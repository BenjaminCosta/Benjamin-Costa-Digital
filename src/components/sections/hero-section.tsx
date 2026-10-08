import { ArrowIcon } from "@/components/ui/arrow-icon";
import { ArtDirectedPicture } from "@/components/ui/art-directed-picture";
import { ButtonLink } from "@/components/ui/button-link";
import { heroImage } from "@/data/site-content";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__panel">
        <div className="page-container indexed hero__body">
          <span className="indexed__index only-desktop" aria-hidden="true">
            01
          </span>
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

      {/* One photo: beside the copy on desktop (full height), under it on
          phones and tablets with a short caption. */}
      <ArtDirectedPicture
        src={heroImage.src}
        alt={heroImage.alt}
        decorative={false}
        sizes="(min-width: 64rem) 39vw, 100vw"
        className="hero__media"
        quality={75}
        eager
      />
      {/* The alt text already names the place for screen readers */}
      <p className="mono-label hero__caption only-mobile" aria-hidden="true">{heroImage.caption}</p>
    </section>
  );
}
