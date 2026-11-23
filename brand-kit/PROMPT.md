# Prompt for the coding agent (paste this whole file)

You are a senior front-end engineer with a print-design background, working in my existing portfolio repo
(`just-ronny`: Next.js 16, React 19, Tailwind v4, Framer Motion, Notion content, Brevo contact form).
I am Aaron Nartey, a mechatronics engineer in Accra. The site already works and has a lot in it.
Your job is to **make the whole site speak the hero's language, swap in my new logo, and fix a short list of real
problems.** It is a restyle-and-fix job, not a rebuild. Do not remove features. Do not invent content.

<theme>
Friendly, personal, dark-first. Soft round corners, flat colour, hairlines instead of shadows, inline tinted chips
inside sentences, one narrow reading column, lots of calm. References: degreat.co.uk (greeting stack, chips, pill nav,
badge, dated lists), adoodevv.com (plain project rows, keyboard shortcuts, location in footer), easyui.site (a few
restrained animated components). The tokens, never/always lists, component table and motion rules are in DESIGN.md.
It is the law for this task.
</theme>

## Step 0 — read first, change nothing yet
1. Read `DESIGN.md` fully and save it to the repo root. Add to `CLAUDE.md` (create if missing):
   "Read DESIGN.md before any UI task."
2. Read the repo's existing design spec, `lib/content.ts`, `lib/posts.ts`, every section component, the theme script,
   the Tailwind `@theme`, the API routes, and the metadata. Note what already matches DESIGN.md.
3. Run the site and screenshot every section at 390 / 768 / 1280 in **both** themes as your "before".
4. Keep what works: analytics attributes, copy-email, drawer, signature intro, arm, Notion fallbacks, honeypot,
   focus traps, reduced-motion handling. Tailwind and Framer Motion are already installed. Do not reinstall.

## Step 1 — logo and icons (APX)
- Add the files I attached: `lib/brand.ts`, `lib/favicon-rotator.ts`, `components/Logo.tsx`,
  `components/FaviconRotator.tsx`, `logo.css` (import it in globals).
- Replace the generated favicons, apple icon and manifest with `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png`,
  `public/icon-192.png`, `public/icon-512.png`, `public/site.webmanifest`. Mount `<FaviconRotator />` once in
  `app/layout.tsx`. Set `themeColor: "#141414"`.
- The pill nav's "Aaron Nartey" text becomes the `<Logo />` linking home (accessible name "Aaron Nartey"). Put a smaller
  Logo in the footer. The pen signature stays for the intro and About, never in the same viewport as the Logo.
- Update `app/opengraph-image.tsx`: APX mark, "Aaron Nartey", "Mechatronics engineer" on `#141414`. Reuse `lib/brand.ts` paths.

## Step 2 — tokens and theme
- Merge the DESIGN.md tokens into the existing Tailwind v4 theme. Keep existing token names. Remove duplicates.
- Default theme is **Dark**. Keep Light / Dark / System with no flash. Light uses the paper tokens. In **both** themes,
  coloured words, links and chip text use the `--*-text` tokens; fills use the plain colour tokens. Chip tint is 13%,
  18% on hover. Move `hero.css` to tokens so the hero looks the same or better in both themes.
- Add Geist Mono via `next/font`. Keep Aspekta, Geist, Darlington. Write the contrast-check script and run it.

## Step 3 — the hero, made mine
The hero currently greets with いらっしゃいませ, the exact Japanese line degreat.co.uk uses. Replace it:
- Keep the green "Akwaaba" pill.
- Under it, a big greeting chosen **once on the client by Accra time**: before 12:00 "Maakye", 12:00–17:59 "Maaha",
  from 18:00 "Maadwo". Render "Akwaaba" on the server and swap after hydration without layout shift. No loop, no timer.
  Screen readers still get "Aaron Nartey, mechatronics engineer". Tell me to confirm these spellings.
- Everything else in the hero stays (lead, chips, footnote, badge). The email chip, the GitHub and Instagram chips stay.

## Step 4 — shell, one section at a time (stop after each so I can review)
1. **Nav + header.** EasyUI Pill Navigation for the drawer nav: Work, Information, Listening, Contact, Blog (hide
   Listening until Spotify is configured, see Step 5). Sliding active background, 250ms. Orange "new" dot driven by data
   (e.g. newest project). Keep the floating theme toggle. Mobile: restyle the existing full-screen menu; swap to Gooey
   Menu only if it keeps Escape, focus trap, scroll lock and a 44px trigger.
2. **Keyboard:** `w` Work, `i` Information, `l` Listening, `c` Contact, `b` Blog, scroll smoothly. Ignore when focus is in
   an input or a modifier is held. Show the hint once in the footer in mono: `press w · i · l · c · b`.
3. **Selected works.** Keep cover-image cards, restyled: title, year (mono), discipline, one line, stack line with ` · `.
   Two real projects only; do not pad. Case-study modal sections use EasyUI Unfold Accordion (Overview, Challenge,
   Approach, Features, Tech), rendering only sections that have content. Card tilt ≤ 3°.
4. **Robot arm.** Keep it as is. Restyle labels (`GND`, `M-01 / LIVE`, `J1`, `TARGET`, telemetry) to Geist Mono and tokens.
   Under reduced motion it stays static (already so; verify). No glow.
5. **About.** Keep the signature write-on and the Services / Contact sidebar. Add one footnote chip aside like the hero.
6. **Activity.** Keep the existing heatmap. Restyle to `--green` and make cells keyboard-reachable with accessible tooltips.
7. **Listening.** Render the card only when Spotify env vars exist and the last call succeeded. Otherwise render nothing
   and drop the nav item. Keep the equaliser and mini-player styling. Add a README note for `/api/spotify/login` setup.
8. **Contact.** Restyle the form: visible labels, rounded fields, focus rings, clear success and error states.
   Keep the honeypot and `/api/contact`.
9. **Footer.** Keep the live Accra clock. Add a mono version string (from package.json or build date), the keyboard
   hint, and small Logo. Social links: GitHub (apexx9), Instagram (with hover card), email. Hide LinkedIn and X until I
   give real URLs.
10. **Blog + 404.** Blog list: mono date · reading time, title, summary, tags as small chips, rounded cover. "Wrong turn."
    404 restyled with the Logo.

## Step 5 — fix these real problems
1. **Positioning.** Metadata says "Product Designer & Engineer… thoughtful digital products". Everything else says
   mechatronics engineer. Title becomes "Aaron Nartey — Mechatronics engineer"; description is one plain sentence in my
   voice taken from the hero lead; update OG/Twitter tags and add Person JSON-LD (jobTitle, Accra).
2. **Instagram bio** `"{gh}{gb} 黑色†"` renders literally. Parse `{gh}` and `{gb}` into small inline **SVG** flags (Ghana,
   UK), not emoji, and render the rest as text.
3. **Social links.** LinkedIn and X point to generic homepages. Never link a generic homepage. Hide them until I provide URLs.
4. **Spotify** shows "unavailable" forever. Handled in Step 4.7.
5. **Visual Socket** has `href: "#"` and no case study. Remove the dead link. The card is not clickable; show "Case study
   soon" in mono instead of opening an empty modal.
6. **Copy in Notion.** Do not edit Notion. Report these to me: Voltar AI summary has "assitance" (→ "assistance") and
   reads awkwardly. Suggest: "AI assistance for businesses, built to help them grow their income."
7. Ignore the Next.js dev-tools bubble in screenshots; it is not part of the design.

## Motion and UX bar
Follow DESIGN.md section 8 exactly. Keep existing animations, tighten them to those rules, add nothing else.
Mobile-first, no horizontal scroll, tap targets ≥ 44px, visible rounded focus rings, AA contrast in both themes,
Lighthouse mobile performance ≥ 95, accessibility 100, CLS 0. No new dependency without saying why.

## Process
- Order: Step 1 → 2 → 3 → 4 → 5. After each step run the app, screenshot at 390 / 768 / 1280 in dark and light with
  Playwright, look at them yourself, fix anything that looks templated, then show me.
- Then run the DESIGN.md section 10 checklist and report what passed. If three or more fail, fix the spec's weak
  spot and regenerate that section instead of patching.
- Ask before adding any content I did not write (projects, posts, numbers, claims).
- Finish with: files changed, packages added, things skipped and why, and the "before / after" screenshots.
