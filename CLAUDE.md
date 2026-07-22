# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

RBT Bank Inc. — a premium banking marketing website. Built as plain HTML5, CSS3, and vanilla JavaScript only: no framework, no bundler, no npm, no build step. External libraries are loaded via CDN `<script>`/`<link>` tags only — this was an explicit pivot (see "Architecture history" below).

The homepage (`index.html`) is built out fully, as are `about.html`, `products-services.html` (deposit/loan/digital/other services — anchor-linked as `#deposit-products`, `#loan-products`, `#digital-services`, `#other-services`, `#remittance`), `careers.html` (open positions + how to apply), `properties.html` (acquired-properties listing with client-side search/filter — see below), and `contact.html` (general contact info + form, branch directory, and an all-branches map — see below). Nav is: Home, About Us, Products & Services, Properties, Careers, Events, Contact. `events.html` is linked from the nav but not yet built — expect a 404 until it's added in a follow-up pass.

There used to be a separate `branches.html` (linked only from the footer's legal row, not the main nav, per an earlier explicit user request). It was later merged into `contact.html` at the user's direction — the branch directory and its Google Maps modal now live there instead, and `branches.html`/`assets/css/branches.css` were deleted. Don't recreate a standalone branches page; branch content belongs on the Contact page.

`properties.html`'s hero is a single pre-composited banner image (`assets/images/properties/hero.jpg`, not the shared `.home-hero` carousel) — the pale-tint-to-photo blend and headline are baked into that JPG itself; the section overrides the generic `section { padding-block }` reset to 0 so the banner runs flush against the nav instead of floating with pale gaps above/below it. The property cards, their photos (`assets/images/properties/property-1.jpg` … `property-8.jpg`, cropped from the design mockup at `assets/images/properties/properties page.jpg`), addresses, classifications, lot areas, and prices are real data taken directly from that mockup — don't invent additional listings or edit these values without a new source. Originally 8 listings; the Sugod, Valencia City residential lot (`property-8.jpg`, ₱320,000) was removed per explicit user instruction because it has already been sold — its card, its now-orphaned "Valencia City" branch-filter option, and the reference to it were all deleted, leaving 7 active listings. Don't re-add it without confirmation it's back on the market. The "Property Type" advanced-search filter (`data-type`, values `lot-with-improvement` / `vacant-lot`, per user direction) has all remaining listings tagged `vacant-lot` — a judgment call based on each listing's photo showing raw/undeveloped land, not confirmed per-listing source data, so correct any that are actually improved lots. Pagination is built at runtime from the real, current match count (`initPropertySearch` in `main.js`, `PROPERTY_PAGE_SIZE = 8`, matching the 4-col x 2-row grid) — it only ever renders as many pages as there are actual cards behind them (re-computed live as search/filters narrow the result set), and the nav renders empty whenever everything fits on one page — which, with only 7 real listings today, is always. Don't reintroduce a hardcoded page list.

`contact.html`'s branch directory (`#branches`) lists 13 real locations with real per-branch addresses and phone numbers, sourced directly from `V:\FILES\01 MIS FILES (2025)\Addresses and Contact Numbers.xlsx` (an internal MIS file, not something in this repo — if branch data ever needs updating, that spreadsheet is the source of truth, not this codebase). The 5 full branches are Main Office, Jasaan, Salay, CDO, and Maramag; the 8 "Lite" (BLU — Branch Lite Unit) locations are Gingoog, Camiguin, Butuan, Manolo Fortich, Claveria, a second CDO location, Iligan, and Kibawe (Kibawe is the same branch referenced in the homepage's "Branch Lite – Kibawe Opening" event). Two source phone numbers (Butuan's second line, Iligan's second line) were dropped from the site because they were truncated/incomplete in the source file (e.g. `(815) 0012`) — don't guess-complete them; go back to the source spreadsheet if a full number is ever needed. Each card's "View Map" button links to a plain `google.com/maps/search/?api=1&query=...` URL (no API key needed, matches the no-build-step/CDN-only architecture) built from the real branch name + address, which lets Google's own search resolve the pin rather than asserting a fake coordinate. Note: the "Find Us Across the Region" Google My Maps embed further down the page (see below) was built by hand before this 13-location expansion and still only has pins for the original 8 — it needs 5 more pins added (Manolo Fortich, Claveria, the second CDO location, Iligan, Kibawe) the next time someone has access to edit that My Maps map.

The page's final section is an "All-Branches Map" (`.contact-map`) — a real **Google My Maps** embed (`https://www.google.com/maps/d/embed?mid=...`), built by hand at mymaps.google.com by placing a pin per branch and uploading `assets/images/rbt-logo.png` as each pin's custom icon. This is the only place on the site where a live, real Google Map shows custom-logo pins — the plain free `google.com/maps?...&output=embed` iframe used elsewhere (branch-tile "View Map" modal, properties.html) does *not* support custom markers without a paid Maps JavaScript API key, which this project doesn't use; My Maps is the one exception since it needs no API key at all. The embed is self-contained/interactive (visitors click a pin directly for its info), so there's no companion branch-list JS driving it — don't reintroduce one. If the map ever needs a new/moved pin, it must be edited directly in the My Maps map itself (not in this codebase), then the `mid` in the iframe `src` updated if it's a different map entirely.

## Structure

- `index.html` — homepage.
- `assets/css/style.css` — design tokens (`:root` custom properties), reset, base elements, and shared layout/button/glass utilities (`.container`, `.section-heading`, `.grid*`, `.btn*`, `.glass*`). Must be loaded first on every page — every other stylesheet below depends on these custom properties and base rules. Always consume a token variable, never hardcode a raw color/size.
- `assets/css/nav.css` — site header/nav (`.site-header*`, `.site-nav*`). Loaded on every page.
- `assets/css/footer.css` — site footer and the back-to-top button (`.site-footer*`, `.back-to-top`). Loaded on every page.
- `assets/css/hero-carousel.css` — the banner-slide Swiper hero component (`.home-hero*`, plus the generic `.swiper-pagination-bullet`/`.swiper-button-next`/`.swiper-button-prev` overrides it relies on). Shared — loaded on `index.html`, `products-services.html`, `careers.html`, and `contact.html`, which all reuse the same hero markup/component for their own top banner.
- `assets/css/home.css` — homepage-only sections excluding the hero carousel itself (`.home-trust*`, `.home-services*`, `.home-about*`, `.home-apply-online*`, `.branch-apply*`, `.branch-card*`, `.home-events*`, `.event-card*`). Loaded on `index.html` only.
- `assets/css/about.css` — About page sections (`.about-hero*`, `.about-history*`, `.about-mission*`, `.about-values*`, `.about-board*`). Loaded on `about.html` only.
- `assets/css/products-services.css` — Products & Services page sections (`.products-hero`/`.products-deposit*`/`.product-tile*`/`.products-loans*`/`.loan-card*`/`.products-extra*`/`.products-trust*`). Loaded on `products-services.html` only.
- `assets/css/careers.css` — Careers page sections (`.careers-why*`, `.careers-jobs*`, `.job-card*`, `.careers-apply*`). Also loads `hero-carousel.css` since the Careers hero reuses the same `.home-hero` banner component. Loaded on `careers.html` only.
- `assets/css/contact.css` — Contact page sections (`.contact-title` plain heading band — no hero photo/carousel on this page, unlike the rest of the site — `.contact-info*`, `.contact-channel*`, `.contact-form*`, `.contact-branches*`, `.branch-tile*`, `.contact-map*`, plus the `.map-modal*` branch-location modal — duplicated here rather than shared, same pattern as `properties.css`'s own copy). Loaded on `contact.html` only.
- `assets/css/properties.css` — Properties page sections (`.properties-hero`, `.properties-search*`, `.field*`, `.properties-grid`, `.property-card*`, `.properties-pagination*`, `.properties-inquire*`). Does *not* load `hero-carousel.css` — its hero is a single pre-composited banner image, not the shared carousel. Loaded on `properties.html` only.
- `assets/css/responsive.css` — all media queries (breakpoints: 1180px, 900px, 600px), covering every page/section above in one file. Keep responsive overrides out of the component files.
- `assets/css/animations.css` — CSS `@keyframes` and animation utility classes, plus the `prefers-reduced-motion` baseline rule every animation in this project must respect.
- `assets/js/main.js` — nav scroll-shrink/mobile toggle, FAQ accordion, button ripple, stat counters, branch search filter, contact form validation, properties search/filter + advanced-search toggle. No animation-library dependency; safe on any page.
- `assets/js/animations.js` — GSAP hero entrance, hover-lift, hero mouse parallax, and the `AOS.init()` call. Marketing pages only.
- `assets/js/particles.js` — hand-rolled 2D canvas particle network for the hero background (no library — simple enough not to need one).
- `assets/js/hero-scene.js` — the Three.js hero visual. Loaded as `type="module"` (needed for the CDN `import`), but internally defers via `requestIdleCallback` and bails out entirely if opened via `file://` or under reduced-motion — see comments in the file for why.
- `assets/js/slider.js` — Swiper carousel init (testimonials, latest news).
- `assets/js/calculator.js` — loan calculator math + currency converter (static illustrative rate table, not a live API — see in-file comment).
- `assets/images/`, `assets/icons/`, `assets/fonts/` — static asset folders (icons are currently inline SVG in the HTML; these folders are scaffolded for when standalone asset files are needed).

## Animation libraries — marketing pages only

GSAP, AOS, Swiper, and the Three.js hero scene must load **only** on marketing/informational pages (homepage, about, product pages) — never on login, account, or transaction pages once those exist. Concretely: don't add the GSAP/AOS/Swiper/Three.js `<script>` tags, or `assets/js/animations.js`, `assets/js/particles.js`, `assets/js/hero-scene.js`, or `assets/js/slider.js`, to any page that authenticates a user or touches money movement or account data. `assets/js/main.js` (no animation dependency) is fine everywhere.

Every animation must respect `prefers-reduced-motion` and degrade to a fully visible, usable static state with zero JS — follow the existing pattern (check `window.matchMedia("(prefers-reduced-motion: reduce)").matches` before animating) in any new animation code.

## CDN library versions in use

Pinned versions (verified reachable before use — don't bump without re-checking the URL resolves):
- GSAP 3.12.5 + ScrollTrigger (cdnjs)
- AOS 2.3.4 (jsdelivr)
- Swiper 11 (jsdelivr)
- Three.js r160, loaded as an ES module from jsdelivr inside `hero-scene.js` — **note:** r160 predates `THREE.Timer` (added later); this codebase intentionally uses the older `THREE.Clock` API to match the pinned version. Don't "fix" this to `Timer` without also bumping the pinned CDN version and re-verifying.
- Google Fonts: Poppins (headings) + Inter (body)

## Architecture history (why CDN, not self-hosted)

An earlier pass in this project self-hosted fonts and libraries (copied from npm, no CDN) specifically to avoid third-party requests on a bank site. A later, more detailed spec explicitly required CDN-only delivery and forbade npm/build tools, which was confirmed with the user as an intentional pivot — that decision now stands. If asked to "improve performance" or "reduce third-party requests" later, raise this tradeoff explicitly rather than silently reverting to self-hosting.

## Design workflow

The `premium-web-design` skill (`.claude/skills/premium-web-design/`) governs visual/UX decisions for this site and auto-triggers on any frontend work — read it before styling or building new pages. Notes specific to this project:
- RBT Bank Inc. is a real Philippine rural bank (est. 1966), regulated by the Bangko Sentral ng Pilipinas and deposit-insured by PDIC — not a fictional "premium digital bank." Copy and imagery should reflect that (e.g. banking hours, ₱ currency, BSP/PDIC/DPO-DPS badges), not generic US fintech framing.
- Palette (from `assets/images/color palette.png`, the actual brand palette — supersedes any earlier blue/navy/gold brief): Navy `#03045E`, Blue `#0077B6`, Cyan `#00B4D8`, Light Cyan `#90E0EF`, Pale `#CAF0F8`. There is **no gold accent** in this brand — don't reintroduce one. In `style.css` these values live in the existing `--color-navy` / `--color-blue` / `--color-gold` (repurposed as the cyan accent) / `--color-light-gray` (repurposed as the pale tint) tokens, so consume those tokens rather than the hex codes directly.
- The hero 3D shape is deliberately offset to the right and low-opacity so it never overlaps or competes with headline text — if resizing/repositioning it, re-check this in a real browser, not just in code (this exact bug happened once already in this project's history).
- The 3D toolchain section's Threlte guidance does not apply (Svelte-only). The 21st.dev component-sourcing note assumes React + Tailwind and does not apply here either — this project is hand-built HTML/CSS/JS.

## Running the site

The homepage works when opened directly via `file://` **except** the Three.js hero scene, which requires being served over http(s) (module CDN fetches are blocked from `file://`) — it falls back gracefully to the CSS gradient + particle-canvas background otherwise. For full functionality during development, serve the directory with any static server, e.g. `python -m http.server` or `npx serve .`.

## MCP

`.mcp.json` (project-scoped) configures `threejs-devtools-mcp` for live Three.js scene inspection — usable now that `assets/js/hero-scene.js` exists (requires the dev server + a browser tab, per that MCP's own prerequisites).

## Sensitive data

This is a financial services site — flag any handling of customer info, credentials, or transaction data for extra scrutiny. Avoid logging secrets; follow OWASP practices for auth/input handling once login/account flows exist. The currency converter and loan calculator are illustrative-only (static rates, client-side math) — don't wire them to real account data without a proper backend and security review.
