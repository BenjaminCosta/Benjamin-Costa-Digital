"use client";

import { useEffect, useRef } from "react";
import { ArrowIcon } from "@/components/ui/arrow-icon";

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);

  // The header sits over every section, so it takes on the theme of the
  // section currently underneath it.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // Sample the content just below the header's bottom edge.
      const probe = header.getBoundingClientRect().bottom + 1;
      const darkSections = document.querySelectorAll<HTMLElement>(
        "[data-header-theme='dark']",
      );
      const isDark = Array.from(darkSections).some((section) => {
        const { top, bottom } = section.getBoundingClientRect();
        return top <= probe && bottom > probe;
      });
      header.dataset.theme = isDark ? "dark" : "light";
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
    <header ref={headerRef} className="site-header" data-theme="light">
      <div className="container site-header__inner">
        <p className="site-header__tagline">Web &amp; Automation — Gold Coast, AU</p>
        <nav className="site-header__nav" aria-label="Primary navigation">
          <a className="text-link" href="#contact">
            <span className="text-link__label">Let’s talk</span>
            <ArrowIcon direction="up-right" />
          </a>
        </nav>
      </div>
    </header>
  );
}
