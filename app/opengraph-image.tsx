// app/opengraph-image.tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND, LOGO_LETTERS } from "@/lib/brand";

/* Satori has no access to next/font, so hand it the same face the page
   uses: Inter everywhere. The static instances were cut from the Inter
   variable font; see public/fonts/LICENSE-inter.txt. */
const inter400 = await readFile(
  join(process.cwd(), "public/fonts/og-inter-400.ttf"),
);
const inter500 = await readFile(
  join(process.cwd(), "public/fonts/og-inter-500.ttf"),
);
const inter700 = await readFile(
  join(process.cwd(), "public/fonts/og-inter-700.ttf"),
);
const SITE_HOST = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://aaronirl.tech"
    ).host;
  } catch {
    return "aaronirl.tech";
  }
})();

const markSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 104 32">${LOGO_LETTERS.map(
  (letter, index) =>
    `<g transform="translate(${index * 36} 0)">${BRAND.glyphs[letter.id]
      .map(
        (d) =>
          `<path fill="${BRAND.palette[letter.color]}" fill-rule="evenodd" d="${d}"/>`,
      )
      .join("")}</g>`,
).join("")}</svg>`;

const markSrc = `data:image/svg+xml;utf8,${encodeURIComponent(markSvg)}`;

export const alt =
  "APX — Aaron Nartey, mechatronics engineer in Accra, Ghana";

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
          backgroundColor: BRAND.bg,
          color: BRAND.palette.paper,
          padding: "60px 72px 50px",
          fontFamily: "Inter",
        }}
      >
        {/* ── Top row: APX mark + section labels ──────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <img src={markSrc} width={208} height={64} alt="APX" />
          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontSize: 13,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              color: "rgba(242,239,230,0.55)",
            }}
          >
            Portfolio — 2026 · Accra, Ghana
          </div>
        </div>

        {/* ── Middle block: name + role ───────────────────────── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "Inter",
              fontSize: 15,
              color: BRAND.palette.orange,
              marginBottom: 24,
              letterSpacing: "0.4px",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: 7,
                backgroundColor: BRAND.palette.orange,
                marginRight: 10,
              }}
            />
            Mechatronics engineer
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 112,
              lineHeight: 0.98,
              fontWeight: 700,
              fontFamily: "Inter",
              letterSpacing: "-3px",
              color: BRAND.palette.paper,
            }}
          >
            <span>Aaron</span>
            <span>Nartey.</span>
          </div>

          <div
            style={{
              width: 56,
              height: 1,
              backgroundColor: "rgba(242,239,230,0.22)",
              marginTop: 32,
              marginBottom: 24,
            }}
          />

          <div
            style={{
              display: "flex",
              fontSize: 18,
              color: "rgba(242,239,230,0.62)",
              lineHeight: 1.5,
              maxWidth: 660,
            }}
          >
            Software, electronics and motion — built into systems that work.
          </div>
        </div>

        {/* ── Bottom row: footer strip ────────────────────────── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(242,239,230,0.16)",
            paddingTop: 22,
            fontFamily: "Inter",
            fontSize: 13,
            letterSpacing: "1.6px",
            textTransform: "uppercase",
            color: "rgba(242,239,230,0.5)",
          }}
        >
          <span>Software · Electronics · Motion</span>
          <span>{SITE_HOST} &#8599;</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: inter400, weight: 400, style: "normal" },
        { name: "Inter", data: inter500, weight: 500, style: "normal" },
        { name: "Inter", data: inter700, weight: 700, style: "normal" },
      ],
    },
  );
}
