import { WorkShowcase } from "@/components/sections/work-showcase";
import { plannedProjectCount, projects } from "@/data/site-content";

export function SelectedWorkSection() {
  return (
    <section
      id="work"
      className="section work"
      aria-labelledby="work-title"
      data-reveal
    >
      <WorkShowcase projects={projects} total={plannedProjectCount} />
    </section>
  );
}
