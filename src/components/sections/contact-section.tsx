export function ContactSection() {
  return (
    <section
      id="contact"
      className="site-section deferred-section"
      aria-labelledby="contact-title"
    >
      <div className="container-page section-stack">
        <p className="section-kicker">06 / Contact</p>

        <h2 id="contact-title" className="display-heading">
          <span>Got something</span>
          <span>that could</span>
          <span>work better?</span>
          <strong>Show me.</strong>
        </h2>

        <span aria-label="Contact link will be added later">Talk to me →</span>

        <p>
          Most projects start around <strong>A$___</strong>.
          <br />
          You get a fixed price before anything starts.
        </p>

        <div className="media-slot" data-media="contact-architecture" aria-hidden="true" />
      </div>
    </section>
  );
}
