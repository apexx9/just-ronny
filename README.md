# Ronny Portfolio

Portfolio for Aaron Nartey, a software developer and mechatronics engineer based in Accra, Ghana.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Notion content

Projects and blog posts are loaded only from Notion. Configure these environment variables:

```text
NOTION_API_KEY=
NOTION_PROJECTS_DATABASE_ID=
NOTION_BLOG_DATABASE_ID=
NOTION_EXPERIENCE_DATABASE_ID=
NEXT_PUBLIC_SITE_URL=https://ronny.tech
NEXT_PUBLIC_GITHUB_HANDLE=apexx9
```

### Projects database properties

- `Title` — title
- `Slug` — rich text
- `Category` — select
- `Year` — date
- `Client` — rich text
- `Role` — rich text
- `Duration` — rich text
- `Description` — rich text
- `Overview` — rich text
- `Challenge` — rich text
- `Approach` — rich text
- `Features` — multi-select
- `Tech Stack` — multi-select
- `Live URL` — URL
- `Github URL` — URL
- `Featured` — checkbox
- `Order` — number

Set a cover image on each Notion project page. Projects and blog posts are not populated from local sample data.
