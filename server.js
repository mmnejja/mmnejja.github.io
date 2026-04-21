const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

app.get("/", (req, res) => {
  res.status(200).send("CSRD backend is running.");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true, service: "csrd-backend" });
});

app.post("/send-report", upload.single("file"), async (req, res) => {
  try {
    const { name, email } = req.body;
    const file = req.file;

    if (!name || !email || !file) {
      res.status(400).json({ error: "Name, email, and file are required." });
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) {
      res.status(400).json({ error: "Invalid email address." });
      return;
    }

    const appPassword = process.env.GMAIL_APP_PASSWORD || "YOUR_GMAIL_APP_PASSWORD";
    if (appPassword === "YOUR_GMAIL_APP_PASSWORD") {
      res.status(500).json({ error: "Server email password is not configured." });
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mya4ccounting@gmail.com",
        pass: appPassword
      }
    });

    await transporter.sendMail({
      from: "mya4ccounting@gmail.com",
      to: "mya4ccounting@gmail.com",
      replyTo: email,
      subject: "CSRD Reporting",
      text: `Name: ${name}\nEmail: ${email}\nFile: ${file.originalname}`,
      attachments: [
        {
          filename: file.originalname,
          content: file.buffer
        }
      ]
    });

    res.status(200).json({ success: true, message: "Report sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send report." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
