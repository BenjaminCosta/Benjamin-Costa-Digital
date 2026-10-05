import { WorkShowcase } from "@/components/sections/work-showcase";
import { Backdrop } from "@/components/ui/backdrop";
import { backdrops, plannedProjectCount, projects } from "@/data/site-content";

export function SelectedWorkSection() {
  return (
    <section
      id="work"
      className="section work"
      aria-labelledby="work-title"
      data-reveal
    >
      <Backdrop
        src={backdrops.work}
        className="work__backdrop"
        sizes="(min-width: 64rem) 70vw, 200vw"
      />
      <WorkShowcase projects={projects} total={plannedProjectCount} />
    </section>
  );
}
