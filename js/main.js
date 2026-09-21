(() => {
  "use strict";

  const cfg = window.SITE_CONFIG || {};

  // Apply central config to marked text.
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.dataset.config;
    if (cfg[key] !== undefined) el.textContent = cfg[key];
  });

  document.querySelectorAll("[data-config-link]").forEach((el) => {
    const key = el.dataset.configLink;
    if (key === "EMAIL" && cfg.EMAIL) {
      el.href = `mailto:${cfg.EMAIL}`;
      el.textContent = cfg.EMAIL;
    }
  });

  // Profile image from central configuration.
  document.querySelectorAll("[data-profile-image]").forEach((img) => {
    if (cfg.PROFILE_IMAGE) img.src = cfg.PROFILE_IMAGE;
  });

  // Canonical + OG metadata.
  if (cfg.CANONICAL_URL) {
    document.getElementById("canonical-link").href = cfg.CANONICAL_URL;
    document.getElementById("og-url").content = cfg.CANONICAL_URL;
  }

  // Social links — only activate configured links.
  const socialItems = [
    ["Facebook", "f", "FACEBOOK_URL"],
    ["Instagram", "ig", "INSTAGRAM_URL"],
    ["LinkedIn", "in", "LINKEDIN_URL"],
    ["WhatsApp", "wa", "WHATSAPP_NUMBER"],
    ["Email", "@", "EMAIL"]
  ];
  function buildSocials(id) {
    const root = document.getElementById(id);
    if (!root) return;
    root.innerHTML = "";
    socialItems.forEach(([label, icon, key]) => {
      const value = cfg[key];
      const a = document.createElement("a");
      a.className = "social-link" + (value ? "" : " disabled");
      a.href = value ? (key === "EMAIL" ? `mailto:${value}` : key === "WHATSAPP_NUMBER" ? `https://wa.me/${String(value).replace(/\D/g,"")}` : value) : "#";
      a.target = value && key !== "EMAIL" ? "_blank" : "_self";
      if (value && key !== "EMAIL") a.rel = "noopener";
      a.setAttribute("aria-label", label);
      a.textContent = icon;
      root.appendChild(a);
    });
  }
  buildSocials("heroSocials");
  buildSocials("contactSocials");

  // WhatsApp floating button — disabled until number is supplied.
  const waButton = document.getElementById("whatsappButton");
  if (cfg.WHATSAPP_NUMBER) {
    waButton.classList.remove("disabled");
    waButton.href = `https://wa.me/${String(cfg.WHATSAPP_NUMBER).replace(/\D/g,"")}`;
  }

  // Mobile navigation.
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("primaryNav");
  const navLinks = nav.querySelectorAll('a[href^="#"]');
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  }
  menuToggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  // Sticky glass header + active section.
  const header = document.querySelector(".site-header");
  const sections = [...document.querySelectorAll("main section[id]")];
  const progress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");

  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 12);
    backToTop.classList.toggle("visible", y > 650);

    const total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${total > 0 ? (y / total) * 100 : 0}%`;

    let current = "home";
    for (const section of sections) {
      const top = section.getBoundingClientRect().top;
      if (top <= 140) current = section.id;
    }
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Theme toggle.
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector(".theme-icon");
  function setTheme(theme, persist = true) {
    document.documentElement.dataset.theme = theme;
    themeIcon.textContent = theme === "light" ? "☾" : "☼";
    themeToggle.setAttribute("aria-label", theme === "light" ? "Switch to dark mode" : "Switch to light mode");
    if (persist) localStorage.setItem("tahmid-theme", theme);
  }
  setTheme(document.documentElement.dataset.theme || "dark", false);
  themeToggle.addEventListener("click", () => {
    setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  // Copy email.
  const copyEmail = document.getElementById("copyEmail");
  const copyFeedback = document.getElementById("copyFeedback");
  copyEmail.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(cfg.EMAIL || "");
      copyFeedback.textContent = "Copied!";
      setTimeout(() => copyFeedback.textContent = "", 1700);
    } catch {
      copyFeedback.textContent = "Copy unavailable";
      setTimeout(() => copyFeedback.textContent = "", 1700);
    }
  });

  // FAQ accordions.
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.addEventListener("click", () => {
      const wasOpen = item.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq-item").forEach((other) => other.setAttribute("aria-expanded", "false"));
      item.setAttribute("aria-expanded", String(!wasOpen));
    });
  });

  // Testimonials.
  const testimonialCards = [...document.querySelectorAll(".testimonial-card")];
  let testimonialIndex = 0;
  const indexLabel = document.getElementById("testimonialIndex");
  function showTestimonial(i) {
    testimonialCards.forEach((card, idx) => card.classList.toggle("active", idx === i));
    indexLabel.textContent = `${i + 1} / ${testimonialCards.length}`;
  }
  document.getElementById("prevTestimonial").addEventListener("click", () => {
    testimonialIndex = (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(testimonialIndex);
  });
  document.getElementById("nextTestimonial").addEventListener("click", () => {
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
    showTestimonial(testimonialIndex);
  });

  // Project URLs only become real links after configuration.
  document.querySelectorAll("[data-project]").forEach((link) => {
    const key = link.dataset.project;
    const value = cfg[key];
    if (value) {
      link.href = value;
      link.target = "_blank";
      link.rel = "noopener";
    } else {
      link.href = "#contact";
      link.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
      });
    }
  });

  // Small toast helper for contact setup messages.
  window.showToast = (message) => {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  };
})();
