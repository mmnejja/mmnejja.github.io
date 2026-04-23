const express = require("express");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cors = require("cors");
require("dotenv").config();

const app = express();

const defaultAllowedOrigins = [
  "https://mohamedmnejja.me",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:4200",
  "http://127.0.0.1:4200"
];

const envAllowedOrigins = String(process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = envAllowedOrigins.length > 0 ? envAllowedOrigins : defaultAllowedOrigins;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "csrd-mail-api" });
});

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const name = String(file.originalname || "").toLowerCase();
    const type = String(file.mimetype || "").toLowerCase();
    const allowedTypes = ["text/html", "application/xhtml+xml", "application/octet-stream", ""];

    if (name.endsWith(".html") && allowedTypes.includes(type)) {
      cb(null, true);
      return;
    }

    cb(new Error("Only .html files are allowed"));
  }
});

const mailUser = process.env.MAIL_USER;
const mailPass = process.env.MAIL_PASS;

if (!mailUser || !mailPass) {
  console.warn("MAIL_USER and MAIL_PASS must be set in environment variables.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: mailUser,
    pass: mailPass
  }
});

const sendReportHandler = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim();
    const file = req.file;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (!mailUser || !mailPass) {
      return res.status(500).json({ error: "Email service is not configured" });
    }

    const mailOptions = {
      from: mailUser,
      replyTo: email,
      to: mailUser,
      subject: "CSRD Reporting Upload",
      text: `Name: ${name}\nEmail: ${email}`,
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error(err);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "Upload failed: file too large or invalid format" });
    }

    if (err && err.message === "Only .html files are allowed") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Email failed" });
  }
};

app.post("/send-report", upload.single("file"), sendReportHandler);
app.post("/upload", upload.single("file"), sendReportHandler);

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});