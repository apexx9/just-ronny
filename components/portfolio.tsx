"use client";

import { useState } from "react";
import ContactFooter from "./contact-footer";
import DrawerNavigation from "./drawer-navigation";
import Hero from "./hero";
import WorkSection from "./work-section";
import ContactSection from "./contact-section";
import { ThemeToggle } from "./theme-toggle";
import { TooltipProvider } from "./tool-tip";
import { useDrawer, useFooterGradient, useHoverSound } from "@/lib/hooks";

interface Props {
  introDone?: boolean;
}

export default function Portfolio({ introDone = true }: Props) {
  const { drawerRef, navigationRef, expanded } = useDrawer();
  const surfaceRef = useFooterGradient();

  /* Portfolio only mounts after hydration (the page gates it), so reading the
     stored preference during the initial render is safe and avoids a
     setState-in-effect. */
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      return localStorage.getItem("aaron-sound") !== "false";
    } catch {
      return true;
    }
  });

  const playHover = useHoverSound(soundEnabled);

  const toggleSound = () => {
    const next = !soundEnabled;
    try {
      localStorage.setItem("aaron-sound", String(next));
    } catch {}
    setSoundEnabled(next);
  };

  return (
    <TooltipProvider>
      <div className="footer-gradient" aria-hidden="true" />

      {!expanded && <ThemeToggle variant="floating" onPointerEnter={playHover} />}

      <main
        className={`portfolio ${expanded ? "drawer-expanded" : ""} ${
          introDone ? "intro-ready" : ""
        }`}
      >
        <div className="portfolio-stage">
          <Hero onHover={playHover} />

          <section
            className="showcase"
            id="showcase"
            ref={drawerRef}
            aria-label="Selected work"
          >
            <DrawerNavigation
              navRef={navigationRef}
              expanded={expanded}
              onHover={playHover}
            />

            <div className="drawer-surface" ref={surfaceRef}>
              <WorkSection onHover={playHover} />
              <ContactSection onHover={playHover} />
            </div>
          </section>

          <ContactFooter
            onHover={playHover}
            soundEnabled={soundEnabled}
            toggleSound={toggleSound}
          />
        </div>
      </main>
    </TooltipProvider>
  );
}
