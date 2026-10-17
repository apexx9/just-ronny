"use client";

import { useState } from "react";
import Image from "next/image";
import IntroAnimation from "@/components/intro-animation";
import Signature from "@/components/signature";
import { site } from "@/lib/content";

const nameForms = [
  { id: "full", text: site.name, note: "Full name — current favicon mark" },
  { id: "first", text: "Aaron", note: "First name only" },
  { id: "initials", text: "AN", note: "Initials" },
  { id: "initial", text: "A", note: "Single letter" },
];

const generated = [
  { src: "/favicon.png", size: 32, label: "favicon.png" },
  { src: "/icon.png", size: 96, label: "icon.png" },
  { src: "/icon-192.png", size: 192, label: "icon-192.png" },
  { src: "/icon-512.png", size: 256, label: "icon-512.png" },
  { src: "/apple-icon.png", size: 180, label: "apple-icon.png" },
];

function Frame({
  children,
  bg = "#fff",
  border = true,
}: {
  children: React.ReactNode;
  bg?: string;
  border?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 22,
        flexWrap: "wrap",
        background: bg,
        padding: 14,
        borderRadius: 12,
        border: border ? "1px solid #2020200f" : "none",
      }}
    >
      {children}
    </div>
  );
}

function Sizer({
  code,
  size,
  color,
}: {
  code: string;
  size: number;
  color: string;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <span
        style={{
          fontFamily: "var(--font-signature)",
          fontSize: size,
          lineHeight: 1,
          color,
          whiteSpace: "nowrap",
          padding: "0.12em",
          display: "inline-block",
        }}
      >
        {code}
      </span>
      <div style={{ fontSize: 10, color: "#828b8c", marginTop: 4 }}>
        {size}px
      </div>
    </div>
  );
}

export default function LabPage() {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <main
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "48px 20px 120px",
        fontFamily: "var(--font-sans)",
        color: "#202020",
      }}
    >
      <h1 style={{ fontSize: 28, fontWeight: 500, marginBottom: 8 }}>
        Signature lab
      </h1>
      <p style={{ color: "#202020a8", marginBottom: 32, maxWidth: 620 }}>
        Sacramento now drives the intro, the about signature and the favicon.
        I can&apos;t see images, so this is your judge&apos;s bench — tell me the
        letter of the name form you want for the favicon and I&apos;ll bake it in.
      </p>

      <section style={{ marginBottom: 56 }}>
        <h2
          style={{
            fontSize: 15,
            letterSpacing: 1.5,
            color: "#828b8c",
            marginBottom: 16,
          }}
        >
          NAME FORM — FAVICON CANDIDATES
        </h2>
        <div style={{ display: "grid", gap: 16 }}>
          {nameForms.map((f, i) => (
            <div
              key={f.id}
              style={{
                border: `1px solid ${i === 0 ? "#20202055" : "#2020201a"}`,
                borderRadius: 16,
                padding: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 14,
                }}
              >
                <strong style={{ fontWeight: 500 }}>
                  {String.fromCharCode(65 + i)} · “{f.text}”
                </strong>
                <span style={{ color: "#828b8c" }}>{f.note}</span>
              </div>
              <Frame>
                {[16, 32, 64, 180].map((s) => (
                  <Sizer key={s} code={f.text} size={s} color="#202020" />
                ))}
              </Frame>
              <div style={{ height: 10 }} />
              <Frame bg="#202020" border={false}>
                {[16, 32, 64].map((s) => (
                  <Sizer key={s} code={f.text} size={s} color="#f5f5f5" />
                ))}
              </Frame>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 56 }}>
        <h2
          style={{
            fontSize: 15,
            letterSpacing: 1.5,
            color: "#828b8c",
            marginBottom: 16,
          }}
        >
          GENERATED FAVICON FILES (current = full name)
        </h2>
        <Frame>
          {generated.map((g) => (
            <div key={g.src} style={{ textAlign: "center" }}>
              <Image
                src={g.src}
                alt={g.label}
                width={g.size}
                height={g.size}
                style={{ width: g.size, height: g.size }}
                unoptimized
              />
              <div style={{ fontSize: 10, color: "#828b8c", marginTop: 6 }}>
                {g.label}
              </div>
            </div>
          ))}
        </Frame>
        <Frame bg="#202020" border={false}>
          {["/favicon-dark-v2.png", "/icon.png"].map((src, i) => (
            <Image
              key={src}
              src={src}
              alt="dark variant"
              width={i === 0 ? 64 : 96}
              height={i === 0 ? 64 : 96}
              style={{ width: i === 0 ? 64 : 96, height: i === 0 ? 64 : 96 }}
              unoptimized
            />
          ))}
        </Frame>
      </section>

      <section style={{ marginBottom: 56 }}>
        <h2
          style={{
            fontSize: 15,
            letterSpacing: 1.5,
            color: "#828b8c",
            marginBottom: 16,
          }}
        >
          SIGNATURE (used in the about section)
        </h2>
        <div
          style={{
            border: "1px solid #2020201a",
            borderRadius: 16,
            padding: "24px 28px",
          }}
        >
          <Signature text={site.name} className="about-signature" />
          <div style={{ height: 16 }} />
          <Signature text={site.name} size={64} />
        </div>
      </section>

      <section>
        <h2
          style={{
            fontSize: 15,
            letterSpacing: 1.5,
            color: "#828b8c",
            marginBottom: 16,
          }}
        >
          INTRO ANIMATION
        </h2>
        <button
          onClick={() => setReplayKey((k) => k + 1)}
          style={{
            background: "#202020",
            color: "#fff",
            border: 0,
            borderRadius: 999,
            padding: "10px 18px",
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Replay intro
        </button>
        <p style={{ color: "#828b8c", marginTop: 12, fontSize: 14 }}>
          The name writes itself, then a white circle wipes to reveal the page.
          Click the overlay to skip.
        </p>
        <IntroAnimation key={replayKey} oncePerSession={false} />
      </section>
    </main>
  );
}
