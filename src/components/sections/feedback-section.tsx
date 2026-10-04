import { testimonials } from "@/data/site-content";

export function FeedbackSection() {
  return (
    <section
      id="feedback"
      className="site-section deferred-section"
      aria-labelledby="feedback-title"
      data-brand="workana"
    >
      <div className="container-page section-stack">
        <div>
          <p className="section-kicker">04 / Client feedback</p>
          <p>Workana verified</p>
        </div>

        <h2 id="feedback-title" className="section-heading">
          What clients say.
        </h2>

        <div>
          <p>Workana</p>
          <p aria-label="Rated five out of five stars">5.0 ★★★★★</p>
          <p>20+ verified reviews</p>
        </div>

        <div className="testimonial-list">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.id} className="testimonial">
              <blockquote>
                <p>“{testimonial.quote}”</p>
              </blockquote>
              <figcaption>
                <strong>{testimonial.author}</strong>
                <span>{testimonial.project}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="cta-row" aria-label="External profiles to add">
          <span>View profile on Workana ↗</span>
          <span>LinkedIn ↗</span>
        </div>
      </div>
    </section>
  );
}
