import { ButtonLink } from "@/components/ui/button-link";
import { SectionHead } from "@/components/ui/section-head";
import { whatsAppHref } from "@/lib/contact";

export function ContactSection() {
  return (
    <section
      id="contact"
      className="section section--dark contact"
      aria-labelledby="contact-title"
      data-header-theme="dark"
    >
      <div className="page-container indexed contact__body" data-reveal>
        <SectionHead index="06" title="Final CTA" desktopTitle="Contact" />

        <h2 id="contact-title" className="display display--contact">
          <span>Got something</span> <span>that could</span>{" "}
          <span>work better?</span> <strong>Show me.</strong>
        </h2>

        <div className="contact__actions">
          <ButtonLink tone="light" href={whatsAppHref("contact")} newTab="opens WhatsApp" arrow="up-right">
            Talk to me
          </ButtonLink>

          <p className="contact__note lines">
            <span>You get a fixed price before</span>{" "}
            <span>anything starts — and a lot less</span>{" "}
            <span>than an agency would charge.</span>
          </p>
        </div>
      </div>

    </section>
  );
}
