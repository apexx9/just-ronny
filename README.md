This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to self-host and optimise the type: **Inter** for the site, matching the hero. The hero chips and footnote keep **Maple Mono Italic** and **DM Mono**; **Darlington** stays for the signature. Font licences live in `public/fonts/`.

## Listening

The "Listening" card shows the last track in Aaron's Spotify listening history.
It is powered by the Spotify Web API, not a static embed, so it needs a one-time
OAuth setup. Copy and labels live in `site.spotify` in `lib/content.ts`; the
track itself comes from `GET /api/spotify/recent` and refreshes about once a
minute.

1. Create an app in the [Spotify developer dashboard](https://developer.spotify.com/dashboard).
2. Add these redirect URIs to the app:
   - `http://localhost:3000/api/spotify/callback`
   - your production callback, e.g. `https://annartey.vercel.app/api/spotify/callback`
3. Add the credentials to `.env.local` (server-only — never use a
   `NEXT_PUBLIC_` prefix):
   ```bash
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   # Optional. Defaults to <request origin>/api/spotify/callback.
   SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
   ```
4. Run `pnpm dev`, open
   [http://localhost:3000/api/spotify/login](http://localhost:3000/api/spotify/login),
   and approve both `user-read-currently-playing` and
   `user-read-recently-played`.
5. Copy the `SPOTIFY_REFRESH_TOKEN` shown after approval into `.env.local`,
   restart the dev server, and add the same variables to your hosting provider.
6. Open the site. The Listening card is always visible in the rail beside the
   Information section. Before setup it shows a connect card; after setup it
   shows the current or last played track from `/api/spotify/recent`.

The refresh token is a secret. Keep it in environment variables and never
commit it. Spotify apps in Development Mode also require the listener's
Spotify account to be added under **User Management** in the dashboard.

## Brand assets

The mark is **APX**: three flat shapes (A orange, P gold, X green). The paths
and palette live in `lib/brand.ts`, which feeds the header/footer `<Logo />`,
the rotating favicon and the OG image.

Static icons are the A tile from the brand kit:

- `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png` (Next metadata files)
- `public/icon-192.png`, `public/icon-512.png`, `public/site.webmanifest`

The tab icon rotates A → P → X every 8s via `lib/favicon-rotator.ts`, mounted
once as `<FaviconRotator />` in `app/layout.tsx`. Do not regenerate these from
the old scripts; replace them from the brand kit instead.

## Project covers

`Visual Socket` and `Voltar AI` have branded fallback covers in
`public/images/work/`. They are used whenever the matching Notion row has no
cover image. Regenerate them with:

```bash
pnpm covers
```

The script lives in `scripts/generate-project-covers.mjs`. Real covers set in
Notion always take priority over these fallbacks.

## Mechatronics

The main document opens with an interactive two-joint arm
(`components/robotic-arm.tsx`) sitting directly on the page surface, with no
panel background. It follows the pointer with a small inverse-kinematics loop,
idles on its own, pauses off-screen, and renders a static pose when reduced
motion is enabled. Copy lives in `site.mechatronics` in `lib/content.ts`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
