// app/opengraph-image.tsx
import { ImageResponse } from "next/og";

const SITE_HOST = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://ronny.tech"
    ).host;
  } catch {
    return "ronny.tech";
  }
})();

export const alt =
  "Aaron Nartey — Software Engineer and Creative Developer in Accra, Ghana";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          color: "#3c4142",
          padding: "64px 76px 54px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {/* ── Top row: section labels ─────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 13,
            letterSpacing: "1.8px",
            textTransform: "uppercase",
            color: "#828b8c",
          }}
        >
          <span>Portfolio — 2026</span>
          <span>Accra, Ghana</span>
        </div>

        {/* ── Middle block: name + tagline ────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 12,
          }}
        >
          <div
            style={{
              fontSize: 15,
              color: "#828b8c",
              marginBottom: 26,
              letterSpacing: "0.4px",
            }}
          >
            Software engineer &amp; creative developer
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 108,
              lineHeight: 1.0,
              fontWeight: 500,
              letterSpacing: "-5px",
              color: "#202020",
            }}
          >
            <span>Aaron</span>
            <span>Nartey.</span>
          </div>

          <div
            style={{
              width: 56,
              height: 1,
              backgroundColor: "#2020201a",
              marginTop: 32,
              marginBottom: 24,
            }}
          />

          <div
            style={{
              fontSize: 18,
              color: "#828b8c",
              lineHeight: 1.5,
              maxWidth: 620,
            }}
          >
            Building thoughtful digital products and software.
          </div>
        </div>

        {/* ── Bottom row: footer strip ────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #2020201a",
            paddingTop: 22,
            fontSize: 13,
            letterSpacing: "1.6px",
            textTransform: "uppercase",
            color: "#828b8c",
          }}
        >
          <span>Software · Products · Systems</span>
          <span>{SITE_HOST} &#8599;</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
