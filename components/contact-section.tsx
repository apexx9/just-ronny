"use client";

import { useState } from "react";
import { site } from "@/lib/content";
import HoverCard from "./hover-card";
import InstagramCard from "./instagram-card";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      setError("Please fill in name, email and message.");
      return;
    }

    if (endpoint) {
      setStatus("submitting");
      setError(null);
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          setStatus("success");
          setForm({ name: "", email: "", message: "" });
        } else {
          setStatus("error");
          setError("Something went wrong. Please try again or email me directly.");
        }
      } catch {
        setStatus("error");
        setError("Something went wrong. Please try again or email me directly.");
      }
      return;
    }

    // mailto fallback
    const subject = encodeURIComponent(`New message from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${site.contactHref.replace("mailto:", "")}?subject=${subject}&body=${body}`;
    setStatus("idle");
  };

  return (
    <section
      data-analytics-section="contact-form"
      id="contact-form"
      className="contact-form-section"
      aria-labelledby="contact-heading"
    >
      <h2 className="section-label" id="contact-heading">
        Contact
      </h2>
      <p className="contact-form-intro">
        Have something in mind? Say hi — I&apos;ll get back to you.
      </p>

      <form onSubmit={onSubmit} className="contact-form" noValidate>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-input"
              placeholder="Your name"
              value={form.name}
              onChange={onChange}
              autoComplete="name"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="you@studio.com"
              value={form.email}
              onChange={onChange}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            className="form-textarea"
            placeholder="Tell me about the project…"
            rows={5}
            value={form.message}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="pill-button primary-button form-submit"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : "Send message"}
            {status !== "submitting" && (
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
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            )}
          </button>
          <span className="form-alt">
            <a className="about-link form-mailto" href={site.contactHref}>
              Or email directly
            </a>
            <span className="form-alt-sep" aria-hidden="true">
              ·
            </span>
            <HoverCard content={<InstagramCard />}>
              <a
                className="about-link form-mailto"
                href={site.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                or say hi on Instagram <span aria-hidden="true">↗</span>
              </a>
            </HoverCard>
          </span>
        </div>

        <div className="form-status-slot" aria-live="polite">
          {status === "success" && (
            <p className="form-status form-success" role="status">
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
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Thanks — your message was sent.
            </p>
          )}
          {status === "error" && error && (
            <p className="form-status form-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
