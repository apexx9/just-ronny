"use client";

import { useState } from "react";
import { site } from "@/lib/content";
import { renderWithFlags } from "./Flags";

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function formatCount(value: number | string) {
  return typeof value === "number" ? compact.format(value) : value;
}

export default function InstagramCard() {
  const ig = site.instagram;
  const [imgOk, setImgOk] = useState(true);
  const initial =
    ig.handle.replace(/^@/, "").charAt(0).toUpperCase() || "?";
  const stats: { label: string; value: number | string }[] = [];

  if (ig.posts !== undefined) stats.push({ label: "posts", value: ig.posts });
  if (ig.followers !== undefined) {
    stats.push({ label: "followers", value: ig.followers });
  }
  if (ig.following !== undefined) {
    stats.push({ label: "following", value: ig.following });
  }

  return (
    <section className="instagram-card" aria-label="Instagram profile preview">
      <header className="instagram-card-top">
        <span className="instagram-handle">{ig.handle}</span>
        <svg
          className="instagram-glyph"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      </header>

      <div className="instagram-card-head">
        <div className="instagram-avatar-wrap">
          {imgOk ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className="instagram-avatar"
              src="/images/instagram-avatar.jpg"
              alt=""
              width={80}
              height={80}
              loading="lazy"
              decoding="async"
              onError={() => setImgOk(false)}
            />
          ) : (
            <span
              className="instagram-avatar instagram-avatar-fallback"
              aria-hidden="true"
            >
              {initial}
            </span>
          )}
        </div>

        {stats.length > 0 && (
          <dl className="instagram-stats">
            {stats.map((stat) => (
              <div key={stat.label} className="instagram-stat">
                <dt>{stat.label}</dt>
                <dd>{formatCount(stat.value)}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {(ig.name || ig.bio) && (
        <div className="instagram-card-id">
          {ig.name && <span className="instagram-name">{ig.name}</span>}
          {ig.bio && (
            <p className="instagram-bio">{renderWithFlags(ig.bio)}</p>
          )}
        </div>
      )}

      <a
        className="instagram-open"
        href={ig.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Follow ${ig.handle} on Instagram (opens in a new tab)`}
      >
        Follow on Instagram
      </a>
    </section>
  );
}