# Where each file goes in the repo (`just-ronny`)

| From this kit | Put it at | Notes |
|---|---|---|
| DESIGN.md | DESIGN.md (repo root) | The rules. Add "Read DESIGN.md before any UI task." to CLAUDE.md |
| PROMPT.md | paste into the agent | Not committed |
| code/brand.ts | lib/brand.ts | APX glyph paths + palette. Used by Logo, OG image and favicon |
| code/favicon-rotator.ts | lib/favicon-rotator.ts | Pure TS, no React |
| code/FaviconRotator.tsx | components/FaviconRotator.tsx | Mount once in app/layout.tsx |
| code/Logo.tsx | components/Logo.tsx | Nav and footer logo |
| code/logo.css | import in globals | Letters hop on hover |
| static/icon.svg, favicon.ico, apple-icon.png | app/ | Next.js picks these up automatically |
| static/icon-192.png, icon-512.png, site.webmanifest | public/ | |
| marks/apx.svg, apx-transparent.svg | design files / public/brand | Lockup with and without background |
| tiles/apx-A.svg, apx-P.svg, apx-X.svg | design files | One tile per letter |
