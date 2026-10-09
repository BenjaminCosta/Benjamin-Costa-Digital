import { BusinessIdeas } from "@/components/sections/business-ideas";
import { getIdeasConfig } from "@/lib/business-ideas/config";

export function BusinessIdeasSection() {
  const { available, whatsappNumber } = getIdeasConfig();
  return (
    <section id="ideas" className="section ideas" aria-labelledby="ideas-title">
      <div id="business-ideas" aria-hidden="true" />
      <div id="audit" aria-hidden="true" />
      <div className="page-container indexed ideas__body" data-reveal>
        <BusinessIdeas available={available} whatsappNumber={whatsappNumber} />
        <noscript><p>Enable JavaScript to explore the options, or <a href="#contact">get in touch with Ben</a>.</p></noscript>
      </div>
    </section>
  );
}
