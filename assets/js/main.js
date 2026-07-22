// Core site behavior: nav scroll/toggle, FAQ accordion, button ripple,
// stat counters, branch search, contact form validation, properties
// search/filter. No animation library dependency here — this file is
// safe to include on any page.

function initNavScroll() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;

  function update() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initBackToTop() {
  const btn = document.querySelector("[data-back-to-top]");
  if (!btn) return;

  function update() {
    btn.classList.toggle("is-visible", window.scrollY > 500);
  }

  btn.addEventListener("click", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initNavToggle() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");
  if (!toggle || !links) return;

  function setOpen(isOpen) {
    links.setAttribute("data-open", String(isOpen));
    toggle.setAttribute("aria-expanded", String(isOpen));
    // Locks background scroll while the fixed mobile panel is open, since
    // the page underneath is otherwise still scrollable behind it.
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  toggle.addEventListener("click", () => {
    setOpen(links.getAttribute("data-open") !== "true");
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("click", (e) => {
    if (links.getAttribute("data-open") !== "true") return;
    if (links.contains(e.target) || toggle.contains(e.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && links.getAttribute("data-open") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
}

function initBranchApplyToggle() {
  const toggle = document.querySelector("[data-branch-toggle]");
  const wrapper = document.querySelector("[data-branch-wrapper]");
  if (!toggle || !wrapper) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    wrapper.setAttribute("data-open", String(!isOpen));
  });
}

function initFaqAccordion() {
  document.querySelectorAll("[data-faq-item]").forEach((item) => {
    const question = item.querySelector(".faq-item__question");
    question.addEventListener("click", () => {
      const isOpen = item.getAttribute("data-open") === "true";
      // Only one FAQ open at a time keeps the list scannable.
      document.querySelectorAll("[data-faq-item]").forEach((other) => {
        other.setAttribute("data-open", "false");
        other.querySelector(".faq-item__question").setAttribute("aria-expanded", "false");
      });
      item.setAttribute("data-open", String(!isOpen));
      question.setAttribute("aria-expanded", String(!isOpen));
    });
  });
}

function initButtonRipple() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "btn__ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

function initCounters() {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function animateCounter(el) {
    const target = Number(el.dataset.counterTarget);
    const suffix = el.dataset.counterSuffix || "";
    const isDecimal = target % 1 !== 0;

    if (reduceMotion) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = `${isDecimal ? value.toFixed(1) : Math.round(value)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

function initBranchSearch() {
  const input = document.querySelector("[data-branch-search]");
  const items = document.querySelectorAll("[data-branch-item]");
  if (!input || !items.length) return;

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    items.forEach((item) => {
      const city = item.dataset.city || "";
      const text = item.textContent.toLowerCase();
      item.hidden = query.length > 0 && !city.includes(query) && !text.includes(query);
    });
  });
}

function initAdvancedSearchToggle() {
  const toggle = document.querySelector("[data-advanced-toggle]");
  const grid = document.getElementById("advanced-search-grid");
  const label = document.querySelector("[data-advanced-toggle-label]");
  if (!toggle || !grid) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    grid.hidden = isOpen;
    if (label) {
      label.textContent = isOpen ? "Show Advanced Search" : "Hide Advanced Search";
    }
  });
}

// Cards per pagination page — matches the full 4-col x 2-row grid, so
// pagination only appears once there are genuinely more than 8 listings.
// Pagination is built from the real, current match count (see
// initPropertySearch) — it never shows more pages than there are actual
// cards behind them.
const PROPERTY_PAGE_SIZE = 8;

function initPropertySearch() {
  const searchInput = document.querySelector("[data-property-search]");
  const items = [...document.querySelectorAll("[data-property-item]")];
  const filters = document.querySelectorAll("[data-property-filter]");
  const clearBtn = document.querySelector("[data-property-clear]");
  const emptyEl = document.querySelector("[data-property-empty]");
  const paginationEl = document.querySelector("[data-property-pagination]");
  if (!searchInput || !items.length) return;

  let currentPage = 1;

  function priceInRange(price, range) {
    const [minStr, maxStr] = range.split("-");
    const min = Number(minStr);
    if (maxStr === "") return price >= min;
    return price >= min && price <= Number(maxStr);
  }

  function getMatches() {
    const query = searchInput.value.trim().toLowerCase();
    const active = {};
    filters.forEach((field) => {
      if (field.value) active[field.dataset.propertyFilter] = field.value;
    });

    return items.filter((item) => {
      const matchesQuery = !query || item.textContent.toLowerCase().includes(query);
      const matchesClassification =
        !active.classification || item.dataset.classification === active.classification;
      const matchesType = !active.type || item.dataset.type === active.type;
      const matchesTown = !active.town || item.dataset.town === active.town;
      const matchesPrice = !active.price || priceInRange(Number(item.dataset.price), active.price);
      return matchesQuery && matchesClassification && matchesType && matchesTown && matchesPrice;
    });
  }

  function renderPagination(totalPages) {
    if (!paginationEl) return;
    paginationEl.innerHTML = "";
    if (totalPages <= 1) return;

    function arrowIcon(direction) {
      const d = direction === -1 ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6";
      return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}" /></svg>`;
    }

    function addArrow(direction) {
      const disabled = direction === -1 ? currentPage === 1 : currentPage === totalPages;
      const el = document.createElement(disabled ? "span" : "button");
      el.className = "properties-pagination__arrow";
      el.innerHTML = arrowIcon(direction);
      if (disabled) {
        el.setAttribute("aria-disabled", "true");
      } else {
        el.type = "button";
        el.setAttribute("aria-label", direction === -1 ? "Previous page" : "Next page");
        el.addEventListener("click", () => goToPage(currentPage + direction));
      }
      paginationEl.appendChild(el);
    }

    function addPage(n) {
      const isCurrent = n === currentPage;
      const el = document.createElement(isCurrent ? "span" : "button");
      el.className = "properties-pagination__page";
      el.textContent = String(n);
      if (isCurrent) {
        el.setAttribute("aria-current", "page");
      } else {
        el.type = "button";
        el.setAttribute("aria-label", `Page ${n}`);
        el.addEventListener("click", () => goToPage(n));
      }
      paginationEl.appendChild(el);
    }

    function addEllipsis() {
      const el = document.createElement("span");
      el.className = "properties-pagination__ellipsis";
      el.setAttribute("aria-hidden", "true");
      el.textContent = "…";
      paginationEl.appendChild(el);
    }

    addArrow(-1);

    const pageNumbers = [...new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1])]
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);

    let previous = 0;
    pageNumbers.forEach((n) => {
      if (previous && n - previous > 1) addEllipsis();
      addPage(n);
      previous = n;
    });

    addArrow(1);
  }

  function goToPage(page) {
    currentPage = page;
    render();
  }

  function render() {
    const matches = getMatches();
    const totalPages = Math.max(1, Math.ceil(matches.length / PROPERTY_PAGE_SIZE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * PROPERTY_PAGE_SIZE;
    const end = start + PROPERTY_PAGE_SIZE;
    const visibleSlice = new Set(matches.slice(start, end));

    items.forEach((item) => {
      item.hidden = !visibleSlice.has(item);
    });

    if (emptyEl) emptyEl.classList.toggle("is-visible", matches.length === 0);
    renderPagination(totalPages);
  }

  function applyFilters() {
    currentPage = 1;
    render();
  }

  searchInput.addEventListener("input", applyFilters);
  filters.forEach((field) => field.addEventListener("change", applyFilters));

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      searchInput.value = "";
      filters.forEach((field) => (field.value = ""));
      applyFilters();
    });
  }

  render();
}

function initBranchMapModal() {
  const modal = document.querySelector("[data-map-modal]");
  const toggles = document.querySelectorAll("[data-map-toggle]");
  if (!modal || !toggles.length) return;

  const iframe = modal.querySelector("[data-map-modal-iframe]");
  const title = modal.querySelector("[data-map-modal-title]");
  const directions = modal.querySelector("[data-map-modal-directions]");
  const closers = modal.querySelectorAll("[data-map-modal-close]");
  let lastFocused = null;

  function open(query, name) {
    lastFocused = document.activeElement;
    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    // Directions need live GPS + turn-by-turn UI an iframe can't provide,
    // so this one link is meant to leave the page (target="_blank") —
    // unlike the embedded preview above, which intentionally stays put.
    directions.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
    title.textContent = name || "Branch Location";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".map-modal__close").focus();
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = "";
    // Stops the embedded map from continuing to load/play in the background.
    iframe.src = "";
    if (lastFocused) lastFocused.focus();
  }

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      open(btn.dataset.mapQuery, btn.dataset.mapName);
    });
  });

  closers.forEach((el) => el.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
}

// Same shape as initBranchMapModal above — a plain pin on the property's
// own location, not directions from the visitor's current location.
// Separate data-property-map-* hooks so this can't collide with the
// branch directory's modal/toggles.
function initPropertyMapModal() {
  const modal = document.querySelector("[data-property-map-modal]");
  const toggles = document.querySelectorAll("[data-property-map-toggle]");
  if (!modal || !toggles.length) return;

  const iframe = modal.querySelector("[data-property-map-modal-iframe]");
  const title = modal.querySelector("[data-property-map-modal-title]");
  const directions = modal.querySelector("[data-property-map-modal-directions]");
  const closers = modal.querySelectorAll("[data-property-map-modal-close]");
  let lastFocused = null;

  function open(query, name) {
    lastFocused = document.activeElement;
    title.textContent = name || "Property Location";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".map-modal__close").focus();

    iframe.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    directions.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = "";
    iframe.src = "";
    if (lastFocused) lastFocused.focus();
  }

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      open(btn.dataset.propertyMapQuery, btn.dataset.propertyMapName);
    });
  });

  closers.forEach((el) => el.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
}

// Contact page's "Find Us Across the Region" — a branch list that swaps
// the SAME visible map panel in place (no modal). "All Branches" restores
// the real Google My Maps embed (custom logo pins, every branch at once);
// picking one branch instead loads a plain google.com/maps search embed
// for that branch's real address, since My Maps' custom pins only exist
// on the full-network view. Separate data-region-map-* hooks so this
// can't collide with the branch tiles' own data-map-toggle (modal) above.
function initRegionMap() {
  const list = document.querySelector("[data-region-map-list]");
  const iframe = document.querySelector("[data-region-map-iframe]");
  if (!list || !iframe) return;

  const items = list.querySelectorAll("[data-region-map-item]");
  const allBranchesSrc = iframe.dataset.regionMapAllSrc;

  items.forEach((item) => {
    item.addEventListener("click", () => {
      items.forEach((el) => el.classList.remove("is-active"));
      item.classList.add("is-active");

      const isAll = item.dataset.regionMapMode === "all";
      iframe.classList.toggle("is-mymaps", isAll);
      iframe.src = isAll
        ? allBranchesSrc
        : `https://www.google.com/maps?q=${encodeURIComponent(item.dataset.regionMapQuery)}&output=embed`;

      // Touch/no-hover devices can't preview a branch via mouseover, so
      // tapping one also expands its inline address/phone panel — see the
      // .contact-map__list-panel markup and CSS added alongside each entry.
      const entry = item.closest("[data-region-map-entry]");
      if (entry && !hasHoverInput()) {
        const wasOpen = entry.dataset.open === "true";
        list.querySelectorAll("[data-region-map-entry]").forEach((el) => (el.dataset.open = "false"));
        entry.dataset.open = String(!wasOpen);
      }
    });
  });

  initRegionMapTooltip(list, items);
}

function hasHoverInput() {
  return window.matchMedia("(hover: hover)").matches;
}

// Hover/focus card showing a branch's address + phone, built once and
// repositioned per-item so it can use position: fixed (escapes the
// scrollable list's overflow clipping) instead of living in each button.
function initRegionMapTooltip(list, items) {
  const tooltip = document.createElement("div");
  tooltip.className = "contact-map__tooltip";
  tooltip.setAttribute("role", "tooltip");
  document.body.appendChild(tooltip);

  const pinIcon =
    '<svg class="contact-map__tooltip-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-7.58 7-12A7 7 0 0 0 5 9c0 4.42 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>';
  const phoneIcon =
    '<svg class="contact-map__tooltip-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 13a8 8 0 0 1 16 0" /><rect x="2" y="13" width="5" height="7" rx="1.5" /><rect x="17" y="13" width="5" height="7" rx="1.5" /><path d="M20 20v1a2 2 0 0 1-2 2h-4" /></svg>';

  function show(item) {
    const address = item.dataset.regionMapAddress;
    if (!address || !hasHoverInput()) return;

    tooltip.innerHTML = `
      <span class="contact-map__tooltip-name">${item.querySelector("span").textContent}</span>
      <span class="contact-map__tooltip-row">${pinIcon}${address}</span>
      <span class="contact-map__tooltip-row">${phoneIcon}${item.dataset.regionMapPhone}</span>
    `;

    const rect = item.getBoundingClientRect();
    tooltip.style.top = `${rect.top}px`;
    tooltip.classList.add("is-visible");

    const tooltipRect = tooltip.getBoundingClientRect();
    const gutter = 12;
    const overflowsRight = rect.right + gutter + tooltipRect.width > window.innerWidth;
    tooltip.style.left = overflowsRight
      ? `${rect.left - gutter - tooltipRect.width}px`
      : `${rect.right + gutter}px`;

    const overflowsBottom = rect.top + tooltipRect.height > window.innerHeight;
    if (overflowsBottom) {
      tooltip.style.top = `${Math.max(gutter, window.innerHeight - tooltipRect.height - gutter)}px`;
    }
  }

  function hide() {
    tooltip.classList.remove("is-visible");
  }

  items.forEach((item) => {
    if (item.dataset.regionMapMode === "all") return;
    item.addEventListener("mouseenter", () => show(item));
    item.addEventListener("mouseleave", hide);
    item.addEventListener("focus", () => show(item));
    item.addEventListener("blur", hide);
    item.addEventListener("click", hide);
  });

  list.addEventListener("scroll", hide);
  window.addEventListener("resize", hide);
}

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const successEl = form.querySelector("[data-form-success]");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let isValid = true;

    form.querySelectorAll("[data-field]").forEach((field) => {
      const control = field.querySelector("input, textarea");
      const valid = control.checkValidity();
      field.classList.toggle("is-invalid", !valid);
      if (!valid) isValid = false;
    });

    if (isValid) {
      // No backend exists yet — this simulates submission locally.
      successEl.classList.add("is-visible");
      form.reset();
    } else {
      successEl.classList.remove("is-visible");
    }
  });
}


/* ==========================================================================
   Interaction layer — pairs with the "Interaction layer" block in
   assets/css/animations.css.

   Every function here is progressive enhancement: it decorates markup that
   already works, attaches nothing on touch-only devices where a hover
   effect can never fire, and bails entirely under reduced-motion. The page
   is complete and usable if none of it runs.
   ========================================================================== */

function motionAllowed() {
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Pointer effects are meaningless without a hover-capable pointer, and on
// touch they'd fire on tap and stick. Gate them here rather than per-effect.
function hasFinePointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/* Hairline progress bar showing position through the document. */
function initScrollProgress() {
  if (!motionAllowed()) return;

  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  let ticking = false;

  function update() {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? window.scrollY / max : 0;
    bar.style.setProperty("--scroll-progress", Math.min(1, Math.max(0, progress)).toFixed(4));
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
}

/* Cards: a soft highlight that tracks the cursor across the surface.
   Applied to the card classes the site already uses — no markup changes. */
const MOTION_CARD_SELECTOR = [
  ".loan-card",
  ".service-photo-card",
  ".products-trust__card",
  ".about-mission__card",
  ".about-history__card",
  ".about-board__card",
  ".home-property-card",
  ".property-card",
  ".branch-card",
  ".job-card",
  ".event-card",
  ".events-highlight-card",
].join(",");

function initCardSpotlight() {
  if (!motionAllowed() || !hasFinePointer()) return;

  document.querySelectorAll(MOTION_CARD_SELECTOR).forEach((card) => {
    card.setAttribute("data-spotlight", "");

    let frame = null;
    card.addEventListener(
      "pointermove",
      (e) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = null;
          const rect = card.getBoundingClientRect();
          card.style.setProperty("--mx", ((e.clientX - rect.left) / rect.width) * 100 + "%");
          card.style.setProperty("--my", ((e.clientY - rect.top) / rect.height) * 100 + "%");
        });
      },
      { passive: true }
    );
  });
}

/* Genuine 3D tilt, deliberately limited to a few feature surfaces rather
   than every card — a whole grid of tilting panels reads as a gimmick, and
   on a bank that costs more trust than the effect is worth. */
// One feature surface per page, each a single instance — not a grid. The QR
// panel is deliberately excluded: people scan it off-screen with a phone,
// and a panel that tips away under the cursor gets in the way of that.
const MOTION_TILT_SELECTOR = [
  ".home-about__visual",
  ".about-history__card--wide",
  ".products-trust__card",
].join(",");

function initTilt() {
  if (!motionAllowed() || !hasFinePointer()) return;

  const MAX_DEG = 5; // Small on purpose — enough to read as depth, not as a toy.

  document.querySelectorAll(MOTION_TILT_SELECTOR).forEach((el) => {
    el.setAttribute("data-tilt", "");

    let frame = null;

    el.addEventListener("pointerenter", () => el.classList.add("is-tilting"));

    el.addEventListener(
      "pointermove",
      (e) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = null;
          const rect = el.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          // Invert X so the surface tips *toward* the cursor.
          el.style.setProperty("--tilt-x", (-py * MAX_DEG).toFixed(2) + "deg");
          el.style.setProperty("--tilt-y", (px * MAX_DEG).toFixed(2) + "deg");
        });
      },
      { passive: true }
    );

    el.addEventListener("pointerleave", () => {
      el.classList.remove("is-tilting");
      el.style.setProperty("--tilt-x", "0deg");
      el.style.setProperty("--tilt-y", "0deg");
    });
  });
}

/* Primary CTAs lean a few pixels toward the cursor as it approaches.
   Capped tight — a button that chases the pointer too far stops feeling
   like a button. */
function initMagneticButtons() {
  if (!motionAllowed() || !hasFinePointer()) return;

  const PULL = 4;

  document.querySelectorAll(".btn--primary, .btn--gold, .btn--navy").forEach((btn) => {
    let frame = null;

    btn.addEventListener(
      "pointermove",
      (e) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = null;
          const rect = btn.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          btn.style.setProperty("--btn-pull-x", (px * PULL * 2).toFixed(2) + "px");
          btn.style.setProperty("--btn-pull-y", (py * PULL).toFixed(2) + "px");
        });
      },
      { passive: true }
    );

    btn.addEventListener("pointerleave", () => {
      btn.style.setProperty("--btn-pull-x", "0px");
      btn.style.setProperty("--btn-pull-y", "0px");
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  initNavScroll();
  initNavToggle();
  initBackToTop();
  initBranchApplyToggle();
  initFaqAccordion();
  initButtonRipple();
  initCounters();
  initBranchSearch();
  initBranchMapModal();
  initPropertyMapModal();
  initRegionMap();
  initContactForm();
  initAdvancedSearchToggle();
  initPropertySearch();

  // Interaction layer — decoration only, safe to run last.
  initScrollProgress();
  initCardSpotlight();
  initTilt();
  initMagneticButtons();
});
