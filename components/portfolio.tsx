"use client";

import { useEffect, useState } from "react";
import ContactFooter from "./contact-footer";
import DrawerNavigation from "./drawer-navigation";
import Hero from "./hero";
import WorkSection from "./work-section";
import { TooltipProvider } from "./tool-tip";
import { useDrawer, useFooterGradient, useHoverSound } from "@/lib/hooks";

export default function Portfolio() {
  const { drawerRef, navigationRef, expanded } = useDrawer();
  const surfaceRef = useFooterGradient();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const playHover = useHoverSound(soundEnabled);

  // Persist sound preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aaron-sound");
      if (saved === "false") setSoundEnabled(false);
    } catch {}
  }, []);

  const toggleSound = () => {
    setSoundEnabled((v) => {
      try {
        localStorage.setItem("aaron-sound", String(!v));
      } catch {}
      return !v;
    });
  };

  return (
    <TooltipProvider>
      <div className="footer-gradient" aria-hidden="true" />

      <main className={`portfolio ${expanded ? "drawer-expanded" : ""}`}>
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
