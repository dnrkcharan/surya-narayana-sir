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
    ".research-feature-section",
    ".updates-grid > *",
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
    const statCard = counter.closest(".stat-card");

    counter.dataset.counting = "true";
    if (statCard) {
      statCard.classList.remove("count-complete");
      statCard.classList.add("is-counting");
    }

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
        if (statCard) {
          statCard.classList.remove("is-counting");
          statCard.classList.add("count-complete");
          window.setTimeout(() => statCard.classList.remove("count-complete"), 1400);
        }
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
            const statCard = entry.target.closest(".stat-card");
            if (statCard) {
              statCard.classList.remove("is-counting", "count-complete");
            }
          }
        });
      }, { threshold: 0.55 });

      counters.forEach((counter) => counterObserver.observe(counter));
    }
  }

  const backToTop = document.querySelector("[data-back-to-top]");

  if (backToTop) {
    let scrollTicking = false;

    function updateBackToTop() {
      const isVisible = window.scrollY > 420;
      backToTop.classList.toggle("is-visible", isVisible);
      backToTop.setAttribute("aria-hidden", String(!isVisible));
      backToTop.tabIndex = isVisible ? 0 : -1;
      scrollTicking = false;
    }

    function requestBackToTopUpdate() {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateBackToTop);
        scrollTicking = true;
      }
    }

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });

    window.addEventListener("scroll", requestBackToTopUpdate, { passive: true });
    updateBackToTop();
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
