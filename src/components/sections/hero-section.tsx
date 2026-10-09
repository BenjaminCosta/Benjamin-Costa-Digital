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
          phones and tablets, with where it was taken written on it. */}
      <ArtDirectedPicture
        src={heroImage.src}
        alt={heroImage.alt}
        decorative={false}
        sizes="(min-width: 64rem) 39vw, 100vw"
        className="hero__media"
        quality={75}
        eager
      >
        {/* The alt text already names the place for screen readers */}
        <p className="mono-label hero__place" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" focusable="false">
            <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21z" />
            <circle cx="12" cy="10" r="2.3" />
          </svg>
          {heroImage.place}
        </p>
      </ArtDirectedPicture>
    </section>
  );
}
