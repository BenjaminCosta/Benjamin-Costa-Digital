import "server-only";

import type { BusinessAreaId, BusinessService } from "@/types/business-ideas";

export const serviceCatalog = {
  "local-presence": {
    id: "local-presence",
    name: "Google and local presence",
    description:
      "Help local customers discover the business and reach relevant pages from Google Business and local search.",
    scope:
      "Suggest local visibility improvements and useful website connections. Do not promise search rankings or claim access to private Google Business data.",
  },
  conversion: {
    id: "conversion",
    name: "Conversion",
    description:
      "Improve the journey from interest to a booking, purchase or enquiry.",
    scope:
      "Propose clearer offers, calls to action and simpler booking or purchase flows. Do not invent conversion figures or promise revenue increases.",
  },
  retention: {
    id: "retention",
    name: "Customer retention",
    description:
      "Help customers return through reminders, follow-ups and rebooking journeys.",
    scope:
      "Work with the business’s existing customer and booking systems. Treat missing follow-up workflows as a possibility unless their absence is confirmed.",
  },
  automation: {
    id: "automation",
    name: "Automation",
    description:
      "Connect existing systems and reduce repetitive steps in everyday processes.",
    scope:
      "Propose bounded workflows and integrations. Availability depends on the tools and permissions the business actually has.",
  },
  "internal-tools": {
    id: "internal-tools",
    name: "Internal tools",
    description:
      "Build dashboards and tools for managing customers, jobs and operations.",
    scope:
      "Focus on a specific team workflow. Do not infer internal systems or operational problems from a public website alone.",
  },
  ai: {
    id: "ai",
    name: "AI",
    description:
      "Build focused AI features for organising information, supporting decisions and assisting routine work.",
    scope:
      "Recommend AI only where it helps a concrete task, with appropriate human review. Do not promise autonomous or error-free operation.",
  },
  website: {
    id: "website",
    name: "Website",
    description:
      "Build clear, accessible websites and landing pages with fast mobile experiences.",
    scope:
      "Connect the website to a real business goal. Avoid presenting unmeasured performance or accessibility problems as established facts.",
  },
  "custom-tools": {
    id: "custom-tools",
    name: "Custom tools",
    description:
      "Build software for a specific business need that existing products do not address well.",
    scope:
      "Define a useful first version and validate the workflow. Do not assume a custom build is always better than an existing product.",
  },
  apps: {
    id: "apps",
    name: "Apps",
    description:
      "Turn an idea into a focused application for customers or a team.",
    scope:
      "Start with the core user task. Platforms, integrations and native mobile requirements need separate scoping.",
  },
  "e-commerce": {
    id: "e-commerce",
    name: "E-commerce",
    description:
      "Build or improve online stores and the journey from product discovery to purchase.",
    scope:
      "Propose store and buying-flow improvements. Do not promise sales or claim knowledge of private orders, stock or payment data.",
  },
} as const satisfies Readonly<Record<BusinessAreaId, BusinessService>>;
