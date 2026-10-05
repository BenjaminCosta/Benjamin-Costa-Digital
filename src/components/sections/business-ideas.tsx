"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { ButtonLink } from "@/components/ui/button-link";
import { IdeaIcon } from "@/components/ui/idea-icon";
import { ideaOptions, ideasCopy, sampleIdeas } from "@/data/site-content";
import type { IdeaOption } from "@/types/content";

/*
 * One block that changes state in place:
 *   select → opportunities + link → loading → results + CTA
 * Nothing navigates. The chosen option rises into a compact bar, the rest
 * fades, new content enters 12px from below and the block eases to its new
 * height.
 */

type View = "select" | "answers" | "loading" | "results";

/** Durations in ms, matched to the CSS. */
const TIMING = Object.freeze({
  press: 200,
  exit: 180,
  submitLabel: 200,
});

/** Layout preview only: step timing until the real request drives progress. */
const PREVIEW_STEP_MS = 700;

const pad = (value: number) => String(value).padStart(2, "0");

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const headerBottom = () =>
  document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;

/**
 * The browser's scroll anchoring would "correct" the page while the block
 * changes height, fighting our own scrolling. Pause it for the transition.
 */
let anchorTimer: number | undefined;
function pauseScrollAnchoring(ms = 900) {
  const root = document.documentElement;
  root.style.overflowAnchor = "none";
  window.clearTimeout(anchorTimer);
  anchorTimer = window.setTimeout(() => {
    root.style.overflowAnchor = "";
  }, ms);
}

/** "That's normal. Show me…" → headline "That's normal." + the rest. */
function splitIntro(intro: string) {
  const text = intro.replace(/:\s*$/, "");
  const stop = text.indexOf(". ");
  if (stop === -1) return { headline: text, rest: "" };
  return { headline: text.slice(0, stop + 1), rest: text.slice(stop + 2) };
}

const vars = (values: Record<string, number>) => values as CSSProperties;

function GlassStack() {
  return (
    <div className="glass-stack" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

export function BusinessIdeas() {
  const [view, setView] = useState<View>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exitTo, setExitTo] = useState<View | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [openIdea, setOpenIdea] = useState(0);

  const stageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sectionTitleRef = useRef<HTMLHeadingElement>(null);
  const contextRef = useRef<HTMLTextAreaElement>(null);
  const flipFrom = useRef<DOMRect | null>(null);
  const sheenFrame = useRef(0);
  const timers = useRef(new Set<number>());
  const shownView = useRef<View>("select");

  const selected = ideaOptions.find((option) => option.id === selectedId) ?? null;
  const busy = exitTo !== null || submitting;

  /** Runs after `ms`; motion-only delays collapse to 0 with reduced motion. */
  const later = useCallback((callback: () => void, ms: number, motionOnly = true) => {
    const delay = motionOnly && reducedMotion() ? 0 : ms;
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      callback();
    }, delay);
    timers.current.add(id);
  }, []);

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current.clear();
  }, []);

  useEffect(
    () => () => {
      clearTimers();
      cancelAnimationFrame(sheenFrame.current);
    },
    [clearTimers],
  );

  // The block eases to the height of whatever it currently holds.
  useEffect(() => {
    const stage = stageRef.current;
    const inner = innerRef.current;
    if (!stage || !inner) return;
    const observer = new ResizeObserver(() => {
      stage.style.height = `${inner.offsetHeight}px`;
    });
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  // After each state change: keep the new content in view (only as much as
  // needed), move focus to its heading, and let the chosen option rise into
  // the compact bar.
  useLayoutEffect(() => {
    if (shownView.current === view) return;
    shownView.current = view;

    pauseScrollAnchoring();
    const from = flipFrom.current;
    flipFrom.current = null;
    const bar = barRef.current;

    if (view === "answers" && bar) {
      const limit = headerBottom() + 16;
      let to = bar.getBoundingClientRect();
      if (to.top < limit) {
        window.scrollBy({ top: to.top - limit, behavior: "instant" });
        to = bar.getBoundingClientRect();
      }
      if (from && !reducedMotion()) {
        const end = getComputedStyle(bar);
        bar.animate(
          [
            {
              transform: `translate(${from.left - to.left}px, ${from.top - to.top}px)`,
              backgroundColor: "#0a0a0a",
              borderColor: "#0a0a0a",
              color: "#f2f0ea",
            },
            {
              transform: "translate(0, 0)",
              backgroundColor: end.backgroundColor,
              borderColor: end.borderColor,
              color: end.color,
            },
          ],
          { duration: 380, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
      }
    } else {
      // Scroll only as much as needed to show the new heading below the header.
      const target = view === "select" ? sectionTitleRef.current : headingRef.current;
      const rect = target?.getBoundingClientRect();
      const limit = headerBottom() + 16;
      if (rect && (rect.top < limit || rect.bottom > window.innerHeight)) {
        const delta = rect.top < limit ? rect.top - limit : rect.bottom - window.innerHeight + 16;
        window.scrollBy({ top: delta, behavior: reducedMotion() ? "instant" : "smooth" });
      }
    }

    if (view === "select") {
      innerRef.current?.querySelector<HTMLButtonElement>(".idea-option")?.focus({ preventScroll: true });
    } else {
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [view]);

  const choose = (option: IdeaOption, event: MouseEvent<HTMLButtonElement>) => {
    if (busy) return;
    const row = event.currentTarget;
    setSelectedId(option.id);
    setExitTo("answers");
    later(() => {
      flipFrom.current = row.getBoundingClientRect();
      setContextOpen(false);
      setExitTo(null);
      setView("answers");
    }, TIMING.press);
  };

  const restart = () => {
    clearTimers();
    setSubmitting(false);
    setExitTo("select");
    later(() => {
      setExitTo(null);
      setSelectedId(null);
      setProgress(0);
      setView("select");
    }, TIMING.exit);
  };

  // Layout preview: the real request (option, link, context) replaces the
  // timers below; it should advance `progress` (0–3) and then show results.
  const showResults = () => {
    setExitTo("results");
    later(() => {
      setExitTo(null);
      setOpenIdea(0);
      setView("results");
    }, TIMING.exit);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setSubmitting(true);
    later(() => setExitTo("loading"), TIMING.submitLabel);
    later(() => {
      setExitTo(null);
      setSubmitting(false);
      setProgress(0);
      setView("loading");
      ideasCopy.loadingSteps.forEach((_, index) => {
        later(() => setProgress(index + 1), PREVIEW_STEP_MS * (index + 1) - 150, false);
      });
      later(showResults, PREVIEW_STEP_MS * ideasCopy.loadingSteps.length + 250, false);
    }, TIMING.submitLabel + TIMING.exit);
  };

  const toggleContext = () => {
    const next = !contextOpen;
    setContextOpen(next);
    // Wait for the panel to lose `inert` before moving focus into it.
    if (next) requestAnimationFrame(() => contextRef.current?.focus({ preventScroll: true }));
  };

  // A faint reflection follows the pointer across glass cards (desktop),
  // updated at most once per frame.
  const trackSheen = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || sheenFrame.current) return;
    const card = (event.target as HTMLElement).closest<HTMLElement>("[data-sheen]");
    if (!card) return;
    const { clientX, clientY } = event;
    sheenFrame.current = requestAnimationFrame(() => {
      sheenFrame.current = 0;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${clientX - rect.left}px`);
      card.style.setProperty("--my", `${clientY - rect.top}px`);
    });
  };

  const intro = selected ? splitIntro(selected.intro) : null;
  const direct = Boolean(selected?.direct);
  const barLeaving = exitTo === "select" || exitTo === "results";

  return (
    <div className="ideas__tool" data-view={view}>
      <div className="ideas__intro">
        <h2 ref={sectionTitleRef} id="ideas-title" className="display display--ideas">
          {ideasCopy.title}
        </h2>
        <p className="ideas__lede">{ideasCopy.lede}</p>
      </div>

      <div ref={stageRef} className="ideas-stage">
        <div ref={innerRef} className="ideas-stage__inner" onPointerMove={trackSheen}>
          {selected && (view === "answers" || view === "loading") ? (
            <div ref={barRef} className="ideas-bar" data-leaving={barLeaving || undefined}>
              <IdeaIcon name={selected.icon} />
              <span className="ideas-bar__label">{selected.label}</span>
              <button
                type="button"
                className="ideas-bar__close"
                onClick={restart}
                aria-label={ideasCopy.changeOption}
              >
                <IdeaIcon name="close" />
              </button>
            </div>
          ) : null}

          <div
            key={view}
            className="ideas-stage__body"
            data-leaving={(exitTo && exitTo !== "answers") || undefined}
          >
            {view === "select" ? (
              <ul className="idea-options" data-choosing={exitTo === "answers" || undefined}>
                {ideaOptions.map((option, index) => (
                  <li
                    key={option.id}
                    style={vars({ "--i": index })}
                    data-chosen={(exitTo === "answers" && option.id === selectedId) || undefined}
                  >
                    <button
                      type="button"
                      className="idea-option"
                      data-sheen
                      onClick={(event) => choose(option, event)}
                    >
                      <IdeaIcon name={option.icon} />
                      <span className="idea-option__label">{option.label}</span>
                      <ArrowIcon />
                      <IdeaIcon name="check" className="idea-option__check" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}

            {view === "answers" && selected && intro ? (
              <>
                <h3 ref={headingRef} tabIndex={-1} className="ideas-step__title ideas-enter">
                  {intro.headline}
                </h3>
                {intro.rest ? <p className="ideas-step__intro ideas-enter">{intro.rest}</p> : null}

                {selected.answers.length > 0 ? (
                  <ul className="idea-opps">
                    {selected.answers.map((answer, index) => (
                      <li
                        key={answer.title}
                        className="idea-opp"
                        data-sheen
                        style={vars({ "--i": index })}
                      >
                        <IdeaIcon name={answer.icon} />
                        <div>
                          <h4>{answer.title}</h4>
                          <p>{answer.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <form
                  className="ideas-form"
                  onSubmit={handleSubmit}
                  style={vars({ "--i": selected.answers.length })}
                >
                  {direct ? null : <h4 className="ideas-form__title">{ideasCopy.formTitle}</h4>}

                  <label className="ideas-form__label" htmlFor="ideas-link">
                    {ideasCopy.linkLabel}
                  </label>
                  <div className="ideas-form__field">
                    <IdeaIcon name="link" />
                    <input
                      id="ideas-link"
                      name="link"
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder={ideasCopy.linkPlaceholder}
                      aria-describedby="ideas-link-note"
                      required
                    />
                  </div>
                  <p id="ideas-link-note" className="ideas-form__note">
                    {ideasCopy.linkNote}
                  </p>

                  <div className="ideas-context" data-open={contextOpen || undefined}>
                    <button
                      type="button"
                      className="ideas-context__toggle"
                      aria-expanded={contextOpen}
                      aria-controls="ideas-context-panel"
                      onClick={toggleContext}
                    >
                      <span>{ideasCopy.contextToggle}</span>
                      <IdeaIcon name="plus" />
                    </button>
                    <div id="ideas-context-panel" className="expand" inert={!contextOpen}>
                      <div className="expand__inner">
                        <div className="ideas-context__body">
                          <label htmlFor="ideas-context">{ideasCopy.contextLabel}</label>
                          <textarea
                            ref={contextRef}
                            id="ideas-context"
                            name="context"
                            rows={3}
                            maxLength={ideasCopy.contextMax}
                            placeholder={ideasCopy.contextPlaceholder}
                            aria-describedby="ideas-context-help"
                          />
                          <p id="ideas-context-help" className="ideas-form__note">
                            {ideasCopy.contextHelp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="button button--dark ideas-form__submit"
                    disabled={submitting}
                    aria-live="polite"
                  >
                    <span>
                      {submitting
                        ? ideasCopy.submitting
                        : direct
                          ? ideasCopy.submitDirect
                          : ideasCopy.submit}
                    </span>
                    <ArrowIcon />
                  </button>

                  <div className="ideas-form__aside">
                    <span className="text-link text-link--underlined" data-pending>
                      <span className="text-link__label">{ideasCopy.talkInstead}</span>
                      <ArrowIcon direction="up-right" />
                    </span>
                    <p className="ideas-form__micro">{ideasCopy.microcopy}</p>
                  </div>
                </form>
              </>
            ) : null}

            {view === "loading" ? (
              <div className="ideas-loading">
                <h3 ref={headingRef} tabIndex={-1} className="ideas-step__title ideas-enter">
                  {ideasCopy.loadingTitle}
                </h3>
                <div className="ideas-loading__visual ideas-enter">
                  <GlassStack />
                  <ol className="ideas-loading__steps">
                    {ideasCopy.loadingSteps.map((step, index) => (
                      <li
                        key={step}
                        data-state={
                          index < progress ? "done" : index === progress ? "active" : "pending"
                        }
                      >
                        <span className="ideas-loading__mark" aria-hidden="true">
                          <IdeaIcon name="check" />
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <p className="visually-hidden" role="status">
                  {ideasCopy.loadingSteps[Math.min(progress, ideasCopy.loadingSteps.length - 1)]}
                </p>
              </div>
            ) : null}

            {view === "results" ? (
              <>
                <h3 ref={headingRef} tabIndex={-1} className="ideas-step__title ideas-enter">
                  {ideasCopy.resultsTitle}
                </h3>
                <p className="ideas-results__lede ideas-enter">
                  {ideasCopy.resultsLede(sampleIdeas.business)}
                </p>
                <p className="ideas-results__source ideas-enter">
                  <IdeaIcon name="search" />
                  {ideasCopy.resultsSource}
                </p>

                <ol className="idea-results">
                  {sampleIdeas.ideas.map((idea, index) => {
                    const open = openIdea === index;
                    const panelId = `idea-panel-${idea.id}`;
                    return (
                      <li
                        key={idea.id}
                        className="idea-result"
                        data-open={open || undefined}
                        data-sheen
                        style={vars({ "--i": index })}
                      >
                        <h4 className="idea-result__heading">
                          <button
                            type="button"
                            aria-expanded={open}
                            aria-controls={panelId}
                            onClick={() => setOpenIdea(open ? -1 : index)}
                          >
                            <span className="idea-result__num">{pad(index + 1)}</span>
                            <span className="idea-result__title">{idea.title}</span>
                            <IdeaIcon name="plus" />
                          </button>
                        </h4>
                        <div id={panelId} className="expand" inert={!open}>
                          <div className="expand__inner">
                            <div className="idea-result__body">
                              <p className="idea-result__summary">{idea.summary}</p>
                              {idea.basis ? (
                                <p className="idea-result__basis">{ideasCopy.basis[idea.basis]}</p>
                              ) : null}
                              <div className="idea-result__build">
                                <IdeaIcon name="cube" />
                                <div>
                                  <p className="idea-result__build-label">{ideasCopy.buildLabel}</p>
                                  <p className="idea-result__build-text">{idea.build}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                <div className="ideas-close" style={vars({ "--i": sampleIdeas.ideas.length })}>
                  <h4 className="ideas-close__title">{ideasCopy.closeTitle}</h4>
                  <p className="ideas-close__text">{ideasCopy.closeText}</p>
                  <ButtonLink
                    className="ideas-close__cta"
                    arrow="up-right"
                    pendingLabel="WhatsApp link coming soon"
                  >
                    <IdeaIcon name="whatsapp" />
                    {ideasCopy.closeCta}
                  </ButtonLink>
                  <p className="ideas-close__note">{ideasCopy.closeNote}</p>
                  <button type="button" className="ideas-restart" onClick={restart}>
                    <IdeaIcon name="restart" />
                    <span>{ideasCopy.restart}</span>
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
