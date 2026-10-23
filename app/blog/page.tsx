import Link from "next/link";
import { getBlogPosts } from "@/lib/notion";
import { posts as fallbackPosts } from "@/lib/posts";

export default async function BlogPage() {
  const notionPosts = await getBlogPosts();
  const posts = notionPosts.length
    ? notionPosts
    : fallbackPosts.map((p) => ({
        slug: p.slug,
        title: p.title,
        date: p.date,
        tags: p.tags as string[],
        summary: p.summary,
        readingTime: p.readingTime,
        coverImage: null,
        content: p.content,
      }));

  return (
    <main className="blog-page">
      <div className="editorial-column">
        <header className="blog-header">
          <Link className="about-link blog-back" href="/">
            ← Back
          </Link>
          <h1 className="section-label blog-title">Blog</h1>
          <p className="blog-intro">
            Notes on building things, software and the small details.
          </p>
        </header>

        <ol className="blog-list">
          {posts.map((post) => (
            <li key={post.slug} className="blog-item">
              <Link className="blog-item-link" href={`/blog/${post.slug}`}>
                {post.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="blog-item-cover"
                    src={post.coverImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                )}
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
                <h2 className="blog-item-title">{post.title}</h2>
                {post.summary && (
                  <p className="blog-item-summary">{post.summary}</p>
                )}
                {post.tags.length > 0 && (
                  <div className="blog-tags">
                    {post.tags.map((t) => (
                      <span key={t} className="blog-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
