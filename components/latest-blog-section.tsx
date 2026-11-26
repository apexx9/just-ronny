"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BlogPost } from "@/lib/notion";
import { BlogCard, BlogCardSkeleton } from "@/components/blog-card";

type Status = "loading" | "ready" | "empty";

export default function LatestBlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/blog", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Blog request failed (${response.status})`);
        return response.json() as Promise<{ posts?: BlogPost[] }>;
      })
      .then((data) => {
        const latest = Array.isArray(data.posts) ? data.posts.slice(0, 3) : [];
        setPosts(latest);
        setStatus(latest.length ? "ready" : "empty");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error("Could not load latest blog posts:", error);
        setStatus("empty");
      });

    return () => controller.abort();
  }, []);

  if (status === "empty") return null;

  return (
    <section
      className="latest-blog-section"
      aria-labelledby="latest-blog-heading"
      aria-busy={status === "loading"}
    >
      <div className="nc-section-head">
        <h2 className="section-label" id="latest-blog-heading">
          Latest notes
        </h2>
        <Link className="about-link" href="/blog">
          All writing <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <div className="nc-grid-wrap">
        <div className="nc-grid">
          {status === "loading"
            ? [0, 1, 2].map((i) => <BlogCardSkeleton key={i} />)
            : posts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
