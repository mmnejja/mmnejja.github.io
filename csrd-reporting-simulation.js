const EMAILJS_PUBLIC_KEY = "YOUR_EMAILJS_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = "YOUR_EMAILJS_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_EMAILJS_TEMPLATE_ID";
const FIXED_SUBJECT = "CSRD Reporting";

const form = document.getElementById("csrdForm");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const btnSpinner = document.getElementById("btnSpinner");
const formMessage = document.getElementById("formMessage");
const fileInput = document.getElementById("reportFile");

if (window.emailjs && EMAILJS_PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY") {
  window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

function setMessage(text, kind) {
  formMessage.textContent = text;
  formMessage.classList.remove("success", "error");
  if (kind) {
    formMessage.classList.add(kind);
  }
}

function isValidHtmlFile(file) {
  if (!file) {
    return false;
  }

  const fileName = file.name.toLowerCase();
  const hasHtmlExtension = fileName.endsWith(".html");
  const validMime = file.type === "text/html" || file.type === "application/xhtml+xml" || file.type === "";

  return hasHtmlExtension && validMime;
}

function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  btnSpinner.classList.toggle("hidden", !isLoading);
  btnText.textContent = isLoading ? "Sending..." : "Submit ESG Report";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  setMessage("");

  const selectedFile = fileInput.files[0];

  if (!isValidHtmlFile(selectedFile)) {
    setMessage("Please upload a valid .html report file.", "error");
    return;
  }

  if (!window.emailjs) {
    setMessage("Email service failed to load. Please try again.", "error");
    return;
  }

  if (
    EMAILJS_PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY" ||
    EMAILJS_SERVICE_ID === "YOUR_EMAILJS_SERVICE_ID" ||
    EMAILJS_TEMPLATE_ID === "YOUR_EMAILJS_TEMPLATE_ID"
  ) {
    setMessage("Set your EmailJS keys in csrd-reporting-simulation.js before submitting.", "error");
    return;
  }

  const subjectInput = form.querySelector('input[name="subject"]');
  subjectInput.value = FIXED_SUBJECT;

  try {
    setLoading(true);

    await window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);

    setMessage("ESG report submitted successfully.", "success");
    form.reset();
  } catch (error) {
    setMessage("Submission failed. Please verify EmailJS configuration and try again.", "error");
    console.error("EmailJS submission error:", error);
  } finally {
    setLoading(false);
  }
});