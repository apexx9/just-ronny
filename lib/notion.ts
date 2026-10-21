import { cacheLife, cacheTag } from "next/cache";
import type { Project } from "@/lib/content";

// Notion API payloads are deeply nested and not fully typed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NotionAny = any;

const NOTION_VERSION = "2022-06-28";

export const PROJECTS_DATABASE_ID = process.env.NOTION_PROJECTS_DATABASE_ID || "";
export const BLOG_DATABASE_ID = process.env.NOTION_BLOG_DATABASE_ID || "";
export const EXPERIENCE_DATABASE_ID =
  process.env.NOTION_EXPERIENCE_DATABASE_ID || "";

const apiKey = () => process.env.NOTION_API_KEY || "";

// ─── Text helpers ─────────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Only allow links that are safe to render in HTML attributes.
function safeUrl(url: string): string {
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("mailto:") || trimmed.startsWith("tel:")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return "";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function estimateReadingTime(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

// Prefer the explicit Slug property; fall back to slugifying the Title so a
// page without a slug never produces a broken link.
function resolveSlug(page: NotionAny): string {
  const properties = page.properties || {};
  const raw = properties.Slug?.rich_text?.[0]?.plain_text || "";
  const title = properties.Title?.title?.[0]?.plain_text || "";
  const candidate = (raw || title).trim();
  if (candidate) return slugify(candidate);
  return String(page.id || "").replace(/-/g, "").slice(0, 12);
}

// ─── Types (raw Notion shape) ─────────────────────────

export interface NotionProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  year: string;
  client: string;
  role: string;
  duration: string;
  description: string;
  overview: string;
  challenge: string;
  approach: string;
  features: string[];
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  order: number;
  coverImage: string | null;
}

export interface NotionBlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  publishedDate: string;
  tags: string[];
  coverImage: string | null;
  content: string;
}

export interface NotionExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  order: number;
  logo: string | null;
}

// ─── Display models (what the UI consumes) ───────────

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  readingTime: string;
  content: string; // rendered HTML
}

// ─── Parsers ──────────────────────────────────────────

function parseProjectPage(page: NotionAny): NotionProject {
  const p = page.properties || {};
  const yearDate = p.Year?.date?.start || "";
  const year = yearDate ? String(new Date(yearDate).getFullYear()) : "";

  return {
    id: page.id,
    title: p.Title?.title?.[0]?.plain_text || "Untitled",
    slug: resolveSlug(page),
    category: p.Category?.select?.name || "",
    year,
    client: p.Client?.rich_text?.[0]?.plain_text || "",
    role: p.Role?.rich_text?.[0]?.plain_text || "",
    duration: p.Duration?.rich_text?.[0]?.plain_text || "",
    description: p.Description?.rich_text?.[0]?.plain_text || "",
    overview: p.Overview?.rich_text?.[0]?.plain_text || "",
    challenge: p.Challenge?.rich_text?.[0]?.plain_text || "",
    approach: p.Approach?.rich_text?.[0]?.plain_text || "",
    features: p.Features?.multi_select?.map((f: NotionAny) => f.name) || [],
    techStack:
      p["Tech Stack"]?.multi_select?.map((t: NotionAny) => t.name) || [],
    liveUrl: p["Live URL"]?.url || "",
    githubUrl: p["Github URL"]?.url || "",
    featured: p.Featured?.checkbox || false,
    order: p.Order?.number || 0,
    coverImage: page.cover?.external?.url || page.cover?.file?.url || null,
  };
}

function parseBlogPage(page: NotionAny): NotionBlogPost {
  const p = page.properties || {};
  return {
    id: page.id,
    title: p.Title?.title?.[0]?.plain_text || "Untitled",
    slug: resolveSlug(page),
    description: p.Description?.rich_text?.[0]?.plain_text || "",
    publishedDate: p.Published?.date?.start || "",
    tags: p.Tags?.multi_select?.map((t: NotionAny) => t.name) || [],
    coverImage: page.cover?.external?.url || page.cover?.file?.url || null,
    content: "",
  };
}

function parseExperiencePage(page: NotionAny): NotionExperience {
  const p = page.properties || {};
  let logo: string | null = null;
  const logoFile = p.Logo?.files?.[0];
  if (logoFile) {
    logo = logoFile.external?.url || logoFile.file?.url || null;
  } else if (page.icon) {
    if (page.icon.type === "external") logo = page.icon.external.url;
    else if (page.icon.type === "file") logo = page.icon.file.url;
  }
  return {
    id: page.id,
    company: p.Company?.title?.[0]?.plain_text || "Unknown Company",
    role: p.Role?.rich_text?.map((t: NotionAny) => t.plain_text).join("") || "",
    duration:
      p.Duration?.rich_text?.map((t: NotionAny) => t.plain_text).join("") || "",
    description:
      p.Description?.rich_text?.map((t: NotionAny) => t.plain_text).join("") ||
      "",
    order: p.Order?.number || 0,
    logo,
  };
}

// ─── Notion → UI project adapter ─────────────────────

export function toProject(p: NotionProject): Project {
  return {
    id: p.id,
    name: p.title,
    title: p.title,
    discipline: p.category || p.role || "",
    summary: p.description || p.overview || "",
    role: p.role,
    period: p.year || p.duration,
    href: p.liveUrl || p.githubUrl || "#",
    image: {
      src: p.coverImage || "/images/work/project-one.png",
      width: 1600,
      height: 1000,
      alt: `${p.title} cover`,
    },
    company: p.client
      ? { label: p.client, href: p.liveUrl || p.githubUrl || "#" }
      : undefined,
    // rich case-study fields (optional — dialog renders them when present)
    description: p.description,
    overview: p.overview,
    challenge: p.challenge,
    approach: p.approach,
    features: p.features,
    techStack: p.techStack,
    liveUrl: p.liveUrl,
    githubUrl: p.githubUrl,
  };
}

function toBlogPost(p: NotionBlogPost, content = ""): BlogPost {
  const body = content || `<p>${escapeHtml(p.description)}</p>`;
  return {
    slug: p.slug,
    title: p.title,
    date: p.publishedDate,
    tags: p.tags,
    summary: p.description,
    readingTime: estimateReadingTime(
      p.description + " " + body.replace(/<[^>]+>/g, " ")
    ),
    content: body,
  };
}

// ─── Low-level Notion fetch ───────────────────────────

async function queryDatabase(
  databaseId: string,
  body: Record<string, unknown>
): Promise<NotionAny[]> {
  if (!databaseId || !apiKey()) return [];
  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("Notion API error:", data);
    return [];
  }
  return data.results || [];
}

// ─── Projects ─────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("notion-projects");
  try {
    const results = await queryDatabase(PROJECTS_DATABASE_ID, {
      sorts: [{ property: "Order", direction: "ascending" }],
      page_size: 24,
    });
    return results.map(parseProjectPage).map(toProject);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// ─── Blog ─────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPost[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("notion-blog");
  try {
    const results = await queryDatabase(BLOG_DATABASE_ID, {
      sorts: [{ property: "Published", direction: "descending" }],
      filter: { property: "Published", date: { is_not_empty: true } },
      page_size: 50,
    });
    return results.map((r) => toBlogPost(parseBlogPage(r)));
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

async function fetchBlogContent(pageId: string): Promise<string> {
  "use cache";
  cacheLife("hours");
  cacheTag("notion-blog");
  try {
    const res = await fetch(
      `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`,
      {
        headers: {
          Authorization: `Bearer ${apiKey()}`,
          "Notion-Version": NOTION_VERSION,
        },
      }
    );
    if (!res.ok) return "";
    const data = await res.json();
    return renderBlocksToHTML(data.results || []);
  } catch (error) {
    console.error("Error fetching blog content:", error);
    return "";
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("notion-blog");
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return null;
  const raw = await fetchBlogContentBySlug(slug);
  return raw ? { ...post, content: raw } : post;
}

// fetchBlogContent needs the Notion page id, which only the raw query has —
// resolve slug → id via a lightweight uncached lookup.
async function fetchBlogContentBySlug(slug: string): Promise<string> {
  const results = await queryDatabase(BLOG_DATABASE_ID, {
    filter: { property: "Published", date: { is_not_empty: true } },
    page_size: 50,
  });
  const match = results.find((r) => resolveSlug(r) === slug);
  if (!match) return "";
  return fetchBlogContent(match.id);
}

// ─── Experience ───────────────────────────────────────

export async function getExperiences(): Promise<NotionExperience[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("notion-experience");
  try {
    const results = await queryDatabase(EXPERIENCE_DATABASE_ID, {
      sorts: [{ property: "Order", direction: "ascending" }],
    });
    return results.map(parseExperiencePage);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return [];
  }
}

// ─── Block renderers (Notion blocks → HTML) ───────────

async function renderBlocksToHTML(blocks: NotionAny[]): Promise<string> {
  let html = "";
  let listBuffer: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = () => {
    if (listBuffer) {
      html += `<${listBuffer.type}>${listBuffer.items.join("")}</${listBuffer.type}>`;
      listBuffer = null;
    }
  };

  for (const block of blocks) {
    if (
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item"
    ) {
      const type = block.type === "bulleted_list_item" ? "ul" : "ol";
      const key = block.type;
      const text = await renderRichText(block[key]?.rich_text || []);
      if (!listBuffer || listBuffer.type !== type) {
        flushList();
        listBuffer = { type, items: [] };
      }
      listBuffer.items.push(`<li>${text}</li>`);
      continue;
    }

    flushList();

    switch (block.type) {
      case "paragraph":
        html += `<p>${await renderRichText(block.paragraph?.rich_text || [])}</p>`;
        break;
      case "heading_1":
        html += `<h1>${await renderRichText(block.heading_1?.rich_text || [])}</h1>`;
        break;
      case "heading_2":
        html += `<h2>${await renderRichText(block.heading_2?.rich_text || [])}</h2>`;
        break;
      case "heading_3":
        html += `<h3>${await renderRichText(block.heading_3?.rich_text || [])}</h3>`;
        break;
      case "code":
        html += `<pre><code>${escapeHtml(
          (block.code?.rich_text || [])
            .map((t: NotionAny) => t.plain_text)
            .join("")
        )}</code></pre>`;
        break;
      case "image": {
        const url = block.image?.external?.url || block.image?.file?.url;
        const alt =
          block.image?.caption?.map((t: NotionAny) => t.plain_text).join("") ||
          "";
        if (url && /^https?:\/\//i.test(url)) {
          html += `<img src="${escapeHtml(url)}" alt="${escapeHtml(
            alt
          )}" loading="lazy" />`;
        }
        break;
      }
      case "divider":
        html += "<hr />";
        break;
      case "quote":
        html += `<blockquote>${await renderRichText(
          block.quote?.rich_text || []
        )}</blockquote>`;
        break;
      case "callout":
        html += `<blockquote>${await renderRichText(
          block.callout?.rich_text || []
        )}</blockquote>`;
        break;
      default:
        break;
    }
  }

  flushList();
  return html;
}

async function renderRichText(richTextArr: NotionAny[]): Promise<string> {
  if (!richTextArr) return "";
  return richTextArr
    .filter((t: NotionAny) => t.type === "text")
    .map((t: NotionAny) => {
      let text = escapeHtml(t.text?.content || "");
      if (t.annotations?.bold) text = `<strong>${text}</strong>`;
      if (t.annotations?.italic) text = `<em>${text}</em>`;
      if (t.annotations?.code) text = `<code>${text}</code>`;
      if (t.href) {
        const href = safeUrl(t.href);
        if (href) {
          text = `<a href="${escapeHtml(
            href
          )}" target="_blank" rel="noopener noreferrer">${text}</a>`;
        }
      }
      return text;
    })
    .join("");
}
