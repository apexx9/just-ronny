import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, prepareArticleHtml } from "@/lib/post-summary";
import { getSitePosts } from "@/lib/site-posts";

export const instant = false;

export async function generateStaticParams() {
  const posts = await getSitePosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getSitePosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index < 0) notFound();

  const post = posts[index];
  const { html, toc } = prepareArticleHtml(post.content);
  const nextPost = posts[index + 1] ?? null;

  return (
    <main className="blog-post-page">
      <div className="editorial-column blog-post-shell">
        <header className="blog-post-header">
          <Link className="about-link blog-back" href="/blog">
            ← Back to blog
          </Link>
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-post-meta">
            <time className="blog-date-chip" dateTime={post.date}>
              {formatPostDate(post.date)}
            </time>
            <span className="blog-reading">{post.readingTime}</span>
          </div>
          {post.tags.length ? (
            <div className="blog-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="blog-post-cover"
            src={post.coverImage}
            alt=""
            loading="eager"
            decoding="async"
          />
        ) : null}

        <div className="blog-post-layout">
          <article
            className="blog-article"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {toc.length ? (
            <aside className="blog-toc" aria-labelledby="toc-heading">
              <h2 className="blog-toc-title" id="toc-heading">
                Jump to
              </h2>
              <nav>
                <ol>
                  {toc.map((item) => (
                    <li key={item.id} className={`toc-level-${item.level}`}>
                      <a href={`#${item.id}`}>{item.title}</a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          ) : null}
        </div>

        <footer className="blog-post-footer">
          {nextPost ? (
            <Link className="blog-next" href={`/blog/${nextPost.slug}`}>
              <span className="blog-next-label">Keep reading</span>
              <span className="blog-next-title">{nextPost.title}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ) : null}
          <Link className="about-link" href="/blog">
            ← All posts
          </Link>
        </footer>
      </div>
    </main>
  );
}
