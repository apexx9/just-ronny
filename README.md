# Ronny Portfolio

Portfolio for Aaron Nartey, a software developer and mechatronics engineer based in Accra, Ghana.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Notion content

Projects and blog posts are loaded only from Notion. Add the following to the ignored local `.env` file or your deployment provider's environment settings:

```text
NOTION_API_KEY=
NOTION_PROJECTS_DATABASE_ID=
NOTION_BLOG_DATABASE_ID=
```

These three Notion values are required to show projects and blog posts. Share both databases with the Notion integration used for `NOTION_API_KEY`.

The contact form sends email through Brevo. These are required for message delivery:

```text
BREVO_API_KEY=
BREVO_FROM_EMAIL=
BREVO_TO_EMAIL=
```

`BREVO_FROM_EMAIL` must be a sender address verified in Brevo. Optional configuration:

| Variable | Purpose | Default |
| --- | --- | --- |
| `BREVO_FROM_NAME` | Sender display name | `Aaron` |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, metadata, and contact email links | `https://ronny.tech` |
| `NEXT_PUBLIC_GITHUB_HANDLE` | GitHub contribution activity | `apexx9` |
| `NEXT_PUBLIC_CONTACT_ENDPOINT` | Override the contact form API endpoint | `/api/contact` |
| `NOTION_EXPERIENCE_DATABASE_ID` | Notion experience database; currently not shown on the homepage | unset |

No environment variables are needed just to build or start the site. Without the Notion settings, project and blog lists remain empty; without the Brevo settings, the contact form cannot send messages.

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
