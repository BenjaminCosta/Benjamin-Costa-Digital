import type { ProfileLink, Project, Testimonial } from "@/types/content";

export const plannedProjectCount = 8;

export const projects: readonly Project[] = [
  {
    id: "mr-moustache",
    name: "Mr Moustache",
    location: "Gold Coast, AU",
    services: ["Website", "Bookings", "Automations"],
    summary: "Two locations, one digital experience.",
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
    avatar: { background: "#EC4690", foreground: "#FFFFFF" },
  },
  {
    id: "daniel-castro",
    quote: "Very professional and easy to work with.",
    author: "Daniel Castro",
    project: "Automation & Integrations",
    source: "Workana",
    avatar: { background: "#E3BCF6", foreground: "#7B2FB8" },
  },
  {
    id: "laura-sanchez",
    quote: "Delivered everything on time and exactly as discussed.",
    author: "Laura Sánchez",
    project: "Web Design & Development",
    source: "Workana",
    avatar: { background: "#96E0BC", foreground: "#14532D" },
  },
];

export const profileLinks: readonly ProfileLink[] = [
  { id: "workana", label: "Workana", value: "5.0 average" },
  { id: "linkedin", label: "LinkedIn", value: "Benjamin Costa" },
];

export const pricing = Object.freeze({
  startingFrom: "A$5,000",
});
