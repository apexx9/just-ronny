"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import HoverCard from "./hover-card";
import InstagramCard from "./instagram-card";

const timeFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: site.timeZone,
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export default function ContactFooter() {
  const [now, setNow] = useState<Date | null>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer
      data-analytics-section="contact"
      id="footer"
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
            {site.socials.map((s) =>
              s.id === "instagram" ? (
                <HoverCard key={s.id} content={<InstagramCard />}>
                  <a
                    className="footer-link"
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.label}
                  </a>
                </HoverCard>
              ) : (
                <a
                  key={s.id}
                  className="footer-link"
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              )
            )}
            or
            <a className="footer-link" href={site.contactHref}>
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
    </footer>
  );
}
