// scripts/generate-work-covers.mjs
// Generates branded placeholder covers for the work section.
// Run: node scripts/generate-work-covers.mjs
import sharp from "sharp";
import { access, copyFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "public/images/work");
await mkdir(outDir, { recursive: true });

/* Kept in sync with `site.name` in lib/content.ts */
const NAME = "Aaron Nartey";
const FAMILY = "Darlington Demo";

const FONT_SRC = path.join(root, "public/fonts/darlington-regular.ttf");
const FONT_DEST = path.join(os.homedir(), ".fonts", "darlington-regular.ttf");

async function ensureFont() {
  try {
    await access(FONT_DEST);
    return;
  } catch {
    /* not installed yet */
  }
  await mkdir(path.dirname(FONT_DEST), { recursive: true });
  await copyFile(FONT_SRC, FONT_DEST);
  try {
    execFileSync("fc-cache", ["-f"], { stdio: "ignore" });
  } catch {
    /* best-effort */
  }
}

await ensureFont();

const covers = [
  {
    file: "project-one.png",
    width: 1440,
    height: 1000,
    title: "Project One",
    discipline: "Product engineering · design and build",
    from: "#eef1f2",
    to: "#dfe4e6",
  },
  {
    file: "project-two.png",
    width: 1440,
    height: 1000,
    title: "Project Two",
    discipline: "Web application · interface design",
    from: "#f3eef1",
    to: "#e3dade",
  },
  {
    file: "project-three.png",
    width: 1440,
    height: 900,
    title: "Project Three",
    discipline: "Backend & APIs · systems",
    from: "#eef1ef",
    to: "#dae2dd",
  },
  {
    file: "project-four.png",
    width: 1440,
    height: 900,
    title: "Project Four",
    discipline: "Creative development · experiment",
    from: "#f0f1f4",
    to: "#dde0e6",
  },
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function cover({ width, height, title, discipline, from, to }) {
  const markSize = Math.round(height * 0.5);
  const markX = width - Math.round(width * 0.08);
  const markY = height - Math.round(height * 0.16);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${from}"/>
        <stop offset="1" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bg)"/>
    <text x="${markX}" y="${markY}" text-anchor="end" opacity="0.08"
       font-family="${FAMILY}" font-size="${markSize}" fill="#202020">${escapeXml(NAME)}</text>
    <g font-family="Helvetica, Arial, sans-serif" fill="#828b8c"
       font-size="20" letter-spacing="3">
      <text x="72" y="88">AARON NARTEY</text>
      <text x="${width - 72}" y="88" text-anchor="end">PLACEHOLDER COVER</text>
    </g>
    <line x1="72" y1="${height - 150}" x2="${width - 72}" y2="${height - 150}"
          stroke="#202020" stroke-opacity="0.12"/>
    <g font-family="Helvetica, Arial, sans-serif">
      <text x="72" y="${height - 78}" font-size="66" font-weight="500"
            fill="#202020" letter-spacing="-1.5">${escapeXml(title)}</text>
      <text x="72" y="${height - 40}" font-size="24" fill="#828b8c">${escapeXml(discipline)}</text>
    </g>
  </svg>`;
}

for (const c of covers) {
  await sharp(Buffer.from(cover(c)))
    .png()
    .toFile(path.join(outDir, c.file));
  console.log(`✓ public/images/work/${c.file}`);
}
