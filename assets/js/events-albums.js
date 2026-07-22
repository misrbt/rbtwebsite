/* ==========================================================================
   RBT Bank — Events page: album carousel + album lightbox

   The carousel is a hand-rolled coverflow (deliberately not Swiper): each
   slide is absolutely stacked at the centre, and JS writes only its distance
   from the active album (--offset / --abs) onto the element. All the 3D
   geometry — the sideways step, the push back along Z, the inward tilt —
   lives in events.css, so the look can be tuned without touching this file.

   "Learn more" opens the album in a fullscreen viewer: one photo at a time,
   stepped through with the on-screen controls, arrow keys, or a swipe.
   ========================================================================== */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ── Coverflow carousel ─────────────────────────────────────────────────── */

  function initAlbumCarousel() {
    const root = document.querySelector("[data-events-albums]");
    if (!root) return;

    const stage = root.querySelector("[data-albums-stage]");
    const track = root.querySelector("[data-albums-track]");
    const prevBtn = root.querySelector("[data-albums-prev]");
    const nextBtn = root.querySelector("[data-albums-next]");
    const dotsWrap = root.querySelector("[data-albums-dots]");
    if (!track) return;

    const slides = Array.from(track.children);
    if (!slides.length) return;

    // Beyond this many places from the centre a card is hidden entirely.
    const VISIBLE_DEPTH = 2;
    let index = 0;

    const dots = slides.map((slide, i) => {
      const card = slide.querySelector("[data-album]");
      const year = card ? card.dataset.albumYear : String(i + 1);
      const place = card ? card.dataset.albumPlace : "";

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "events-albums__dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", place ? year + " — " + place : year);
      dot.setAttribute("aria-selected", "false");
      dot.textContent = year;
      dot.addEventListener("click", () => setIndex(i));

      if (dotsWrap) dotsWrap.appendChild(dot);
      return dot;
    });

    function setIndex(i) {
      // Wraps, so there is always an album either side of the centre.
      index = (i + slides.length) % slides.length;
      paint();
    }

    /* Shortest way round the ring: with 7 albums, slide 6 sits at -1 from
       slide 0 rather than +6, so the carousel fans out both ways. */
    function wrappedOffset(i) {
      const n = slides.length;
      let offset = i - index;
      if (offset > n / 2) offset -= n;
      if (offset < -n / 2) offset += n;
      return offset;
    }

    function paint() {
      slides.forEach((slide, i) => {
        const offset = wrappedOffset(i);
        const abs = Math.abs(offset);
        const active = offset === 0;
        const far = abs > VISIBLE_DEPTH;

        slide.style.setProperty("--offset", String(offset));
        slide.style.setProperty("--abs", String(abs));
        slide.classList.toggle("is-active", active);
        slide.classList.toggle("is-far", far);
        // Off-centre cards shouldn't be reachable by Tab or screen readers.
        slide.setAttribute("aria-hidden", String(!active));
        slide.querySelectorAll("button").forEach((btn) => {
          btn.tabIndex = active ? 0 : -1;
        });
      });

      dots.forEach((dot, i) => {
        const active = i === index;
        dot.classList.toggle("is-active", active);
        dot.setAttribute("aria-selected", String(active));
      });

    }

    if (prevBtn) prevBtn.addEventListener("click", () => setIndex(index - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => setIndex(index + 1));

    /* Clicking an off-centre album brings it to the front rather than
       opening it — one tap to look at it, another to open it. */
    slides.forEach((slide, i) => {
      slide.addEventListener(
        "click",
        (e) => {
          if (i === index) return;
          e.preventDefault();
          e.stopPropagation();
          setIndex(i);
        },
        true
      );
    });

    if (stage) {
      stage.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setIndex(index - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          setIndex(index + 1);
        }
      });

      /* Swipe / drag to move between albums. */
      let startX = null;
      let moved = 0;

      stage.addEventListener(
        "pointerdown",
        (e) => {
          if (e.pointerType === "mouse" && e.button !== 0) return;
          startX = e.clientX;
          moved = 0;
        },
        { passive: true }
      );

      stage.addEventListener(
        "pointermove",
        (e) => {
          if (startX === null) return;
          moved = Math.abs(e.clientX - startX);
        },
        { passive: true }
      );

      stage.addEventListener("pointerup", (e) => {
        if (startX === null) return;
        const delta = e.clientX - startX;
        startX = null;
        if (Math.abs(delta) < 45) return;
        // A drag is navigation, not a click — don't let it open a lightbox.
        e.preventDefault();
        setIndex(delta < 0 ? index + 1 : index - 1);
      });

      stage.addEventListener(
        "click",
        (e) => {
          if (moved > 8) {
            e.preventDefault();
            e.stopPropagation();
            moved = 0;
          }
        },
        true
      );

      stage.addEventListener("pointercancel", () => {
        startX = null;
      });
    }

    paint();
  }

  /* ── Lightbox ───────────────────────────────────────────────────────────── */

  function initAlbumLightbox() {
    const box = document.querySelector("[data-album-lightbox]");
    if (!box) return;

    const titleEl = box.querySelector("[data-album-title]");
    const subtitleEl = box.querySelector("[data-album-subtitle]");
    const imageEl = box.querySelector("[data-album-image]");
    const captionEl = box.querySelector("[data-album-caption]");
    const counterEl = box.querySelector("[data-album-counter]");
    const stageEl = box.querySelector("[data-album-stage]");
    const blurEl = box.querySelector("[data-album-blur]");
    const prevBtn = box.querySelector("[data-album-prev]");
    const nextBtn = box.querySelector("[data-album-next]");
    const closeBtn = box.querySelector(".album-lightbox__close");
    if (!imageEl) return;

    // Photos in the album currently on screen: [{ src, alt }, ...]
    let photos = [];
    let index = 0;
    let lastFocused = null;

    /* Slide the incoming photo in from the side it came from. Animating the
       single <img> rather than a track keeps wrapping seamless — the last
       photo flows into the first with no rewind. */
    function slideIn(direction) {
      imageEl.classList.add("is-loaded");
      if (reduceMotion.matches || !imageEl.animate) return;

      imageEl.animate(
        [
          { opacity: 0, transform: "translateX(" + direction * 48 + "px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 320, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    }

    function show(i, direction) {
      if (!photos.length) return;
      // Wraps both ways, so the album never runs out of photos.
      index = (i + photos.length) % photos.length;
      const photo = photos[index];

      pendingDirection = direction || 0;
      imageEl.classList.remove("is-loaded");
      imageEl.src = photo.src;
      imageEl.alt = photo.alt;

      // Same photo, blurred, as the backdrop behind the black wash.
      if (blurEl) {
        blurEl.style.backgroundImage = 'url("' + photo.src + '")';
      }

      if (captionEl) captionEl.textContent = photo.alt;
      if (counterEl) {
        counterEl.textContent = index + 1 + " / " + photos.length;
      }

      // A single-photo album has nothing to step to.
      const single = photos.length < 2;
      if (prevBtn) prevBtn.hidden = single;
      if (nextBtn) nextBtn.hidden = single;
    }

    let pendingDirection = 0;
    imageEl.addEventListener("load", () => slideIn(pendingDirection));

    function open(card) {
      const year = card.dataset.albumYear || "";
      const place = card.dataset.albumPlace || "";
      const source = card.querySelector("[data-album-gallery]");

      photos = source
        ? Array.from(source.querySelectorAll("img")).map((img) => ({
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt") || "",
          }))
        : [];
      if (!photos.length) return;

      if (titleEl) titleEl.textContent = place;
      if (subtitleEl) {
        subtitleEl.textContent =
          year +
          " · " +
          photos.length +
          (photos.length === 1 ? " photo" : " photos");
      }

      show(0, 0);

      lastFocused = document.activeElement;
      box.hidden = false;
      // Next frame, so the opening transition has a start state to animate from.
      requestAnimationFrame(() => box.classList.add("is-open"));
      document.body.classList.add("has-album-open");
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      box.classList.remove("is-open");
      document.body.classList.remove("has-album-open");

      const finish = () => {
        box.hidden = true;
        imageEl.removeAttribute("src");
        if (blurEl) blurEl.style.backgroundImage = "";
        photos = [];
      };

      if (reduceMotion.matches) finish();
      else setTimeout(finish, 200);

      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    if (prevBtn) prevBtn.addEventListener("click", () => show(index - 1, -1));
    if (nextBtn) nextBtn.addEventListener("click", () => show(index + 1, 1));

    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-album-open]");
      if (opener) {
        const card = opener.closest("[data-album]");
        if (card) open(card);
        return;
      }
      if (e.target.closest("[data-album-close]")) close();
    });

    /* Swipe between photos on touch devices. */
    if (stageEl) {
      let swipeX = null;
      stageEl.addEventListener(
        "touchstart",
        (e) => {
          swipeX = e.touches[0].clientX;
        },
        { passive: true }
      );
      stageEl.addEventListener(
        "touchend",
        (e) => {
          if (swipeX === null) return;
          const delta = e.changedTouches[0].clientX - swipeX;
          swipeX = null;
          if (Math.abs(delta) > 45) {
            show(delta < 0 ? index + 1 : index - 1, delta < 0 ? 1 : -1);
          }
        },
        { passive: true }
      );
    }

    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;

      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        show(index + 1, 1);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        show(index - 1, -1);
        return;
      }

      if (e.key !== "Tab") return;

      // Keep focus inside the viewer while it's open.
      const focusables = Array.from(
        box.querySelectorAll("button:not([hidden])")
      );
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initAlbumCarousel();
    initAlbumLightbox();
  });
})();
