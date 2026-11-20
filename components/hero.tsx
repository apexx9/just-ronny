
"use client";

import { useState } from "react";
import { site } from "@/lib/content";
import { GhanaSignature } from "./ghana-signature";
import "../app/hero.css";

const KICKER = "Akwaaba";
const GREETING = "いらっしゃいませ";
const FOOTNOTE = `You can also find me as ${site.github.handle}.`;

const socialHref = (id: string) =>
  site.socials.find((s) => s.id === id)?.href ?? "#";

/* Discord is optional: the chip only exists once a real invite URL is in
   site.socials. A dead "#" link is worse than no link. */
const discordHref = site.socials.find((s) => s.id === "discord")?.href;

function InstagramIcon() {
  return (
    <svg className="hx-social-icon hx-instagram-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hx-instagram-gradient" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0" className="hx-ig-stop-yellow" />
          <stop offset=".5" className="hx-ig-stop-pink" />
          <stop offset="1" className="hx-ig-stop-purple" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="url(#hx-instagram-gradient)" strokeWidth="2.2" />
      <circle cx="12" cy="12" r="4" stroke="url(#hx-instagram-gradient)" strokeWidth="2.2" />
      <circle cx="17.5" cy="6.8" r="1.2" className="hx-ig-dot" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg className="hx-social-icon hx-github-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.31-3.76-1.31-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15.99 1.69 2.59 1.2 3.22.92.1-.72.39-1.2.7-1.48-2.48-.28-5.08-1.24-5.08-5.51 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15a10.6 10.6 0 0 1 5.55 0c2.11-1.45 3.04-1.15 3.04-1.15.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3.01 0 4.28-2.6 5.22-5.09 5.5.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg className="hx-social-icon hx-discord-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.7 5.1A19.4 19.4 0 0 0 15 3.65l-.58 1.18a18 18 0 0 0-4.84 0L9 3.65a19.4 19.4 0 0 0-4.7 1.45C1.33 9.5.53 13.8.93 18.04a19.7 19.7 0 0 0 5.77 2.92l1.25-2.03c-.68-.25-1.33-.56-1.94-.92l.47-.37a13.9 13.9 0 0 0 11.04 0l.47.37c-.61.36-1.26.67-1.94.92l1.25 2.03a19.7 19.7 0 0 0 5.77-2.92c.47-4.91-.8-9.17-3.37-12.94ZM8.55 14.9c-1.08 0-1.96-.99-1.96-2.2s.86-2.2 1.96-2.2c1.1 0 1.98.99 1.96 2.2 0 1.21-.86 2.2-1.96 2.2Zm6.9 0c-1.08 0-1.96-.99-1.96-2.2s.86-2.2 1.96-2.2c1.1 0 1.98.99 1.96 2.2 0 1.21-.86 2.2-1.96 2.2Z" />
    </svg>
  );
}

export default function Hero() {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const email = site.contactHref.replace("mailto:", "");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("failed");
    }
  };

  return (
    <section
      className="hx"
      id="hero"
      data-analytics-section="hero"
      aria-label="Introduction"
    >
      <div className="hx-inner">
        <p className="hx-kicker">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M8 12V6a2 2 0 0 1 4 0v5" />
            <path d="M12 11V4a2 2 0 0 1 4 0v8" />
            <path d="M16 11V7a2 2 0 0 1 4 0v7a8 8 0 0 1-8 8h-2a7 7 0 0 1-5-2.1L2.5 15a2 2 0 0 1 3-2.6L8 15" />
          </svg>
          {KICKER}
        </p>

        <h1 className="hx-greeting">
          <span className="hx-greeting-word">{GREETING}</span>
          <span className="sr-only">
            {site.name} — {site.role}
          </span>
        </h1>

        <p className="hx-lead">
          It&apos;s me {site.name}
          <a className="hx-fnref" href="#hx-note" aria-describedby="hx-note">
            <sup>1</sup>
          </a>
          . I&apos;m a {site.role.toLowerCase()} building things where
          software, electronics and motion meet. Sensors, actuators, control
          loops, CAD, prototyping?
        </p>

        <p className="hx-lead">
          On this site, you&apos;ll find a few things I want you to know{" "}
          <a className="hx-chip hx-green" href="#information">
            about me <span aria-hidden="true">🙈</span>
          </a>{" "}
          or{" "}
          <a className="hx-chip hx-orange" href="#work">
            stuff I&apos;m building <span aria-hidden="true">⚙️</span>
          </a>
          . If you want to talk, grab my{" "}
          <button
            type="button"
            className="hx-chip hx-blue"
            onClick={copy}
            aria-label={`Copy ${email}`}
          >
            {status === "copied" ? "email, copied!" : "email"}
            <span aria-hidden="true">
              {status === "copied" ? " ✓" : " ✉"}
            </span>
          </button>{" "}
          or follow along on{" "}
          <a
            className="hx-chip hx-social-chip hx-green"
            href={socialHref("github")}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <GithubIcon />
            GitHub
          </a>
          {" and "}
          <a
            className="hx-chip hx-social-chip hx-orange"
            href={socialHref("instagram")}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <InstagramIcon />
            Instagram
          </a>
          {discordHref && (
            <>
              {" — "}
              <a
                className="hx-chip hx-social-chip hx-blue"
                href={discordHref}
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
              >
                <DiscordIcon />
                Discord
              </a>
            </>
          )}
          {" too."}
        </p>

        <p className="hx-note" id="hx-note">
          <sup>1</sup> {FOOTNOTE}
        </p>

        <GhanaSignature />

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
