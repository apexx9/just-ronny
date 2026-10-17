// scripts/generate-favicons.mjs
// Renders the Sacramento signature (the site name) into the favicon set.
// Run: node scripts/generate-favicons.mjs
import sharp from "sharp";
import { access, copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";

const root = process.cwd();

/* Kept in sync with `site.name` in lib/content.ts */
const NAME = "Aaron Nartey";
const FAMILY = "Sacramento";

const FONT_SRC = path.join(root, "public/fonts/sacramento-regular.ttf");
const FONT_DEST = path.join(os.homedir(), ".fonts", "sacramento-regular.ttf");

/* librsvg (sharp's SVG engine) resolves fonts through fontconfig, so the
   webfont has to be installed on the machine before we can render text. */
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
    /* fc-cache is best-effort */
  }
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/* Draw the name at high resolution on a transparent canvas and trim the
   empty space, so we can scale the exact ink to fit each icon. */
async function signatureInk(fg) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="700">
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="${FAMILY}" font-size="320" fill="${fg}">${escapeXml(NAME)}</text>
  </svg>`;
  const rendered = await sharp(Buffer.from(svg), { density: 512 }).png().toBuffer();
  return sharp(rendered).trim().png().toBuffer();
}

async function icon({ size, fg, bg }) {
  const ink = await signatureInk(fg);
  const pad = Math.max(1, Math.round(size * 0.1));
  const inner = size - pad * 2;
  const fitted = await sharp(ink)
    .resize(inner, inner, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  let pipeline = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  }).composite([{ input: fitted, gravity: "center" }]);

  if (bg !== "transparent") pipeline = pipeline.flatten({ background: bg });
  return pipeline.png().toBuffer();
}

const targets = [
  { out: "public/favicon.png", size: 32, fg: "#202020", bg: "transparent" },
  { out: "public/icon.png", size: 96, fg: "#202020", bg: "transparent" },
  { out: "public/icon-192.png", size: 192, fg: "#202020", bg: "transparent" },
  { out: "public/icon-512.png", size: 512, fg: "#202020", bg: "transparent" },
  { out: "public/apple-icon.png", size: 180, fg: "#202020", bg: "#ffffff" },
  { out: "public/favicon-light-v2.png", size: 64, fg: "#202020", bg: "transparent" },
  { out: "public/favicon-dark-v2.png", size: 64, fg: "#f5f5f5", bg: "transparent" },
];

await ensureFont();

for (const { out, size, fg, bg } of targets) {
  const buf = await icon({ size, fg, bg });
  await writeFile(path.join(root, out), buf);
  console.log(`✓ ${out}`);
}

/* Standalone, recolourable source mark. */
const signatureSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 700"><text x="700" y="350" dominant-baseline="middle" text-anchor="middle" font-family="${FAMILY}, 'Segoe Script', cursive" font-size="320" fill="currentColor">${escapeXml(NAME)}</text></svg>`;
await writeFile(path.join(root, "public/signature.svg"), signatureSvg);
console.log("✓ public/signature.svg");

/* Wrap the 32px PNG in a real ICO container (PNG-compressed ICO entry). */
const png32 = await readFile(path.join(root, "public/favicon.png"));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // count

const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0); // width
entry.writeUInt8(32, 1); // height
entry.writeUInt8(0, 2); // palette colours
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // colour planes
entry.writeUInt16LE(32, 6); // bits per pixel
entry.writeUInt32LE(png32.length, 8); // bytes in resource
entry.writeUInt32LE(header.length + entry.length, 12); // image offset

await writeFile(
  path.join(root, "public/favicon.ico"),
  Buffer.concat([header, entry, png32]),
);
console.log("✓ public/favicon.ico");
