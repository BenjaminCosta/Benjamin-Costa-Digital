import { ButtonLink } from "@/components/ui/button-link";
import { MediaSlot } from "@/components/ui/media-slot";
import { SectionHead } from "@/components/ui/section-head";
import { pricing } from "@/data/site-content";

export function ContactSection() {
  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container contact__body" data-reveal>
        <SectionHead index="06" title="Final CTA" />

        <h2 id="contact-title" className="display display--contact">
          <span>Got something</span> <span>that could</span>{" "}
          <span>work better?</span> <strong>Show me.</strong>
        </h2>

        <ButtonLink pendingLabel="Contact link coming soon">Talk to me</ButtonLink>

        <p className="contact__note lines">
          <span>Most projects start around {pricing.startingFrom}.</span>{" "}
          <span>You get a fixed price before</span> <span>anything starts.</span>
        </p>
      </div>

      <MediaSlot slot="contact image" className="contact__media" sizes="100vw" />
    </section>
  );
}
