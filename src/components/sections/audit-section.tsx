export function AuditSection() {
  return (
    <section
      id="audit"
      className="site-section section-inverse deferred-section"
      aria-labelledby="audit-title"
    >
      <div className="container-page section-stack">
        <div>
          <p className="section-kicker">02 / Audit</p>
          <p>Free website check</p>
        </div>

        <h2 id="audit-title" className="section-heading">
          <span>Got a website?</span>
          <span>Let&apos;s see what&apos;s slowing it down.</span>
        </h2>

        <div className="audit-control" aria-label="Future website audit input">
          <label htmlFor="website-url">Website URL</label>
          <div className="audit-control__row">
            <input
              id="website-url"
              type="url"
              inputMode="url"
              placeholder="Paste your website here"
              autoComplete="url"
              disabled
            />
            <button type="button" disabled aria-label="Website audit coming soon">
              →
            </button>
          </div>
        </div>

        <div className="split-copy">
          <h3>AI picks up the obvious stuff.</h3>
          <h3>I can look at the business.</h3>
        </div>

        <p className="section-copy">
          Send it over and I&apos;ll tell you what I&apos;d actually change — free, no
          catch.
        </p>

        <a href="#contact">Send it on WhatsApp →</a>
        <div className="media-slot" data-media="audit-texture" aria-hidden="true" />
      </div>
    </section>
  );
}
