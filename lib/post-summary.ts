export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  readingTime: string;
  coverImage: string | null;
};

export type TocItem = {
  id: string;
  title: string;
  level: number;
};

export function formatPostDate(date: string): string {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return date;
  return value.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeAttribute(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

export function prepareArticleHtml(html: string): {
  html: string;
  toc: TocItem[];
} {
  const toc: TocItem[] = [];
  const seen = new Map<string, number>();

  const prepared = html.replace(
    /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (match, level: string, attrs: string, inner: string) => {
      const title = inner.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      if (!title) return match;

      const base = slugifyHeading(title) || "section";
      const count = (seen.get(base) ?? 0) + 1;
      seen.set(base, count);
      const id = count === 1 ? base : `${base}-${count}`;
      const cleanAttrs = attrs.replace(/\s+id\s*=\s*"[^"]*"/gi, "");

      toc.push({ id, title, level: Number(level) });
      return `<h${level}${cleanAttrs} id="${escapeAttribute(id)}">${inner}</h${level}>`;
    },
  );

  return { html: prepared, toc };
}
