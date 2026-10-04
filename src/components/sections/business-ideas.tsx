"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { ButtonLink } from "@/components/ui/button-link";
import { IdeaIcon } from "@/components/ui/idea-icon";
import { ideaOptions, ideasCopy, sampleIdeas } from "@/data/site-content";
import type { BusinessIdea, IdeaOption } from "@/types/content";

type View = "choose" | "answers" | "loading" | "results";

const pad = (value: number) => String(value).padStart(2, "0");

/** Layout preview: how long the "finding ideas" state stays on screen. */
const PREVIEW_LOADING_MS = 3200;

function GlassStack() {
  return (
    <div className="glass-stack" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function SubmitButton({ direct }: Readonly<{ direct: boolean }>) {
  return (
    <button type="submit" className="button button--dark ideas-form__submit">
      <span>{direct ? ideasCopy.submitDirect : ideasCopy.submit}</span>
      <ArrowIcon />
    </button>
  );
}

function IdeasForm({
  option,
  onSubmit,
}: Readonly<{ option: IdeaOption; onSubmit: (event: FormEvent<HTMLFormElement>) => void }>) {
  const direct = Boolean(option.direct);

  return (
    <form className="ideas-form" onSubmit={onSubmit}>
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

      <details className="ideas-context">
        <summary>
          <span>{ideasCopy.contextToggle}</span>
          <IdeaIcon name="plus" />
        </summary>
        <div className="ideas-context__body">
          <label htmlFor="ideas-context">{ideasCopy.contextLabel}</label>
          <textarea
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
      </details>

      <SubmitButton direct={direct} />

      <div className="ideas-form__aside">
        <span className="text-link text-link--underlined ideas-form__talk" data-pending>
          <span className="text-link__label">{ideasCopy.talkInstead}</span>
          <ArrowIcon direction="up-right" />
        </span>
        <p className="ideas-form__micro">{ideasCopy.microcopy}</p>
      </div>
    </form>
  );
}

function IdeaResult({ idea, index }: Readonly<{ idea: BusinessIdea; index: number }>) {
  return (
    <li className="idea-result">
      <span className="idea-result__num" aria-hidden="true">
        {pad(index + 1)}
      </span>
      <div className="idea-result__main">
        <h4 className="idea-result__title">
          <span className="visually-hidden">{pad(index + 1)} — </span>
          {idea.title}
        </h4>
        <p className="idea-result__summary">{idea.summary}</p>
        {idea.basis ? (
          <p className="idea-result__basis">{ideasCopy.basis[idea.basis]}</p>
        ) : null}
      </div>
      <div className="idea-result__build">
        <IdeaIcon name="cube" />
        <div>
          <p className="idea-result__build-label">{ideasCopy.buildLabel}</p>
          <p className="idea-result__build-text">{idea.build}</p>
        </div>
      </div>
    </li>
  );
}

export function BusinessIdeas() {
  const [view, setView] = useState<View>("choose");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const firstRender = useRef(true);

  const selected = ideaOptions.find((option) => option.id === selectedId) ?? null;

  // Each step change moves focus to the new heading and, on small screens,
  // brings the top of the tool back into view.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const section = sectionRef.current;
    if (section && window.matchMedia("(max-width: 63.999rem)").matches) {
      if (section.getBoundingClientRect().top < 0) {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        section.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      }
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [view, selectedId]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const choose = (option: IdeaOption) => {
    window.clearTimeout(timerRef.current);
    setSelectedId(option.id);
    setView("answers");
  };

  const restart = () => {
    window.clearTimeout(timerRef.current);
    setSelectedId(null);
    setView("choose");
  };

  // Layout only: the real request (option, link, context) replaces this
  // timer and the sample ideas.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setView("loading");
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setView("results"), PREVIEW_LOADING_MS);
  };

  return (
    <div ref={sectionRef} className="ideas__tool" data-view={view}>
      <div className="ideas__intro">
        <h2 id="ideas-title" className="display display--ideas">
          {ideasCopy.title}
        </h2>
        <p className="ideas__lede">{ideasCopy.lede}</p>

        <ul className="idea-options">
          {ideaOptions.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                className="idea-option"
                aria-pressed={selectedId === option.id}
                onClick={() => choose(option)}
              >
                <IdeaIcon name={option.icon} />
                <span className="idea-option__label">{option.label}</span>
                <ArrowIcon />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="ideas__panel">
        {view !== "choose" ? (
          <button type="button" className="ideas__back only-mobile" onClick={restart}>
            <IdeaIcon name="back" />
            <span>All options</span>
          </button>
        ) : null}

        {view === "choose" ? (
          <div className="ideas-empty only-desktop">
            <GlassStack />
            <p>Pick the option that sounds most like your business and I’ll show you where I’d start.</p>
          </div>
        ) : null}

        {view === "answers" && selected ? (
          <div className="ideas-step" key={selected.id}>
            <p className="mono-label ideas-step__count">01 / 03</p>
            <h3 ref={headingRef} tabIndex={-1} className="ideas-step__title">
              {selected.label}
            </h3>
            <p className="ideas-step__intro">{selected.intro}</p>

            {selected.answers.length > 0 ? (
              <ul className="idea-answers" data-count={selected.answers.length}>
                {selected.answers.map((answer) => (
                  <li key={answer.title} className="idea-answer">
                    <IdeaIcon name={answer.icon} />
                    <div>
                      <h4>{answer.title}</h4>
                      <p>{answer.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}

            <IdeasForm option={selected} onSubmit={handleSubmit} />
          </div>
        ) : null}

        {view === "loading" ? (
          <div className="ideas-step ideas-loading">
            <h3 ref={headingRef} tabIndex={-1} className="ideas-step__title ideas-loading__title">
              {ideasCopy.loadingTitle}
            </h3>
            <div className="ideas-loading__visual">
              <GlassStack />
              <ol className="ideas-loading__steps" role="status">
                {ideasCopy.loadingSteps.map((step, index) => (
                  <li key={step} style={{ "--step": index } as CSSProperties}>
                    <span className="ideas-loading__check" aria-hidden="true">
                      <IdeaIcon name="check" />
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : null}

        {view === "results" ? (
          <div className="ideas-step ideas-results">
            <p className="mono-label ideas-step__count">02 / 03</p>
            <h3 ref={headingRef} tabIndex={-1} className="ideas-step__title">
              {ideasCopy.resultsTitle}
            </h3>
            <p className="ideas-results__lede">{ideasCopy.resultsLede(sampleIdeas.business)}</p>
            <p className="ideas-results__source">
              <IdeaIcon name="search" />
              {ideasCopy.resultsSource}
            </p>

            <ol className="idea-results">
              {sampleIdeas.ideas.map((idea, index) => (
                <IdeaResult key={idea.id} idea={idea} index={index} />
              ))}
            </ol>

            <div className="ideas-close">
              <p className="mono-label ideas-step__count">03 / 03</p>
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

              <p className="ideas-close__restart-lead">{ideasCopy.restartLead}</p>
              <button type="button" className="idea-option ideas-restart" onClick={restart}>
                <IdeaIcon name="restart" />
                <span>{ideasCopy.restart}</span>
                <ArrowIcon />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
