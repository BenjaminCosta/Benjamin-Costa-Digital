"use client";

import { useEffect, useRef } from "react";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { site } from "@/data/site-content";

const menu = [
  { href: "#work", label: "Work" },
  { href: "#feedback", label: "Reviews" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);

  // The header sits over every section, so it takes on the theme of the
  // section underneath it. At the very top it turns transparent so the
  // desktop hero image can run up behind it.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.scrollY < 8) {
        header.dataset.theme = "top";
        return;
      }
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
    <header ref={headerRef} className="site-header" data-theme="top">
      <div className="site-header__inner">
        <p className="site-header__tagline only-mobile">{site.tagline}</p>
        <nav className="site-header__nav" aria-label="Primary navigation">
          <div className="site-header__primary only-desktop">
            <a className="site-header__brand" href="#main-content">
              {site.name}
            </a>
            <ul className="site-header__menu">
              {menu.map((item) => (
                <li key={item.href}>
                  <a className="site-header__link" href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <p className="site-header__location only-desktop">{site.location}</p>
          <a className="text-link site-header__cta" href="#contact">
            <span className="text-link__label">Let’s talk</span>
            <ArrowIcon direction="up-right" />
          </a>
        </nav>
      </div>
    </header>
  );
}
