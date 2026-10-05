"use client";

import { useEffect, useRef, useState } from "react";
import { businessGoals } from "@/data/business-goals";
import { normaliseBusinessLink } from "@/lib/business-ideas/link";
import { buildWhatsAppLink } from "@/lib/business-ideas/whatsapp";
import type { BusinessGoalId, IdeasErrorCode, IdeasResponse, IdeasResult } from "@/types/business-ideas";

type ToolState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; code: IdeasErrorCode; message: string }
  | { status: "success"; result: IdeasResult };

export type BusinessIdeasProps = { available: boolean; whatsappNumber: string | null };

// Request/validation/cancellation behaviour is independent of the visual stages.
export function useBusinessIdeas({ available, whatsappNumber }: BusinessIdeasProps) {
  const [selectedGoalId, setSelectedGoalId] = useState<BusinessGoalId | null>(null);
  const [businessLink, setBusinessLink] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState<ToolState>({ status: "idle" });
  const controller = useRef<AbortController | null>(null);
  const selectedGoal = businessGoals.find((goal) => goal.id === selectedGoalId);

  useEffect(() => () => controller.current?.abort(), []);

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

  async function submit(): Promise<ToolState | undefined> {
    if (!selectedGoalId || state.status === "loading" || !available) return;
    let link: string;
    try { link = businessLink.trim() ? normaliseBusinessLink(businessLink) : ""; }
    catch (error) {
      const failure: ToolState = { status: "error", code: "invalid-input", message: (error as Error).message };
      setState(failure);
      return failure;
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
      if (payload.status === "success" && response.ok && payload.result.opportunities.length === 3) {
        setState(payload);
        return payload;
      }
      if (payload.status === "error") {
        setState(payload);
        return payload;
      }
      throw new Error("Unexpected response");
    } catch {
      if (controller.current !== active) return;
      const failure: ToolState = {
        status: "error", code: active.signal.aborted ? "timeout" : "generation-failed",
        message: active.signal.aborted
          ? "That took too long. Please try again or talk to Ben directly."
          : "We couldn’t prepare ideas this time. Check your connection, try again or talk to Ben directly.",
      };
      setState(failure);
      return failure;
    } finally {
      clearTimeout(timer);
      if (controller.current === active) controller.current = null;
    }
  }

  return {
    selectedGoalId, setSelectedGoalId, selectedGoal,
    businessLink, setBusinessLink, description, setDescription, state,
    resetRequest, submit, contactHref,
    needsContext: state.status === "error" && state.code === "needs-context",
    invalidLink: state.status === "error" && ["invalid-input", "unsafe-link"].includes(state.code),
  };
}
