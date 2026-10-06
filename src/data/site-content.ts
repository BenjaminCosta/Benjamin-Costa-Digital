import type { GlassIconName, IdeaOption, Project, Testimonial } from "@/types/content";
import type { BusinessAreaId, BusinessGoalId } from "@/types/business-ideas";
import { businessGoals } from "@/data/business-goals";

export const site = Object.freeze({
  name: "Benjamin Costa",
  location: "Gold Coast, AU",
});

/** Hero photo: beside the copy on desktop, under it on smaller screens. */
export const heroImage = Object.freeze({
  portrait: "/images/bg/hero.png",
  landscape: "/images/bg/hero-dp.png",
});

/** Subtle glass/acrylic backgrounds, one per section that carries one. */
export const backdrops = Object.freeze({
  // *-soft.jpg: reviews.png pre-toned (desaturated, lifted) so the browser
  // doesn't have to filter it on every paint.
  // Blurred, warmed light behind the Business Ideas glass cards.
  ideas: "/images/bg/ideas-soft.jpg",
  ideasDesktop: "/images/bg/ideas-dp-soft.jpg",
  reviews: "/images/bg/reviews-soft.jpg",
  reviewsDesktop: "/images/bg/reviews-dp-soft.jpg",
  work: "/images/bg/glass-devices-sunlight.png",
  about: "/images/bg/glass-laptop-soft.png",
  contact: "/images/bg/cta.png",
  contactDesktop: "/images/bg/cta-dp.png",
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

const goalIcons: Record<BusinessGoalId, GlassIconName> = {
  "more-bookings": "calendar", "less-manual-work": "gear", "better-website": "window-clock",
  "build-an-idea": "lightbulb", "not-sure": "compass",
};
// One icon per area, so no two cards in a view share one.
const areaIcons: Record<BusinessAreaId, GlassIconName> = {
  "local-presence": "search", conversion: "funnel", retention: "sync",
  automation: "flow", "internal-tools": "window-clock", ai: "sparkle", website: "monitor",
  "custom-tools": "cubes", apps: "gear", "e-commerce": "bag",
};

// The design uses the same canonical goals/catalogue mapping as the API.
export const ideaOptions: readonly IdeaOption[] = businessGoals.map((goal) => ({
  id: goal.id,
  label: goal.label,
  icon: goalIcons[goal.id],
  intro: goal.introduction,
  answers: goal.ideas.map((idea) => ({
    icon: areaIcons[idea.area], title: idea.title, text: idea.description,
  })),
  direct: goal.selection === "automatic",
}));

export const ideasCopy = Object.freeze({
  title: "What could work better in your business?",
  lede: "Choose the option that sounds most like your business.",
  formTitle: "Want to see what this could look like for your business?",
  linkLabel: "Your business website",
  linkPlaceholder: "yourbusiness.com.au",
  linkNote: "Use your public website. No website? Leave this empty and describe your business below. No private links or personal information.",
  contextToggle: "Add a little context (optional)",
  contextLabel: "What does your business do, and what would you like to improve?",
  contextPlaceholder: "We’re a Gold Coast barbershop. We’d like more repeat bookings.",
  contextHelp:
    "A short sentence helps when you don’t have a website or we can’t read it. Maximum 600 characters.",
  contextMax: 600,
  submit: "Show me ideas",
  submitDirect: "Take a look",
  submitting: "Finding ideas…",
  changeOption: "Change option",
  talkInstead: "Talk to Ben instead",
  microcopy: "Three starting points, followed by a personal conversation.",
  loadingTitle: "Finding ideas for your business…",
  // One request does all three; the steps pace what it is doing.
  loadingSteps: {
    website: { title: "Reading your website", detail: "Your public pages and what they say." },
    description: { title: "Reading your description", detail: "What you told us about your business." },
    understand: { title: "Understanding your business", detail: "What you do, your customers and opportunities." },
    ideas: { title: "Finding the best ideas", detail: "Putting everything together…" },
  },
  resultsTitle: "Here’s where I’d start.",
  resultsLede: (business: string) => `Three ideas for ${business}.`,
  resultsSource: "Based on your website and public information",
  buildLabel: "What I’d build",
  closeTitle: "Want me to look at it properly?",
  closeText:
    "The ideas above were generated automatically. I’ll personally take a look and tell you what I’d actually do.",
  closeCta: "Talk to Ben",
  closePoints: ["Custom proposal for your business", "Clear next steps and pricing", "No commitment"],
  closeNote: "WhatsApp opens with your business context, goal and ideas. You decide whether to send the message.",
  tryAnother: "Or try another option",
  restart: "Start again",
  basis: {
    public: "From public info",
    owner: "From your description",
    explore: "Worth exploring",
  },
});
