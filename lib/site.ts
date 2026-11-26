// lib/site.ts
// Single source of truth for SEO. layout, sitemap, robots, RSS, JSON-LD and the
// OG images all read from here, so a change in one place updates everything.

const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aaronirl.tech";

export const siteConfig = {
  name: "Aaron Nartey",
  alternateName: "Ronny",
  title: "Aaron Nartey — Software Developer & Mechatronics Engineer",
  description:
    "I'm Aaron Nartey, a software developer and mechatronics engineer from Accra, Ghana. I build software, embedded systems, automation, and connected products.",
  jobTitle: "Software Developer & Mechatronics Engineer",
  url: rawUrl.replace(/\/+$/, ""),
  email: "aaronnartey001@gmail.com",
  locale: "en_GH",
  city: "Accra",
  country: "Ghana",
  countryCode: "GH",

  /**
   * IMPORTANT for "Google knows who I am":
   * add every profile you control (GitHub, LinkedIn, X, etc.). Google uses these
   * `sameAs` links to connect this site to you as one entity.
   * Example: ["https://github.com/yourname", "https://www.linkedin.com/in/yourname"]
   */
  sameAs: [] as string[],

  keywords: [
    "Aaron Nartey",
    "Ronny",
    "Software Engineer",
    "Software Developer",
    "Mechatronics Engineer",
    "Embedded Systems",
    "Automation",
    "IoT",
    "Next.js",
    "NestJS",
    "TypeScript",
    "Ghana",
    "Accra",
  ],

  knowsAbout: [
    "Software engineering",
    "Mechatronics",
    "Embedded systems",
    "Automation",
    "Internet of Things",
    "Next.js",
    "NestJS",
    "TypeScript",
  ],
};

export const hostname = new URL(siteConfig.url).host;

/** Stable @id values so schema nodes can reference each other. */
export const personId = `${siteConfig.url}/#person`;
export const websiteId = `${siteConfig.url}/#website`;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Minimal Person reference reused by Article / CreativeWork schema. */
export const personRef = {
  "@type": "Person",
  "@id": personId,
  name: siteConfig.name,
  url: siteConfig.url,
} as const;
