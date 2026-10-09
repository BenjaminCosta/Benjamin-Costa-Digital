import "server-only";
import { getIdeasConfig } from "@/lib/business-ideas/config";
import { contactMessages } from "@/data/site-content";

export type ContactPlace = keyof typeof contactMessages;

/**
 * Every "let's talk" button opens WhatsApp with a message ready to send, so
 * a visitor is one tap away from a conversation. Same number as the Business
 * Ideas tool.
 */
export function whatsAppHref(place: ContactPlace): string | undefined {
  const { whatsappNumber } = getIdeasConfig();
  if (!whatsappNumber) return undefined;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(contactMessages[place])}`;
}
