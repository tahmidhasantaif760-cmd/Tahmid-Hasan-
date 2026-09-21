(() => {
  "use strict";

  const cfg = window.SITE_CONFIG || {};
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submit = document.getElementById("submitButton");

  const sanitize = (value) => value.replace(/[<>]/g, "").trim();

  function setStatus(message, type = "") {
    status.textContent = message;
    status.className = `form-status ${type}`.trim();
  }

  function validate(data) {
    if (!data.name || data.name.length < 2) return "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Please enter a valid email address.";
    if (!data.message || data.message.length < 10) return "Please enter a message of at least 10 characters.";
    return "";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("");

    const data = {
      name: sanitize(form.name.value),
      email: sanitize(form.email.value),
      subject: sanitize(form.subject.value),
      message: sanitize(form.message.value)
    };

    const error = validate(data);
    if (error) {
      setStatus(error, "error");
      return;
    }

    if (!cfg.CONTACT_FORM_ENDPOINT) {
      setStatus("Contact form backend is not configured yet. Please email me directly at " + (cfg.EMAIL || "the configured email address") + ".", "error");
      window.showToast?.("Configure CONTACT_FORM_ENDPOINT to enable sending.");
      return;
    }

    submit.classList.add("loading");
    setStatus("Sending…");

    try {
      const response = await fetch(cfg.CONTACT_FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error("Request failed");
      form.reset();
      setStatus("Message sent successfully.", "success");
      window.showToast?.("Message sent.");
    } catch (error) {
      setStatus("The message could not be sent. Please email me directly.", "error");
      window.showToast?.("Sending failed.");
    } finally {
      submit.classList.remove("loading");
    }
  });
})();
