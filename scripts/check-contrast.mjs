// scripts/check-contrast.mjs
// Checks the active dark palette against WCAG AA for normal text.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const start = css.indexOf(":root {");
if (start < 0) throw new Error("Missing :root token block");
const open = css.indexOf("{", start);
const close = css.indexOf("}", open);
const source = css.slice(open + 1, close);
const tokens = Object.fromEntries(
  [...source.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-f]{3,8})\s*;/gi)].map((match) => [match[1], match[2]]),
);

function rgb(hex) {
  let value = hex.slice(1);
  if (value.length === 3) value = [...value].map((part) => part + part).join("");
  return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16));
}
function luminance(hex) {
  const channels = rgb(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
function contrast(foreground, background) {
  const [high, low] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (high + 0.05) / (low + 0.05);
}

const pairs = [
  ["ink", "bg"], ["muted", "bg"], ["faint", "bg"], ["accent", "bg"],
  ["ink", "panel"], ["muted", "panel"], ["faint", "panel"], ["accent", "panel"],
];
let failures = 0;
for (const [foreground, background] of pairs) {
  const fg = tokens[`--${foreground}`];
  const bg = tokens[`--${background}`];
  if (!fg || !bg) throw new Error(`Missing color token: --${foreground} or --${background}`);
  const ratio = contrast(fg, bg);
  const passed = ratio >= 4.5;
  if (!passed) failures += 1;
  console.log(`${passed ? "PASS" : "FAIL"}  --${foreground} on --${background}: ${ratio.toFixed(2)}:1`);
}
console.log(failures ? `\n${failures} contrast pair(s) below WCAG AA.` : "\nAll checked text pairs meet WCAG AA.");
process.exit(failures ? 1 : 0);
