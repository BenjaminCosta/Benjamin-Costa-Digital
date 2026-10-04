"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { ButtonLink } from "@/components/ui/button-link";
import { MediaSlot } from "@/components/ui/media-slot";
import type { Project } from "@/types/content";

type WorkShowcaseProps = Readonly<{
  projects: readonly Project[];
  total: number;
}>;

const pad = (value: number) => String(value).padStart(2, "0");

export function WorkShowcase({ projects, total }: WorkShowcaseProps) {
  const trackRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const slides = Array.from(track.children) as HTMLElement[];
      const origin = slides[0]?.offsetLeft ?? 0;
      let closest = 0;
      let closestDistance = Infinity;
      for (const [index, slide] of slides.entries()) {
        const distance = Math.abs(slide.offsetLeft - origin - track.scrollLeft);
        if (distance < closestDistance) {
          closest = index;
          closestDistance = distance;
        }
      }
      setActive(closest);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    track.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", schedule);
    };
  }, []);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const target = slides[index];
    if (!target) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: target.offsetLeft - slides[0].offsetLeft,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, []);

  const current = projects[active];
  const upcoming = [1, 2]
    .map((offset) => (active + offset) % projects.length)
    .filter((index, position, list) => index !== active && list.indexOf(index) === position);

  return (
    <>
      <div className="page-container indexed work__head">
        <div className="section-head">
          <p className="mono-label section-head__label">
            <span className="section-head__index">03</span>
            <span className="section-head__sep" aria-hidden="true">
              {" / "}
            </span>
            Selected work
          </p>
          <p className="mono-label section-head__aside" aria-live="polite" aria-atomic="true">
            <span className="visually-hidden">Project </span>
            {pad(active + 1)} / {pad(total)}
          </p>
        </div>

        <div className="work__intro">
          <h2 id="work-title" className="display display--work">
            <span>A few things</span> <span>I’ve built.</span>
          </h2>
          <div className="work__controls">
            <button
              type="button"
              className="round-button"
              onClick={() => goTo(active - 1)}
              disabled={active === 0}
              aria-label="Previous project"
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              className="round-button round-button--primary"
              onClick={() => goTo(active + 1)}
              disabled={active === projects.length - 1}
              aria-label="Next project"
            >
              <ArrowIcon direction="right" />
            </button>
            <p className="work__counter only-desktop" aria-live="polite" aria-atomic="true">
              <span className="visually-hidden">Project </span>
              {pad(active + 1)} / {pad(total)}
            </p>
          </div>
        </div>
      </div>

      <div className="work__stage">
        <ol ref={trackRef} className="work__track" aria-label="Project images">
          {projects.map((project, index) => (
            <li
              key={project.id}
              className="work__slide"
              aria-label={`${project.name}, ${index + 1} of ${projects.length}`}
            >
              <MediaSlot
                slot={project.name}
                image={project.image}
                className="work__media"
                sizes="(min-width: 64rem) 56vw, 80vw"
              />
            </li>
          ))}
        </ol>

        <div className="page-container work__details">
          <article className="work__current" aria-labelledby="work-current-title">
            <h3 id="work-current-title" className="work__name">
              {current.name}
            </h3>
            <p className="work__location">
              {current.category ? (
                <span className="only-desktop">{current.category} — </span>
              ) : null}
              {current.location}
            </p>
            <ul className="work__services" aria-label="Services">
              {current.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
            <div className="work__progress only-desktop" aria-hidden="true">
              <span
                style={{
                  width: `${100 / projects.length}%`,
                  transform: `translateX(${active * 100}%)`,
                }}
              />
            </div>
            <p className="work__summary">
              {current.description ? (
                <>
                  <span className="only-mobile">{current.summary}</span>
                  <span className="only-desktop">{current.description}</span>
                </>
              ) : (
                current.summary
              )}
            </p>
            <ButtonLink
              href={current.href}
              arrow="up-right"
              className="work__cta"
              pendingLabel="Case study coming soon"
            >
              View project
            </ButtonLink>
          </article>

          <ol className="work__next" aria-label="More projects">
            {upcoming.map((index) => {
              const project = projects[index];
              return (
                <li key={project.id}>
                  <button type="button" onClick={() => goTo(index)}>
                    <MediaSlot
                      slot={project.name}
                      image={project.image}
                      className="work__next-media only-desktop"
                      sizes="16rem"
                      as="span"
                    />
                    <span className="work__next-index">{pad(index + 1)}</span>
                    <span className="work__next-name">{project.name}</span>
                    <span className="work__next-location">{project.location}</span>
                    <span className="work__next-services">
                      {project.services.map((service) => (
                        <span key={service}>{service}</span>
                      ))}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
