"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import { ThemeToggle } from "./theme-toggle";

interface Props {
  navRef: React.RefObject<HTMLDivElement | null>;
  expanded: boolean;
  /** Clear a manual collapse so the handle can expand the pill again. */
  onExpand?: () => void;
}

const reduced = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({
    behavior: reduced() ? "instant" : "smooth",
  });
}

export default function DrawerNavigation({
  navRef,
  expanded,
  onExpand,
}: Props) {
  /* Phone-only overlay menu, opened from the pill's menu button. */
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const openMenu = () => setMenuOpen(true);

  // Lock the page behind the overlay, and let Escape dismiss it.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // If the viewport grows to desktop the trigger disappears, so the
    // overlay must not be left stranded open.
    const mq = matchMedia("(min-width: 640px)");
    const onWide = () => {
      if (mq.matches) setMenuOpen(false);
    };
    mq.addEventListener("change", onWide);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onWide);
    };
  }, [menuOpen]);

  const scrollToShowcase = () => {
    onExpand?.();
    scrollToId("showcase");
  };

  const scrollToHero = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    window.scrollTo({
      top: 0,
      behavior: reduced() ? "instant" : "smooth",
    });
  };

  /* Anchor nav — closes the overlay first so it doesn't cover the target. */
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();
    scrollToId(id);
  };

  const links = (
    <>
      <a href="#work" onClick={scrollTo("work")}>
        Work
      </a>
      <a href="#information" onClick={scrollTo("information")}>
        Information
      </a>
      <a href="#contact-form" onClick={scrollTo("contact-form")}>
        Contact
      </a>
      <Link href="/blog" onClick={closeMenu}>
        Blog
      </Link>
    </>
  );

  return (
    <>
      <div
        ref={navRef}
        className={`drawer-navigation ${expanded ? "is-expanded" : ""}`}
      >
        <button
          className="drawer-handle"
          tabIndex={expanded ? -1 : 0}
          aria-hidden={expanded}
          aria-label="Open the showcase"
          onClick={scrollToShowcase}
        />

        <div
          className="navigation-content"
          inert={!expanded}
          aria-hidden={!expanded}
        >
          <a
            className="navigation-name personal-name"
            href="#hero"
            onClick={scrollToHero}
          >
            {site.name}
          </a>

          <div className="nav-right">
            {/* Inline links — wide screens only. */}
            <nav className="desktop-links" aria-label="Main navigation">
              <a className="desktop-nav" href="#work" onClick={scrollTo("work")}>
                Work
              </a>
              <a
                className="desktop-nav"
                href="#information"
                onClick={scrollTo("information")}
              >
                Information
              </a>
              <a
                className="desktop-nav"
                href="#contact-form"
                onClick={scrollTo("contact-form")}
              >
                Contact
              </a>
              <Link className="desktop-nav" href="/blog" onClick={closeMenu}>
                Blog
              </Link>
            </nav>

            <div className="nav-actions">
              <ThemeToggle />
              {/* Phone-only trigger, revealed once the pill scrolls in. */}
              <button
                type="button"
                className="nav-menu-button"
                onClick={openMenu}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label="Open navigation menu"
              >
                Menu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Phone overlay menu */}
      <div
        id="mobile-nav"
        className={`mobile-nav ${menuOpen ? "is-open" : ""}`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <button
          type="button"
          className="mobile-nav-backdrop"
          tabIndex={-1}
          aria-label="Close navigation menu"
          onClick={closeMenu}
        />
        <div
          className="mobile-nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="mobile-nav-head">
            <span className="personal-name">{site.name}</span>
            <button
              type="button"
              className="mobile-nav-close"
              onClick={closeMenu}
              aria-label="Close navigation menu"
            >
              Close
              <span aria-hidden="true">&#10005;</span>
            </button>
          </div>
          <nav className="mobile-nav-links" aria-label="Main navigation">
            {links}
          </nav>
          <div className="mobile-nav-foot">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
