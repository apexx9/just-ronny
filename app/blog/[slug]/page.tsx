import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPosts, type BlogPost } from "@/lib/notion";
import { posts as fallbackPosts } from "@/lib/posts";

/* The post body is `use cache` and every slug is prerendered via
   generateStaticParams, so navigations serve static HTML immediately.
   `params` is still awaited (required in Next 16), which the dev-time
   instant-navigation validator flags — opt this segment out. */
export const instant = false;

export async function generateStaticParams() {
  const [notionPosts] = await Promise.all([getBlogPosts()]);
  const slugs = new Set(notionPosts.map((p) => p.slug));
  for (const p of fallbackPosts) slugs.add(p.slug);
  return Array.from(slugs).map((slug) => ({ slug }));
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// Notion content is already HTML; local fallback content is plain text.
function toHtml(content: string): string {
  if (content.includes("<")) return content;
  return content
    .split("\n\n")
    .map((para) => `<p>${escapeHtml(para)}</p>`)
    .join("");
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const notion = await getBlogPostBySlug(slug);
  let post: BlogPost | null = notion;

  if (!post) {
    const fb = fallbackPosts.find((p) => p.slug === slug);
    if (fb) {
      post = {
        slug: fb.slug,
        title: fb.title,
        date: fb.date,
        tags: fb.tags as string[],
        summary: fb.summary,
        readingTime: fb.readingTime,
        content: toHtml(fb.content),
      };
    }
  }

  if (!post) notFound();

  const html = toHtml(post.content);

  return (
    <main className="blog-post-page">
      <div className="editorial-column">
        <header className="blog-post-header">
          <Link className="about-link blog-back" href="/blog">
            ← Back to blog
          </Link>
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-item-meta">
            <time className="blog-date" dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-CA", {
                year: "numeric",
                month: "short",
                day: "2-digit",
              })}
            </time>
            <span className="blog-sep">·</span>
            <span className="blog-reading">{post.readingTime}</span>
          </div>
          <div className="blog-tags">
            {post.tags.map((t) => (
              <span key={t} className="blog-tag">
                {t}
              </span>
            ))}
          </div>
        </header>

        <article className="blog-article" dangerouslySetInnerHTML={{ __html: html }} />

        <footer className="blog-post-footer">
          <Link className="about-link" href="/blog">
            ← All posts
          </Link>
        </footer>
      </div>
    </main>
  );
}
