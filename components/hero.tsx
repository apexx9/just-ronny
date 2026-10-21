"use client";

import { useState } from "react";
import { site } from "@/lib/content";

export default function Hero() {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const email = site.contactHref.replace("mailto:", "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("failed");
    }
  };

  return (
    <section
      className="hero"
      id="hero"
      data-analytics-section="hero"
      aria-label="Introduction"
    >
      <div className="hero-content">
        <h1 className="hero-title">
          <span className="personal-name">{site.name}</span>
          <span className="hero-role">{site.role}</span>
        </h1>

        <p className="hero-tagline">{site.heroTagline}</p>

        <p className="hero-meta">
          <span className="hero-status">{site.availability}</span>
          <span aria-hidden="true" className="hero-meta-sep">
            ·
          </span>
          <span>Based in {site.location}</span>
        </p>

        <div className="hero-actions">
          <button
            className="pill-button primary-button"
            onClick={copy}
            aria-label={`Copy ${email}`}
          >
            <span className="copy-label">
              {status === "copied" ? "Copied!" : "Copy email"}
            </span>
          </button>

          <a className="pill-button" href="#work">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Work
          </a>
        </div>

        <span className="sr-only" role="status">
          {status === "copied"
            ? "Email address copied."
            : status === "failed"
              ? `Could not copy. Email ${email} using the contact link below.`
              : ""}
        </span>
      </div>
    </section>
  );
}
