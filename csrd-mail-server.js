const express = require("express");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 5050;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const isHtmlName = file.originalname.toLowerCase().endsWith(".html");
    const isValidMime = ["text/html", "application/xhtml+xml", "application/octet-stream", ""].includes(file.mimetype);

    if (!isHtmlName || !isValidMime) {
      cb(new Error("Only .html files are accepted."));
      return;
    }

    cb(null, true);
  }
});

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "csrd-mail-server" });
});

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("Missing SMTP credentials. Set SMTP_USER and SMTP_PASS in your environment.");
  }

  if (host && smtpPort) {
    return nodemailer.createTransport({
      host,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: { user, pass }
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass }
  });
};

app.post("/api/csrd-report", upload.single("reportFile"), async (req, res) => {
  try {
    const { name, email } = req.body;
    const reportFile = req.file;

    if (!name || !email || !reportFile) {
      res.status(400).json({ message: "Name, email, and HTML report are required." });
      return;
    }

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) {
      res.status(400).json({ message: "Invalid email address." });
      return;
    }

    const transporter = createTransporter();
    const senderAddress = process.env.SMTP_USER;

    await transporter.sendMail({
      from: senderAddress,
      to: "mya4ccounting@gmail.com",
      replyTo: email,
      subject: "CSRD Reporting",
      text:
        "A new ESG report has been submitted.\n\n" +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Original file: ${reportFile.originalname}`,
      html:
        "<p>A new ESG report has been submitted.</p>" +
        `<p><strong>Name:</strong> ${name}</p>` +
        `<p><strong>Email:</strong> ${email}</p>` +
        `<p><strong>Original file:</strong> ${reportFile.originalname}</p>`,
      attachments: [
        {
          filename: reportFile.originalname,
          content: reportFile.buffer,
          contentType: "text/html"
        }
      ]
    });

    res.status(200).json({ message: "Report submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not send report email." });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    res.status(400).json({ message: error.message });
    return;
  }

  if (error && error.message) {
    res.status(400).json({ message: error.message });
    return;
  }

  next();
});

app.listen(port, () => {
  console.log(`CSRD mail server running on http://localhost:${port}`);
});
