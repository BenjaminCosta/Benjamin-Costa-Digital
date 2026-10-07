"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { getProjectIndex, getSwipeStep } from "@/lib/work-navigation";

type WorkShowcaseProps = Readonly<{
  projectNames: readonly string[];
  heading: ReactNode;
  slides: readonly ReactNode[];
  selectors: readonly ReactNode[];
}>;

type Phase = "idle" | "loading" | "exit" | "enter";
const pad = (value: number) => String(value).padStart(2, "0");

function pause(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const cancel = () => {
      window.clearTimeout(timer);
      reject(new DOMException("Cancelled", "AbortError"));
    };
    const timer = window.setTimeout(() => {
      signal.removeEventListener("abort", cancel);
      resolve();
    }, ms);
    signal.addEventListener("abort", cancel, { once: true });
  });
}

function prepareImage(image: HTMLImageElement, signal: AbortSignal) {
  image.loading = "eager";
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      window.clearTimeout(timer);
      image.removeEventListener("load", ready);
      image.removeEventListener("error", failed);
      signal.removeEventListener("abort", cancelled);
    };
    const ready = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error("Preview unavailable")); };
    const cancelled = () => { cleanup(); reject(new DOMException("Cancelled", "AbortError")); };
    const timer = window.setTimeout(failed, 8000);
    image.addEventListener("load", ready, { once: true });
    image.addEventListener("error", failed, { once: true });
    signal.addEventListener("abort", cancelled, { once: true });
    if (image.complete) {
      if (image.naturalWidth) ready();
      else failed();
    }
  });
}

/** Server-rendered slides, with a small client controller. No autoplay or scroll loop. */
export function WorkShowcase({ projectNames, heading, slides, selectors }: WorkShowcaseProps) {
  const viewportRef = useRef<HTMLOListElement>(null);
  const selectorsRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const busyRef = useRef(false);
  const gestureRef = useRef<{ x: number; y: number; pointerId: number } | null>(null);
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const total = projectNames.length;
  const busy = phase !== "idle";

  useEffect(() => () => requestRef.current?.abort(), []);

  const warm = useCallback((index: number) => {
    const slide = viewportRef.current?.children[getProjectIndex(index, total)];
    slide?.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
      image.loading = "eager";
    });
  }, [total]);

  const choose = useCallback(async (index: number) => {
    const next = getProjectIndex(index, total);
    if (!total || next === active || busyRef.current) return;
    const slide = viewportRef.current?.children[next];
    if (!slide) return;

    busyRef.current = true;
    requestRef.current?.abort();
    const request = new AbortController();
    requestRef.current = request;
    const { signal } = request;
    setError("");
    setPhase("loading");

    try {
      // Keep the current project visible until the requested media is ready.
      await Promise.all(Array.from(slide.querySelectorAll<HTMLImageElement>("img"))
        .map((image) => prepareImage(image, signal)));
      if (signal.aborted) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        setPhase("exit");
        await pause(160, signal);
      }

      // Never overlap two projects: hide the old slide before entering the new one.
      const focused = document.activeElement;
      if (focused instanceof HTMLElement && viewportRef.current?.contains(focused)) {
        viewportRef.current.focus({ preventScroll: true });
      }
      setActive(next);
      setPhase(reduce ? "idle" : "enter");
      const selector = selectorsRef.current?.children[next] as HTMLElement | undefined;
      if (selector && selectorsRef.current) {
        const rail = selectorsRef.current;
        const left = selector.offsetLeft - rail.offsetLeft;
        if (left < rail.scrollLeft || left + selector.offsetWidth > rail.scrollLeft + rail.clientWidth) {
          rail.scrollTo({ left: left - (rail.clientWidth - selector.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
        }
      }
      if (!reduce) await pause(340, signal);
      setPhase("idle");
    } catch {
      if (!signal.aborted) {
        setError("That preview couldn’t load. Please try again or choose another project.");
        setPhase("idle");
      }
    } finally {
      if (!signal.aborted) busyRef.current = false;
    }
  }, [active, total]);

  function onKeyDown(event: KeyboardEvent<HTMLOListElement>) {
    const indices: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: total - 1 };
    const index = indices[event.key];
    if (index === undefined) return;
    event.preventDefault();
    void choose(index);
  }

  function onPointerDown(event: PointerEvent<HTMLOListElement>) {
    if (event.button !== 0) return;
    gestureRef.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  }

  function onPointerUp(event: PointerEvent<HTMLOListElement>) {
    const start = gestureRef.current;
    gestureRef.current = null;
    if (!start || start.pointerId !== event.pointerId) return;
    const step = getSwipeStep(start, { x: event.clientX, y: event.clientY });
    if (step) void choose(active + step);
  }

  if (!total) return null;

  const arrows = (
    <>
      <button type="button" className="round-button sw-arrow" aria-label="Previous project"
        aria-controls="work-projects" disabled={busy || total < 2}
        onPointerEnter={() => warm(active - 1)} onFocus={() => warm(active - 1)}
        onClick={() => void choose(active - 1)}>
        <ArrowIcon direction="left" />
      </button>
      <button type="button" className="round-button round-button--primary sw-arrow" aria-label="Next project"
        aria-controls="work-projects" disabled={busy || total < 2}
        onPointerEnter={() => warm(active + 1)} onFocus={() => warm(active + 1)}
        onClick={() => void choose(active + 1)}>
        <ArrowIcon direction="right" />
      </button>
    </>
  );

  return (
    <div className="sw-shell" role="group" aria-roledescription="carousel" aria-label="Selected projects">
      <div className="sw-topline">
        <p className="mono-label sw-label">03 <span aria-hidden="true"> / </span> Selected work</p>
        <div className="sw-navigation">
          <p className="mono-label sw-counter" aria-hidden="true">{pad(active + 1)} / {pad(total)}</p>
          <div className="sw-desktop-arrows">{arrows}</div>
        </div>
      </div>
      <div className="sw-body">
        {heading}
        <ol ref={viewportRef} id="work-projects" className="sw-viewport" tabIndex={0}
          aria-label="Projects. Use arrow keys or swipe to change project." aria-busy={busy}
          data-phase={phase} onKeyDown={onKeyDown} onPointerDown={onPointerDown}
          onPointerUp={onPointerUp} onPointerCancel={() => { gestureRef.current = null; }}>
          {slides.map((slide, index) => (
            <li key={projectNames[index]} className="sw-slide" hidden={index !== active}
              inert={index !== active} aria-hidden={index !== active}
              aria-roledescription="slide" aria-label={projectNames[index] + ", " + (index + 1) + " of " + total}>
              {slide}
            </li>
          ))}
        </ol>
        <div className="sw-mobile-arrows">{arrows}</div>
      </div>
      <p className="sw-error" role="status">{error}</p>
      <p className="visually-hidden" aria-live="polite" aria-atomic="true">
        {projectNames[active] + ". Project " + (active + 1) + " of " + total + "."}
      </p>
      <div ref={selectorsRef} className="sw-selectors" role="group" aria-label="Choose a project">
        {selectors.map((selector, index) => (
          <button key={projectNames[index]} type="button" className="sw-selector"
            aria-label={"Show " + projectNames[index] + " project"} aria-pressed={index === active}
            aria-controls="work-projects" disabled={busy}
            onPointerEnter={() => warm(index)} onFocus={() => warm(index)} onClick={() => void choose(index)}>
            {selector}
          </button>
        ))}
      </div>
    </div>
  );
}
