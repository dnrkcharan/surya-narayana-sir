(function () {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      }
    });
  }

  const contactForm = document.querySelector("[data-contact-form]");
  const formNote = document.querySelector("[data-form-note]");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(contactForm);
      const name = String(form.get("name") || "").trim();
      const email = String(form.get("email") || "").trim();
      const subject = String(form.get("subject") || "Speaking invitation").trim();
      const message = String(form.get("message") || "").trim();
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        "",
        message,
      ].join("\n");

      window.location.href = `mailto:meetsuryamule@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (formNote) {
        formNote.textContent = "Opening your email app with this message addressed to Dr. Reddy.";
      }
    });
  }

  document.querySelectorAll("[data-subscribe-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("input");
      if (input) {
        input.value = "";
        input.placeholder = "Thank you";
      }
    });
  });
})();
