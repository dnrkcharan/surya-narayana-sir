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

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealTargets = document.querySelectorAll([
    ".stats-band",
    ".split-section",
    ".journey-section",
    ".timeline-item",
    ".media-section .section-heading",
    ".media-card",
    ".lower-grid > *",
    ".contact-copy",
    ".contact-form",
    ".about-hero",
    ".profile-card",
    ".detail-section",
  ].join(","));

  revealTargets.forEach((element) => {
    element.classList.add("reveal-on-scroll");
  });

  if (prefersReducedMotion) {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });

    revealTargets.forEach((element) => revealObserver.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add("is-visible"));
  }

  const counters = document.querySelectorAll("[data-count-target]");
  const formatNumber = new Intl.NumberFormat("en-IN");

  function setCounterValue(counter, value) {
    const suffix = counter.dataset.countSuffix || "";
    counter.textContent = `${formatNumber.format(value)}${suffix}`;
  }

  function animateCounter(counter) {
    if (counter.dataset.counting === "true") return;

    const target = Number(counter.dataset.countTarget || 0);
    const duration = Math.min(1800, Math.max(900, target * 10));
    const start = performance.now();
    counter.dataset.counting = "true";

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      setCounterValue(counter, value);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCounterValue(counter, target);
        counter.dataset.counting = "false";
      }
    }

    requestAnimationFrame(tick);
  }

  if (counters.length) {
    counters.forEach((counter) => setCounterValue(counter, 0));

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      counters.forEach((counter) => setCounterValue(counter, Number(counter.dataset.countTarget || 0)));
    } else {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
          } else {
            setCounterValue(entry.target, 0);
          }
        });
      }, { threshold: 0.55 });

      counters.forEach((counter) => counterObserver.observe(counter));
    }
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
