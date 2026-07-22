// Swiper carousels — testimonials and hero. Autoplay is disabled under
// prefers-reduced-motion; sliders remain manually navigable either way
// (this is content, not decoration, so it never disappears).

document.addEventListener("DOMContentLoaded", () => {
  if (typeof Swiper === "undefined") return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const sharedOptions = {
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: { clickable: true },
    autoplay: reduceMotion ? false : { delay: 5000, disableOnInteraction: true },
    breakpoints: {
      720: { slidesPerView: 2 },
      1080: { slidesPerView: 3 },
    },
  };

  const testimonialEl = document.querySelector("[data-testimonial-slider]");
  if (testimonialEl) new Swiper(testimonialEl, sharedOptions);

  // Homepage hero: wired with real prev/next navigation, pagination dots,
  // and autoplay so additional slides can be appended without touching
  // this file.
  const heroEl = document.querySelector("[data-hero-slider]");
  if (heroEl) {
    const heroSection = heroEl.closest(".home-hero");
    new Swiper(heroEl, {
      slidesPerView: 1,
      speed: reduceMotion ? 0 : 500,
      loop: true,
      autoplay: reduceMotion ? false : { delay: 6000, disableOnInteraction: false },
      pagination: {
        el: heroSection.querySelector(".swiper-pagination"),
        clickable: true,
      },
      navigation: {
        nextEl: heroSection.querySelector("[data-hero-next]"),
        prevEl: heroSection.querySelector("[data-hero-prev]"),
      },
    });
  }

  // Products & Services — Loan Products carousel. Partial next-card peek at
  // every breakpoint signals there's more to scroll, matching the reference
  // design's cropped fifth card.
  const eventsHighlightsEl = document.querySelector("[data-events-highlights-slider]");
  if (eventsHighlightsEl) {
    const eventsSection = eventsHighlightsEl.closest(".events-highlights__carousel");
    new Swiper(eventsHighlightsEl, {
      slidesPerView: 1.1,
      spaceBetween: 20,
      speed: reduceMotion ? 0 : 500,
      navigation: {
        nextEl: eventsSection.querySelector("[data-events-highlights-next]"),
        prevEl: eventsSection.querySelector("[data-events-highlights-prev]"),
      },
      breakpoints: {
        640:  { slidesPerView: 2,   spaceBetween: 20 },
        900:  { slidesPerView: 3,   spaceBetween: 24 },
        1180: { slidesPerView: 4,   spaceBetween: 24 },
      },
    });
  }

  const loanEl = document.querySelector("[data-loan-slider]");
  if (loanEl) {
    const loanSection = loanEl.closest(".products-loans__carousel");
    new Swiper(loanEl, {
      slidesPerView: 1.15,
      spaceBetween: 20,
      speed: reduceMotion ? 0 : 500,
      navigation: {
        nextEl: loanSection.querySelector("[data-loan-next]"),
        prevEl: loanSection.querySelector("[data-loan-prev]"),
      },
      breakpoints: {
        640: { slidesPerView: 2.2, spaceBetween: 20 },
        900: { slidesPerView: 3.2, spaceBetween: 24 },
        1180: { slidesPerView: 4.3, spaceBetween: 24 },
      },
    });
  }
});
