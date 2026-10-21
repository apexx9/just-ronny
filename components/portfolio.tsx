"use client";

import ContactFooter from "./contact-footer";
import DrawerNavigation from "./drawer-navigation";
import Hero from "./hero";
import WorkSection from "./work-section";
import ContactSection from "./contact-section";
import { ThemeToggle } from "./theme-toggle";
import { TooltipProvider } from "./tool-tip";
import { useDrawer, useFooterGradient } from "@/lib/hooks";

interface Props {
  introDone?: boolean;
}

export default function Portfolio({ introDone = true }: Props) {
  const { drawerRef, navigationRef, expanded } = useDrawer();
  const surfaceRef = useFooterGradient();

  return (
    <TooltipProvider>
      <div className="footer-gradient" aria-hidden="true" />

      {!expanded && <ThemeToggle variant="floating" />}

      <main
        className={`portfolio ${expanded ? "drawer-expanded" : ""} ${
          introDone ? "intro-ready" : ""
        }`}
      >
        <div className="portfolio-stage">
          <Hero />

          <section
            className="showcase"
            id="showcase"
            ref={drawerRef}
            aria-label="Selected work"
          >
            <DrawerNavigation navRef={navigationRef} expanded={expanded} />

            <div className="drawer-surface" ref={surfaceRef}>
              <WorkSection />
              <ContactSection />
            </div>
          </section>

          <ContactFooter />
        </div>
      </main>
    </TooltipProvider>
  );
}
