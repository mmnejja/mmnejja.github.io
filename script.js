document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
    setTimeout(() => {
      loader.style.display = "none";
    }, 220);
  }

  const API_ENDPOINT = "http://localhost:3000/send-report";
  const form = document.getElementById("csrdForm");
  const submitBtn = document.getElementById("submitBtn");
  const statusEl = document.getElementById("formStatus");

  if (!form || !submitBtn || !statusEl) {
    return;
  }

  const setStatus = (message, type) => {
    statusEl.textContent = message;
    statusEl.classList.remove("success", "error");
    if (type) {
      statusEl.classList.add(type);
    }
  };

  const setLoading = (isLoading) => {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("is-loading", isLoading);
  };

  const isHtmlFile = (file) => {
    if (!file) {
      return false;
    }

    const lowerName = file.name.toLowerCase();
    const allowedTypes = ["text/html", "application/xhtml+xml", ""];
    return lowerName.endsWith(".html") && allowedTypes.includes(file.type);
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("", null);

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const reportFileInput = document.getElementById("reportFile");
    const reportFile = reportFileInput.files && reportFileInput.files[0];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !reportFile) {
      setStatus("Please complete all fields and select your ESG HTML report.", "error");
      return;
    }

    if (!emailRegex.test(email)) {
      setStatus("Please provide a valid email address.", "error");
      return;
    }

    if (!isHtmlFile(reportFile)) {
      setStatus("Invalid file type. Please upload an .html file only.", "error");
      return;
    }

    const payload = new FormData();
    payload.append("name", name);
    payload.append("email", email);
    payload.append("file", reportFile);

    try {
      setLoading(true);
      setStatus("Sending report...", null);

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: payload
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || "Failed to send ESG report.");
      }

      setStatus("ESG report submitted successfully. Thank you.", "success");
      form.reset();
    } catch (error) {
      setStatus(error.message || "Unable to submit report right now. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  });
});
