"use client";

import { useEffect, useRef } from "react";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { site } from "@/data/site-content";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);

  // The header sits over every section, so it takes on the theme of the
  // section underneath it. At the very top it turns transparent so the
  // desktop hero image can run up behind it.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const darkSections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-header-theme='dark']"),
    );
    let frame = 0;
    // Written only when it changes, so scrolling doesn't restyle the header
    // on every frame.
    const setTheme = (theme: string) => {
      if (header.dataset.theme !== theme) header.dataset.theme = theme;
    };
    const update = () => {
      frame = 0;
      if (window.scrollY < 8) {
        setTheme("top");
        return;
      }
      // Sample the content just below the header's bottom edge.
      const probe = header.getBoundingClientRect().bottom + 1;
      const isDark = darkSections.some((section) => {
        const { top, bottom } = section.getBoundingClientRect();
        return top <= probe && bottom > probe;
      });
      setTheme(isDark ? "dark" : "light");
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <header ref={headerRef} className="site-header" data-theme="top">
      <div className="site-header__inner">
        <a className="site-header__brand" href="#main-content">
          <span className="site-header__name">{site.name}</span>
          <span className="site-header__place"> — {site.location}</span>
        </a>
        <nav className="site-header__nav" aria-label="Primary navigation">
          <a className="site-header__link only-desktop" href="#work">
            Work
          </a>
          <a className="text-link site-header__cta" href="#contact">
            <span className="text-link__label">Let’s talk</span>
            <ArrowIcon direction="up-right" />
          </a>
        </nav>
      </div>
    </header>
  );
}
