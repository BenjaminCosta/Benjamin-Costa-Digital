import type { BusinessGoal } from "@/types/business-ideas";

export const businessGoals: readonly BusinessGoal[] = [
  {
    id: "more-bookings",
    label: "I need more bookings",
    selection: "guided",
    introduction: "Here are a few places I’d look first:",
    ideas: [
      {
        area: "local-presence",
        title: "Get found",
        description:
          "Make it easier for people looking for a business like yours to find you through Google and local search.",
      },
      {
        area: "conversion",
        title: "Conversion",
        description:
          "Reduce the steps between finding your business and making a booking.",
      },
      {
        area: "retention",
        title: "Retention",
        description:
          "Bring customers back with reminders, follow-ups and easier rebooking.",
      },
    ],
  },
  {
    id: "less-manual-work",
    label: "I spend too much time doing things manually",
    selection: "guided",
    introduction: "Here are a few ways I’d look to save you time:",
    ideas: [
      {
        area: "automation",
        title: "Automation",
        description:
          "Connect the tools you already use so routine tasks don’t need someone moving information by hand.",
      },
      {
        area: "internal-tools",
        title: "Internal tools",
        description:
          "Keep jobs, customers and day-to-day operations in one place that works for your team.",
      },
      {
        area: "ai",
        title: "AI",
        description:
          "Use AI for specific tasks such as sorting enquiries, summarising information or drafting replies for you to check.",
      },
    ],
  },
  {
    id: "better-website",
    label: "My website feels outdated",
    selection: "guided",
    introduction: "Here are a few things I’d focus on:",
    ideas: [
      {
        area: "website",
        title: "Website",
        description:
          "Build a fast, clear website that explains what you do and works well on mobile.",
      },
      {
        area: "conversion",
        title: "Conversion",
        description:
          "Give visitors a clear next step, whether that’s booking, buying or getting in touch.",
      },
      {
        area: "local-presence",
        title: "Google / local presence",
        description:
          "Connect your Google Business presence to useful pages and an easier path to becoming a customer.",
      },
    ],
  },
  {
    id: "build-an-idea",
    label: "I have an idea I want to build",
    selection: "guided",
    introduction: "Here are a few directions we could explore:",
    ideas: [
      {
        area: "custom-tools",
        title: "Custom tools",
        description:
          "Build something around the way your business works when off-the-shelf tools don’t quite fit.",
      },
      {
        area: "apps",
        title: "Apps",
        description:
          "Start with a focused app that lets people do the one thing your idea needs to prove.",
      },
      {
        area: "ai",
        title: "AI",
        description:
          "Add an AI feature where it solves a clear problem, such as finding information or helping people make a decision.",
      },
      {
        area: "e-commerce",
        title: "E-commerce",
        description:
          "Turn a product idea into a store with a clear offer and a straightforward buying experience.",
      },
    ],
  },
  {
    id: "not-sure",
    label: "Honestly, I’m not sure",
    selection: "automatic",
    introduction:
      "That’s normal. Show me your business and I’ll look for a few opportunities.",
    ideas: [],
  },
];
