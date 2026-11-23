# DESIGN.md — Aaron Nartey's site (`just-ronny`)

Read this before ANY UI task. If a rule here conflicts with a default you would normally pick, this file wins.
Do not add colours, fonts, radii or shadows that are not defined here.

## 1. The feeling
A friendly, personal engineering notebook from Accra that reads like a person talking, not a company pitching.
Soft round corners, flat colour, hairlines instead of shadows, inline highlighted words inside sentences,
one narrow reading column, lots of calm. The hero sets the language; every other section speaks it.

**What already exists and stays** (do not rebuild): the dark hero with the Akwaaba pill, chips, footnote and
static Ghana origin signature; the drawer that slides up over the hero; the pen-written signature intro; the two-joint robot arm;
Selected works with case-study modal; About; GitHub heatmap; Spotify card; contact form (Brevo); footer with live
Accra clock; blog; 404; Light / Dark / System theme toggle. Restyle and fix these. Do not replace them.

**Decisions taken** (so you do not have to ask):
- Theme: keep the toggle. **Default is Dark** so the hero language leads. Light is derived from the same tokens.
- Drawer: keep the mechanic. In dark mode the sheet is `--surface` with a hairline top edge and a 28px top radius.
  In light mode keep the existing light sheet.
- Fonts: **Inter** for the site face, matching the hero and degreat.co.uk.
  Hero chips keep **Maple Mono Italic**, the hero footnote keeps **DM Mono**, and **Darlington** is the intro/about signature only.
  Do not add Onest or any other family.

References (copy the specific quality, not the site):
- **degreat.co.uk** — greeting stack, tinted inline chips, footnote chips, pill nav with active state and a "new" dot,
  rotating badge, quiet cards, dated writing list, footer version string.
- **adoodevv.com** — single narrow column, plain project rows (title / year / one line / stack with middots),
  keyboard shortcuts in the nav, location in the footer, almost no ornament. (Read from text only; colours and fonts unseen.)
- **easyui.site** — a few restrained animated components (section 7).

One dominant element per screen. Everything else recedes.

## 2. Tokens
Map these onto the existing Tailwind v4 `@theme` / CSS variables. Keep existing token names where they exist;
add only what is missing. Dark is the default.

```css
:root, [data-theme="dark"] {
  --bg: #141414;  --surface: #1c1c1c;  --surface-2: #242424;
  --line: rgb(255 255 255 / 0.08);  --line-strong: rgb(255 255 255 / 0.16);
  --fg: #f5f5f2;  --muted: #9b9b96;  --faint: #6b6b67;   /* faint = decoration only, never text */
  /* FILLS: logo, dots, bars, chip backgrounds */
  --orange: #f2784b;  --gold: #f5c518;  --green: #3dbb78;  --blue: #7b8cff;
  --purple: #a17be8;  --pink: #e78bb5;
  /* TEXT: coloured words and links (verified ≥ 4.5:1 on bg, surface, surface-2, also on a 13% / 18% tint of itself) */
  --orange-text: #f68a63;  --gold-text: #f5c518;  --green-text: #4cc786;  --blue-text: #9ba8ff;
  --purple-text: #b69af5;  --pink-text: #efa3c5;
}
[data-theme="light"] {
  --bg: #f6f4ef;  --surface: #ffffff;  --surface-2: #efece5;
  --line: rgb(0 0 0 / 0.08);  --line-strong: rgb(0 0 0 / 0.16);
  --fg: #161616;  --muted: #5f5f5a;  --faint: #8a8a84;
  --orange: #e8541e;  --gold: #f5c518;  --green: #3dbb78;  --blue: #6b7bff;
  --purple: #8a5bd6;  --pink: #db4f8f;
  --orange-text: #9c3509;  --gold-text: #6e5300;  --green-text: #146338;  --blue-text: #3a49bc;
  --purple-text: #5b2a9e;  --pink-text: #a61e5c;
}
:root {
  --r-xs: 6px;  --r-sm: 10px;  --r-md: 14px;  --r-lg: 20px;  --r-xl: 28px;  --r-pill: 999px;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);  --t-fast: 150ms;  --t-base: 250ms;  --t-slow: 450ms;
}
```
- Chips: background `color-mix(in srgb, var(--x) 13%, transparent)`, **18%** on hover (not 24%: it breaks AA).
  Chip **text** always uses `--x-text`, in both themes. Chips sit on `--bg`, `--surface` or `--surface-2` only.
- Social chips: GitHub uses `--blue`, Instagram `--pink`, Discord `--purple` for the background tint;
  their labels use the matching `--*-text` token.
- The text values above were checked against WCAG AA. Still write a small script that checks every text/background
  pair in both themes (4.5:1 body, 3:1 large) after you wire them in, and fix the token, not the component.
- `--gold` is a fill colour. Never set body text in `--gold` on paper; use `--gold-text`.

## 3. Type
- Inter: the site face — headings 700 (tracking -0.02em), lead 500–600 (like the hero), body 400–500, metadata.
- Dates, years, stack lines (` · ` separated), the clock, J1/J2 telemetry, keyboard hints and version string stay in Inter.
- Hero exception: chips use Maple Mono Italic and the footnote uses DM Mono. Do not change those two.
- Darlington: the intro and the about signature. Nowhere else.
- Scale (rem): 0.8125 · 0.9375 · 1.0625 · 1.25 · 1.75 · clamp(2.25, 5vw, 3.5). Body line-height 1.6, headings 1.15.
- Sentence case. All caps only in the origin lockup and telemetry labels.
- Never ship Roboto, Open Sans, Arial, Space Grotesk or bare `system-ui` as a visible face.

## 4. Layout and spacing
- Mobile first. Container `min(100% - 2.5rem, 72rem)`; reading column max `38rem`, left-aligned.
- 4px base grid. Section gap 6rem desktop / 4rem mobile.
- Hairline `1px solid var(--line)` instead of shadows. Surfaces step `--bg → --surface → --surface-2`.
- Touch targets ≥ 44px. Focus ring `2px solid currentColor`, offset 2px, **rounded to match the element**.

## 5. NEVER
1. No Roboto / Open Sans / Arial / Space Grotesk. Inter is the house face; hero chips and footnote keep their original faces; Darlington is the signature only.
2. No purple or indigo gradients. No gradients on text or buttons. No glow, neon, blurred orbs. (The Voltar AI cover
   is a client image; leave it, but no new gradient art.)
3. No row of three equal cards with icon + title + blurb.
4. No soft drop shadows on cards. Shadows only on popovers and menus, one value.
5. No emoji as UI icons or bullets. Emoji appear only inside the inline hero chips. One icon set (Lucide, stroke 1.75).
   Never use flag emoji for real UI (Windows renders them as letters). Draw flags as small inline SVG.
6. No filler: no lorem, stock art, fake testimonials, fake metrics, fake client logos, invented projects or posts.
   If a section has no real content, it does not render.
7. No dead or fake links: no `href="#"`, no link to a generic homepage standing in for a profile.
   An unconfigured integration must not show a permanent error. It hides.
8. No generic copy: "passionate", "cutting-edge", "seamless", "elevate", "unlock", "leverage", "crafting digital
   experiences", "thoughtful digital products". No stacked em-dashes. No three-beat rhythm in every sentence.
9. No scroll-jacking, parallax, cursor trails, particles, typewriter loops, auto-playing carousels, animated backgrounds.
10. No corner under 6px anywhere, including inner notches and focus rings. No second theme system.

## 6. ALWAYS
- Colours, radii, durations only from tokens. No raw hex in components.
- Real content from `lib/content.ts` / Notion. Add fields there, not in JSX.
- Landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, visible focus, full keyboard reach.
- `prefers-reduced-motion`: no transforms or loops; opacity fades ≤ 150ms. Keep the existing handling and extend it.
- Voice: first person, plain, specific, a little playful, short sentences. Position is **mechatronics engineer**
  everywhere (title, meta, OG, JSON-LD, hero, about).
- Metadata in Inter, muted. One primary action per screen.

## 7. Components
Base: shadcn/ui primitives. Animated layer: EasyUI (React + Tailwind + Framer Motion). The site already has
Tailwind v4 and Framer Motion; run `npx shadcn@latest init` only if `components.json` is missing.
Install with the CLI so the real source is copied in, then restyle to tokens. Do not retype source.

| Where | Component | Install | Key props |
|---|---|---|---|
| Drawer nav (≥640px) | Pill Navigation | `npx shadcn@latest add Surajmaurya1/easyui/pill-navigation` | `items`, `defaultValue`, `defaultSubValue`, `onChange(id, subId?)` |
| Case-study modal sections | Unfold Accordion | `npx shadcn@latest add Surajmaurya1/easyui/unfold-accordion` | `items`, `allowMultiple` (false), `defaultOpen` |
| Mobile menu (optional) | Gooey Menu | `npx shadcn@latest add Surajmaurya1/easyui/gooey-menu` | `options`, `value`, `onSelect`, `trigger`, `align`, `width` |
| Footer (optional) | Liquid Toggle | `npx shadcn@latest add Surajmaurya1/easyui/liquid-toggle` | `value`, `onChange`, `onLabel`, `offLabel`, `accentColor`, `width`, `height` — as a "Reduce motion" switch |

Rules for using them:
- **Gooey Menu** replaces the full-screen mobile overlay only if the result still has Escape to close, a focus trap,
  body scroll lock and a 44px trigger. If any is missing, keep the existing overlay and restyle it.
- **Heatmap:** keep the existing GitHub heatmap (it already has labels, tooltips, skeleton). Restyle it to `--green`
  and make it keyboard-reachable. Do not add EasyUI's Activity Heatmap alongside it.
- **Liquid Toggle** is not for the theme toggle (that has three states).
- Skipped on purpose: Wave Transition (rainbow wave), Neon Edge Button (neon).
- One more idea at a time from Cult UI, Motion Primitives or Animata is fine. Check the licence, restyle to tokens,
  and do not add a second component system.

## 8. Motion (nice and simple)
Keep: the signature intro, the arm, chip tints, card tilt. Tighten them to these rules.
- Signature intro: once per session, ≤ 2s, click or Esc to skip, never blocks content, never delays LCP, no scroll lock,
  skipped for reduced motion and repeat visits (already so; verify).
- Page load: sections fade up 8px, 400ms `--ease`, staggered 60ms, max 6 steps, once.
- Nav pill: active background slides between items, 250ms. Chips and links: tint 13% → 18%, 150ms.
- Logo: letters hop 3px one after another on hover/focus, 250ms, 40ms stagger.
- Cards: tilt ≤ 3°, 250ms, off for touch and reduced motion. Arrow nudges 2px.
- Hero greeting: no loop. It is chosen once by Accra time of day (see PROMPT).
- Origin signature: static. No rotation, no orbit, no reveal animation. Drawer: existing spring, no bounce overshoot beyond 4px.
- Only `transform` and `opacity`. Nothing loops faster than 20s.

## 9. Logo, favicon and origin signature
- **Mark: APX.** Three solid flat shapes, one per letter, every corner rounded, equal height, even 8-unit gaps:
  a full triangle for A (orange), a filled P with no counter (gold), a fat crossed X (green).
  Data in `lib/brand.ts`; component `components/Logo.tsx`; hover in `logo.css`.
- The pen **signature** ("Aa" / "Aaron Nartey" in Darlington) stays for the intro and About. APX is the logo
  (nav, footer, favicon, OG). Do not show both in the same viewport.
- Static icons (first paint, crawlers, no-JS): `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png` = the A tile.
  `public/icon-192.png`, `icon-512.png`, `site.webmanifest` (theme and background `#141414`). Replace the generated ones.
- Rotating favicon: `lib/favicon-rotator.ts` + `components/FaviconRotator.tsx`, mounted once in `app/layout.tsx`.
  Steps A → P → X every 8s while the tab is visible, steps once when you leave the tab, never animates in a hidden tab,
  remembers its place per session, holds still under reduced motion, PNG frames so Safari works.

### Origin signature
- One static mark in the hero, directly under the footnote. Component `components/ghana-signature.tsx`;
  styles `.hx-origin*` in `app/hero.css`. Left-aligned, 2.65 × 3.25rem (2.35 × 2.9rem at ≤480px).
- Outline: Ghana from Natural Earth 1:50m admin-0 (public domain), projected to a 54 × 66 viewBox and
  simplified to 50 points. Do not replace it with a hand-drawn or unverified silhouette.
- Gold star at the polygon centroid: it is the national star from the flag, **not an Accra pin**. The
  `ACCRA · GHANA` line carries the place. No orbit arc, no rotation, no reveal.
- Lockup: `PROUDLY` Inter 650 at 0.59rem / 0.24em tracking; `GHANAIAN` Inter 600 at 0.94rem; `ACCRA · GHANA`
  Inter 500 at 0.55rem, muted. Three fixed flag bars sit under the place line.
- Identity colours, intentionally outside the theme tokens: star `#d8b45d`; bars `#ce1126`, `#fcd116`,
  `#006b3f`. Do not reuse them for UI fills.
- One per page. Never in the nav, footer or OG image.

## 10. Review checklist (run before saying "done")
- [ ] Every colour, radius, duration comes from a token (grep components for `#` and raw px radii).
- [ ] No item from section 5 appears. Three or more misses → fix the spec's weak spot and regenerate that section.
- [ ] AA contrast in **both** themes; focus ring visible and rounded everywhere.
- [ ] 390 / 768 / 1280px screenshots, dark and light, look intentional. No horizontal scroll. Tap targets ≥ 44px.
- [ ] Reduced motion honoured. Lighthouse mobile: performance ≥ 95, accessibility 100, CLS 0.
- [ ] Copy has no banned phrases, says "mechatronics engineer" consistently, and says something only Aaron could say.
- [ ] No dead links, no permanent error states, no generic social homepages.
