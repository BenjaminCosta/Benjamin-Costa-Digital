import type { Project, Testimonial } from "@/types/content";

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

export const testimonials: readonly Testimonial[] = [
  {
    id: "maria-rujano",
    quote:
      "I recommend him 1000%. He was always willing to help beyond what had been proposed, solved difficult problems very quickly, and was incredibly patient with me.",
    author: "Maria Rujano",
    project: "Shopify Store Development",
    source: "Workana",
  },
];
