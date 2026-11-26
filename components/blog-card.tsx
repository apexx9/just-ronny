// components/blog-card.tsx
// One card, used on the home page, /blog and the bottom of every post.
// Server-compatible (no hooks) so it can be rendered anywhere.
import Link from "next/link";
import type { CSSProperties } from "react";
import type { BlogPost } from "@/lib/notion";
import { formatDate } from "@/lib/format";

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "featured";
  /** Position in the list; drives the staggered entrance. */
  index?: number;
  /** Set for the first above-the-fold card so its image loads eagerly. */
  priority?: boolean;
}

export function BlogCard({
  post,
  variant = "default",
  index = 0,
  priority = false,
}: BlogCardProps) {
  const date = formatDate(post.date);
  const tags = post.tags.slice(0, 2);

  return (
    <article
      className="nc-card nc-reveal"
      data-variant={variant}
      style={{ "--i": index } as CSSProperties}
    >
      <div className="nc-media">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="nc-cover"
            src={post.coverImage}
            alt=""
            width={1200}
            height={750}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />
        ) : (
          <div className="nc-placeholder" aria-hidden="true">
            <span className="nc-placeholder-tag">{post.tags[0] || "Field notes"}</span>
            <span className="nc-placeholder-mark">A.</span>
          </div>
        )}
        <span className="nc-badge" aria-hidden="true">↗</span>
      </div>

      <div className="nc-body">
        <div className="nc-meta">
          {date && (
            <time dateTime={post.date}>{date}</time>
          )}
          {date && post.readingTime && <span aria-hidden="true">·</span>}
          {post.readingTime && <span>{post.readingTime}</span>}
        </div>

        <h3 className="nc-title">
          {/* The ::after on this link stretches over the whole card, so the card
              is one tap target but screen readers announce just the title. */}
          <Link className="nc-link" href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>

        {post.summary && <p className="nc-summary">{post.summary}</p>}

        {tags.length > 0 && (
          <ul className="nc-tags" aria-label="Topics">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

/** Same footprint as BlogCard so the page doesn't jump when data arrives. */
export function BlogCardSkeleton({
  variant = "default",
}: {
  variant?: "default" | "featured";
}) {
  return (
    <div className="nc-card" data-variant={variant} aria-hidden="true">
      <div className="nc-media nc-skeleton" />
      <div className="nc-body">
        <div className="nc-skeleton nc-skeleton-line" style={{ width: "42%" }} />
        <div className="nc-skeleton nc-skeleton-line nc-skeleton-title" />
        <div className="nc-skeleton nc-skeleton-line" style={{ width: "86%" }} />
      </div>
    </div>
  );
}
