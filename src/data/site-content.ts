import type { ProfileLink, Project, Testimonial } from "@/types/content";

export const site = Object.freeze({
  name: "Benjamin Costa",
  location: "Gold Coast, AU",
  coordinates: ["28.0167° S", "153.4000° E"],
});

/** Subtle glass/acrylic backgrounds, one per section that carries one. */
export const backdrops = Object.freeze({
  hero: "/images/bg/glass-analytics-sunlight.png",
  audit: "/images/bg/glass-dashboards-dark.png",
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

// Copy below follows the approved mobile mockups. Verify every quote and
// figure against the live Workana profile before launch.
export const workanaRating = Object.freeze({
  score: "5.0",
  outOf: "5",
  completedProjects: 18,
});

export const testimonials: readonly Testimonial[] = [
  {
    id: "maria-rujano",
    quote: "Excellent communication and quality of work.",
    author: "Maria Rujano",
    project: "Shopify Store Development",
    source: "Workana",
  },
  {
    id: "daniel-castro",
    quote: "Very professional and easy to work with.",
    author: "Daniel Castro",
    project: "Automation & Integrations",
    source: "Workana",
  },
  {
    id: "laura-sanchez",
    quote: "Delivered everything on time and exactly as discussed.",
    author: "Laura Sánchez",
    project: "Web Design & Development",
    source: "Workana",
  },
];

export const profileLinks: readonly ProfileLink[] = [
  { id: "workana", label: "Workana", value: "5.0 average" },
  { id: "linkedin", label: "LinkedIn", value: "Benjamin Costa" },
];

export const pricing = Object.freeze({
  startingFrom: "A$5,000",
});
