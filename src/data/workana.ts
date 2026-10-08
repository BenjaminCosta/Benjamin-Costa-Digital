import type { Testimonial } from "@/types/content";

/** Owner's transcription supplied on 8 October 2026. Eighteen ratings is not
 * a count of written reviews. Eight supplied entries have comments; exact
 * dates and official freelancer verification status were not supplied.
 */
export const workana = Object.freeze({
  profileUrl: "https://www.workana.com/freelancer/6525bdbaa3b696218eb9e38608f3ea03#section-ratings",
  name: "Benjamin Costa Mihanovich", role: "Front-end Developer",
  score: "5.0", ratingCount: 18, portrait: "/images/profile.jpg",
});

export const testimonials = [
  {
    id: "maria-rujano", author: "Maria Rujano", project: "Shopify store development",
    quote: "I recommend him 1000%. He was always willing to help beyond what had been proposed. He solved difficult problems very quickly and was incredibly patient with me. I’m delighted with his work, highly recommend him, and will definitely work with him on many more projects.",
    originalQuote: "Lo recomiendo 1000%; siempre estuvo dispuesto a ayudar más de lo que se había propuesto. Solventó problemas que no eran nada fáciles y lo hizo muy rápido. Tuvo una paciencia increíble conmigo, estoy encantada con su trabajo, lo recomiendo y de seguro haré muchos más trabajos con él.",
    tags: ["E-commerce", "Shopify", "API integrations"], rating: 5, featured: true, source: "Workana",
  },
  {
    id: "maria-laura-rodrigues", author: "Maria Laura Rodrigues", project: "Shopify store improvements",
    quote: "A genius. He understood the essence of what we wanted straight away and delivered within a few days. Then we polished the details. Very happy with the final result!",
    originalQuote: "Un genio. Entendió enseguida la esencia de lo que queríamos y nos presentó el trabajo a los pocos dias. Luego fuimos puliendo detalles. Muy conformes con el trabajo final!",
    tags: ["E-commerce", "Shopify"], rating: 5, featured: false, source: "Workana",
  },
  {
    id: "matias-shopify-landing", author: "Matias costadoni", project: "Shopify landing page & AJAX cart",
    quote: "Super professional. He delivered much faster than agreed and even helped with extra sections for my e-commerce store. Highly recommended.",
    originalQuote: "Super profesional, resolvio en mucho tiempo antes de lo acordado. e incluso colaboro con secciones extra para mi ecomerce. Super recomendable",
    tags: ["Shopify", "JavaScript", "AJAX"], rating: 5, featured: false, source: "Workana",
  },
  {
    id: "matias-shopify-html", author: "Matias costadoni", project: "Custom HTML integration in Shopify",
    quote: "This is already our fourth project and round of improvements with Benja. Always attentive and willing to help, around the clock. Don’t hesitate to reach out and see how he works. Incredible!",
    originalQuote: "Ya 4to proyecto y mejoras trabajando con benja. Super atento y predispuesto las 24hs. No tengan dudas en consultar y ver la forma en la cual trabaja. increible!",
    tags: ["Shopify", "HTML", "CSS", "JavaScript"], rating: 5, featured: false, source: "Workana",
  },
  {
    id: "alessandro-riglos", author: "Alessandro Riglos", project: "Interactive political comparison platform",
    quote: "A very good professional.", originalQuote: "Muy buen profesional",
    tags: ["Custom software", "PHP", "MySQL"], rating: 5, featured: false, source: "Workana",
  },
  {
    id: "plantillaspromx", author: "Plantillaspromx", project: "Squarespace store, Stripe & Zapier",
    quote: "Excellent service. Very kind and delivered exactly as promised. He helped me design my website from scratch.",
    originalQuote: "Excelente servicio , muy amable y cumple 100% , me ayudó a diseñar mi página web desde 0",
    tags: ["Squarespace", "Stripe", "Zapier"], rating: 5, featured: true, source: "Workana",
  },
  {
    id: "olivia-workshop", author: "Olivia", project: "Landing page for an in-person & online workshop",
    quote: "Excellent. The landing page design was perfect!", originalQuote: "Excelente, el diseño de landing page perfecto!",
    tags: ["Web design", "Responsive design"], rating: 5, featured: false, source: "Workana",
  },
  {
    id: "fran-consultancy", author: "Fran", project: "Website for a food consultancy",
    quote: "Benjamín was a great help in building my consultancy website. I’m very grateful for the way he treated me and for the work he did. I would absolutely recommend him to anyone who needs his services; they’ll be completely satisfied with his work.",
    originalQuote: "Benjamín ha sido de gran ayuda para hacer la web de mi consultoría. Le estoy muy agradecido por el trato y el trabajo realizado. Sin lugar a dudas, recomiéndo que cualquier persona que lo necesite lo contrate porque quedará absolutamente satisfecho con la labor de Benjamín.",
    tags: ["Web design", "Carrd", "Responsive design"], rating: 5, featured: true, source: "Workana",
  },
] as const satisfies readonly Testimonial[];

/** Mix website, automation and software work between Shopify testimonials. */
const carouselOrder: readonly Testimonial["id"][] = [
  "maria-rujano", "fran-consultancy", "plantillaspromx", "matias-shopify-html",
  "alessandro-riglos", "maria-laura-rodrigues", "olivia-workshop", "matias-shopify-landing",
];
export const carouselTestimonials: readonly Testimonial[] = carouselOrder.map((id) => {
  const review = testimonials.find((item) => item.id === id);
  if (!review) throw new Error(`Missing Workana testimonial: ${id}`);
  return review;
});
