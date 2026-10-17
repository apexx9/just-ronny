"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drives the drawer navigation's `--nav-progress` CSS variable
 * based on scroll position and returns an `expanded` boolean.
 */
export function useDrawer() {
  const drawerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const drawer = drawerRef.current;
    const nav = navigationRef.current;
    if (!drawer || !nav) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let progress = 0;
    let target = 0;
    let velocity = 0;
    let lastT = 0;
    let raf = 0;

    const setProgress = (v: number) =>
      nav.style.setProperty("--nav-progress", String(v));

    const tick = (t: number) => {
      if (document.body.dataset.projectOpen !== undefined) return;
      const dt = Math.min((t - (lastT || t)) / 1000, 0.032);
      lastT = t;
      const steps = Math.max(1, Math.ceil(dt / 0.008));
      const sub = dt / steps;
      for (let i = 0; i < steps; i++) {
        velocity += (400 * (target - progress) - 40 * velocity) * sub;
        progress += velocity * sub;
      }
      if (Math.abs(target - progress) < 0.001 && Math.abs(velocity) < 0.01) {
        progress = target;
        velocity = 0;
        raf = 0;
        lastT = 0;
      }
      setProgress(progress);
      if (raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (document.body.dataset.projectOpen !== undefined) return;
      const next = drawer.getBoundingClientRect().top <= 0 ? 1 : 0;
      if (next !== target) {
        target = next;
        setExpanded(next === 1);
      }
      if (reduced.matches || document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        lastT = 0;
        progress = target;
        velocity = 0;
        setProgress(target);
        return;
      }
      if (!raf && progress !== target) {
        raf = requestAnimationFrame(tick);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("portfolio:project-closed", onScroll);
    document.addEventListener("visibilitychange", onScroll);
    reduced.addEventListener("change", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("portfolio:project-closed", onScroll);
      document.removeEventListener("visibilitychange", onScroll);
      reduced.removeEventListener("change", onScroll);
    };
  }, []);

  return { drawerRef, navigationRef, expanded };
}

/**
 * Drives the footer-gradient opacity + drawer scale as you scroll
 * into the contact section.
 */
export function useFooterGradient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const surface = ref.current;
    const footer = document.getElementById("contact");
    if (!surface || !footer) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let progress = 0;
    let target = 0;
    let raf = 0;
    let lastT = 0;
    let maxShrink = 0.05;
    let radiusBase = 32;
    let distance = 520;

    const clamp = (n: number) => Math.min(1, Math.max(0, n));

    const apply = () => {
      if (reduced.matches) {
        surface.style.transform = "";
        surface.style.removeProperty("--footer-radius");
        document.documentElement.style.removeProperty("--gradient-opacity");
        return;
      }
      surface.style.transform = `scale(${1 - progress * maxShrink})`;
      surface.style.setProperty(
        "--footer-radius",
        `${progress * radiusBase}px`
      );
      document.documentElement.style.setProperty(
        "--gradient-opacity",
        String(clamp(progress * 20))
      );
    };

    const tick = (t: number) => {
      const dt = lastT ? Math.min(t - lastT, 64) : 16;
      lastT = t;
      progress += (target - progress) * (1 - Math.exp(-dt / 80));
      if (Math.abs(target - progress) < 0.001) progress = target;
      apply();
      if (progress === target) {
        raf = 0;
        lastT = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const measure = () => {
      const w = window.innerWidth;
      distance = w <= 480 ? 760 : w <= 768 ? 640 : 520;
      radiusBase = w <= 480 ? 40 : 32;
      maxShrink = Math.min(w <= 480 ? 0.15 : 0.05, (w <= 480 ? 220 : 180) / Math.max(1, surface.offsetHeight));
      onScroll();
    };

    const onScroll = () => {
      if (document.body.dataset.projectOpen !== undefined) return;
      target =
        window.scrollY <= 0
          ? 0
          : clamp((window.innerHeight - footer.getBoundingClientRect().top + 20) / distance);
      if (reduced.matches || document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        lastT = 0;
        progress = target;
        apply();
        return;
      }
      if (!raf && progress !== target) raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(surface);
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("portfolio:project-closed", measure);
    document.addEventListener("visibilitychange", onScroll);
    reduced.addEventListener("change", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("portfolio:project-closed", measure);
      document.removeEventListener("visibilitychange", onScroll);
      reduced.removeEventListener("change", onScroll);
    };
  }, []);

  return ref;
}

/**
 * Hover sound effect using WebAudio.
 */
export function useHoverSound(enabled: boolean) {
  const stateRef = useRef<{
    ctx: AudioContext | null;
    buffer: AudioBuffer | null;
    lastPlay: number;
  }>({ ctx: null, buffer: null, lastPlay: 0 });

  useEffect(() => {
    const s = stateRef.current;
    const controller = new AbortController();
    let raw: ArrayBuffer | null = null;

    const decode = async () => {
      if (raw && s.ctx && !s.buffer) {
        try {
          s.buffer = await s.ctx.decodeAudioData(raw);
        } catch {}
      }
    };

    const unlock = (e: Event) => {
      if (!e.isTrusted || typeof window === "undefined" || !window.AudioContext)
        return;
      s.ctx ??= new AudioContext();
      if (s.ctx.state === "suspended") s.ctx.resume().catch(() => {});
      decode();
    };

    fetch("/audio/hover.mp3", { signal: controller.signal })
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
      .then((b) => {
        raw = b;
        decode();
      })
      .catch(() => {});

    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);

    return () => {
      controller.abort();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      s.ctx?.close();
    };
  }, []);

  return useCallback(() => {
    const s = stateRef.current;
    if (!enabled || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (document.hidden || s.ctx?.state !== "running" || !s.buffer) return;
    const now = performance.now();
    if (now - s.lastPlay < 60) return;
    s.lastPlay = now;
    const src = s.ctx.createBufferSource();
    const gain = s.ctx.createGain();
    src.buffer = s.buffer;
    gain.gain.value = 0.125;
    src.connect(gain);
    gain.connect(s.ctx.destination);
    src.start();
  }, [enabled]);
}
