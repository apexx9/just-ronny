"use client";

import { site } from "@/lib/content";

interface Props {
  navRef: React.RefObject<HTMLDivElement | null>;
  expanded: boolean;
  onHover?: () => void;
}

export default function DrawerNavigation({ navRef, expanded, onHover }: Props) {
  const scrollToShowcase = () => {
    document.getElementById("showcase")?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  const scrollToHero = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  return (
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
          onPointerEnter={onHover}
          onClick={scrollToHero}
        >
          {site.name}
        </a>
        <nav aria-label="Main navigation">
          <a className="desktop-nav" href="#work" onPointerEnter={onHover}>
            Work
          </a>
          <a className="desktop-nav" href="#information" onPointerEnter={onHover}>
            Information
          </a>
          <a href="#contact" onPointerEnter={onHover}>
            Contact
          </a>
        </nav>
      </div>
    </div>
  );
}
