import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

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

        <article className="blog-article">
          {post.content.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>

        <footer className="blog-post-footer">
          <Link className="about-link" href="/blog">
            ← All posts
          </Link>
        </footer>
      </div>
    </main>
  );
}
