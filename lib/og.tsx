// lib/og.tsx
// One share-card template for the whole site. Palette is taken straight from
// the existing OG images (white / paper #f4f4ef / ink #171918) so nothing shifts.
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { hostname, siteConfig } from "@/lib/site";
import { truncate } from "@/lib/format";

const themes = {
  light: { bg: "#ffffff", fg: "#202020", text: "#3c4142", muted: "#737773", line: "#2020201a", ghost: "#2020200d" },
  paper: { bg: "#f4f4ef", fg: "#202020", text: "#3c4142", muted: "#737773", line: "#20202020", ghost: "#2020200f" },
  dark: { bg: "#171918", fg: "#f7f7f2", text: "#bfc3bf", muted: "#a6aaa6", line: "#ffffff20", ghost: "#ffffff0d" },
} as const;

export type OgTheme = keyof typeof themes;

export const ogSize = { width: 1200, height: 630 };

/** Darlington is your signature font. satori cannot read woff2, but the .ttf works. */
async function loadSignature() {
  try {
    return await readFile(
      path.join(process.cwd(), "public/fonts/darlington-regular.ttf"),
    );
  } catch {
    return null;
  }
}

function titleSize(title: string) {
  const n = title.length;
  if (n > 90) return 54;
  if (n > 60) return 64;
  if (n > 34) return 76;
  return 96;
}

export interface OgCardProps {
  eyebrow: string;
  title: string;
  kicker?: string;
  summary?: string;
  footerLeft?: string;
  footerRight?: string;
  theme?: OgTheme;
}

export async function renderOgCard({
  eyebrow,
  title,
  kicker,
  summary,
  footerLeft,
  footerRight,
  theme = "light",
}: OgCardProps) {
  const t = themes[theme];
  const signature = await loadSignature();
  const sig = signature ? "Darlington" : "serif";
  const safeTitle = truncate(title, 110);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: t.bg,
          color: t.fg,
          padding: "56px 72px 48px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Ghost signature mark: on-brand texture instead of a gradient blob */}
        <div
          style={{
            position: "absolute",
            right: 48,
            top: 24,
            display: "flex",
            fontFamily: sig,
            fontSize: 560,
            lineHeight: 1,
            color: t.ghost,
          }}
        >
          A.
        </div>

        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 46,
                height: 46,
                borderRadius: 12,
                border: `1px solid ${t.line}`,
                fontFamily: sig,
                fontSize: 30,
                color: t.fg,
              }}
            >
              A.
            </div>
            <div style={{ display: "flex", fontSize: 20, color: t.text, letterSpacing: "-0.2px" }}>
              {siteConfig.name}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 15,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: t.muted,
            }}
          >
            {eyebrow}
          </div>
        </div>

        {/* Title block */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
          {kicker ? (
            <div style={{ display: "flex", fontSize: 22, color: t.muted, marginBottom: 22 }}>
              {kicker}
            </div>
          ) : null}
          <div
            style={{
              display: "flex",
              fontSize: titleSize(safeTitle),
              lineHeight: 1.04,
              fontWeight: 600,
              letterSpacing: "-3px",
              color: t.fg,
            }}
          >
            {safeTitle}
          </div>
          {summary ? (
            <div
              style={{
                display: "flex",
                fontSize: 26,
                lineHeight: 1.4,
                color: t.text,
                marginTop: 28,
                maxWidth: 820,
              }}
            >
              {truncate(summary, 150)}
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${t.line}`,
            paddingTop: 22,
            fontSize: 16,
            letterSpacing: "1.4px",
            textTransform: "uppercase",
            color: t.muted,
          }}
        >
          <div style={{ display: "flex" }}>{footerLeft ?? "Software · Electronics · Automation"}</div>
          <div style={{ display: "flex" }}>{footerRight ?? hostname}</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: signature
        ? [{ name: "Darlington", data: signature, style: "normal", weight: 400 }]
        : undefined,
    },
  );
}
