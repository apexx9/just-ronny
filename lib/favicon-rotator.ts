import { BRAND, LOGO_LETTERS } from "./brand";

/**
 * Rotating favicon — one letter of the APX logo at a time.
 *
 * Rules (so it feels alive, not like a notification):
 *  1. Starts on the first letter at the start of a session, then remembers where it is
 *     (sessionStorage) so navigating between pages continues the sequence instead of resetting.
 *  2. While the tab is visible it steps to the next letter every `stepMs` (default 8s).
 *  3. When you leave the tab it steps ONCE, so the strip shows a fresh letter while you are away.
 *  4. It never animates in a hidden tab (no blinking for attention, no wasted timers).
 *  5. prefers-reduced-motion: no timed steps and no hidden step; the current letter holds still.
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

function normalize(index: number) {
  const length = LOGO_LETTERS.length;
  return ((index % length) + length) % length;
}

export function frame(index: number): string {
  const i = normalize(index);
  const hit = cache.get(i);
  if (hit) return hit;

  const letter = LOGO_LETTERS[i];
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = BRAND.bg;
  roundRect(ctx, 0, 0, SIZE, SIZE, SIZE * 0.26);
  ctx.fill();

  const scale = (SIZE * 0.58) / 32;
  const offset = (SIZE - 32 * scale) / 2;
  ctx.save();
  ctx.translate(offset, offset);
  ctx.scale(scale, scale);
  ctx.fillStyle = BRAND.palette[letter.color];
  for (const d of BRAND.glyphs[letter.id]) {
    ctx.fill(new Path2D(d), "evenodd");
  }
  ctx.restore();

  const url = canvas.toDataURL("image/png");
  cache.set(i, url);
  return url;
}

function apply(index: number) {
  const url = frame(index);
  let links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'));
  if (!links.length) {
    const link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
    links = [link];
  }
  for (const link of links) {
    /* Skip links already pointing at this frame: the observer below sees our
       own writes, and this guard is what stops it from looping. */
    if (link.getAttribute("href") === url) continue;
    link.setAttribute("type", "image/png");
    link.removeAttribute("sizes");
    link.setAttribute("href", url);
  }
}

const read = () => {
  try {
    const value = Number(sessionStorage.getItem(KEY));
    return Number.isFinite(value) ? Math.trunc(value) : 0;
  } catch {
    return 0;
  }
};

const write = (index: number) => {
  try {
    sessionStorage.setItem(KEY, String(index));
  } catch {
    /* private mode */
  }
};

export function startFaviconRotator({ stepMs = 8000 }: { stepMs?: number } = {}) {
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  let index = normalize(read());
  let timer: ReturnType<typeof setInterval> | undefined;
  let disposed = false;

  const step = () => {
    index = normalize(index + 1);
    write(index);
    apply(index);
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
      if (!reduced) step(); // one fresh letter for the glance while you are away
    } else {
      start();
    }
  };

  apply(index);
  if (!document.hidden) start();
  document.addEventListener("visibilitychange", onVisibility);

  /* Next emits the static icons (app/favicon.ico, app/icon.svg) again while
     hydrating and after client-side navigation. Without this observer those
     tags land after the effect has run, and a browser that ignores SVG
     favicons — Safari — would pick the .ico instead of the current APX
     letter. Re-applying on head mutations keeps the sequence in place. */
  let queued = false;
  const observer = new MutationObserver(() => {
    if (disposed || queued) return;
    queued = true;
    queueMicrotask(() => {
      queued = false;
      if (!disposed) apply(index);
    });
  });

  observer.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["href", "rel", "type"],
  });

  return () => {
    disposed = true;
    stop();
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
