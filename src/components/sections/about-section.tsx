import { Backdrop } from "@/components/ui/backdrop";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHead } from "@/components/ui/section-head";
import { backdropAlt, backdrops, site } from "@/data/site-content";

export function AboutSection() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <Backdrop
        src={backdrops.about}
        alt={backdropAlt.about}
        className="about__backdrop"
        sizes="(min-width: 64rem) 60vw, 180vw"
      />

      <div className="page-container indexed about__body" data-reveal>
        <div className="about__main">
          <SectionHead index="05" title="About" />
          <h2 id="about-title" className="display display--about">
            <span>I work with</span> <span>local businesses</span>{" "}
            <span>to build what</span> <span>actually helps.</span>
          </h2>
        </div>

        <div className="about__aside">
          <div className="about__bio">
            <p>
              I’m {site.name}, an independent developer and designer based on the
              Gold Coast.
            </p>
            <p>
              Since 2023 I’ve been working with businesses — from barbershops and
              dive centres to e-commerce stores — building websites, booking
              systems and automations that save time and bring in more customers.
            </p>
            <p>
              I use modern tools to build in weeks, for a fraction of what an
              agency charges for the same thing.
            </p>
          </div>

          <ButtonLink href="#contact">Let’s talk</ButtonLink>
        </div>
      </div>
    </section>
  );
}
