import type { Project } from "@/types/content";

const media = (id: string, name: string) => ({
  image: {
    src: `/images/work/${id}-devices-v3.webp`,
    alt: `${name} website presented on a laptop and phone in a daylight glass studio`,
  },
  isotipo: `/images/isotipos/${id}.png`,
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
    previewHref: "https://mr-moustache.vercel.app",
    wordmark: { src: "/images/work/wordmarks/hq/mr-moustache.webp", width: 2777, height: 420, viewBox: "43 52 2692 316" },
  },
  {
    id: "kirra-dive", name: "Kirra Dive", category: "Dive centre", location: "Tweed Heads",
    services: ["Website", "Booking platform"],
    summary: "From the first question to the first dive.",
    ...media("kirra-dive", "Kirra Dive"),
    previewHref: "https://kirra-dive.vercel.app",
    wordmark: { src: "/images/work/wordmarks/hq/kirra-dive.webp", width: 2631, height: 420, viewBox: "58 65 2517 290" },
  },
  {
    id: "santos-becker", name: "Santos & Becker", category: "Immigration consulting", location: "Mexico",
    services: ["Website", "Multilingual experience"],
    summary: "A clearer digital presence for a global practice.",
    ...media("santos-becker", "Santos & Becker"),
    previewHref: "https://santos-becker-actualsite.vercel.app",
    wordmark: { src: "/images/work/wordmarks/hq/santos-becker.webp", width: 3318, height: 420, viewBox: "54 68 3204 288" },
  },
  {
    id: "agendify", name: "Agendify", category: "Scheduling product", location: "",
    services: ["Website", "Booking product"],
    summary: "Bookings, without the back-and-forth.",
    ...media("agendify", "Agendify"),
    previewHref: "https://agendify.pro/",
    wordmark: { src: "/images/work/wordmarks/hq/agendify.webp", width: 1427, height: 420, viewBox: "44 52 1340 315" },
  },
  {
    id: "stockia", name: "StockIA", category: "Wholesale commerce", location: "Argentina",
    services: ["E-commerce", "Custom platform"],
    summary: "Wholesale ordering, in one place.",
    ...media("stockia", "StockIA"),
    previewHref: "https://stockia-online.vercel.app/comercio",
  },
  {
    id: "decoratre", name: "Decoratre", category: "Handcrafted furniture", location: "",
    services: ["Website", "E-commerce"],
    summary: "Craftsmanship, translated into a digital storefront.",
    ...media("decoratre", "Decoratre"),
    previewHref: "https://decoratre-2.myshopify.com/",
    wordmark: { src: "/images/work/wordmarks/hq/decoratre.webp", width: 2196, height: 420, viewBox: "149 67 1992 219" },
  },
  {
    id: "a1-estudio", name: "A1 Estudio", category: "Food direction", location: "Buenos Aires",
    services: ["Website", "Editorial design"],
    summary: "A bold digital presence for food direction.",
    ...media("a1-estudio", "A1 Estudio"),
    previewHref: "https://a1-estudio.vercel.app/",
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
