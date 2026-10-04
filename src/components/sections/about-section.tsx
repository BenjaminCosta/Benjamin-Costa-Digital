export function AboutSection() {
  return (
    <section
      id="about"
      className="site-section deferred-section"
      aria-labelledby="about-title"
    >
      <div className="container-page section-stack">
        <p className="section-kicker">05 / About</p>

        <h2 id="about-title" className="section-heading">
          <span>I work with</span>
          <span>local businesses</span>
          <span>to build what</span>
          <span>actually helps.</span>
        </h2>

        <div className="section-copy prose-stack">
          <p>
            I&apos;m Benjamin Costa, an independent developer and designer based on
            the Gold Coast.
          </p>
          <p>
            Since 2023 I&apos;ve been working with businesses — from barbershops and
            dive centres to e-commerce stores — building websites, booking
            systems and automations that save time and bring in more customers.
          </p>
          <p>
            I use modern tools and AI to move fast, keep things simple and focus
            on what actually makes a difference for your business.
          </p>
        </div>

        <a href="#contact">Let&apos;s talk →</a>
        <div className="media-slot" data-media="about-architecture" aria-hidden="true" />
      </div>
    </section>
  );
}
