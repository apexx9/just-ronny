"use client";

import Signature from "./signature";
import { site } from "@/lib/content";

export default function AboutSection() {
  return (
    <section
      data-analytics-section="about"
      id="information"
      className="about-section"
      aria-labelledby="about-heading"
    >
      <div>
        <h2 className="section-label" id="about-heading">
          About
        </h2>
        <div className="about-prose">
          <p>
            {site.about.intro}{" "}
            <span className="personal-name">{site.name}</span> —{" "}
            {site.about.description}{" "}
            <span className="about-location">based in {site.location}.</span>
          </p>
          <p>{site.about.experience}</p>
        </div>
        <Signature inView className="about-signature" />
      </div>

      <aside className="about-sidebar" aria-label="Services and contact">
        <div>
          <h3 className="section-label">Services</h3>
          <ul className="about-services">
            {site.services.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="section-label">Contact</h3>
          <a className="about-contact about-link" href={site.contactHref}>
            Let&apos;s talk
          </a>
        </div>
      </aside>
    </section>
  );
}
