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

  /* ── Social-Post Popup ──────────────────────────────────────────────────── */

  /*
   * Descriptions for each album — keyed by "YEAR|PLACE" so we can show a
   * proper text body inside the Instagram-style right panel.
   */
  const ALBUM_DESCS = {
    "2015|Singapore":
      "The Bank's first overseas incentive trip brought officers and employees to the iconic Gardens by the Bay and the thrilling Universal Studios Singapore — an unforgettable milestone that sparked a tradition of rewarding excellence.",
    "2017|Hong Kong":
      "A second incentive trip took the team across Victoria Harbour and through Hong Kong's landmark attractions, celebrating another year of outstanding performance and dedication.",
    "2019|South Korea":
      "Employees explored traditional Korean villages, colourful cultural sites, and breathtaking landscapes — broadening perspectives and creating lasting memories beyond Philippine shores.",
    "2023|Japan":
      "After a pandemic pause, RBT Bank resumed its overseas trips with a milestone journey to Japan. The team experienced the unique blend of tradition and modernity that Japan is renowned for.",
    "2023|Bohol, Philippines":
      "A local getaway to Bohol gave the team time to recharge among pristine beaches and the famous Chocolate Hills, celebrating the year's milestones together.",
    "2024|Da Nang, Vietnam":
      "The team travelled to Sun World Ba Na Hills in Da Nang — crossing the iconic Golden Bridge and exploring the French Village — as a reward for another year of dedicated service.",
    "2025|Account Officers' Trip":
      "The Bank's account officers were recognised with a dedicated trip for their exceptional fieldwork and commitment to serving clients across all areas of operation.",
  };

  /* Returns the year as a plain label, e.g. "2015". */
  function relativeYear(yearStr) {
    return yearStr;
  }

  function initAlbumPopup() {
    const box = document.querySelector("[data-album-popup]");
    if (!box) return;

    const titleEl  = box.querySelector("[data-album-title]");
    const subtitleEl = box.querySelector("[data-album-subtitle]");
    const descEl   = box.querySelector("[data-album-desc]");
    const imageEl  = box.querySelector("[data-album-image]");
    const counterEl = box.querySelector("[data-album-counter]");
    const stageEl  = box.querySelector("[data-album-stage]");
    const dotsWrap = box.querySelector("[data-album-photo-dots]");
    const prevBtn  = box.querySelector("[data-album-prev]");
    const nextBtn  = box.querySelector("[data-album-next]");
    if (!imageEl) return;

    let photos = [];
    let photoIndex = 0;
    let lastFocused = null;
    let pendingDir = 0;

    /* Rebuild the row of indicator dots. */
    function buildDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      photos.forEach((_, i) => {
        const d = document.createElement("span");
        d.className = "dot" + (i === photoIndex ? " is-active" : "");
        dotsWrap.appendChild(d);
      });
    }

    function updateDots() {
      if (!dotsWrap) return;
      Array.from(dotsWrap.children).forEach((d, i) => {
        d.classList.toggle("is-active", i === photoIndex);
      });
    }

    function slideIn(dir) {
      imageEl.classList.add("is-loaded");
      if (reduceMotion.matches || !imageEl.animate) return;
      imageEl.animate(
        [
          { opacity: 0, transform: "translateX(" + dir * 40 + "px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 280, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    }

    function showPhoto(i, dir) {
      if (!photos.length) return;
      photoIndex = (i + photos.length) % photos.length;
      const photo = photos[photoIndex];

      pendingDir = dir || 0;
      imageEl.classList.remove("is-loaded");
      imageEl.src = photo.src;
      imageEl.alt = photo.alt;

      if (counterEl) {
        counterEl.textContent = photos.length > 1
          ? (photoIndex + 1) + " / " + photos.length
          : "";
      }

      const single = photos.length < 2;
      if (prevBtn) prevBtn.hidden = single;
      if (nextBtn) nextBtn.hidden = single;

      updateDots();
    }

    imageEl.addEventListener("load", () => slideIn(pendingDir));

    function open(card) {
      const year  = card.dataset.albumYear  || "";
      const place = card.dataset.albumPlace || "";
      const key   = year + "|" + place;
      const source = card.querySelector("[data-album-gallery]");

      photos = source
        ? Array.from(source.querySelectorAll("img")).map((img) => ({
            src: img.getAttribute("src"),
            alt: img.getAttribute("alt") || "",
          }))
        : [];
      if (!photos.length) return;

      // Populate right panel
      if (titleEl)    titleEl.textContent    = place;
      if (subtitleEl) subtitleEl.textContent = relativeYear(year);
      if (descEl)     descEl.textContent     = ALBUM_DESCS[key] || "";

      photoIndex = 0;
      buildDots();
      showPhoto(0, 0);

      lastFocused = document.activeElement;
      box.hidden = false;
      requestAnimationFrame(() => box.classList.add("is-open"));
      document.body.classList.add("has-album-open");

      const closeBtn = box.querySelector(".album-popup__close");
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      box.classList.remove("is-open");
      document.body.classList.remove("has-album-open");

      const finish = () => {
        box.hidden = true;
        imageEl.removeAttribute("src");
        photos = [];
        if (dotsWrap) dotsWrap.innerHTML = "";
      };

      if (reduceMotion.matches) finish();
      else setTimeout(finish, 280);

      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    if (prevBtn) prevBtn.addEventListener("click", () => showPhoto(photoIndex - 1, -1));
    if (nextBtn) nextBtn.addEventListener("click", () => showPhoto(photoIndex + 1,  1));

    // Open on "Learn more" / close on backdrop or close button
    document.addEventListener("click", (e) => {
      const opener = e.target.closest("[data-album-open]");
      if (opener) {
        const card = opener.closest("[data-album]");
        if (card) open(card);
        return;
      }
      if (e.target.closest("[data-album-close]")) close();
    });

    // Swipe between photos on touch devices
    if (stageEl) {
      let swipeX = null;
      stageEl.addEventListener("touchstart", (e) => {
        swipeX = e.touches[0].clientX;
      }, { passive: true });
      stageEl.addEventListener("touchend", (e) => {
        if (swipeX === null) return;
        const delta = e.changedTouches[0].clientX - swipeX;
        swipeX = null;
        if (Math.abs(delta) > 45)
          showPhoto(photoIndex + (delta < 0 ? 1 : -1), delta < 0 ? 1 : -1);
      }, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape")      { close(); return; }
      if (e.key === "ArrowRight")  { e.preventDefault(); showPhoto(photoIndex + 1,  1); return; }
      if (e.key === "ArrowLeft")   { e.preventDefault(); showPhoto(photoIndex - 1, -1); return; }

      if (e.key !== "Tab") return;
      const focusables = Array.from(box.querySelectorAll("button:not([hidden])"));
      if (!focusables.length) return;
      const first = focusables[0];
      const last  = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initAlbumCarousel();
    initAlbumPopup();
  });
})();
