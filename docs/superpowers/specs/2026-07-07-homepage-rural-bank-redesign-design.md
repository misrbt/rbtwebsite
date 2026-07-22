# Homepage redesign — RBT Bank Inc., A Rural Bank

## Context

The existing `index.html` is a generic "premium digital bank" concept page (12+ sections: hero with 3D/particle canvas, quick services, products, digital banking, why-choose-us, security, loan calculator/currency converter, testimonials, news, branch locator, FAQ, contact). The user supplied a screenshot (`Downloads/Home.png`) of the actual homepage to build: a real Philippine rural bank ("RBT BANK INC., A Rural Bank", est. 1966, regulated by Bangko Sentral ng Pilipinas, deposits insured by PDIC). The `assets/images/` folder already contains every asset this design needs (logo, hero photo, 3 service photos, 1 event photo, BSP/DPO-DPS/PDIC badges, a `color palette.png` reference), confirming this is a planned rebrand rather than a one-off mockup.

## Decisions (confirmed with user)

1. **Full replace.** The homepage becomes exactly the 4 sections in the screenshot (hero carousel, Explore our Services, Events, footer). All 12+ existing sections and their now-unused scripts (`particles.js`, `hero-scene.js`, GSAP/ScrollTrigger, `calculator.js`) are removed from `index.html`. Their CSS/JS files are left in place (unused) in case a future page reuses them — only `index.html`'s `<script>` tags and section markup change.
2. **Carousels are functional, not decorative.** Hero and Events each become a 1-slide Swiper instance with real prev/next wiring, so more slides/events can be added later by appending markup — no rebuild needed.
3. **CLAUDE.md is updated** to document the real palette and rural-bank identity as the brand going forward, replacing the placeholder blue/navy/gold description.

## Visual design

- **Palette** (from `color palette.png`): navy `#03045e`, blue `#0077b6`, cyan `#00b4d8`, light-cyan `#90e0ef`, pale `#caf0f8`. No gold accent in this brand. Applied by changing the *values* of the existing `--color-navy`, `--color-blue`, `--color-gold` (repurposed as the cyan accent), and `--color-light-gray` (repurposed as the pale tint) tokens in `style.css`, plus their derived shades — this keeps all 53 existing token consumers working without a rename.
- **Header**: permanent white background (not transparent-over-dark-hero — the new hero is light, so the old scroll-triggered transparent→white behavior no longer applies). Text lockup logo ("RBT BANK INC." / "A Rural Bank"), plain nav links (navy, blue underline on hover/active), no Login/Open Account buttons. Mobile hamburger toggle retained for <900px (not visible in the desktop screenshot but required for responsiveness).
- **Hero**: light background, bold navy headline "Grow your Business with Us", "Apply for a Loan" pill button (blue), `Hero-image 1.png` offset right and bottom-aligned. Swiper carousel, both prev/next chevrons (plain navy chevrons, no circle background), no pagination dots, no autoplay.
- **Explore our Services**: light-cyan-tinted section background. Heading + "Empowering Every Filipino with Accessible Financial Solutions" subhead. 3-card grid, each card a full-bleed photo (`service-deposit.jpg` / `service-loan.jpg` / `service-other.jpg`) with a dark gradient overlay, bold uppercase title + one-line description bottom-left, small circular arrow bottom-right. Card copy verbatim from screenshot:
  - Deposit Products — "Deposits are insured up to ₱1 Million per depositor" → links to `products-services.html#deposit-products`
  - Loan Products — "Deposits are insured up to ₱1 Million per depositor" → `products-services.html#loan-products`
  - Other Services — "We also offer Money Transfer/ E-wallet Cash in and Cash out/Remittances services" → `products-services.html#other-services`
- **Events**: white background, two-column (text left / photo right). Heading "Events", copy verbatim: "RBT BANK @ 60 in the service to the community" + the anniversary paragraph. `event-community-service.jpg` right, one plain navy next-chevron only (no prev arrow — matches screenshot), Swiper single-slide.
- **Footer**: simplified to three columns + centered copyright bar — brand column (`rbt-logo.png` seal + BSP regulation blurb + link to `https://www.bsp.gov.ph` + a link to `contact.html` for "channels listed in the RBT BANK page"), Follow Us (Facebook icon only) + Banking Hours (9:00 AM–3:00 PM, closed weekends & public holidays), and "Regulated & Insured By" badges (`bsp-logonew.png`, `dpo logo.png`, `pdic logo.png`). Drops the old 4-column footer (product/company/legal link lists, 3 social icons).

## Non-goals

- Not building `products-services.html`, `about.html`, etc. — the anchors referenced above are placeholders for a future pass (already true per existing CLAUDE.md).
- Not touching any page other than `index.html`, plus the shared CSS/JS files and CLAUDE.md.
- Not adding autoplay/looping to the carousels — arrows only, matching the screenshot.
