# Workana client feedback

- Ratings and eight written Spanish comments: Benjamin's Workana transcription supplied on 8 October 2026. The total is **18 client ratings**, not 18 written reviews. The displayed score is 5.0. No exact project years or freelancer verification status were supplied.
- Source profile and original reviews: https://www.workana.com/freelancer/6525bdbaa3b696218eb9e38608f3ea03#section-ratings
- English translations and original Spanish text are paired in `src/data/workana.ts`. All eight comments appear in a native scroll-snap carousel, interleaving Shopify, web design, automation and custom software. No supplied comment is cut short or invented. Skills come from the supplied project titles and skills lists.
- Official brand guide and Poppins typography: https://brand.workana.com/
- Unmodified official vector wordmark, the navy variant for light backgrounds: https://brand.workana.com/images/negative-logo.svg → `public/images/workana/logo.svg`.
- Profile portrait: copied unchanged from the owner's `Documents/Benjamin Costa Digital/public/images/profile.jpg`. Original resolution: 192 × 192.

The owner's follow-up explicitly requested a purple check rosette on the portrait. This is a decorative, locally drawn icon matching the supplied reference, not an official Workana certification asset or a new textual certification claim. Incorrect names, invented project years and the outdated count of 10 reviews were not retained. These figures are curated content, not a live Workana API feed.

On 9 October the owner supplied an Instagram-style reference. The icon now uses a compact 12-point seal, a purple fill, a crisp white check and a white keyline at a 32/36px footprint. It is not labelled as official verification: Workana's actual verified freelancer badge is a different campaign-specific mark described at https://help.workana.com/hc/en-us/articles/360041359014-What-Do-the-Badges-on-Profiles-Mean.

LinkedIn's official, unmodified `LI-In-Bug.png` was downloaded from the package linked by https://brand.linkedin.com/downloads: https://content.linkedin.com/content/dam/me/business/en-us/amp/xbu/linkedin-revised-brand-guidelines/logos/in-logo.zip. It lives in `public/images/brands/linkedin.png`. Benjamin confirmed his profile destination on 9 October: https://www.linkedin.com/in/benjamin-costa-mihanovich-2088b628a. It is stored in `src/data/social-profiles.ts` and opens in a new tab. An explicitly disabled fallback is kept for a missing URL, never an invented link.

The LinkedIn destination appears beside the Workana profile link in an editorial text-link group on desktop and mobile, not as a boxed button inside the profile identity.
