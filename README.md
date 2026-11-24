# Aaron Nartey — Portfolio

A dark, editorial portfolio for Aaron Nartey (APX), a mechatronics engineer based in Accra, Ghana. The site focuses on work across software, electronics, robotics and physical systems.

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Framer Motion
- Inter and DM Mono via `next/font`

## Local development

Requires Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
pnpm build
pnpm lint
pnpm contrast
```

## Content and routes

- `lib/content.ts` contains the profile and selected project records.
- `lib/site-posts.ts` loads Notion posts and falls back to local posts in `lib/posts.ts`.
- `app/blog` contains the writing index and article route.
- `components/robotic-arm.tsx` renders the interactive two-joint inverse-kinematics study.
- `components/activity-section.tsx` displays GitHub contribution activity.
- `components/remake-portfolio.tsx` composes the homepage sections.

## Integrations

The contact form posts to `/api/contact` (Brevo). Spotify listening status is read from `/api/spotify/recent`. GitHub activity is read from `/api/contributions`. Configure the relevant server-side environment variables in your deployment provider; keep API secrets out of client-side variables and out of source control.

## Deployment

Deploy the repository with your preferred Next.js host. Set the production site URL and the server-side credentials required by the integrations in the host's environment settings, then run the production build.
