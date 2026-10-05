import "server-only";
import { normaliseWhatsAppNumber } from "./whatsapp";

export function getIdeasConfig() {
  const enabled = process.env.BUSINESS_IDEAS_ENABLED === "true";
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const onVercel = process.env.VERCEL === "1";
  const ipRule = process.env.BUSINESS_IDEAS_IP_RULE?.trim();
  const globalRule = process.env.BUSINESS_IDEAS_GLOBAL_RULE?.trim();
  // Distributed production must not fall back to a process-local counter.
  const limiterReady = process.env.NODE_ENV !== "production" || (onVercel && Boolean(ipRule && globalRule));
  return {
    available: enabled && Boolean(apiKey) && limiterReady,
    apiKey,
    model: process.env.BUSINESS_IDEAS_MODEL?.trim() || "gpt-6-luna",
    onVercel,
    ipRule,
    globalRule,
    // Public contact information, not a credential. Works without a local env file.
    whatsappNumber: normaliseWhatsAppNumber(process.env.WHATSAPP_NUMBER?.trim() || "61409871882"),
  };
}
