import Image from "next/image";
import type { CSSProperties } from "react";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import type { Project } from "@/types/content";

/** Static project content stays on the server; only navigation is interactive. */
export function WorkProject({ project }: Readonly<{ project: Project }>) {
  const { wordmark } = project;
  return (
    <article className="sw-project" aria-labelledby={`work-${project.id}-title`}>
      <div className="sw-project__visual">
        {project.image ? (
          <Image src={project.image.src} alt={project.image.alt} width={1536} height={1024}
            sizes="(min-width: 1500px) 1000px, (min-width: 64rem) 68vw, 100vw"
            className="sw-project__image" draggable={false} />
        ) : null}
      </div>
      <div className="sw-project__copy">
        <h3 id={`work-${project.id}-title`} className={`sw-wordmark sw-wordmark--${project.id}`}>
          {wordmark ? (
            <>
              <span className="visually-hidden">{project.name}</span>
              <Image src={wordmark.src} alt={`${project.name} logo`} width={wordmark.width} height={wordmark.height}
                sizes={`${wordmark.display}px`} draggable={false} aria-hidden="true"
                style={{ "--wm-w": `${wordmark.display}px` } as CSSProperties} />
            </>
          ) : (
            <span>{project.name}</span>
          )}
        </h3>
        <p className="sw-project__location">{[project.category, project.location].filter(Boolean).join(" — ")}</p>
        <ul className="sw-project__services" aria-label="Project focus">
          {project.services.map((service) => <li key={service}>{service}</li>)}
        </ul>
        <p className="sw-project__summary">{project.summary}</p>
        {project.href || project.previewHref ? (
          <a className="button button--dark sw-project__cta" href={project.previewHref ?? project.href}
            target="_blank" rel="noopener noreferrer">
            <span>{project.previewHref ? "View preview" : "Visit website"}</span>
            <ArrowIcon direction="up-right" />
            <span className="visually-hidden"> — {project.name} (opens in a new tab)</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
