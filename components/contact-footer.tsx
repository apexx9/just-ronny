"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import { Tooltip } from "./tool-tip";

interface Props {
  onHover?: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const timeFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: site.timeZone,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export default function ContactFooter({
  onHover,
  soundEnabled,
  toggleSound,
}: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer
      data-analytics-section="contact"
      id="contact"
      className="contact-footer"
      aria-label="Contact and social links"
    >
      <div className="footer-column">
        <div className="footer-copy">
          <p className="footer-location">
            Right now I&apos;m in {site.location}, where it&apos;s{" "}
            <time dateTime={now?.toISOString()} suppressHydrationWarning>
              {now ? timeFmt.format(now) : "—"}
            </time>
          </p>
          <p className="footer-socials">
            You can also find me on
            {site.socials.map((s) => (
              <a
                key={s.id}
                className="footer-link"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                onPointerEnter={onHover}
              >
                {s.label}
              </a>
            ))}
            or
            <a className="footer-link" href={site.contactHref} onPointerEnter={onHover}>
              Email
            </a>
            me directly.
          </p>
          <p className="footer-copyright">
            © {now?.getFullYear() ?? 2026},{" "}
            <span className="personal-name">{site.name}</span>
          </p>
        </div>
      </div>

      <Tooltip
        text={soundEnabled ? "Sound on" : "Sound off"}
        label={soundEnabled ? "Disable audio" : "Enable audio"}
        className="sound-control"
        onClick={toggleSound}
        onHover={onHover}
      >
        {soundEnabled ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
            <path d="M16 9a5 5 0 0 1 0 6" />
            <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
            <line x1="22" x2="16" y1="9" y2="15" />
            <line x1="16" x2="22" y1="9" y2="15" />
          </svg>
        )}
      </Tooltip>
    </footer>
  );
}
