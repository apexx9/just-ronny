import Link from "next/link";
import SectionHead from "./section-head";
import SectionIcon from "./section-icon";
import { formatPostDate, type PostSummary } from "@/lib/post-summary";

export default function RecentPostsSection({
  posts,
}: {
  posts: PostSummary[];
}) {
  return (
    <section
      id="recent-posts"
      className="middle-section recent-posts-section"
      aria-labelledby="recent-posts-heading"
    >
      <SectionHead
        title="Recent posts"
        id="recent-posts-heading"
        icon={<SectionIcon name="cassette" />}
        lead={
          posts.length
            ? `${posts.length} post${posts.length === 1 ? "" : "s"} published`
            : undefined
        }
      />

      {posts.length ? (
        <ol className="post-timeline">
          {posts.slice(0, 5).map((post) => (
            <li key={post.slug} className="post-timeline-row">
              <time className="post-timeline-date" dateTime={post.date}>
                {formatPostDate(post.date)}
              </time>
              <span className="post-timeline-marker" aria-hidden="true" />
              <Link className="post-timeline-link" href={`/blog/${post.slug}`}>
                <span className="post-timeline-main">
                  <span className="post-timeline-title">{post.title}</span>
                  {post.tags.length ? (
                    <span className="reference-tags">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="reference-tag">
                          {tag}
                        </span>
                      ))}
                    </span>
                  ) : null}
                </span>
                <span className="post-timeline-meta">{post.readingTime}</span>
              </Link>
            </li>
          ))}
        </ol>
      ) : null}

      <div className="list-trailer">
        <Link className="about-link" href="/blog">
          See all posts <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
