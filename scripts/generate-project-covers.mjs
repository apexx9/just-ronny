// Branded fallback covers for the two live projects. Notion cover images still
// win when present; these keep the work section from showing generic
// "placeholder" artwork in the meantime.
// Run: node scripts/generate-project-covers.mjs
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const outDir = path.join(root, "public/images/work");
await mkdir(outDir, { recursive: true });

const width = 1600;
const height = 1000;

const visualSocket = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7f2e8"/>
      <stop offset="1" stop-color="#e7ece9"/>
    </linearGradient>
    <pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.2" fill="#202020" fill-opacity=".1"/>
    </pattern>
    <linearGradient id="socket" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e8541e"/>
      <stop offset="1" stop-color="#b43a12"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#paper)"/>
  <rect width="${width}" height="${height}" fill="url(#dots)"/>
  <circle cx="1270" cy="360" r="300" fill="#e8541e" opacity=".07"/>
  <circle cx="1270" cy="360" r="210" fill="none" stroke="#202020" stroke-opacity=".14"/>
  <circle cx="1270" cy="360" r="154" fill="none" stroke="#202020" stroke-opacity=".14" stroke-dasharray="3 10"/>
  <circle cx="1270" cy="360" r="52" fill="url(#socket)"/>
  <circle cx="1270" cy="360" r="17" fill="#f7f2e8"/>
  <path d="M1116 360h-86M1424 360h86M1270 206v-86M1270 514v86" stroke="#202020" stroke-opacity=".25" stroke-width="2"/>
  <path d="M1150 240 1098 188M1390 240l52-52M1150 480l-52 52M1390 480l52 52" stroke="#202020" stroke-opacity=".16" stroke-width="2"/>
  <g font-family="Helvetica, Arial, sans-serif" fill="#202020">
    <text x="82" y="98" font-size="21" letter-spacing="4" fill-opacity=".55">AARON NARTEY</text>
    <text x="1518" y="98" font-size="21" letter-spacing="4" text-anchor="end" fill-opacity=".55">PRODUCT / INTERFACE</text>
    <text x="82" y="770" font-size="112" font-weight="600" letter-spacing="-5">Visual Socket</text>
    <text x="86" y="824" font-size="26" fill-opacity=".55">A product surface for visual work.</text>
    <line x1="82" y1="870" x2="1518" y2="870" stroke="#202020" stroke-opacity=".2"/>
    <text x="82" y="922" font-size="18" letter-spacing="2.4" fill-opacity=".45">DESIGN / BUILD</text>
    <text x="1518" y="922" font-size="18" letter-spacing="2.4" text-anchor="end" fill-opacity=".45">2026</text>
  </g>
  <g transform="translate(82 150)" fill="none" stroke="#202020" stroke-opacity=".22">
    <rect x="0" y="0" width="470" height="340" rx="18"/>
    <path d="M0 64h470M78 0v340" />
    <circle cx="34" cy="32" r="6" fill="#e8541e" stroke="none"/>
    <circle cx="58" cy="32" r="6"/>
    <circle cx="82" cy="32" r="6"/>
    <rect x="108" y="102" width="310" height="36" rx="7"/>
    <rect x="108" y="158" width="230" height="20" rx="6"/>
    <rect x="108" y="194" width="270" height="20" rx="6"/>
    <rect x="108" y="250" width="112" height="38" rx="19" fill="#e8541e" fill-opacity=".18" stroke="#e8541e" stroke-opacity=".5"/>
  </g>
</svg>`;

const voltar = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2b1d52"/>
      <stop offset=".56" stop-color="#b14d7a"/>
      <stop offset="1" stop-color="#f2a65a"/>
    </linearGradient>
    <radialGradient id="orb" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#fff7ef"/>
      <stop offset=".3" stop-color="#ffd3b0"/>
      <stop offset="1" stop-color="#ff7a45" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="54" height="54" patternUnits="userSpaceOnUse">
      <path d="M54 0H0V54" fill="none" stroke="#fff" stroke-opacity=".07"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <circle cx="1210" cy="390" r="360" fill="url(#orb)"/>
  <circle cx="1210" cy="390" r="188" fill="none" stroke="#fff" stroke-opacity=".28"/>
  <circle cx="1210" cy="390" r="122" fill="none" stroke="#fff" stroke-opacity=".22" stroke-dasharray="2 11"/>
  <circle cx="1210" cy="390" r="48" fill="#fff7ef" fill-opacity=".92"/>
  <g stroke="#fff" stroke-opacity=".34" fill="none">
    <path d="M1210 202 960 284M1210 202l250 82M1210 578l-250-82M1210 578l250-82"/>
    <path d="M960 284 840 420M1460 284l120 136M960 496 840 420M1460 496l120-136"/>
  </g>
  <g fill="#fff">
    <circle cx="960" cy="284" r="8" fill-opacity=".8"/><circle cx="1460" cy="284" r="8" fill-opacity=".8"/>
    <circle cx="960" cy="496" r="8" fill-opacity=".5"/><circle cx="1460" cy="496" r="8" fill-opacity=".5"/>
    <circle cx="840" cy="420" r="5" fill-opacity=".6"/><circle cx="1580" cy="420" r="5" fill-opacity=".6"/>
  </g>
  <g font-family="Helvetica, Arial, sans-serif" fill="#fff">
    <text x="82" y="98" font-size="21" letter-spacing="4" fill-opacity=".6">AARON NARTEY</text>
    <text x="1518" y="98" font-size="21" letter-spacing="4" text-anchor="end" fill-opacity=".6">AI PRODUCT / WEB</text>
    <text x="82" y="770" font-size="112" font-weight="600" letter-spacing="-5">Voltar AI</text>
    <text x="86" y="824" font-size="26" fill-opacity=".66">AI assistance for growing businesses.</text>
    <line x1="82" y1="870" x2="1518" y2="870" stroke="#fff" stroke-opacity=".25"/>
    <text x="82" y="922" font-size="18" letter-spacing="2.4" fill-opacity=".55">FRONTEND / NEXT.JS</text>
    <text x="1518" y="922" font-size="18" letter-spacing="2.4" text-anchor="end" fill-opacity=".55">2025</text>
  </g>
</svg>`;

const covers = [
  { file: "visual-socket.png", svg: visualSocket },
  { file: "voltar-ai.png", svg: voltar },
];

for (const cover of covers) {
  await sharp(Buffer.from(cover.svg))
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, cover.file));
  console.log(`✓ public/images/work/${cover.file}`);
}
