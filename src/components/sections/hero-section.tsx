export function HeroSection() {
  return (
    <section className="site-section hero-section" aria-labelledby="hero-title">
      <div className="container-page section-stack">
        <div>
          <p className="section-kicker">01 / Hero</p>
          <h1 id="hero-title" className="display-heading">
            <span>More customers,</span>
            <span>fewer things</span>
            <span>done by hand.</span>
          </h1>
        </div>

        <p className="section-copy">
          I build websites, booking flows and automations for local businesses
          on the Gold Coast.
        </p>

        <div className="cta-row" aria-label="Hero actions">
          <a href="#business-ideas">Find ideas for your business →</a>
          <a href="#work">See my work ↓</a>
        </div>

        <div className="media-slot" data-media="gold-coast-business" aria-hidden="true" />
      </div>
    </section>
  );
}
