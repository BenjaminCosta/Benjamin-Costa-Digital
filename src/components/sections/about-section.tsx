import { ArrowIcon } from "@/components/ui/arrow-icon";
import { MediaSlot } from "@/components/ui/media-slot";
import { SectionHead } from "@/components/ui/section-head";

export function AboutSection() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container" data-reveal>
        <SectionHead index="05" title="About" aside="Since 2023" />

        <h2 id="about-title" className="display display--about">
          <span>I work with</span> <span>local businesses</span>{" "}
          <span>to build what</span> <span>actually helps.</span>
        </h2>

        <div className="about__copy">
          <p>
            I’m Benjamin Costa, an independent developer and designer based on
            the Gold Coast.
          </p>
          <p>
            Since 2023 I’ve been working with businesses — from barbershops and
            dive centres to e-commerce stores — building websites, booking
            systems and automations that save time and bring in more customers.
          </p>
          <p>
            I use modern tools and AI to move fast, keep things simple and focus
            on what actually makes a difference for your business.
          </p>
        </div>

        <a className="text-link text-link--underlined" href="#contact">
          <span className="text-link__label">Let’s talk</span>
          <ArrowIcon />
        </a>
      </div>

      <MediaSlot slot="about image" className="about__media" sizes="100vw" />
    </section>
  );
}
