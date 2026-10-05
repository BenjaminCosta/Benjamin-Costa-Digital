"use client";

import { useEffect } from "react";

/**
 * Fades sections in as they enter the viewport. Elements already visible on
 * load are left alone, so content never flashes or depends on JS to appear.
 */
export function RevealObserver() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.reveal = "in";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    for (const element of elements) {
      if (element.getBoundingClientRect().top < window.innerHeight) continue;
      element.dataset.reveal = "pending";
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
