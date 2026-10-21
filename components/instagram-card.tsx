"use client";

import { useState } from "react";
import { site } from "@/lib/content";

export default function InstagramCard() {
  const ig = site.instagram;
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="instagram-card">
      <div className="instagram-card-head">
        {imgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="instagram-avatar"
            src="/images/instagram-avatar.jpg"
            alt=""
            width={52}
            height={52}
            onError={() => setImgOk(false)}
          />
        ) : (
          <span className="instagram-avatar instagram-avatar-fallback" aria-hidden="true">
            A
          </span>
        )}
        <div className="instagram-card-id">
          <span className="instagram-handle">{ig.handle}</span>
          <span className="instagram-bio">{ig.bio}</span>
        </div>
      </div>

      <dl className="instagram-stats">
        {ig.stats.map((s) => (
          <div key={s.label} className="instagram-stat">
            <dt>{s.label}</dt>
            <dd>{s.caption}</dd>
          </div>
        ))}
      </dl>

      <a
        className="instagram-open"
        href={ig.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        Open on Instagram <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
