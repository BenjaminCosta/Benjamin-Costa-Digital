import { ArrowIcon } from "@/components/ui/arrow-icon";
import { ButtonLink } from "@/components/ui/button-link";
import { MediaSlot } from "@/components/ui/media-slot";
import { SectionHead } from "@/components/ui/section-head";

export function AuditSection() {
  return (
    <section
      id="audit"
      className="section section--dark audit"
      aria-labelledby="audit-title"
      data-header-theme="dark"
    >
      <div className="container audit__body" data-reveal>
        <SectionHead index="02" title="Audit" aside="Free website check" />

        <h2 id="audit-title" className="display display--audit">
          <span>Got a</span> <span>website?</span> <span>Let’s see</span>{" "}
          <span>what’s slowing</span> <span>it down.</span>
        </h2>

        <form className="audit-field" aria-label="Free website check">
          <label className="visually-hidden" htmlFor="website-url">
            Website URL
          </label>
          <input
            id="website-url"
            name="url"
            type="url"
            inputMode="url"
            placeholder="[ paste your website here ]"
            autoComplete="url"
            disabled
          />
          <button type="button" disabled aria-label="Website check coming soon">
            <ArrowIcon />
          </button>
        </form>

        <div className="audit__copy">
          <p className="audit__statement lines">
            <span>AI picks up the obvious</span> <span>stuff. I can look at</span>{" "}
            <span>the business.</span>
          </p>
          <p className="audit__note lines">
            <span>Send it over and I’ll tell you what</span>{" "}
            <span>I’d actually change — free, no catch.</span>
          </p>
        </div>

        <ButtonLink tone="light" href="#contact">
          Send it on WhatsApp
        </ButtonLink>
      </div>

      <MediaSlot slot="audit texture" className="audit__media" sizes="100vw" />
    </section>
  );
}
