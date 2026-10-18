"use client";

import { useState } from "react";
import { site } from "@/lib/content";

interface Props {
  onHover?: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactSection({ onHover }: Props) {
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
              value={form.name}
              onChange={onChange}
              onPointerEnter={onHover}
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
              value={form.email}
              onChange={onChange}
              onPointerEnter={onHover}
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
            rows={5}
            value={form.message}
            onChange={onChange}
            onPointerEnter={onHover}
            required
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="pill-button primary-button form-submit"
            disabled={status === "submitting"}
            onPointerEnter={onHover}
          >
            {status === "submitting" ? "Sending..." : "Send message"}
          </button>
          <a
            className="about-link form-mailto"
            href={site.contactHref}
            onPointerEnter={onHover}
          >
            Or email directly
          </a>
        </div>

        {status === "success" && (
          <p className="form-status form-success" role="status">
            Thanks — your message was sent.
          </p>
        )}
        {status === "error" && error && (
          <p className="form-status form-error" role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
