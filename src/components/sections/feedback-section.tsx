import { ArrowIcon } from "@/components/ui/arrow-icon";
import { SectionHead } from "@/components/ui/section-head";
import { profileLinks, testimonials, workanaRating } from "@/data/site-content";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function Stars() {
  return (
    <span className="stars" role="img" aria-label="Rated 5 out of 5">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M10 1.2l2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L10 14.8l-5.4 3 1.2-6.1L1.3 7.5l6.1-.7z" />
        </svg>
      ))}
    </span>
  );
}

export function FeedbackSection() {
  return (
    <section
      id="feedback"
      className="section feedback"
      aria-labelledby="feedback-title"
      data-brand="workana"
    >
      <div className="container" data-reveal>
        <SectionHead index="04" title="Client feedback" aside="Workana" ruled={false} />

        <h2 id="feedback-title" className="display display--feedback">
          What clients say.
        </h2>

        <div className="rating">
          <div className="rating__score">
            <p className="rating__value">
              <strong>{workanaRating.score}</strong>
              <span> / {workanaRating.outOf}</span>
            </p>
            <p className="rating__meta">
              {workanaRating.completedProjects} completed projects
            </p>
          </div>
          <div className="rating__source">
            <p className="rating__verified">Verified freelance profile</p>
            <p className="rating__brand">
              <span className="workana-mark" aria-hidden="true" />
              Workana
            </p>
          </div>
        </div>

        <ol className="testimonials">
          {testimonials.map((testimonial, index) => (
            <li key={testimonial.id} className="testimonial">
              <span className="testimonial__index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <figure className="testimonial__body">
                <Stars />
                <blockquote className="testimonial__quote">
                  <p>“{testimonial.quote}”</p>
                </blockquote>
                <figcaption className="testimonial__author">
                  <span
                    className="avatar"
                    aria-hidden="true"
                    style={{
                      backgroundColor: testimonial.avatar.background,
                      color: testimonial.avatar.foreground,
                    }}
                  >
                    {initials(testimonial.author)}
                  </span>
                  <span className="testimonial__person">
                    <span className="testimonial__name">{testimonial.author}</span>
                    <span className="testimonial__project">{testimonial.project}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        <ul className="profiles" aria-label="Profiles">
          {profileLinks.map((profile) => {
            const content = (
              <>
                <span className="mono-label">{profile.label}</span>
                <span className="profiles__value">{profile.value}</span>
                <span className="profiles__cta">
                  View profile
                  <ArrowIcon direction="up-right" />
                </span>
              </>
            );

            return (
              <li key={profile.id}>
                {profile.href ? (
                  <a className="profiles__item" href={profile.href} target="_blank" rel="noreferrer">
                    {content}
                  </a>
                ) : (
                  <span className="profiles__item" data-pending>
                    {content}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
