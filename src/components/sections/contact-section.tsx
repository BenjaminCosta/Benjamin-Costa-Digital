import { ButtonLink } from "@/components/ui/button-link";
import { Backdrop } from "@/components/ui/backdrop";
import { SectionHead } from "@/components/ui/section-head";
import { backdrops, pricing } from "@/data/site-content";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="section section--dark contact"
      aria-labelledby="contact-title"
      data-header-theme="dark"
    >
      <Backdrop
        src={backdrops.contact}
        className="contact__backdrop"
        sizes="(min-width: 64rem) 65vw, 180vw"
      />

      <div className="page-container indexed contact__body" data-reveal>
        <SectionHead index="06" title="Final CTA" desktopTitle="Contact" />

        <h2 id="contact-title" className="display display--contact">
          <span>Got something</span> <span>that could</span>{" "}
          <span>work better?</span> <strong>Show me.</strong>
        </h2>

        <div className="contact__actions">
          <ButtonLink tone="light" pendingLabel="Contact link coming soon">
            Talk to me
          </ButtonLink>

          <p className="contact__note lines">
            <span>Most projects start around {pricing.startingFrom}.</span>{" "}
            <span>You get a fixed price before</span> <span>anything starts.</span>
          </p>
        </div>
      </div>

    </section>
  );
}
