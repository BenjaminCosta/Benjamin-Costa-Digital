import { BusinessIdeasTool } from "@/components/business-ideas/business-ideas-tool";
import { getIdeasConfig } from "@/lib/business-ideas/config";

export function BusinessIdeasSection() {
  const { available, whatsappNumber } = getIdeasConfig();
  return (
    <section
      id="business-ideas"
      className="site-section section-inverse deferred-section"
      aria-labelledby="business-ideas-title"
    >
      <div id="audit" aria-hidden="true" />
      <div className="container-page section-stack">
        <p className="section-kicker">02 / Business ideas</p>
        <h2 id="business-ideas-title" className="section-heading">
          What could work better in your business?
        </h2>
        <BusinessIdeasTool available={available} whatsappNumber={whatsappNumber} />
        <noscript>
          <p>
            Enable JavaScript to explore the options, or{" "}
            <a href="#contact">get in touch with Ben</a>.
          </p>
        </noscript>
      </div>
    </section>
  );
}
