import { plannedProjectCount, projects } from "@/data/site-content";

export function SelectedWorkSection() {
  return (
    <section
      id="work"
      className="site-section deferred-section"
      aria-labelledby="work-title"
    >
      <div className="container-page section-stack">
        <div>
          <p className="section-kicker">03 / Selected work</p>
          <p>
            01 / {String(plannedProjectCount).padStart(2, "0")}
          </p>
        </div>

        <h2 id="work-title" className="section-heading">
          <span>A few things</span>
          <span>I&apos;ve built.</span>
        </h2>
      </div>

      <ol className="work-track" aria-label="Selected projects">
        {projects.map((project, index) => {
          const projectTitleId = `project-${project.id}`;

          return (
            <li key={project.id} className="work-slide">
              <article aria-labelledby={projectTitleId}>
                <p aria-label={`Project ${index + 1}`}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 id={projectTitleId}>{project.name}</h3>
                <p>{project.location}</p>
                <p>{project.services.join(" / ")}</p>
                <p>{project.summary}</p>
                {project.href ? (
                  <a href={project.href}>View project ↗</a>
                ) : (
                  <span aria-label="Project link will be added later">
                    View project ↗
                  </span>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
