(function () {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (navToggle && nav) {
    const closeNavigation = () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open navigation");
      document.body.classList.remove("nav-open");
    };

    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      document.body.classList.toggle("nav-open", isOpen);
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) {
        closeNavigation();
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNavigation();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1120) closeNavigation();
    });
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const navLinks = nav ? Array.from(nav.querySelectorAll("a")) : [];
  const currentPagePath = new URL(window.location.href).pathname;
  const sectionLinks = navLinks
    .map((link) => {
      const targetUrl = new URL(link.href, window.location.href);
      const hash = targetUrl.hash;
      const section = targetUrl.pathname === currentPagePath && hash ? document.querySelector(hash) : null;
      const markerElement = section ? section.closest("section[id]") || section : null;
      return section && markerElement ? { link, section, markerElement } : null;
    })
    .filter(Boolean);

  if (sectionLinks.length) {
    let activeSectionId = "";
    let activeNavTicking = false;

    function setActiveNav(sectionId) {
      if (!sectionId || sectionId === activeSectionId) return;
      activeSectionId = sectionId;
      navLinks.forEach((link) => {
        const hash = new URL(link.href, window.location.href).hash;
        link.classList.toggle("is-active", hash === `#${sectionId}`);
      });
    }

    function getCurrentSectionId() {
      const header = document.querySelector(".site-header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const marker = window.scrollY + headerHeight + 96;
      const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;

      if (isAtBottom) {
        return sectionLinks[sectionLinks.length - 1].section.id;
      }

      let currentSectionId = sectionLinks[0].section.id;
      let currentSectionTop = -Infinity;

      sectionLinks.forEach((item) => {
        const sectionTop = item.markerElement.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= marker && sectionTop > currentSectionTop + 4) {
          currentSectionId = item.section.id;
          currentSectionTop = sectionTop;
        }
      });

      return currentSectionId;
    }

    function updateActiveNav() {
      setActiveNav(getCurrentSectionId());
      activeNavTicking = false;
    }

    function requestActiveNavUpdate() {
      if (!activeNavTicking) {
        window.requestAnimationFrame(updateActiveNav);
        activeNavTicking = true;
      }
    }

    const initialHash = window.location.hash;
    const initialSection = sectionLinks.find(({ section }) => `#${section.id}` === initialHash);
    setActiveNav((initialSection || sectionLinks[0]).section.id);
    window.addEventListener("scroll", requestActiveNavUpdate, { passive: true });
    window.addEventListener("resize", requestActiveNavUpdate);
    window.addEventListener("hashchange", () => window.setTimeout(updateActiveNav, 80));
    window.addEventListener("load", () => window.setTimeout(updateActiveNav, 120));
    window.setTimeout(updateActiveNav, 180);
  }

  const revealTargets = document.querySelectorAll([
    ".stats-band",
    ".about-feature",
    ".video-feature",
    ".about-panel",
    ".expertise-stack article",
    ".experience-section",
    ".experience-card",
    ".awards-section",
    ".awards-panel",
    ".media-section",
    ".interview-panel",
    ".resource-column",
    ".milestone-card",
    ".testimonials-section",
    ".testimonial-spotlight",
    ".testimonial-mini-card",
    ".consultation-band",
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

  const testimonialCarousel = document.querySelector("[data-testimonial-carousel]");

  if (testimonialCarousel) {
    const sources = Array.from(testimonialCarousel.querySelectorAll("[data-testimonial-source]")).map((source) => ({
      name: source.dataset.name || "Education leader",
      role: source.dataset.role || "Leadership reference",
      image: source.dataset.image || "",
      quote: source.dataset.quote || "Draft testimonial copy awaiting written approval from the institution.",
    }));
    const quote = testimonialCarousel.querySelector("[data-testimonial-quote]");
    const name = testimonialCarousel.querySelector("[data-testimonial-name]");
    const role = testimonialCarousel.querySelector("[data-testimonial-role]");
    const profileImage = testimonialCarousel.querySelector("[data-testimonial-image]");
    const previous = testimonialCarousel.querySelector("[data-testimonial-prev]");
    const next = testimonialCarousel.querySelector("[data-testimonial-next]");
    let testimonialIndex = 0;

    const showTestimonial = (index) => {
      if (!sources.length || !quote || !name || !role) return;
      testimonialIndex = (index + sources.length) % sources.length;
      const current = sources[testimonialIndex];
      testimonialCarousel.classList.remove("is-updating");
      window.requestAnimationFrame(() => {
        quote.textContent = current.quote;
        name.textContent = current.name;
        role.textContent = current.role;
        if (profileImage && current.image) profileImage.src = current.image;
        testimonialCarousel.classList.add("is-updating");
      });
    };

    previous?.addEventListener("click", () => showTestimonial(testimonialIndex - 1));
    next?.addEventListener("click", () => showTestimonial(testimonialIndex + 1));
  }

  const mediaPlaylist = document.querySelector("[data-media-playlist]");
  const mediaFeature = document.querySelector("[data-media-feature]");

  if (mediaPlaylist && mediaFeature) {
    const mediaItems = Array.from(mediaPlaylist.querySelectorAll("[data-media-item]"));
    const featureImage = mediaFeature.querySelector("[data-media-feature-image]");
    const featureTitle = mediaFeature.querySelector("[data-media-feature-title]");
    const featureSubtitle = mediaFeature.querySelector("[data-media-feature-subtitle]");
    let mediaIndex = Math.max(0, mediaItems.findIndex((item) => item.classList.contains("is-active")));
    let rotationTimer = null;

    const showMedia = (index, shouldScroll) => {
      if (!mediaItems.length || !featureImage || !featureTitle || !featureSubtitle) return;
      mediaIndex = (index + mediaItems.length) % mediaItems.length;
      const current = mediaItems[mediaIndex];

      mediaItems.forEach((item, itemIndex) => {
        const isActive = itemIndex === mediaIndex;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      mediaFeature.href = current.dataset.mediaHref || "#";
      featureImage.src = current.dataset.mediaImage || "";
      featureImage.alt = current.dataset.mediaAlt || "Interview video preview";
      featureTitle.textContent = current.dataset.mediaTitle || "Featured interview";
      featureSubtitle.textContent = current.dataset.mediaSubtitle || "Watch the full conversation on YouTube";

      if (shouldScroll) {
        const playlistBounds = mediaPlaylist.getBoundingClientRect();
        const itemBounds = current.getBoundingClientRect();
        const nextScrollTop = mediaPlaylist.scrollTop + itemBounds.top - playlistBounds.top - 8;

        mediaPlaylist.scrollTo({
          top: Math.max(0, nextScrollTop),
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    };

    const updateYouTubeMetadata = (item) => {
      const url = item.dataset.mediaHref;
      if (!url || !window.fetch) return;

      fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
        .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Metadata unavailable"))))
        .then((metadata) => {
          if (metadata.title) {
            item.dataset.mediaTitle = metadata.title;
            const label = item.querySelector(".media-playlist-thumb + span");
            if (label) label.textContent = metadata.title;
          }
          if (metadata.author_name) item.dataset.mediaSubtitle = metadata.author_name;
          if (item.classList.contains("is-active")) showMedia(mediaIndex, false);
        })
        .catch(() => {
          // The supplied title is retained when YouTube metadata is unavailable.
        });
    };

    const stopRotation = () => {
      if (rotationTimer) window.clearInterval(rotationTimer);
      rotationTimer = null;
    };

    const startRotation = () => {
      if (prefersReducedMotion || mediaItems.length < 2) return;
      stopRotation();
      rotationTimer = window.setInterval(() => showMedia(mediaIndex + 1, true), 7000);
    };

    mediaItems.forEach((item, index) => {
      item.setAttribute("aria-pressed", String(index === mediaIndex));
      updateYouTubeMetadata(item);
      item.addEventListener("click", () => {
        showMedia(index, true);
        startRotation();
      });
    });

    mediaPlaylist.addEventListener("mouseenter", stopRotation);
    mediaPlaylist.addEventListener("mouseleave", startRotation);
    mediaPlaylist.addEventListener("focusin", stopRotation);
    mediaPlaylist.addEventListener("focusout", (event) => {
      if (!mediaPlaylist.contains(event.relatedTarget)) startRotation();
    });

    showMedia(mediaIndex, false);
    startRotation();
  }

  const awardModal = document.querySelector("[data-award-modal]");

  if (awardModal) {
    const modalImage = awardModal.querySelector("[data-award-modal-image]");
    const modalYear = awardModal.querySelector("[data-award-modal-year]");
    const modalTitle = awardModal.querySelector("[data-award-modal-title]");
    const modalSummary = awardModal.querySelector("[data-award-modal-summary]");
    const modalPoints = awardModal.querySelector("[data-award-modal-points]");
    let lastTrigger = null;

    const closeAwardModal = () => {
      awardModal.classList.remove("is-open");
      awardModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      lastTrigger?.focus();
    };

    document.querySelectorAll("[data-award-trigger]").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        lastTrigger = trigger;
        const image = trigger.dataset.awardImage || "";
        if (modalImage) {
          modalImage.hidden = !image;
          modalImage.src = image;
          modalImage.alt = trigger.dataset.awardTitle || "Award";
        }
        if (modalYear) modalYear.textContent = trigger.dataset.awardYear || "Recognition details";
        if (modalTitle) modalTitle.textContent = trigger.dataset.awardTitle || "Award details";
        if (modalSummary) modalSummary.textContent = trigger.dataset.awardSummary || "Details will be added shortly.";
        if (modalPoints) {
          modalPoints.replaceChildren(...(trigger.dataset.awardPoints || "").split("|").filter(Boolean).map((point) => {
            const item = document.createElement("li");
            item.textContent = point;
            return item;
          }));
        }
        awardModal.classList.add("is-open");
        awardModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        awardModal.querySelector("[data-award-modal-close]")?.focus();
      });
    });

    awardModal.querySelectorAll("[data-award-modal-close]").forEach((button) => button.addEventListener("click", closeAwardModal));
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && awardModal.classList.contains("is-open")) closeAwardModal();
    });
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
    const serviceField = contactForm.querySelector('select[name="service"]');
    const requestedService = new URLSearchParams(window.location.search).get("service");

    if (serviceField && requestedService) {
      const matchingOption = Array.from(serviceField.options).find(
        (option) => option.textContent.trim() === requestedService.trim()
      );
      if (matchingOption) {
        serviceField.value = matchingOption.value;
      }
    }

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const submitLabel = submitButton?.querySelector("span");
      const endpoint = contactForm.dataset.formEndpoint;

      if (!endpoint) {
        contactForm.submit();
        return;
      }

      if (submitButton) submitButton.disabled = true;
      if (submitLabel) submitLabel.textContent = "Sending Request...";
      if (formNote) {
        formNote.className = "form-note";
        formNote.textContent = "Sending your request securely...";
      }

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error("Form submission failed");

        contactForm.reset();
        if (formNote) {
          formNote.className = "form-note is-success";
          formNote.textContent = "Thank you. Your request has been sent to Dr. Reddy.";
        }
      } catch (error) {
        if (formNote) {
          formNote.className = "form-note is-error";
          formNote.textContent = "We could not send the request. Please try again in a moment.";
        }
      } finally {
        if (submitButton) submitButton.disabled = false;
        if (submitLabel) submitLabel.textContent = "Send Consultation Request";
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
