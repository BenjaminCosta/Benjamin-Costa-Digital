import { BusinessIdeas } from "@/components/sections/business-ideas";
import { SectionHead } from "@/components/ui/section-head";

export function BusinessIdeasSection() {
  return (
    <section id="ideas" className="section ideas" aria-labelledby="ideas-title">
      <div className="page-container indexed ideas__body" data-reveal>
        <SectionHead index="02" title="Business ideas" />
        <BusinessIdeas />
      </div>
    </section>
  );
}
