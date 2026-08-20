# SEO, Google Analytics 4 & Search Console — Implementation Spec

## Purpose

Full technical SEO + GA4 + Search Console foundation for the RBT Bank Inc.
website (`rbtbank.com`), a plain HTML/CSS/vanilla-JS static site (no
framework, no build step, no npm — see project `CLAUDE.md`). Adapted from a
generic client-supplied spec to this repo's actual pages and data.

Real pages in this repo (not the generic `services.html`/`branches.html`
names from the source spec): `index.html`, `about.html`,
`products-services.html`, `properties.html`, `careers.html`, `events.html`,
`contact.html` (branch directory lives here, not a separate branches page —
see `CLAUDE.md`), `privacy-policy.html`, `terms-conditions.html`,
`sitemap.html`. No `/admin`, `/dashboard`, `/api`, or other private routes
exist — this is a pure marketing site.

Real domain: `https://rbtbank.com` (confirmed via `terms-conditions.html`).

## Already implemented (2026-08-20 session)

- **GA4**: `gtag.js` snippet with placeholder `G-XXXXXXXXXX` added once per
  page (no duplication), in `<head>`, clearly commented
  `<!-- Google tag (gtag.js) — replace G-XXXXXXXXXX with your real GA4
  Measurement ID -->`. Present on all 10 pages.
- **`sitemap.xml`** (repo root) — valid XML, all 10 real pages at their
  clean-URL paths (`/about`, `/contact`, etc., matching the `.htaccess`
  rewrite rules), `lastmod`/`changefreq`/`priority` per page.
- **`robots.txt`** (repo root) — `User-agent: *` / `Allow: /`, points at
  `https://rbtbank.com/sitemap.xml`. Nothing disallowed since no
  private/admin routes exist.
- **Per-page SEO meta tags** — `<link rel="canonical">`, Open Graph
  (`og:type`/`site_name`/`locale`/`url`/`title`/`description`/`image`), and
  Twitter Card (`summary`) tags on all 10 pages, each reusing that page's
  existing unique `<title>`/meta description (not copy-pasted across pages).
  `og:image`/`twitter:image` currently point at `assets/images/rbt-logo.png`
  (3000×3000 square) — a proper 1200×630 social-share banner would look
  better in link unfurls but wasn't fabricated since no such asset exists
  yet.
- **Structured data (JSON-LD)**:
  - `index.html`: `BankOrCreditUnion` schema — real Main Office address/
    phone/email (sourced from `contact.html`'s existing branch data),
    `sameAs` → real Facebook page. No invented business info.
  - All other pages: `BreadcrumbList` (Home → page).
- Page titles/meta descriptions were already unique and natural per page
  from earlier site-build work — no change needed there.

## Still open (do in a later session)

1. **Search Console verification placeholder** — add
   `<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE">`
   to every page's `<head>` (or use the DNS TXT method instead, which needs
   no code change — decide which before implementing). Do not invent a code.
2. **Semantic HTML / heading audit** — walk each page confirming one `<h1>`,
   logical `<h2>`/`<h3>` nesting, proper `<nav>`/`<main>`/`<footer>` (this
   site already uses those at the shell level per `CLAUDE.md`'s structure
   docs — verify section-level headings too).
3. **Image SEO pass** — audit `assets/images/*` usage across pages: real
   descriptive `alt` text (empty `alt=""` only for decorative images),
   `loading="lazy"` on below-the-fold images, flag any non-descriptive
   filenames. Don't touch image quality/dimensions without a separate ask.
4. **Additional structured data** — `WebSite` schema (with
   `SearchAction`/site name) on `index.html`; consider per-branch
   `LocalBusiness` JSON-LD on `contact.html`'s 13 real branch entries (only
   if it's worth the payload — the branch directory already has full real
   data there, see `CLAUDE.md`'s branch-directory section).
5. **GA4 event tracking** — once a real Measurement ID exists, wire up
   `gtag('event', ...)` calls for: contact form submission, phone-number
   click (`tel:` links already exist across branch tiles), email click
   (`mailto:` links), branch "View Map" clicks, loan/deposit product CTA
   clicks. Add as a small addition to `assets/js/main.js` (this project's
   existing no-dependency JS file) rather than a new `analytics.js` unless
   it grows large. Never send form field contents/PII into events.
6. **Internal linking pass** — confirm homepage → products-services,
   products-services → specific product anchors, homepage → properties,
   about → contact, etc. are all present with descriptive anchor text (most
   of this already exists via the nav/footer/quick-links — verify, don't
   assume).
7. **Performance audit** — check for oversized images, confirm `async`/
   `defer` on the CDN script tags already in use (GSAP/AOS/Swiper/Three.js
   per `CLAUDE.md`'s "marketing pages only" rule), lazy-load below-the-fold
   imagery.
8. **Accessibility pass alongside the above** — form labels, button aria-
   labels, focus states, color contrast — most already exists per the
   `premium-web-design` skill's accessibility checks; do a final review here
   rather than starting from scratch.
9. **URL structure** — the `.htaccess` clean-URL rewrite (extensionless
   URLs) is mid-migration: `index.html`/`events.html` already point their
   home link at `/`, the other 8 pages still use `index.html`. Finish that
   migration consistently, or decide to leave `.html` in internal links
   (rewrite rules make both work) — confirm intent before touching further.

## Explicitly not done (per source spec's own constraints)

- No `SITE_CONFIG` JS object / no separate `assets/js/analytics.js` — the
  GA snippet is inlined per-page in `<head>`, matching Google's own
  recommended placement (needs to run early, synchronously-ish) and this
  project's CDN/no-build-step architecture. A shared config object isn't
  meaningful here since there's no build step to inject it at.
- No fake GA4 Measurement ID, no fake Search Console verification code, no
  fake `og-image.jpg` asset, no invented branch/company data anywhere.
- No admin/private paths disallowed in `robots.txt` — none exist on this
  site.

## Google-side setup required (manual, cannot be done from this repo)

- Create a GA4 property at analytics.google.com → get the real
  `G-XXXXXXXXXX` Measurement ID → replace the placeholder in all 10 pages'
  `<head>` blocks (one find-and-replace across the repo).
- Verify `rbtbank.com` in Google Search Console (DNS TXT record via
  Hostinger's DNS Zone Editor, or the HTML meta tag from item 1 above).
- Submit `sitemap.xml` in Search Console → Sitemaps.
- Optional: Bing Webmaster Tools (same sitemap), Google Business Profile for
  local/map presence (separate from the website, run through Google's own
  onboarding).

## Testing checklist once live on `rbtbank.com`

1. GA4 receiving traffic: Analytics → Realtime report, visit the live site
   yourself and confirm your own hit appears.
2. Search Console recognizes the site: verification status shows green in
   Search Console's Settings → Ownership.
3. Sitemap valid: Search Console → Sitemaps shows "Success", or run
   `https://www.xml-sitemaps.com/validate-xml-sitemap.html` against the live
   URL.
4. Google can crawl: Search Console → URL Inspection on a few real pages,
   confirm "URL is available to Google" / no robots.txt blocks.
5. SEO metadata detected: use Search Console's URL Inspection "Tested Page"
   → View Crawled Page, or a tool like metatags.io against the live URL, to
   confirm title/description/OG/canonical render as expected.

Do not claim indexing/rankings have happened until Search Console actually
reports it — none of the above guarantees ranking position or immediate
indexing.
