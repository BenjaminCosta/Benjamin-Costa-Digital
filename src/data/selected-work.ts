import type { Project } from "@/types/content";

const media = (id: string, name: string) => ({
  image: {
    src: `/images/work/${id}-glass.webp`,
    alt: `${name} website presented on a laptop and phone in a daylight glass studio`,
  },
  isotipo: `/images/isotipos/${id}.png`,
  previewHref: `/images/work/source/${id}.webp`,
});

/** The seven projects for which Benjamin supplied captures and brand assets. */
export const selectedWorkProjects: readonly Project[] = [
  {
    id: "mr-moustache", name: "Mr Moustache", category: "Barbershop", location: "Gold Coast",
    services: ["Website", "Bookings", "Automations"],
    summary: "Two shops, one digital experience.",
    description: "Two shops, bookings spread across platforms and no site that sold the place. Now one site, Square bookings connected, and the follow-ups go out on their own.",
    href: "https://moustachebarbersgc.com/",
    ...media("mr-moustache", "Mr Moustache"),
    wordmark: { src: "/images/work/wordmarks/mr-moustache.webp", width: 2048, height: 715, viewBox: "250 250 1570 250" },
  },
  {
    id: "kirra-dive", name: "Kirra Dive", category: "Dive centre", location: "Tweed Heads",
    services: ["Website", "Booking platform"],
    summary: "From the first question to the first dive.",
    ...media("kirra-dive", "Kirra Dive"),
    wordmark: { src: "/images/work/wordmarks/kirra-dive.webp", width: 2048, height: 473, viewBox: "150 170 1770 245" },
  },
  {
    id: "santos-becker", name: "Santos & Becker", category: "Immigration consulting", location: "Mexico",
    services: ["Website", "Multilingual experience"],
    summary: "A clearer digital presence for a global practice.",
    ...media("santos-becker", "Santos & Becker"),
    wordmark: { src: "/images/work/wordmarks/santos-becker.webp", width: 2048, height: 376, viewBox: "120 80 1800 215" },
  },
  {
    id: "agendify", name: "Agendify", category: "Scheduling product", location: "",
    services: ["Website", "Booking product"],
    summary: "Bookings, without the back-and-forth.",
    ...media("agendify", "Agendify"),
    wordmark: { src: "/images/work/wordmarks/agendify.webp", width: 2048, height: 1153, viewBox: "420 440 1210 300" },
  },
  {
    id: "stockia", name: "StockIA", category: "Wholesale commerce", location: "Argentina",
    services: ["E-commerce", "Custom platform"],
    summary: "Wholesale ordering, in one place.",
    ...media("stockia", "StockIA"),
  },
  {
    id: "decoratre", name: "Decoratre", category: "Handcrafted furniture", location: "",
    services: ["Website", "E-commerce"],
    summary: "Craftsmanship, translated into a digital storefront.",
    ...media("decoratre", "Decoratre"),
    wordmark: { src: "/images/work/wordmarks/decoratre.webp", width: 2048, height: 324, viewBox: "90 20 1900 270" },
  },
  {
    id: "a1-estudio", name: "A1 Estudio", category: "Food direction", location: "Buenos Aires",
    services: ["Website", "Editorial design"],
    summary: "A bold digital presence for food direction.",
    ...media("a1-estudio", "A1 Estudio"),
  },
];

/** Preserve the original case until its visuals and public link are supplied. */
export const pendingWorkProjects: readonly Project[] = [
  {
    id: "custom-operations-platform", name: "Custom Operations Platform", location: "USA",
    services: ["Internal software", "Dashboards", "Automation"],
    summary: "Software built to keep people, jobs and operations in one place.",
  },
];
