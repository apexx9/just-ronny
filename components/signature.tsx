"use client";

import { motion, useReducedMotion, type Transition } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { site } from "@/lib/content";

interface SignatureProps {
  /** Text to render as a signature. Defaults to the site name. */
  text?: string;
  /** Font size in pixels, or any CSS length. */
  size?: number | string;
  color?: string;
  /** Seconds the "pen" takes to write the name. */
  duration?: number;
  /** Seconds to wait before writing. */
  delay?: number;
  /** Write when scrolled into view instead of on mount. */
  inView?: boolean;
  /** Draw immediately on mount regardless of viewport. */
  eager?: boolean;
  className?: string;
  style?: CSSProperties;
  label?: string;
}

/* A pen speeds up in the middle and eases out at the end — a left-to-right
   ink wipe reads as handwriting without breaking the signature font's
   connecting strokes the way a per-letter reveal would. */
const WRITE_EASE = [0.63, 0.01, 0.26, 1] as const;
const HIDDEN = { clipPath: "inset(0% 100% 0% 0%)" };
const SHOWN = { clipPath: "inset(0% 0% 0% 0%)" };

export default function Signature({
  text = site.name,
  size,
  color,
  duration = 1.9,
  delay = 0,
  inView = false,
  eager = false,
  className = "",
  style,
  label,
}: SignatureProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(() => eager || !inView || Boolean(reduceMotion));

  useEffect(() => {
    if (shown || eager || !inView) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    // Observe a non-clipped ancestor: the span starts fully clipped by its
    // initial clip-path, and Chromium's IntersectionObserver treats a fully
    // clipped target as zero-area, so it would never report intersecting.
    const target = node.parentElement ?? node;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [shown, inView, eager]);

  const merged: CSSProperties = {
    ...(size !== undefined
      ? { fontSize: typeof size === "number" ? `${size}px` : size }
      : {}),
    ...(color ? { color } : {}),
    ...style,
  };

  const transition: Transition = {
    clipPath: { duration, delay, ease: WRITE_EASE },
  };

  return (
    <motion.span
      ref={ref}
      className={`signature ${className}`.trim()}
      style={merged}
      role="img"
      aria-label={label ?? `${text} signature`}
      initial={reduceMotion ? false : HIDDEN}
      animate={shown ? SHOWN : HIDDEN}
      transition={transition}
    >
      {text}
    </motion.span>
  );
}
