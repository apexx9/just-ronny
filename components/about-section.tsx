"use client";

import SectionHead from "./section-head";
import SectionIcon from "./section-icon";
import Signature from "./signature";
import { site } from "@/lib/content";

export default function AboutSection() {
  return (
    <section
      data-analytics-section="about"
      id="information"
      className="middle-section about-section"
      aria-labelledby="about-heading"
    >
      <SectionHead
        title="Information"
        id="about-heading"
        icon={<SectionIcon name="user" />}
      />

      <div className="about-body">
        <div className="about-prose">
          <p>
            {site.about.intro}{" "}
            <span className="personal-name">{site.name}</span> —{" "}
            {site.about.description}{" "}
            <span className="about-location">based in {site.location}.</span>
          </p>
          <p>{site.about.experience}</p>
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
      </div>

      <Signature inView className="about-signature" />

      <p className="about-footnote">
        <sup>1</sup> {site.location} runs on GMT all year, so the clock in the
        footer is the same as the one on my desk.
      </p>
    </section>
  );
}
