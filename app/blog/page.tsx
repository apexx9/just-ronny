import Link from "next/link";
import { formatPostDate } from "@/lib/post-summary";
import { getSitePosts } from "@/lib/site-posts";

export default async function BlogPage() {
  const posts = await getSitePosts();

  return (
    <main className="blog-page">
      <div className="editorial-column">
        <header className="blog-header">
          <Link className="about-link blog-back" href="/">
            ← Back
          </Link>
          <h1 className="blog-heading">Writing</h1>
          <p className="blog-intro">
            {posts.length} {posts.length === 1 ? "post" : "posts"} published
          </p>
        </header>

        {posts.length ? (
          <ul className="blog-list">
            {posts.map((post) => (
              <li key={post.slug} className="blog-item">
                <Link className="blog-item-link" href={`/blog/${post.slug}`}>
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="blog-item-cover"
                      src={post.coverImage}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span
                      className="blog-item-cover blog-item-cover-empty"
                      aria-hidden="true"
                    />
                  )}
                  <span className="blog-item-body">
                    <span className="blog-item-top">
                      <span className="blog-item-title">{post.title}</span>
                      <span className="blog-item-reading">
                        {post.readingTime}
                      </span>
                    </span>
                    {post.summary ? (
                      <span className="blog-item-summary">{post.summary}</span>
                    ) : null}
                    <span className="blog-item-meta">
                      <time dateTime={post.date}>
                        {formatPostDate(post.date)}
                      </time>
                      {post.tags.length ? (
                        <span className="blog-tags">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="blog-tag">
                              {tag}
                            </span>
                          ))}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </main>
  );
}
