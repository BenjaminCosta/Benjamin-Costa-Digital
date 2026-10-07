import Image from "next/image";
import { WorkProject } from "@/components/sections/work-project";
import { WorkShowcase } from "@/components/sections/work-showcase";
import { selectedWorkProjects } from "@/data/selected-work";
import "./selected-work.css";

export function SelectedWorkSection() {
  if (!selectedWorkProjects.length) return null;
  return (
    <section
      id="work"
      className="section work selected-work"
      aria-labelledby="work-title"
    >
      <Image src="/images/work/daylight-background.webp" alt="" fill sizes="100vw"
        quality={50} className="sw-background" aria-hidden="true" />
      <WorkShowcase
        projectNames={selectedWorkProjects.map(({ name }) => name)}
        heading={<h2 id="work-title" className="sw-title">A few things<br /><em>I’ve built.</em></h2>}
        slides={selectedWorkProjects.map((project) => <WorkProject key={project.id} project={project} />)}
        selectors={selectedWorkProjects.map((project) => (
          <span key={project.id} className="sw-selector__content">
            <span className={`sw-isotipo sw-isotipo--${project.id}`}>
              {project.isotipo ? <Image src={project.isotipo} width={48} height={48} sizes="48px" alt="" /> : null}
            </span>
            <span className="sw-selector__name">{project.name}</span>
          </span>
        ))}
      />
    </section>
  );
}
