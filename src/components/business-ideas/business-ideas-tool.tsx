"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { businessGoals } from "@/data/business-goals";
import { normaliseBusinessLink } from "@/lib/business-ideas/link";
import { buildWhatsAppLink } from "@/lib/business-ideas/whatsapp";
import type { BusinessGoalId, IdeasErrorCode, IdeasResponse, IdeasResult } from "@/types/business-ideas";
import { BusinessIdeasResult } from "./business-ideas-result";

type ToolState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; code: IdeasErrorCode; message: string }
  | { status: "success"; result: IdeasResult };
type Props = { available: boolean; whatsappNumber: string | null };

export function BusinessIdeasTool({ available, whatsappNumber }: Props) {
  const [selectedGoalId, setSelectedGoalId] = useState<BusinessGoalId | null>(null);
  const [businessLink, setBusinessLink] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState<ToolState>({ status: "idle" });
  const controller = useRef<AbortController | null>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const errorMessage = useRef<HTMLParagraphElement>(null);
  const contextDetails = useRef<HTMLDetailsElement>(null);
  const selectedGoal = businessGoals.find((goal) => goal.id === selectedGoalId);
  const loading = state.status === "loading";
  const needsContext = state.status === "error" && state.code === "needs-context";
  const invalidLink = state.status === "error" && ["invalid-input", "unsafe-link"].includes(state.code);

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (state.status === "success") resultHeading.current?.focus();
    if (state.status === "error") errorMessage.current?.focus();
    if (state.status === "error" && state.code === "needs-context" && contextDetails.current) contextDetails.current.open = true;
  }, [state]);

  function resetRequest() {
    controller.current?.abort();
    controller.current = null;
    setState({ status: "idle" });
  }

  let cleanLink = "";
  try { cleanLink = normaliseBusinessLink(businessLink); } catch { /* Validated on submit. */ }
  const contactHref = whatsappNumber && selectedGoalId
    ? cleanLink || description.trim()
      ? buildWhatsAppLink(whatsappNumber, { goal: selectedGoalId, link: cleanLink, description }, state.status === "success" ? state.result : undefined)
      : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hey Ben, I’d love your take on my business. I selected: ${selectedGoal!.label}.`)}`
    : null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGoalId || loading || !available) return;
    let link: string;
    try { link = businessLink.trim() ? normaliseBusinessLink(businessLink) : ""; }
    catch (error) {
      setState({ status: "error", code: "invalid-input", message: (error as Error).message });
      return;
    }
    controller.current?.abort();
    const active = new AbortController();
    controller.current = active;
    setState({ status: "loading" });
    const timer = setTimeout(() => active.abort("timeout"), 50000);
    try {
      const response = await fetch("/api/business-ideas", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: selectedGoalId, link, description: description.trim() }),
        signal: active.signal, cache: "no-store",
      });
      const payload: IdeasResponse = await response.json();
      if (controller.current !== active) return;
      if (payload.status === "success" && response.ok && payload.result.opportunities.length === 3) setState(payload);
      else if (payload.status === "error") setState(payload);
      else throw new Error("Unexpected response");
    } catch {
      if (controller.current !== active) return;
      setState({
        status: "error", code: active.signal.aborted ? "timeout" : "generation-failed",
        message: active.signal.aborted
          ? "That took too long. Please try again or talk to Ben directly."
          : "We couldn’t prepare ideas this time. Check your connection, try again or talk to Ben directly.",
      });
    } finally {
      clearTimeout(timer);
      if (controller.current === active) controller.current = null;
    }
  }

  return (
    <div className="max-w-3xl space-y-8">
      <fieldset className="min-w-0 space-y-3">
        <legend className="sr-only">What could work better in your business?</legend>
        {businessGoals.map((goal) => (
          <label key={goal.id} className="flex min-h-11 cursor-pointer items-start gap-3 py-2">
            <input className="mt-1 h-4 w-4 shrink-0 accent-current"
              type="radio" name="business-goal" value={goal.id} checked={selectedGoalId === goal.id}
              onChange={() => { resetRequest(); setSelectedGoalId(goal.id); }} aria-controls="business-goal-response" />
            <span>{goal.label}</span>
          </label>
        ))}
      </fieldset>
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {selectedGoal ? `Selected: ${selectedGoal.label}. Business link field available below.` : "Choose the option that sounds most like your business."}
      </p>
      <div id="business-goal-response">
        {selectedGoal ? (
          <div className="space-y-8">
            {selectedGoal.selection === "guided" ? (
              <section className="space-y-4" aria-labelledby="business-goal-response-title">
                <h3 id="business-goal-response-title" className="text-xl font-medium">{selectedGoal.introduction}</h3>
                <ul className="space-y-4">
                  {selectedGoal.ideas.map((idea) => (
                    <li key={idea.area} className="space-y-1"><h4 className="font-semibold">{idea.title}</h4><p>{idea.description}</p></li>
                  ))}
                </ul>
              </section>
            ) : <p>{selectedGoal.introduction}</p>}
            <form className="space-y-4" onSubmit={submit} aria-busy={loading} noValidate>
              {selectedGoal.selection === "guided" && <h3 className="text-xl font-medium">Want to see what this could look like for your business?</h3>}
              <div className="space-y-2">
                <label htmlFor="business-link" className="block">Your business website</label>
                <input id="business-link" className="min-h-11 w-full min-w-0 border border-current bg-transparent px-3 py-2 placeholder:opacity-70"
                  type="text" inputMode="url" autoComplete="url" autoCapitalize="none" spellCheck={false} maxLength={2048}
                  placeholder="yourbusiness.com.au" value={businessLink}
                  onChange={(event) => { resetRequest(); setBusinessLink(event.target.value); }}
                  aria-invalid={invalidLink} aria-describedby={`business-link-hint${invalidLink ? " business-ideas-error" : ""}`} />
                <p id="business-link-hint" className="text-sm">Use your public website. No website? Leave this empty and tell us what your business does below. No private links or personal information.</p>
              </div>
              <details ref={contextDetails} className="space-y-3">
                <summary className="min-h-11 cursor-pointer py-2">Add a little context {needsContext ? "(needed to continue)" : "(optional)"}</summary>
                <label htmlFor="business-description" className="block">What does your business do, and what would you like to improve?</label>
                <textarea id="business-description" className="w-full min-w-0 border border-current bg-transparent px-3 py-2"
                  rows={3} maxLength={600} value={description} placeholder="We’re a Gold Coast barbershop. We’d like more repeat bookings."
                  onChange={(event) => { resetRequest(); setDescription(event.target.value); }} aria-invalid={needsContext} aria-describedby={`business-description-hint${needsContext ? " business-ideas-error" : ""}`} />
                <p id="business-description-hint" className="text-sm">A short sentence helps when you don’t have a website or we can’t read it. Maximum 600 characters.</p>
              </details>
              <p id="business-ideas-privacy" className="text-sm">
                Submitting sends your public page text and any description to OpenAI to prepare three suggestions. We don’t store submissions in this app. Don’t include sensitive information. These are ideas, not a verified audit.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button className="min-h-11 border border-current px-4 py-2 disabled:cursor-not-allowed disabled:opacity-60"
                  type="submit" disabled={!available || loading} aria-describedby="business-ideas-privacy business-ideas-availability">
                  {loading ? "Preparing ideas…" : selectedGoal.selection === "automatic" ? "Take a look →" : "Show me ideas →"}
                </button>
                {loading && <button className="min-h-11 px-2 py-2 underline" type="button" onClick={resetRequest}>Cancel</button>}
                {contactHref && state.status !== "success" && <a className="inline-flex min-h-11 items-center underline" href={contactHref} target="_blank" rel="noopener noreferrer">Talk to Ben instead ↗</a>}
              </div>
              <p id="business-ideas-availability" className="text-sm">
                {available ? "Three starting points, followed by a personal conversation." : "Personalised ideas aren’t available right now. The instant starting points above still work."}
              </p>
              {!whatsappNumber && <p className="text-sm">Direct contact will be available once Ben’s WhatsApp details are added.</p>}
            </form>
            <div className="min-h-12">
              {loading && <p role="status">Reading the available context and preparing three ideas. This may take a moment.</p>}
              {state.status === "error" && <p id="business-ideas-error" ref={errorMessage} tabIndex={-1} role="alert">{state.message}</p>}
            </div>
            {state.status === "success" && <BusinessIdeasResult result={state.result} headingRef={resultHeading} contactHref={contactHref} />}
          </div>
        ) : <p>Choose the option that sounds most like your business.</p>}
      </div>
    </div>
  );
}
