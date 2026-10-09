import Image from "next/image";
import { ArrowIcon } from "@/components/ui/arrow-icon";
import { WorkanaLogo } from "@/components/ui/workana-logo";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { LinkedInProfileLink } from "@/components/ui/linkedin-profile-link";
import { socialProfiles } from "@/data/social-profiles";
import { ReviewCarousel } from "./review-carousel";
import { carouselTestimonials, workana } from "@/data/workana";
import type { Testimonial } from "@/types/content";
import "./feedback-section.css";

function Stars() {
  return (
    <span className="wk-stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <svg key={index} viewBox="0 0 20 20" focusable="false">
          <path d="M10 1.2l2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L10 14.8l-5.4 3 1.2-6.1L1.3 7.5l6.1-.7z" />
        </svg>
      ))}
    </span>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="wk-briefcase" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
      <rect x="2.5" y="7" width="19" height="14" rx="2" />
      <path d="M8 7V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V7M3 12h18" />
    </svg>
  );
}

function ProfileLink({ className }: Readonly<{ className: string }>) {
  return (
    <a className={className} href={workana.profileUrl} target="_blank" rel="noopener noreferrer">
      <span className="wk-profile-link__label">Open Workana profile</span><ArrowIcon direction="up-right" />
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}

function ProfileLinks({ className }: Readonly<{ className: string }>) {
  return (
    <nav className={className} aria-label="Professional profiles">
      <ProfileLink className="wk-profile-link" />
      <LinkedInProfileLink href={socialProfiles.linkedin} />
    </nav>
  );
}

function ReviewCard({ review }: Readonly<{ review: Testimonial }>) {
  const initials = review.author.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  return (
    <li className="wk-review">
      <figure>
        <div className="wk-review__top">
          <Stars />
          <span className="visually-hidden">Rated {review.rating} out of 5.</span>
          <span className="wk-source"><span>From</span><WorkanaLogo /></span>
        </div>
        <blockquote className="wk-review__quote"><p>“{review.quote}”</p></blockquote>
        <figcaption className="wk-review__author">
          <span className="wk-review__avatar" aria-hidden="true">{initials}</span>
          <span><span className="wk-review__name">{review.author}</span><span className="wk-review__project">{review.project}</span></span>
        </figcaption>
        <ul className="wk-review__tags" role="list" aria-label="Project focus">
          {review.tags.map((tag, index) => <li key={tag}>{index === 0 ? <BriefcaseIcon /> : null}{tag}</li>)}
        </ul>
      </figure>
    </li>
  );
}

export function FeedbackSection() {
  return (
    <section id="feedback" className="section feedback workana-feedback" aria-labelledby="feedback-title" data-brand="workana">
      <div className="page-container wk-feedback__body">
        <p className="mono-label wk-feedback__index">04 <span aria-hidden="true"> / </span> Client feedback</p>
        <div className="wk-feedback__head">
          <h2 id="feedback-title" className="wk-feedback__title">What clients say.</h2>
          <p className="wk-feedback__lede">Straight from Workana. Translated from Spanish, otherwise untouched.</p>
          <ProfileLinks className="wk-profile-actions wk-profile-actions--desktop" />
        </div>
        <div className="wk-profile">
          <div className="wk-profile__brand"><WorkanaLogo className="wk-profile__logo" /><p className="mono-label">Public client feedback</p></div>
          <div className="wk-profile__portrait-wrap">
            <Image className="wk-profile__portrait" src={workana.portrait} alt="Benjamin Costa Mihanovich" width={192} height={192} sizes="(min-width: 1024px) 112px, 88px" />
            <span className="wk-profile__badge" aria-hidden="true"><VerifiedBadge /></span>
          </div>
          <div className="wk-profile__identity">
            <h3>{workana.name}</h3><p className="wk-profile__role">{workana.role}</p>
            <p className="wk-profile__meta"><BriefcaseIcon />Freelancer on Workana</p>
          </div>
          <div className="wk-profile__rating" aria-label={`${workana.score} out of 5, based on ${workana.ratingCount} client ratings on Workana`}>
            <p className="wk-profile__score"><strong>{workana.score}</strong><span>/ 5</span></p>
            <Stars /><p className="wk-profile__count">Based on {workana.ratingCount} client ratings on Workana</p>
          </div>
          <ProfileLinks className="wk-profile-actions wk-profile-actions--mobile" />
        </div>
        <ReviewCarousel count={carouselTestimonials.length}>
          {carouselTestimonials.map((review) => <ReviewCard key={review.id} review={review} />)}
        </ReviewCarousel>
      </div>
    </section>
  );
}
