"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/hooks";

const OPEN_DELAY = 180;
const CLOSE_DELAY = 140;
const GAP = 8;
const MARGIN = 8;

interface Props {
  content: ReactNode;
  children: ReactNode;
}

export default function HoverCard({ content, children }: Props) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0, origin: "top" });

  const targetRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef(0);
  const closeTimer = useRef(0);
  const mounted = useIsClient();

  const cancel = (t: React.RefObject<number>) => {
    if (t.current) window.clearTimeout(t.current);
  };

  const place = () => {
    const trigger = targetRef.current?.querySelector<HTMLElement>("a, button");
    const card = cardRef.current;
    if (!trigger || !card) return;
    const r = trigger.getBoundingClientRect();
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const left = Math.max(
      MARGIN,
      Math.min(r.left + r.width / 2 - w / 2, innerWidth - w - MARGIN)
    );
    const below = r.bottom + GAP;
    const above = r.top - GAP - h;
    const showBelow = below + h + MARGIN <= innerHeight;
    setPos({
      left,
      top: showBelow ? below : Math.max(MARGIN, above),
      origin: showBelow ? "top" : "bottom",
    });
  };

  useLayoutEffect(() => {
    if (open) place();
  }, [open]);

  const openNow = () => {
    cancel(closeTimer);
    cancel(openTimer);
    place();
    setOpen(true);
  };

  const openSoon = (instant: boolean) => {
    cancel(closeTimer);
    cancel(openTimer);
    if (instant) {
      openNow();
      return;
    }
    openTimer.current = window.setTimeout(openNow, OPEN_DELAY);
  };

  const closeSoon = () => {
    cancel(openTimer);
    cancel(closeTimer);
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  const closeNow = useCallback(() => {
    cancel(openTimer);
    cancel(closeTimer);
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (targetRef.current?.contains(t) || cardRef.current?.contains(t)) return;
      closeNow();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("scroll", closeNow, true);
    window.addEventListener("resize", closeNow);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("scroll", closeNow, true);
      window.removeEventListener("resize", closeNow);
    };
  }, [open, closeNow]);

  return (
    <span
      ref={targetRef}
      className="hover-card-target"
      onPointerEnter={(e) => {
        if (
          e.pointerType === "mouse" &&
          matchMedia("(hover: hover) and (pointer: fine)").matches
        ) {
          openSoon(false);
        }
      }}
      onPointerLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) closeSoon();
      }}
      onFocus={(e) => {
        if (e.target.matches(":focus-visible")) openNow();
      }}
      onBlur={closeNow}
    >
      {children}

      {mounted &&
        createPortal(
          <div
            ref={cardRef}
            id={id}
            role="dialog"
            aria-hidden={!open}
            data-open={open}
            className="hover-card"
            style={{
              left: pos.left,
              top: pos.top,
              transformOrigin: `${pos.origin} center`,
            }}
            onPointerEnter={() => cancel(closeTimer)}
            onPointerLeave={closeSoon}
          >
            {content}
          </div>,
          document.body
        )}
    </span>
  );
}
