---
name: premium-web-design
description: Design taste and workflow for building rbtbank's website so it looks and feels like a premium, trustworthy fintech product rather than a generic template. Use this whenever building, styling, or reviewing ANY page, component, layout, color palette, typography, spacing, animation, micro-interaction, or 3D/WebGL scene for this site — even if the user just says "make a page," "add a button," "build the hero section," "style this," "make it look better," or "add a 3D hero/scene." Also use it before declaring any UI work finished, to check states (loading/empty/error/dark), motion, and accessibility. Don't wait for the user to say "design" or "premium" explicitly — if the task touches visual or interactive output for this site, consult this skill first.
---

# Premium web design for rbtbank

rbtbank is a bank/fintech site. Financial products live or die on trust — a site that looks slightly off (inconsistent spacing, clashing colors, jarring motion, no loading state) reads as untrustworthy no matter how good the backend is. This skill is the taste and checklist that keeps every page consistent and premium, so decisions don't get reinvented (or forgotten) component by component.

## Workflow — follow this order

Design decisions made out of order cause rework (e.g. picking colors per-component instead of once). Work top-down:

1. **Clarify brand/tone if unknown.** If there's no established palette, logo, or tone yet, ask the user (or make one deliberate, stated choice and note it) rather than defaulting to generic "startup blue." Fintech brands usually pick between "conservative/institutional" (navy, slate, minimal accent) and "modern/challenger" (bold single accent on neutral base, e.g. Monzo/Revolut). Pick one on purpose.
2. **Establish tokens before components.** Define a type scale, spacing scale, and color tokens (see below) before writing component markup. If tokens already exist in the codebase (Tailwind config, CSS variables, theme file), read and reuse them — don't invent a parallel set.
3. **Build mobile-first**, using the spacing scale consistently. Check the layout narrow before checking it wide.
4. **Add micro-interactions last, and sparingly.** Motion should be the final polish pass on top of a layout that already works with zero animation — not a crutch that hides weak layout.
5. **Before calling it done**, actually look at it (see "Verify before shipping" below). Don't mark UI work complete on code review alone.

## Visual fundamentals

- **Type scale**: pick one scale (e.g. a 1.25 ratio: 14/16/20/25/31/39px) and only use those sizes. Random one-off font sizes are the fastest way for a page to look unplanned. Headings should have a clear, boring hierarchy — resist making more than one thing on a page "loudest."
- **Color**: one neutral ramp (grays, often slightly warm or cool-tinted rather than pure gray) + one accent color used deliberately for actions and emphasis. Avoid rainbow UI — if you reach for a third color, ask whether it's status-communicating (success/error/warning) or just decoration. Financial numbers (balances, rates, gains/losses) deserve their own careful treatment: high contrast, tabular-nums, and color used functionally (e.g. red/green for negative/positive) not decoratively. A fixed brand brief can legitimately specify two accents (e.g. this project's blue for primary actions + gold used sparingly for premium highlights) — the principle still holds, just extended: each accent needs a distinct, consistent job, and neither should show up on more than a small fraction of elements.
- **Whitespace**: err on the side of more than feels natural. Cramped layouts read as cheap; generous whitespace reads as premium. This is the single highest-leverage, lowest-effort change available.
- **Depth**: prefer soft shadows and subtle layering over hard borders to separate surfaces. A 1px border everywhere looks like a wireframe; sparing, soft elevation looks designed.
- **Alignment**: everything should sit on a consistent grid/spacing unit (e.g. multiples of 4px or 8px). Eyeballed padding is visible to users even if they can't articulate why something looks off.

## Component sourcing (if the stack is React + Tailwind)

If the frontend ends up being React with Tailwind, don't hand-build every primitive from scratch. [21st.dev](https://21st.dev) is a community marketplace of shadcn/ui-based React + Tailwind components, blocks, and hooks — install individual components with `npx shadcn` the same way you'd pull from shadcn/ui itself. Use it to skip rebuilding common patterns (tables, modals, form controls, nav bars) so effort goes into the things that actually differentiate this site (brand, layout, the 3D moment) rather than reinventing a dropdown. Still run anything pulled in through this skill's fundamentals — a borrowed component still needs to fit the established type scale, color tokens, and spacing scale, not bring its own. This doesn't apply if the stack ends up being Svelte or something else entirely.

## Motion and micro-interactions

Motion should communicate state, not decorate. Before adding any animation, ask: "what is this telling the user?" (something appeared, something is loading, this is now selected, this action succeeded). If there's no answer, cut the animation.

- Use eased curves, not linear or default browser transitions — linear motion reads as mechanical. A gentle ease-out for things entering/appearing, ease-in for things leaving, feels natural because it mimics real-world deceleration.
- Keep durations short (roughly 100–300ms for UI feedback; hover/press states at the low end, page-level transitions at the high end). Slow motion makes a product feel sluggish, which is deadly for a bank's perceived reliability.
- Give every interactive element a visible pressed/active state, not just hover — many users are on touch devices where hover doesn't exist.
- Always respect `prefers-reduced-motion` — disable or drastically simplify non-essential motion for users who request it. This isn't optional polish, it's an accessibility requirement.
- Loading, success, and error states deserve as much motion care as the "happy path" — a skeleton loader or a subtle success checkmark animation does more for perceived quality than any hero-section flourish.

## 3D and signature-moment tooling

Awwwards-tier agency sites (the peachweb.io look) use 3D/WebGL for one or two signature moments, not throughout. For a bank site the goal is a memorable hero or brand moment that still feels institutional and fast — not a tech demo. Reach for this toolchain only when a plain CSS/JS interaction genuinely can't deliver the effect (a hero scene, an interactive product visualization, a data-driven 3D graphic) — most pages on a bank site should need none of it.

- **Spline** (spline.design) — the fastest path to a 3D asset: design the scene visually, then export it for the web (React/Three.js/code, or an embeddable viewer). Default to this for one-off hero visuals or illustrations where you don't need custom shader work — it avoids hand-writing Three.js scene setup.
- **Three.js** (threejs.org) — the underlying WebGL library. Reach for it directly (or via a helper below) when you need custom geometry, shaders, or interaction logic that Spline's visual editor can't express.
- **Threlte** (threlte.xyz) — a declarative Three.js layer for Svelte. Only relevant if the site's frontend is actually built in Svelte/SvelteKit; don't pull it in otherwise. If the stack turns out to be React, the equivalent is react-three-fiber, not Threlte.
- **Theatre.js** (theatrejs.com) — a keyframe-based animation editor for choreographing complex, timed sequences (camera moves, multi-element scroll-driven animation) with a visual timeline rather than hand-tuned JS tweens. Reach for it when a scene needs precise, scrubbable choreography — not for simple hover/enter transitions, which plain CSS or a lightweight tween handles fine.
- **PeachWeb** (peachweb.io) — a no-code SaaS 3D site builder. It's a different path, not part of this codebase's stack (you'd use it instead of hand-coding, not alongside) — treat it as inspiration/benchmark for the visual bar, not a dependency to integrate.

This project has the `threejs-devtools-mcp` MCP server configured (`.mcp.json`) for live scene inspection — once a Three.js/Threlte scene is running in a dev server, use it to inspect objects, materials, shaders, and animations in real time instead of guessing from code alone. It requires the dev server running and a browser tab open at `localhost:9222` where its devtools bridge is injected; if no 3D scene exists yet in the project, its tools won't have anything to connect to.

Ground rules for using any of this on a bank site:
- **Budget it to a moment, not the whole site.** A 3D hero on the homepage is a brand statement; a 3D-heavy dashboard where users check their balance is a liability (slower, harder to make accessible, easy to make ambiguous about what's clickable).
- **Always ship a static fallback.** WebGL can fail to initialize (old GPU, disabled hardware acceleration, reduced-motion preference) — design the surrounding layout so a static image/gradient in its place still looks intentional, not broken.
- **Respect `prefers-reduced-motion`** the same as any other motion — pause or replace camera moves and looping animation for users who ask for it.
- **Watch load performance.** Lazy-load the 3D scene (don't block first paint on WebGL init), and check bundle size — a multi-megabyte GLTF model on a bank's marketing page will hurt perceived speed, which directly undercuts the trust signals elsewhere in this skill.
- **Keep interaction affordances obvious.** In a 3D scene it's easy to lose the plain UX heuristic of "recognition over recall" — make sure users can still tell what's clickable/draggable versus decorative.

## Platform-native conventions

Borrow from iOS Human Interface Guidelines even on the web, because users' expectations are shaped by their phones: clarity (text and icons legible at every size, no ambiguity about what's tappable), deference (chrome gets out of the way of content), depth (motion and layering communicate hierarchy). Concretely:
- Touch targets at least ~44px, even on desktop layouts that might later go responsive.
- Every state a component can be in — default, hover, focus, active, disabled, loading, error, empty — should have an intentional design, not just the two or three that came up during happy-path building.
- Focus states must be visible and consistent (for keyboard users) — don't strip outlines without replacing them.

## UX heuristics to check against

Cheap to check, expensive to skip:
- **Visibility of system status** — every async action (submitting a form, loading a balance) needs immediate feedback; never leave the user staring at a static button after they click it.
- **Error prevention & recovery** — validate inline before submission where possible; error messages should say what's wrong and how to fix it, not just "invalid input."
- **Consistency** — the same action (e.g. "primary button") should always look and behave the same way across the site. Don't let each page invent its own button style.
- **Recognition over recall** — label things, don't rely on icon-only affordances the user has to remember the meaning of, especially for anything involving money.

## Fintech trust signals

Beyond generic good design, banking products carry specific expectations:
- Conservative, high-contrast color use over trendy gradients/glassmorphism — flashy effects can read as unserious for a bank. Premium here means restrained, not maximal.
- Accessible contrast ratios (WCAG AA at minimum) — this is both an ethical and a trust issue; low-contrast text on a bank site reads as an accessibility afterthought.
- Fast perceived performance — skeleton screens and optimistic UI over spinners-then-nothing. Slow-feeling UI undermines confidence in a financial product specifically.
- Security/compliance cues where relevant (e.g. clear indication of secure session, no dark patterns around fees or terms) — trust is the product here, not just the interface.

## Verify before shipping

Don't consider frontend/UI work done from reading the code alone. Actually look at it: use `/run` or the `claude-in-chrome` skill to load the page in a browser and check:
- Both light and dark mode if the site supports theming.
- Loading, empty, and error states — not just the state with sample data filled in.
- At least one narrow (mobile) and one wide (desktop) viewport.
- That primary actions have visible hover/active/focus states.
- For any 3D/WebGL scene: use the `threejs-devtools-mcp` MCP server (dev server + browser tab open) to confirm materials/lighting/animation actually match intent, and confirm the static fallback renders correctly when the scene is disabled (simulating `prefers-reduced-motion` or a WebGL init failure).

If you can't drive a browser in the current environment, say so explicitly rather than claiming the UI was verified.
