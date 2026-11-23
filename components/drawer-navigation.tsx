"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { site } from "@/lib/content";
import { useSpotifyAvailable } from "@/lib/spotify-status";
import Logo from "./Logo";
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
  const spotifyAvailable = useSpotifyAvailable();
  const router = useRouter();
  const [active, setActive] = useState("work");

  const navItems: { id: string; label: string; href: string }[] = [
    { id: "work", label: "Work", href: "#work" },
    { id: "information", label: "Information", href: "#information" },
    ...(spotifyAvailable
      ? [{ id: "listening", label: "Listening", href: "#listening" }]
      : []),
    { id: "contact", label: "Contact", href: "#contact-form" },
    { id: "blog", label: "Blog", href: "/blog" },
  ];

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

  /* Keyboard shortcuts: w · i · l · c · b. Never while typing, never with a
     modifier held. Listening only participates when its card is live. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          'input, textarea, select, [contenteditable="true"], [role="textbox"]',
        )
      ) {
        return;
      }
      const key = e.key.toLowerCase();
      if (key === "b") {
        e.preventDefault();
        router.push("/blog");
        return;
      }
      const destinations: Record<string, string> = {
        w: "work",
        i: "information",
        c: "contact-form",
        ...(spotifyAvailable ? { l: "listening" } : {}),
      };
      const id = destinations[key];
      if (!id) return;
      e.preventDefault();
      closeMenu();
      scrollToId(id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, spotifyAvailable]);

  /* Active nav item follows the section crossing the reading line. The
     section ids and nav ids differ for Contact, so keep both explicit. */
  useEffect(() => {
    const sections = [
      { id: "work", target: "work" },
      { id: "information", target: "information" },
      { id: "listening", target: "listening" },
      { id: "contact", target: "contact-form" },
    ];
    const onScroll = () => {
      const line = window.innerHeight * 0.45;
      let current = "work";
      for (const section of sections) {
        const el = document.getElementById(section.target);
        if (el && el.getBoundingClientRect().top <= line) current = section.id;
      }
      setActive((previous) => (previous === current ? previous : current));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            className="navigation-name"
            href="#hero"
            onClick={scrollToHero}
            aria-label={site.name}
          >
            <Logo height={20} title={site.name} />
          </a>

          <div className="nav-right">
            {/* Inline links — wide screens only. */}
            <nav className="desktop-links" aria-label="Main navigation">
              {navItems.map((item) =>
                item.id === "blog" ? (
                  <Link
                    key={item.id}
                    className="desktop-nav"
                    href="/blog"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.id}
                    className={`desktop-nav${active === item.id ? " is-active" : ""}`}
                    href={item.href}
                    onClick={scrollTo(item.href.slice(1))}
                    aria-current={active === item.id ? "true" : undefined}
                  >
                    {item.label}
                  </a>
                ),
              )}
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
            <a
              className="mobile-nav-brand"
              href="#hero"
              onClick={scrollToHero}
              aria-label={site.name}
            >
              <Logo height={18} title={site.name} />
            </a>
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
            {navItems.map((item) =>
              item.id === "blog" ? (
                <Link key={item.id} href="/blog" onClick={closeMenu}>
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.id}
                  className={active === item.id ? "is-active" : undefined}
                  href={item.href}
                  onClick={scrollTo(item.href.slice(1))}
                  aria-current={active === item.id ? "true" : undefined}
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>
          <div className="mobile-nav-foot">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
