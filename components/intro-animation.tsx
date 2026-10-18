"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/lib/content";

type Phase = "write" | "wipe" | "done";

const WIPE_AT = 2100;
const DONE_AT = 3500;

/* Same pen curve as components/signature.tsx, slowed down for the overture. */
const WRITE_EASE = [0.63, 0.01, 0.26, 1] as const;

interface IntroAnimationProps {
  onComplete?: () => void;
  oncePerSession?: boolean;
  storageKey?: string;
}

export default function IntroAnimation({
  onComplete,
  oncePerSession = true,
  storageKey = "hasSeenIntro",
}: IntroAnimationProps) {
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    return !oncePerSession || !sessionStorage.getItem(storageKey);
  });

  const [phase, setPhase] = useState<Phase>("write");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const finish = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("done");
    if (oncePerSession) sessionStorage.setItem(storageKey, "true");
    onComplete?.();
  }, [oncePerSession, storageKey, onComplete]);

  useEffect(() => {
    if (!enabled) {
      onComplete?.();
      return;
    }

    timers.current = [
      setTimeout(() => setPhase("wipe"), WIPE_AT),
      setTimeout(finish, DONE_AT),
    ];

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [enabled, finish, onComplete]);

  if (!enabled || phase === "done") return null;

  const isWiping = phase === "wipe";

  return (
    <div
      className="intro"
      role="presentation"
      aria-hidden="true"
      onClick={finish}
    >
      <motion.div
        className="intro-content"
        animate={{ scale: isWiping ? 0.92 : 1, y: isWiping ? -12 : 0 }}
        transition={{ duration: 1.1, ease: [0.6, 0.05, -0.01, 0.9] }}
      >
        <motion.span
          className="intro-name"
          initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 2, ease: WRITE_EASE }}
        >
          {site.name}
        </motion.span>
      </motion.div>

      <motion.div
        className="intro-wipe"
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{
          clipPath: isWiping ? "circle(150% at 50% 50%)" : "circle(0% at 50% 50%)",
        }}
        transition={{ duration: 1.3, ease: [0.6, 0.05, -0.01, 0.9] }}
      />
    </div>
  );
}
