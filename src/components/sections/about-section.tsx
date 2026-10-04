import { MediaSlot } from "@/components/ui/media-slot";
import { SectionHead } from "@/components/ui/section-head";
import { principles, site } from "@/data/site-content";

export function AboutSection() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="page-container indexed about__body" data-reveal>
        <div className="about__intro">
          <div className="about__main">
            <SectionHead index="05" title="How I work" aside="Since 2023" />
            <h2 id="about-title" className="display display--about">
              <span>Directly with you.</span> <span>Start to finish.</span>
            </h2>
          </div>

          <div className="about__bio">
            <p>
              I’m {site.name}, an independent developer and designer based on the
              Gold Coast.
            </p>
            <p>
              I work directly with business owners, from figuring out what matters
              to designing, building and launching the solution.
            </p>
          </div>
        </div>

        <ul className="principles">
          {principles.map((principle) => (
            <li key={principle.id}>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </li>
          ))}
        </ul>
      </div>

      <MediaSlot
        slot="about image"
        className="about__media"
        sizes="(min-width: 64rem) 20vw, 100vw"
      />
    </section>
  );
}
