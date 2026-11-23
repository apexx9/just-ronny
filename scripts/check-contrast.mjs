// scripts/check-contrast.mjs
// Reads the DESIGN.md tokens out of app/globals.css and checks every text
// pair the site actually uses. Exit code 1 means a token must change.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function block(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Missing selector: ${selector}`);
  const open = css.indexOf("{", start);
  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  throw new Error(`Unclosed block: ${selector}`);
}

function tokens(source) {
  const map = {};
  for (const line of source.split("\n")) {
    const match = line.match(/^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);/i);
    if (match) map[match[1]] = match[2].trim();
  }
  return map;
}

const themes = {
  dark: tokens(block(":root,")),
  light: tokens(block('[data-theme="light"]')),
};

function parseColor(value) {
  if (!value) return null;
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      return [0, 1, 2].map((i) => parseInt(hex[i] + hex[i], 16));
    }
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  }
  const rgb = value.match(/rgba?\(([^)]+)\)/);
  if (rgb) {
    const parts = rgb[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return parts.slice(0, 3);
  }
  return null;
}

function blend(fg, alpha, bg) {
  return fg.map((channel, i) => Math.round(channel * alpha + bg[i] * (1 - alpha)));
}

function luminance([r, g, b]) {
  const lin = (channel) => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const surfaces = ["bg", "surface", "surface-2"];
const textTokens = [
  "fg",
  "muted",
  "orange-text",
  "gold-text",
  "green-text",
  "blue-text",
  "purple-text",
  "pink-text",
];
const fills = {
  "orange-text": "orange",
  "gold-text": "gold",
  "green-text": "green",
  "blue-text": "blue",
  "purple-text": "purple",
  "pink-text": "pink",
};

let failures = 0;
for (const [name, theme] of Object.entries(themes)) {
  console.log(`\n${name.toUpperCase()}`);
  for (const surface of surfaces) {
    const background = parseColor(theme[`--${surface}`]);
    if (!background) throw new Error(`Missing --${surface} in ${name}`);
    for (const token of textTokens) {
      const foreground = parseColor(theme[`--${token}`]);
      if (!foreground) continue;
      const ratio = contrast(foreground, background);
      const pass = ratio >= 4.5;
      if (!pass) failures += 1;
      console.log(
        `${pass ? "PASS" : "FAIL"}  ${token.padEnd(12)} on ${surface.padEnd(10)} ${ratio.toFixed(2)}:1`,
      );
    }

    // Chips: 13% fill at rest, 18% on hover, with the matching --*-text ink.
    for (const [token, fill] of Object.entries(fills)) {
      const foreground = parseColor(theme[`--${token}`]);
      const fillColor = parseColor(theme[`--${fill}`]);
      if (!foreground || !fillColor) continue;
      for (const alpha of [0.13, 0.18]) {
        const tinted = blend(fillColor, alpha, background);
        const ratio = contrast(foreground, tinted);
        const pass = ratio >= 4.5;
        if (!pass) failures += 1;
        console.log(
          `${pass ? "PASS" : "FAIL"}  ${token.padEnd(12)} on ${surface.padEnd(10)} + ${fill} ${Math.round(alpha * 100)}%  ${ratio.toFixed(2)}:1`,
        );
      }
    }
  }
}

console.log(
  failures === 0
    ? "\nAll text pairs meet WCAG AA (4.5:1)."
    : `\n${failures} pair(s) below 4.5:1 — fix the token, not the component.`,
);
process.exit(failures === 0 ? 0 : 1);
