"use client";

import Link from "next/link";
import AboutSection from "./about-section";
import ActivitySection from "./activity-section";
import ContactFooter from "./contact-footer";
import DrawerNavigation from "./drawer-navigation";
import Hero from "./hero";
import ListeningSection from "./listening-section";
import MechatronicsSection from "./mechatronics-section";
import RecentPostsSection from "./recent-posts-section";
import WorkSection from "./work-section";
import ContactSection from "./contact-section";
import { ThemeToggle } from "./theme-toggle";
import { TooltipProvider } from "./tool-tip";
import { site } from "@/lib/content";
import type { PostSummary } from "@/lib/post-summary";
import { useDrawer, useFooterGradient } from "@/lib/hooks";

interface Props {
  introDone?: boolean;
  recentPosts: PostSummary[];
}

export default function Portfolio({ introDone = true, recentPosts }: Props) {
  const { drawerRef, navigationRef, expanded, expand } = useDrawer();
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
            <DrawerNavigation
              navRef={navigationRef}
              expanded={expanded}
              onExpand={expand}
            />

            <div className="drawer-surface" ref={surfaceRef}>
              <div className="middle-layout">
                <div className="middle-main">
                  <WorkSection />
                  <RecentPostsSection posts={recentPosts} />
                  <MechatronicsSection />
                  <AboutSection />
                </div>

                <aside className="middle-rail" aria-label="Listening and links">
                  <ListeningSection />

                  <nav className="rail-links" aria-label="Elsewhere">
                    <p className="section-label">Elsewhere</p>
                    <Link className="rail-link" href="/blog">
                      Blog <span aria-hidden="true">↗</span>
                    </Link>
                    {site.socials.map((social) => (
                      <a
                        key={social.id}
                        className="rail-link"
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {social.label} <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </nav>
                </aside>

                <div className="middle-wide middle-activity">
                  <ActivitySection />
                </div>

                <div className="middle-wide middle-contact">
                  <ContactSection />
                </div>
              </div>
            </div>
          </section>

          <ContactFooter />
        </div>
      </main>
    </TooltipProvider>
  );
}
