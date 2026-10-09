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
    summary: "Two shops, bookings scattered across platforms and no site that showed the place off. Now it’s one site with Square bookings connected, and the follow-up emails go out on their own.",
    href: "https://moustachebarbersgc.com/",
    ...media("mr-moustache", "Mr Moustache"),
    previewHref: "https://mr-moustache.vercel.app",
    wordmark: { src: "/images/work/wordmarks/hq/mr-moustache.webp", width: 1525, height: 176, display: 298 },
  },
  {
    id: "kirra-dive", name: "Kirra Dive", category: "Dive centre", location: "Tweed Heads",
    summary: "People were asking the same questions over WhatsApp before they’d commit to a course. Now one page walks them from online theory to their first ocean dive, answers those questions and takes the booking.",
    ...media("kirra-dive", "Kirra Dive"),
    previewHref: "https://kirra-dive.vercel.app",
    wordmark: { src: "/images/work/wordmarks/hq/kirra-dive.webp", width: 1656, height: 176, display: 322 },
  },
  {
    id: "santos-becker", name: "Santos & Becker", category: "Immigration consulting", location: "Mexico",
    summary: "Decades of immigration expertise, but a website that didn’t explain what the firm actually does. Now a bilingual site lays out every service and leads companies and individuals to a first consultation.",
    ...media("santos-becker", "Santos & Becker"),
    previewHref: "https://santos-becker-actualsite.vercel.app",
    wordmark: { src: "/images/work/wordmarks/hq/santos-becker.webp", width: 2092, height: 176, display: 360 },
  },
  {
    id: "agendify", name: "Agendify", category: "Booking software", location: "Argentina",
    summary: "Booking by message eats into a small business’s day, and most booking apps take a cut. Agendify lets clients book and pay on their own, around the clock, with no commission.",
    ...media("agendify", "Agendify"),
    previewHref: "https://agendify.pro/",
    wordmark: { src: "/images/work/wordmarks/hq/agendify.webp", width: 719, height: 176, display: 165 },
  },
  {
    id: "stockia", name: "StockIA", category: "Wholesale", location: "Argentina",
    summary: "Local shops were restocking by phone, one distributor at a time. Now they see what every nearby distributor stocks, order in one place, repeat past orders and track each delivery.",
    ...media("stockia", "StockIA"),
    previewHref: "https://stockia-online.vercel.app/comercio",
  },
  {
    id: "decoratre", name: "Decoratre", category: "Handcrafted furniture", location: "Mexico",
    summary: "Handmade furniture with a strong story, sold mostly through messages and social media. Now a Shopify store tells the workshop’s story and lets people browse and buy each piece online.",
    ...media("decoratre", "Decoratre"),
    previewHref: "https://decoratre-2.myshopify.com/",
    wordmark: { src: "/images/work/wordmarks/hq/decoratre.webp", width: 1795, height: 176, display: 333 },
  },
  {
    id: "a1-estudio", name: "A1 Estudio", category: "Food consultancy", location: "Buenos Aires",
    summary: "A food consultancy that was hard to explain in a sentence. Now a bold, editorial site shows how the studio works, from concept to kitchen to operations, and makes it easy to get in touch.",
    ...media("a1-estudio", "A1 Estudio"),
    previewHref: "https://a1-estudio.vercel.app/",
    wordmark: { src: "/images/work/wordmarks/hq/a1-estudio.webp", width: 980, height: 176, display: 205 },
  },
];

/** Preserve the original case until its visuals and public link are supplied. */
export const pendingWorkProjects: readonly Project[] = [
  {
    id: "custom-operations-platform", name: "Custom Operations Platform", location: "USA",
    summary: "Software built to keep people, jobs and operations in one place.",
  },
];
