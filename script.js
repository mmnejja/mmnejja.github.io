// Handles loader, navigation interactions, section reveal, and optional dark mode.
document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const themeToggle = document.getElementById("themeToggle");
  const revealElements = document.querySelectorAll(".reveal");

  // Simple loading screen for premium first impression.
  window.setTimeout(() => {
    if (loader) {
      loader.classList.add("hidden");
    }
  }, 650);

  // Mobile menu toggle.
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Highlights active section in navbar while scrolling.
  const setActiveLink = () => {
    const currentPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const id = section.getAttribute("id");
      if (!id) return;

      const top = section.offsetTop;
      const height = section.offsetHeight;
      const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);

      if (activeLink) {
        if (currentPosition >= top && currentPosition < top + height) {
          activeLink.classList.add("active");
        } else {
          activeLink.classList.remove("active");
        }
      }
    });
  };

  window.addEventListener("scroll", setActiveLink);
  setActiveLink();

  // Scroll reveal animation.
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // Contact form front-end validation/feedback.
  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !email || !message) {
        formStatus.textContent = "Please complete all fields before sending.";
        formStatus.style.color = "#c0392b";
        return;
      }

      if (!isEmailValid) {
        formStatus.textContent = "Please enter a valid email address.";
        formStatus.style.color = "#c0392b";
        return;
      }

      formStatus.textContent = "Message sent successfully. Thank you.";
      formStatus.style.color = "#00A86B";
      contactForm.reset();
    });
  }

  // Optional dark mode with local storage persistence.
  if (themeToggle) {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      themeToggle.textContent = "Light";
    }

    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");
      themeToggle.textContent = isDark ? "Light" : "Dark";
      localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    });
  }
});
