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
import { BrandLogo } from "@/components/ui/brand-logo";
import { GlassIcon, prefetchGlassIcons } from "@/components/ui/glass-icon";
import { IdeaIcon } from "@/components/ui/idea-icon";
import { SectionHead } from "@/components/ui/section-head";
import { ideaOptions, ideasCopy } from "@/data/site-content";
import { brandIn, buildSteps, ideaBrand } from "@/components/business-ideas/presentation";
import { useBusinessIdeas, type BusinessIdeasProps } from "@/components/business-ideas/use-business-ideas";
import type { IdeaOption } from "@/types/content";
import type { Opportunity } from "@/types/business-ideas";

/*
 * One block that changes state in place:
 *   select → opportunities + link → loading → results + CTA
 * Nothing navigates. The chosen option's icon flies up to head the next
 * step, the rest fades, new content enters 12px from below and the block
 * eases to its new height.
 */

type View = "select" | "answers" | "loading" | "results";

/** Durations in ms, matched to the CSS. */
const TIMING = Object.freeze({
  press: 200,
  exit: 180,
  submitLabel: 200,
  /** When the loading steps tick over; the last one waits for the answer. */
  steps: [2400, 6000],
  /** A beat with every step ticked before the results replace them. */
  settle: 450,
  /** After this long, a quiet line says it's still working. */
  slow: 15000,
});

const pad = (value: number) => String(value).padStart(2, "0");

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const headerBottom = () =>
  document.querySelector(".site-header")?.getBoundingClientRect().bottom ?? 0;

/**
 * While the block changes height (see globals.css, body[data-block-moving]):
 * scroll anchoring is paused, so the browser doesn't "correct" the page
 * against our own scrolling, and everything below the block rides on its own
 * layers, so moving it each frame doesn't repaint it. Set on <body>: any
 * style change on <html> would restyle the whole document.
 */
let movingTimer: number | undefined;
function holdWhileMoving(ms = 900) {
  const { body } = document;
  body.dataset.blockMoving = "";
  window.clearTimeout(movingTimer);
  movingTimer = window.setTimeout(() => {
    delete body.dataset.blockMoving;
  }, ms);
}

const vars = (values: Record<string, number>) => values as CSSProperties;

/** The idea's mark: the official logo of the platform or tool behind it. */
function IdeaMark({ idea }: Readonly<{ idea: Opportunity }>) {
  return (
    <span className="idea-result__mark" aria-hidden="true">
      <BrandLogo brand={ideaBrand(idea.title, idea.area)} />
    </span>
  );
}

export function BusinessIdeas(props: BusinessIdeasProps) {
  const tool = useBusinessIdeas(props);
  const [view, setView] = useState<View>("select");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [exitTo, setExitTo] = useState<View | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [slow, setSlow] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sectionTitleRef = useRef<HTMLHeadingElement>(null);
  const contextRef = useRef<HTMLTextAreaElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);
  const flipFrom = useRef<DOMRect | null>(null);
  const sheenFrame = useRef(0);
  const timers = useRef(new Set<number>());
  const shownView = useRef<View>("select");

  const selected = ideaOptions.find((option) => option.id === selectedId) ?? null;
  const busy = exitTo !== null || submitting;
  const result = tool.state.status === "success" ? tool.state.result : null;

  useEffect(() => {
    if (view === "answers" && tool.state.status === "error") errorRef.current?.focus();
  }, [view, tool.state]);

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
      const height = `${inner.offsetHeight}px`;
      if (stage.style.height === height) return;
      // Not on the first measure: the page is still loading, nothing moves.
      if (stage.style.height) holdWhileMoving();
      stage.style.height = height;
    });
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  // After each state change: keep the new content in view (only as much as
  // needed), move focus to its heading, and fly the chosen option's icon up
  // to head the next step.
  useLayoutEffect(() => {
    if (shownView.current === view) return;
    shownView.current = view;

    holdWhileMoving();
    const from = flipFrom.current;
    flipFrom.current = null;

    if (view === "answers" && topRef.current) {
      // Start the step at the top of the section, right under the header.
      const section = topRef.current.closest("section") ?? topRef.current;
      const limit = headerBottom();
      const top = section.getBoundingClientRect().top;
      if (Math.abs(top - limit) > 1) window.scrollBy({ top: top - limit, behavior: "instant" });

      const mark = markRef.current;
      if (from && mark && !reducedMotion()) {
        const to = mark.getBoundingClientRect();
        mark.animate(
          [
            {
              transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`,
            },
            { transform: "translate(0, 0) scale(1)" },
          ],
          { duration: 460, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
        );
      }
    } else {
      // Scroll only as much as needed to show the new heading below the header
      // (for loading, the whole glass stack, layers included).
      const target =
        view === "select" ? sectionTitleRef.current : view === "loading" ? loadingRef.current : headingRef.current;
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

  // Fetch a step's icons on intent (hover, touch, focus), before the click.
  const prefetched = useRef(new Set<string>());
  const prefetchAnswers = (option: IdeaOption) => {
    if (prefetched.current.has(option.id)) return;
    prefetched.current.add(option.id);
    prefetchGlassIcons(option.answers.map((answer) => answer.icon));
  };

  const choose = (option: IdeaOption, event: MouseEvent<HTMLButtonElement>) => {
    if (busy) return;
    const icon = event.currentTarget.querySelector(".glass-icon");
    setSelectedId(option.id);
    tool.resetRequest();
    tool.setSelectedGoalId(option.id);
    setExitTo("answers");
    later(() => {
      flipFrom.current = icon?.getBoundingClientRect() ?? null;
      setContextOpen(false);
      setExitTo(null);
      setView("answers");
    }, TIMING.press);
  };

  const restart = () => {
    clearTimers();
    tool.resetRequest();
    setSubmitting(false);
    setExitTo("select");
    later(() => {
      setExitTo(null);
      setSelectedId(null);
      setView("select");
    }, TIMING.exit);
  };

  // Only a successful, validated API response can enter the results stage.
  const showResults = () => {
    setExitTo("results");
    later(() => {
      setExitTo(null);
      setView("results");
    }, TIMING.exit);
  };

  const cancelLoading = () => {
    clearTimers();
    tool.resetRequest();
    setSubmitting(false);
    setExitTo(null);
    setView("answers");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (!props.available) return;
    setSubmitting(true);
    later(() => setExitTo("loading"), TIMING.submitLabel);
    later(async () => {
      setExitTo(null);
      setSubmitting(false);
      setLoadingStep(0);
      setSlow(false);
      setView("loading");
      for (const [index, at] of TIMING.steps.entries()) {
        later(() => setLoadingStep((step) => Math.max(step, index + 1)), at, false);
      }
      later(() => setSlow(true), TIMING.slow, false);
      const response = await tool.submit();
      if (!response) return; // Cancelled or superseded: never resurrect stale UI.
      if (response.status === "success") {
        clearTimers();
        setLoadingStep(TIMING.steps.length + 1);
        later(showResults, TIMING.settle);
      } else {
        clearTimers();
        if (response.status === "error" && response.code === "needs-context") setContextOpen(true);
        setView("answers");
      }
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

  const direct = Boolean(selected?.direct);
  const submitLabel = submitting ? ideasCopy.submitting : direct ? ideasCopy.submitDirect : ideasCopy.submit;
  const steps = [
    tool.businessLink.trim() ? ideasCopy.loadingSteps.website : ideasCopy.loadingSteps.description,
    ideasCopy.loadingSteps.understand,
    ideasCopy.loadingSteps.ideas,
  ];
  const ready = loadingStep >= steps.length;
  const stepState = (index: number) =>
    index < loadingStep ? "done" : index === loadingStep ? "active" : "pending";

  return (
    <>
      {/* On phones the way back sits beside the section label, as in an app */}
      <div ref={topRef} className="ideas__head" data-view={view}>
        {view === "answers" ? (
          <button
            type="button"
            className="ideas-back ideas-back--head ideas-enter"
            onClick={restart}
            aria-label={ideasCopy.changeOption}
          >
            <IdeaIcon name="back" />
          </button>
        ) : null}
        <SectionHead index="02" title="Business ideas" />
      </div>

      <div className="ideas__tool" data-view={view}>
        <div className="ideas__intro">
          <h2 ref={sectionTitleRef} id="ideas-title" className="display display--ideas">
            {ideasCopy.title}
          </h2>
          <p className="ideas__lede">{ideasCopy.lede}</p>
        </div>

        <div ref={stageRef} className="ideas-stage">
          <div ref={innerRef} className="ideas-stage__inner" onPointerMove={trackSheen}>
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
                        onPointerEnter={() => prefetchAnswers(option)}
                        onPointerDown={() => prefetchAnswers(option)}
                        onFocus={() => prefetchAnswers(option)}
                        onClick={(event) => choose(option, event)}
                      >
                        <GlassIcon name={option.icon} size={84} />
                        <span className="idea-option__label">{option.label}</span>
                        <ArrowIcon />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}

              {view === "answers" && selected ? (
                <>
                  <div className="ideas-top ideas-enter">
                    <button
                      type="button"
                      className="ideas-back"
                      onClick={restart}
                      aria-label={ideasCopy.changeOption}
                    >
                      <IdeaIcon name="back" />
                    </button>
                  </div>

                  <span ref={markRef} className="ideas-answers__mark" aria-hidden="true">
                    <GlassIcon name={selected.icon} size={176} />
                  </span>
                  <h3 ref={headingRef} tabIndex={-1} className="ideas-step__title ideas-enter">
                    {selected.label}
                  </h3>
                  <p className="ideas-step__intro ideas-enter">{selected.intro}</p>

                  {selected.answers.length > 0 ? (
                    <ol className="idea-opps">
                      {selected.answers.map((answer, index) => (
                        <li
                          key={answer.title}
                          className="idea-opp"
                          data-sheen
                          style={vars({ "--i": index })}
                        >
                          <span className="idea-opp__num">{pad(index + 1)}</span>
                          <GlassIcon name={answer.icon} size={64} />
                          <div>
                            <h4>{answer.title}</h4>
                            <p>{answer.text}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : null}

                  <form
                    className="ideas-form"
                    onSubmit={handleSubmit}
                    noValidate
                    aria-busy={submitting}
                    style={vars({ "--i": selected.answers.length })}
                  >
                    {direct ? null : <h4 className="ideas-form__title">{ideasCopy.formTitle}</h4>}

                    <label className="visually-hidden" htmlFor="ideas-link">
                      {ideasCopy.linkLabel}
                    </label>
                    <div className="ideas-form__field" data-busy={submitting || undefined}>
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
                        maxLength={2048}
                        value={tool.businessLink}
                        onChange={(event) => { tool.resetRequest(); tool.setBusinessLink(event.target.value); }}
                        aria-invalid={tool.invalidLink}
                        aria-describedby={`ideas-link-note${tool.invalidLink ? " ideas-error" : ""}`}
                      />
                      <button
                        type="submit"
                        className="ideas-form__go"
                        disabled={submitting || !props.available}
                        aria-label={submitLabel}
                        aria-describedby={props.available ? undefined : "ideas-availability"}
                      >
                        {submitting ? <span className="ideas-form__spinner" aria-hidden="true" /> : <ArrowIcon />}
                      </button>
                    </div>
                    <p id="ideas-link-note" className="ideas-form__note">
                      {ideasCopy.linkNote}
                    </p>
                    {tool.state.status === "error" ? (
                      <p id="ideas-error" ref={errorRef} tabIndex={-1} role="alert" className="ideas-form__error">
                        {tool.state.message}
                      </p>
                    ) : null}

                    <div className="ideas-context" data-open={contextOpen || undefined}>
                      <button
                        type="button"
                        className="ideas-context__toggle"
                        aria-expanded={contextOpen}
                        aria-controls="ideas-context-panel"
                        onClick={toggleContext}
                      >
                        <span>{tool.needsContext ? "Add a little context (needed to continue)" : ideasCopy.contextToggle}</span>
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
                              value={tool.description}
                              onChange={(event) => { tool.resetRequest(); tool.setDescription(event.target.value); }}
                              placeholder={ideasCopy.contextPlaceholder}
                              aria-invalid={tool.needsContext}
                              aria-describedby={`ideas-context-help${tool.needsContext ? " ideas-error" : ""}`}
                            />
                            <p id="ideas-context-help" className="ideas-form__note">
                              {ideasCopy.contextHelp}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ideas-form__aside">
                      {tool.contactHref ? <a className="text-link text-link--underlined" href={tool.contactHref} target="_blank" rel="noopener noreferrer">
                        <span className="text-link__label">{ideasCopy.talkInstead}</span>
                        <ArrowIcon direction="up-right" />
                      </a> : null}
                      {props.available ? null : <p id="ideas-availability" className="ideas-form__micro">Personalised ideas aren’t available right now. The instant starting points still work.</p>}
                    </div>
                  </form>
                </>
              ) : null}

              {view === "loading" ? (
                <div ref={loadingRef} className="ideas-loading">
                  <div className="ideas-loading__glass ideas-enter">
                    <span className="ideas-loading__layer" aria-hidden="true" />
                    <span className="ideas-loading__layer" aria-hidden="true" />
                    <div className="ideas-loading__card" data-step={loadingStep}>
                      <div className="ideas-loading__top">
                        <span className="ideas-orb" aria-hidden="true">
                          <span />
                        </span>
                        <span className="ideas-loading__eyebrow">
                          {ready ? "Ready" : "Thinking"}
                        </span>
                      </div>
                      <h3 ref={headingRef} tabIndex={-1} className="ideas-loading__title">
                        {ideasCopy.loadingTitle}
                      </h3>
                      <ol className="ideas-loading__steps">
                        {steps.map((step, index) => (
                          <li key={step.title} data-state={stepState(index)}>
                            <span className="ideas-loading__mark" aria-hidden="true">
                              <IdeaIcon name="check" />
                            </span>
                            <span>
                              <span className="ideas-loading__step">{step.title}</span>
                              <span className="ideas-loading__detail">{step.detail}</span>
                            </span>
                          </li>
                        ))}
                      </ol>
                      <span className="ideas-loading__bar" aria-hidden="true">
                        <span />
                      </span>
                    </div>
                  </div>
                  <p className="ideas-loading__slow" data-shown={(slow && !ready) || undefined} aria-live="polite">
                    {slow && !ready ? "Still working — reading a website can take up to half a minute." : ""}
                  </p>
                  <p className="visually-hidden" role="status">
                    {steps[Math.min(loadingStep, steps.length - 1)].title}
                  </p>
                  <button type="button" className="ideas-restart" onClick={cancelLoading}>
                    Cancel
                  </button>
                </div>
              ) : null}

              {view === "results" && result ? (
                <>
                  <h3 ref={headingRef} tabIndex={-1} className="ideas-step__title ideas-enter">
                    {ideasCopy.resultsTitle}
                  </h3>
                  <p className="ideas-results__lede ideas-enter">
                    {ideasCopy.resultsLede(result.businessName)}
                  </p>
                  <ol className="idea-results">
                    {result.opportunities.map((idea, index) => (
                      <li
                        key={idea.area}
                        className="idea-result"
                        data-sheen
                        style={vars({ "--i": index })}
                      >
                        <div className="idea-result__head">
                          <span className="idea-result__num">{pad(index + 1)}</span>
                          <IdeaMark idea={idea} />
                          <h4 className="idea-result__title">{idea.title}</h4>
                        </div>
                        <div className="idea-result__body">
                          <p className="idea-result__summary">{idea.explanation}</p>
                          <div className="idea-result__build">
                            <p className="idea-result__build-label">{ideasCopy.buildLabel}</p>
                            <ul>
                              {buildSteps(idea.build).map((step) => {
                                const brand = brandIn(step);
                                return (
                                  <li key={step}>
                                    {brand ? <BrandLogo brand={brand} /> : <ArrowIcon />}
                                    <span>{step}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="ideas-results__sources" style={vars({ "--i": result.opportunities.length })}>
                    <p className="ideas-results__source">
                      <IdeaIcon name="search" />
                      {result.source === "website" ? "Based on public website text and your context. Internal systems, analytics and performance haven’t been checked." : "Based on your description only. No website or Google profile was analysed."}
                    </p>
                    {result.sourceLinks?.length ? <div className="ideas-results__pages">
                      <p>Pages used:</p>
                      <ul>{result.sourceLinks.map((link) => <li key={link}><a href={link} target="_blank" rel="noopener noreferrer">{link}</a></li>)}</ul>
                    </div> : null}
                  </div>

                  <div className="ideas-close" style={vars({ "--i": result.opportunities.length + 1 })}>
                    <h4 className="ideas-close__title">{ideasCopy.closeTitle}</h4>
                    <p className="ideas-close__text">{ideasCopy.closeText}</p>
                    {tool.contactHref ? <a className="button button--dark ideas-close__cta" href={tool.contactHref} target="_blank" rel="noopener noreferrer">
                      <span><BrandLogo brand="whatsapp" />{ideasCopy.closeCta}</span><ArrowIcon direction="up-right" />
                    </a> : null}
                    <ul className="ideas-close__points">
                      {ideasCopy.closePoints.map((point) => (
                        <li key={point}>
                          <span className="ideas-close__check" aria-hidden="true">
                            <IdeaIcon name="check" />
                          </span>
                          {point}
                        </li>
                      ))}
                    </ul>
                    <p className="ideas-close__note">{ideasCopy.closeNote}</p>

                    <p className="ideas-close__alt">{ideasCopy.tryAnother}</p>
                    <button type="button" className="ideas-again" data-sheen onClick={restart}>
                      <IdeaIcon name="restart" />
                      <span>{ideasCopy.restart}</span>
                      <ArrowIcon />
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
