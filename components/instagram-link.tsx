
"use client";

import HoverCard from "./hover-card";
import { site } from "@/lib/content";
import InstagramCard from "./instagram-card";

export default function InstagramLink() {
  const ig = site.instagram;

  return (
    <HoverCard
      content={<InstagramCard />}
      openDelay={180}
      closeDelay={180}
      className="instagram-hover-surface"
    >
      <a
        className="instagram-trigger"
        href={ig.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Instagram profile: ${ig.handle}`}
      >
        <span>{ig.handle}</span>
        <span aria-hidden="true" className="instagram-trigger-arrow">
          ↗
        </span>
      </a>
    </HoverCard>
  );
}
