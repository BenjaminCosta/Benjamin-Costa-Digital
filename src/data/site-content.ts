import type { BusinessIdea, IdeaOption, Project, Testimonial } from "@/types/content";

export const site = Object.freeze({
  name: "Benjamin Costa",
  location: "Gold Coast, AU",
  coordinates: ["28.0167° S", "153.4000° E"],
});

/** Subtle glass/acrylic backgrounds, one per section that carries one. */
export const backdrops = Object.freeze({
  hero: "/images/bg/glass-analytics-sunlight.png",
  work: "/images/bg/glass-devices-sunlight.png",
  about: "/images/bg/glass-laptop-soft.png",
  contact: "/images/bg/glass-interface-dark.png",
});

export const plannedProjectCount = 8;

export const projects: readonly Project[] = [
  {
    id: "mr-moustache",
    name: "Mr Moustache",
    category: "Barbershop",
    location: "Gold Coast, AU",
    services: ["Website", "Bookings", "Automations"],
    summary: "Two shops, one digital experience.",
    description:
      "Two shops, bookings spread across platforms and no site that sold the place. Now one site, Square bookings connected, and the follow-ups go out on their own.",
  },
  {
    id: "kirra-dive",
    name: "Kirra Dive",
    location: "Tweed Heads, AU",
    services: ["Website", "Booking platform"],
    summary:
      "A simpler, clearer way for customers to find the right dive and book it.",
  },
  {
    id: "custom-operations-platform",
    name: "Custom Operations Platform",
    location: "USA",
    services: ["Internal software", "Dashboards", "Automation"],
    summary: "Software built to keep people, jobs and operations in one place.",
  },
];

/**
 * Public Workana profile. Figures and reviews were transcribed from the
 * profile (reviews are in Spanish there, shown here in English); confirm the
 * wording against the live page before launch.
 */
export const workana = Object.freeze({
  profileUrl: "https://www.workana.com/freelancer/6525bdbaa3b696218eb9e38608f3ea03",
  score: "5.0",
  reviewCount: 10,
});

export const testimonials: readonly Testimonial[] = [
  {
    id: "maria-rujano",
    quote:
      "I recommend him 1000%. He was always willing to help beyond what had been proposed, solved difficult problems very quickly, and was incredibly patient with me.",
    author: "María Rujano",
    project: "Shopify store development",
    source: "Workana",
  },
  {
    id: "maria-laura-rodriguez",
    quote:
      "A genius. He understood the essence of what we wanted straight away and delivered within a few days. Then we polished the details. Very happy with the final result.",
    author: "María Laura Rodríguez",
    project: "Shopify store improvements",
    source: "Workana",
  },
  {
    id: "matias-c",
    quote:
      "Super professional. He delivered much faster than agreed and even helped with extra sections for my e-commerce. Highly recommended.",
    author: "Matías C.",
    project: "Shopify landing page integration",
    source: "Workana",
  },
];

export const pricing = Object.freeze({
  startingFrom: "A$5,000",
});

/* --------------------------------------------------------------------------
   02 Business Ideas
   Layer 1 is fully controlled copy (instant, no AI). Layer 2 is generated
   per business once the owner shares a link.
   -------------------------------------------------------------------------- */

export const ideaOptions: readonly IdeaOption[] = [
  {
    id: "more-bookings",
    label: "I need more bookings",
    icon: "calendar",
    intro: "Here are a few places I’d look first:",
    answers: [
      {
        icon: "search",
        title: "Get found",
        text: "Make it easier for people looking for a business like yours to find you through Google and local search.",
      },
      {
        icon: "chart",
        title: "Conversion",
        text: "Reduce the steps between finding your business and making a booking.",
      },
      {
        icon: "users",
        title: "Retention",
        text: "Bring customers back with reminders, follow-ups and easier rebooking.",
      },
    ],
  },
  {
    id: "manual-work",
    label: "I spend too much time doing things manually",
    icon: "gear",
    intro: "Here are a few ways I’d look to save you time:",
    answers: [
      {
        icon: "flow",
        title: "Automation",
        text: "Connect the tools you already use so routine tasks don’t need someone moving information by hand.",
      },
      {
        icon: "grid",
        title: "Internal tools",
        text: "Keep jobs, customers and day-to-day operations in one place that works for your team.",
      },
      {
        icon: "sparkle",
        title: "AI",
        text: "Use AI for specific tasks such as sorting enquiries, summarising information or drafting replies for you to check.",
      },
    ],
  },
  {
    id: "outdated-website",
    label: "My website feels outdated",
    icon: "monitor",
    intro: "Here are a few things I’d focus on:",
    answers: [
      {
        icon: "monitor",
        title: "Website",
        text: "Build a fast, clear website that explains what you do and works well on mobile.",
      },
      {
        icon: "chart",
        title: "Conversion",
        text: "Give visitors a clear next step, whether that’s booking, buying or getting in touch.",
      },
      {
        icon: "pin",
        title: "Google / local presence",
        text: "Connect your Google Business presence to useful pages and an easier path to becoming a customer.",
      },
    ],
  },
  {
    id: "new-idea",
    label: "I have an idea I want to build",
    icon: "bulb",
    intro: "Here are a few directions we could explore:",
    answers: [
      {
        icon: "cube",
        title: "Custom tools",
        text: "Build something around the way your business works when off-the-shelf tools don’t quite fit.",
      },
      {
        icon: "phone",
        title: "Apps",
        text: "Start with a focused app that lets people do the one thing your idea needs to prove.",
      },
      {
        icon: "sparkle",
        title: "AI",
        text: "Add an AI feature where it solves a clear problem, such as finding information or helping people make a decision.",
      },
      {
        icon: "bag",
        title: "E-commerce",
        text: "Turn a product idea into a store with a clear offer and a straightforward buying experience.",
      },
    ],
  },
  {
    id: "not-sure",
    label: "Honestly, I’m not sure",
    icon: "compass",
    intro: "That’s normal. Show me your business and I’ll look for a few opportunities.",
    answers: [],
    direct: true,
  },
];

export const ideasCopy = Object.freeze({
  title: "What could work better in your business?",
  lede: "Choose the option that sounds most like your business.",
  formTitle: "Want to see what this could look like for your business?",
  linkLabel: "Paste your website, Instagram or Google Business link",
  linkPlaceholder: "yourbusiness.com.au",
  linkNote: "Use a public link only — no private documents, login links or personal information.",
  contextToggle: "Add a little context (optional)",
  contextLabel: "What does your business do, and what would you like to improve?",
  contextPlaceholder: "We’re a Gold Coast barbershop. We’d like more repeat bookings.",
  contextHelp:
    "A short sentence helps with social links and pages we can’t read. Maximum 600 characters.",
  contextMax: 600,
  submit: "Show me ideas",
  submitDirect: "Take a look",
  submitting: "Finding ideas…",
  changeOption: "Change option",
  talkInstead: "Talk to Ben instead",
  microcopy: "Three starting points, followed by a personal conversation.",
  loadingTitle: "Finding ideas for your business…",
  loadingSteps: ["Reading your link", "Understanding your business", "Finding opportunities"],
  resultsTitle: "Here’s where I’d start.",
  resultsLede: (business: string) => `Three ideas for ${business}.`,
  resultsSource: "Based on your website and public information",
  buildLabel: "What I’d build",
  closeTitle: "Want me to look at it properly?",
  closeText:
    "The ideas above were generated automatically. I’ll personally take a look and tell you what I’d actually do.",
  closeCta: "Talk to Ben",
  closeNote: "WhatsApp opens with your link, goal and ideas. You decide whether to send the message.",
  restart: "Start again with another option",
  basis: {
    public: "From public info",
    owner: "From your description",
    explore: "Worth exploring",
  },
});

/**
 * Layout preview only: stands in for the generator's response until the
 * real request is wired up.
 */
export const sampleIdeas = Object.freeze({
  business: "Mr Moustache",
  ideas: [
    {
      id: "google-bookings",
      title: "Turn Google visitors into bookings",
      summary:
        "Your business has strong reviews, but the journey from finding you to booking could be shorter.",
      build: "Google → focused landing page → direct booking",
      basis: "public",
    },
    {
      id: "rebooking",
      title: "Bring customers back automatically",
      summary:
        "Customers usually need another haircut every few weeks, but there’s no automatic rebooking journey.",
      build: "Booking → follow-up → rebooking reminder",
      basis: "explore",
    },
    {
      id: "reviews",
      title: "Get more reviews",
      summary: "Happy customers are already walking out the door every day.",
      build: "Automatic post-visit review request",
      basis: "public",
    },
  ] satisfies BusinessIdea[],
});
