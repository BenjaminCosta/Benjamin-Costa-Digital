import Image from "next/image";
import { ArrowIcon } from "./arrow-icon";

export function LinkedInProfileLink({ href }: Readonly<{ href: string | null }>) {
  const content = (
    <>
      <Image src="/images/brands/linkedin.png" alt="LinkedIn logo" width={635} height={540}
        sizes="20px" className="linkedin-profile-link__logo" aria-hidden="true" />
      <span className="linkedin-profile-link__label">LinkedIn</span>
      <ArrowIcon direction="up-right" />
    </>
  );

  // Keep an honest preview until the owner supplies the destination.
  if (!href) {
    return (
      <span className="linkedin-profile-link" role="link" aria-disabled="true" title="LinkedIn profile URL pending">
        {content}<span className="visually-hidden"> — profile link pending</span>
      </span>
    );
  }
  return (
    <a className="linkedin-profile-link" href={href} target="_blank" rel="noopener noreferrer">
      {content}<span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  );
}
