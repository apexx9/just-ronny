import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, type BlogPost } from "@/lib/notion";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date || undefined,
      tags: post.tags,
      images: [
        {
          url: `/blog/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [`/blog/${slug}/opengraph-image`],
    },
  };
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
  const post: BlogPost | null = await getBlogPostBySlug(slug);

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
          {post.tags.length > 0 && (
            <div className="blog-tags">
              {post.tags.map((t) => (
                <span key={t} className="blog-tag">
                  {t}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="blog-post-cover"
            src={post.coverImage}
            alt=""
            loading="eager"
            decoding="async"
          />
        )}

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
