import { ArrowIcon } from "@/components/ui/arrow-icon";
import { ButtonLink } from "@/components/ui/button-link";
import { Backdrop } from "@/components/ui/backdrop";
import { backdrops, site } from "@/data/site-content";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Backdrop
        src={backdrops.hero}
        className="hero__backdrop"
        sizes="(min-width: 64rem) 100vw, 220vw"
        eager
      />

      <div className="hero__panel">
        <div className="page-container indexed hero__body">
          <span className="indexed__index only-desktop" aria-hidden="true">
            01
          </span>
          <p className="mono-label hero__kicker only-desktop">
            Digital systems
            <br />
            for local businesses
          </p>

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
            <ButtonLink href="#ideas">Check your website</ButtonLink>
            <div className="hero__secondary">
              <a className="text-link text-link--underlined" href="#work">
                <span className="text-link__label">See my work</span>
                <ArrowIcon direction="down" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <p className="hero__coords only-desktop" aria-hidden="true">
        {site.coordinates[0]}
        <br />
        {site.coordinates[1]}
      </p>
    </section>
  );
}
