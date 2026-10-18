"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useIsClient } from "@/lib/hooks";

interface Ctx {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}
const TooltipCtx = createContext<Ctx | null>(null);

export function TooltipProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeId) return;
    const close = () => setActiveId(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointer = (e: PointerEvent) => {
      const trigger = (e.target as Element)?.closest?.("[data-tooltip-trigger]");
      if (trigger?.getAttribute("data-tooltip-trigger") !== activeId) close();
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("blur", close);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("blur", close);
    };
  }, [activeId]);

  return (
    <TooltipCtx.Provider value={{ activeId, setActiveId }}>
      {children}
    </TooltipCtx.Provider>
  );
}

interface TooltipProps {
  text: string;
  label: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  onHover?: () => void;
}

export function Tooltip({
  text,
  label,
  children,
  className = "",
  onClick,
  onHover,
}: TooltipProps) {
  const id = useId();
  const ctx = useContext(TooltipCtx);
  if (!ctx) throw new Error("Tooltip requires TooltipProvider");
  const { activeId, setActiveId } = ctx;
  const open = activeId === id;

  const tipRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });
  const mounted = useIsClient();

  useLayoutEffect(() => {
    if (!open || !btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    const w = tipRef.current?.offsetWidth ?? 96;
    const h = tipRef.current?.offsetHeight ?? 28;
    const left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, innerWidth - w - 8));
    const top = r.top >= h + 12 ? r.top - h - 4 : r.bottom + 4;
    setPos({ left, top });
  }, [open, text]);

  const show = (el: HTMLElement) => {
    if (btnRef.current) {
      const r = el.getBoundingClientRect();
      const w = tipRef.current?.offsetWidth ?? 96;
      const h = tipRef.current?.offsetHeight ?? 28;
      const left = Math.max(8, Math.min(r.left + r.width / 2 - w / 2, innerWidth - w - 8));
      const top = r.top >= h + 12 ? r.top - h - 4 : r.bottom + 4;
      setPos({ left, top });
    }
    setActiveId(id);
  };

  return (
    <span className="tooltip-target">
      <button
        ref={btnRef}
        type="button"
        className={className}
        aria-label={label}
        aria-describedby={open ? id : undefined}
        data-tooltip-trigger={id}
        onPointerEnter={(e) => {
          if (
            e.pointerType === "mouse" &&
            matchMedia("(hover: hover) and (pointer: fine)").matches
          ) {
            show(e.currentTarget);
            onHover?.();
          }
        }}
        onPointerLeave={(e) => {
          if (!e.currentTarget.matches(":focus-visible")) setActiveId(null);
        }}
        onFocus={(e) => {
          if (e.currentTarget.matches(":focus-visible")) show(e.currentTarget);
        }}
        onBlur={() => setActiveId(null)}
        onClick={onClick}
      >
        {children}
      </button>

      {mounted &&
        createPortal(
          <span
            ref={tipRef}
            id={id}
            role="tooltip"
            aria-hidden={!open}
            data-open={open}
            className="tooltip"
            style={pos}
          >
            {text}
          </span>,
          document.body
        )}
    </span>
  );
}
