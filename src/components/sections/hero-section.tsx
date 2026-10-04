import { ArrowIcon } from "@/components/ui/arrow-icon";
import { ButtonLink } from "@/components/ui/button-link";
import { MediaSlot } from "@/components/ui/media-slot";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container hero__body">
        <h1 id="hero-title" className="display display--hero">
          <span>More</span> <span>customers,</span> <span>fewer things</span>{" "}
          <span>done by hand.</span>
        </h1>

        <p className="hero__lede lines">
          <span>I build websites, booking flows and</span>{" "}
          <span>automations for local businesses</span>{" "}
          <span>on the Gold Coast.</span>
        </p>

        <div className="hero__actions">
          <ButtonLink href="#audit">Check your website</ButtonLink>
          <div className="hero__secondary">
            <a className="text-link text-link--underlined" href="#work">
              <span className="text-link__label">See my work</span>
              <ArrowIcon direction="down" />
            </a>
          </div>
        </div>
      </div>

      <MediaSlot
        slot="hero image"
        className="hero__media"
        sizes="100vw"
        preload
      />
    </section>
  );
}
