import { BRAND, LOGO_LETTERS } from "./brand";

/**
 * Rotating favicon — one letter of the logo at a time.
 *
 * Rules (so it feels alive, not like a notification):
 *  1. Starts on the first letter at the start of a session, then remembers where it is
 *     (sessionStorage) so navigating between pages continues the sequence instead of resetting.
 *  2. While the tab is visible it steps to the next letter every `stepMs` (default 8s).
 *  3. When you leave the tab it steps ONCE, so the strip shows a fresh letter while you are away.
 *  4. It never animates in a hidden tab (no blinking for attention, no wasted timers).
 *  5. prefers-reduced-motion: no timed steps; it only steps when you leave the tab.
 *  6. Frames are drawn on a canvas and set as PNG data URLs. PNG works in Safari too,
 *     which ignores runtime changes to SVG favicons.
 */

const SIZE = 64;
const KEY = "fv-i";
const cache = new Map<number, string>();

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function frame(i: number): string {
  const hit = cache.get(i);
  if (hit) return hit;
  const letter = LOGO_LETTERS[i];
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = BRAND.bg;
  roundRect(ctx, 0, 0, SIZE, SIZE, SIZE * 0.26);
  ctx.fill();
  const s = (SIZE * 0.58) / 32;
  const off = (SIZE - 32 * s) / 2;
  ctx.save();
  ctx.translate(off, off);
  ctx.scale(s, s);
  ctx.fillStyle = BRAND.palette[letter.color];
  for (const d of BRAND.glyphs[letter.id]) ctx.fill(new Path2D(d), "evenodd");
  ctx.restore();
  const url = canvas.toDataURL("image/png");
  cache.set(i, url);
  return url;
}

function apply(i: number) {
  const url = frame(i);
  let links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'));
  if (!links.length) {
    const l = document.createElement("link");
    l.rel = "icon";
    document.head.appendChild(l);
    links = [l];
  }
  for (const l of links) {
    l.type = "image/png";
    l.removeAttribute("sizes");
    l.href = url;
  }
}

const read = () => {
  try {
    return Number(sessionStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
};
const write = (n: number) => {
  try {
    sessionStorage.setItem(KEY, String(n));
  } catch {}
};

export function startFaviconRotator({ stepMs = 8000 }: { stepMs?: number } = {}) {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  let i = read() % LOGO_LETTERS.length;
  let timer: ReturnType<typeof setInterval> | undefined;

  const step = () => {
    i = (i + 1) % LOGO_LETTERS.length;
    write(i);
    apply(i);
  };
  const stop = () => {
    if (timer) clearInterval(timer);
    timer = undefined;
  };
  const start = () => {
    stop();
    if (!reduced) timer = setInterval(step, stepMs);
  };
  const onVisibility = () => {
    if (document.hidden) {
      stop();
      step(); // one fresh letter for the glance while you are away
    } else {
      start();
    }
  };

  apply(i);
  if (!document.hidden) start();
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    stop();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
