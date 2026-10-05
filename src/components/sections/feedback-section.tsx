import { ArrowIcon } from "@/components/ui/arrow-icon";
import { SectionHead } from "@/components/ui/section-head";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { WorkanaLogo } from "@/components/ui/workana-logo";
import { testimonials, workana } from "@/data/site-content";

const initials = (name: string) =>
  name
    .split(" ")
    .filter((part) => /^\p{L}/u.test(part))
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function Stars({ className }: Readonly<{ className?: string }>) {
  return (
    <span className={className ? `stars ${className}` : "stars"} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 20 20" focusable="false">
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
      <div className="page-container indexed feedback__body" data-reveal>
        <SectionHead index="04" title="Client feedback" />

        <div className="feedback__head">
          <div className="feedback__heading">
            <p className="feedback__verified">
              <VerifiedBadge />
              Workana verified
            </p>
            <h2 id="feedback-title" className="display display--feedback">
              <span>What</span> <span>clients say.</span>
            </h2>
          </div>

          <a
            className="workana-rating"
            href={workana.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Rated ${workana.score} out of 5 from ${workana.reviewCount} verified reviews on Workana (opens in a new tab)`}
          >
            <WorkanaLogo />
            <span className="workana-rating__score">
              <strong>{workana.score}</strong>
              <Stars />
            </span>
            <span className="workana-rating__count">{workana.reviewCount} verified reviews</span>
          </a>
        </div>

        <ol className="reviews">
          {testimonials.map((testimonial) => (
            <li key={testimonial.id} className="review">
              <figure>
                <Stars className="review__stars" />
                <span className="visually-hidden">Rated 5 out of 5.</span>
                <blockquote className="review__quote">
                  <p>“{testimonial.quote}”</p>
                </blockquote>
                <figcaption className="review__author">
                  <span className="review__avatar" aria-hidden="true">
                    {initials(testimonial.author)}
                  </span>
                  <span>
                    <span className="review__name">{testimonial.author}</span>
                    <span className="review__project">{testimonial.project}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        <div className="feedback__foot">
          <p className="feedback__note">Reviews translated from Spanish.</p>
          <a
            className="text-link text-link--underlined feedback__profile"
            href={workana.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-link__label">View profile on Workana</span>
            <ArrowIcon direction="up-right" />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
