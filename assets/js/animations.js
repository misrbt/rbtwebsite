// GSAP-driven animation: hero entrance, hover-lift, scroll reveals (AOS),
// and hero mouse parallax. Marketing/informational pages only — this
// script must never be included on login, account, or transaction pages
// (see CLAUDE.md).
//
// Progressive enhancement: every animated element is already visible and
// usable in plain CSS with zero JS. This file only adds motion on top of
// a page that already works — it never hides content pending a script.

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initHeroEntrance() {
  const targets = document.querySelectorAll("[data-animate-entrance]");
  if (!targets.length || typeof gsap === "undefined") return;
  if (prefersReducedMotion()) return;

  gsap.from(targets, {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: "power2.out",
    stagger: 0.12,
  });
}

function initHoverLift() {
  if (prefersReducedMotion() || typeof gsap === "undefined") return;

  // Only the transform is GSAP-driven — box-shadow crossfade is left to the
  // plain CSS transition already on .card (see assets/css/style.css).
  document.querySelectorAll("[data-hover-lift]").forEach((el) => {
    el.addEventListener("pointerenter", () => gsap.to(el, { y: -6, duration: 0.25, ease: "power2.out" }));
    el.addEventListener("pointerleave", () => gsap.to(el, { y: 0, duration: 0.25, ease: "power2.out" }));
  });
}

function initHeroParallax() {
  const hero = document.querySelector(".hero");
  const content = document.querySelector(".hero__content");
  if (!hero || !content || typeof gsap === "undefined") return;
  if (prefersReducedMotion()) return;

  const moveX = gsap.quickTo(content, "x", { duration: 0.6, ease: "power3.out" });
  const moveY = gsap.quickTo(content, "y", { duration: 0.6, ease: "power3.out" });

  hero.addEventListener("pointermove", (e) => {
    const rect = hero.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    moveX(relX * -16);
    moveY(relY * -10);
  });

  hero.addEventListener("pointerleave", () => {
    moveX(0);
    moveY(0);
  });
}

// Pins the hero for one extra viewport of scroll (PeachWeb-style: the scene
// holds in place while scroll input drives the 3D shape's rotation/scale
// and a fog overlay, before releasing into Quick Services). The 3D part is
// optional — if hero-scene.js hasn't mounted yet (still idle-deferred, or
// skipped entirely under file:// / reduced-motion), the pin/fade/fog still
// run on their own; the shape hookup attaches later if it shows up.
function initHeroScrollPin() {
  const hero = document.querySelector(".hero");
  const content = document.querySelector(".hero__content");
  const scrollCue = document.querySelector(".hero__scroll-cue");
  const fog = document.querySelector("[data-hero-fog]");
  if (!hero || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (prefersReducedMotion()) return;

  gsap.registerPlugin(ScrollTrigger);

  let setShapeProgress = null;
  window.addEventListener("heroscene:mounted", () => {
    if (window.__heroScene) setShapeProgress = window.__heroScene.setScrollProgress;
  });
  if (window.__heroScene) setShapeProgress = window.__heroScene.setScrollProgress;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: () => "+=" + window.innerHeight,
      scrub: 1,
      pin: true,
      onUpdate(self) {
        if (setShapeProgress) setShapeProgress(self.progress);
      },
    },
  });

  if (content) tl.to(content, { opacity: 0, y: -40, ease: "none" }, 0);
  if (scrollCue) tl.to(scrollCue, { opacity: 0, ease: "none" }, 0);
  if (fog) tl.to(fog, { opacity: 1, ease: "none" }, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof AOS !== "undefined") {
    AOS.init({
      disable: () => prefersReducedMotion(),
      once: true,
      duration: 600,
      offset: 80,
    });
  }

  initHeroEntrance();
  initHoverLift();
  initHeroParallax();
  initHeroScrollPin();
});
