# Benjamin Costa Digital

Benjamin Costa's personal and business website. The design from main is integrated with the server-only business ideas tool; final content and production activation remain to be completed.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Server Components by default, with isolated interactive controllers for business ideas and selected-work navigation
- AI SDK + direct OpenAI Responses API for server-only structured generation
- Vercel deployment target

## Local development

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run check
npm run build
```

## Project structure

```text
src/
  app/          Routes, metadata, and global styles
  components/   Server-rendered landing sections and interactive business ideas selector
  data/         Typed content, prepared goal responses, and server-only service catalog
  lib/          Shared server-first utilities
  types/        Shared TypeScript types
public/         Static editorial and project assets
```

## Deployment

The project is configured for Vercel. Set `SITE_URL` to the canonical production URL in the Vercel project settings before launch.

The chosen business ideas flow uses OpenAI with independently retrieved website text or an owner description: five instant prepared responses, an optional public website, bounded text retrieval (up to three same-origin pages within 6000 characters and 12 seconds), source links, exactly three validated opportunities, and contextual WhatsApp links. Businesses without a website can use a short description; missing context is requested before generation. Instagram is no longer offered. Selecting goals or typing never calls AI. The homepage remains statically prerendered; only submitted requests run the server endpoint. No Google content is sent to OpenAI. Google/name discovery is not part of this version; the locally configured Google key is unused and Places remains disabled. See [Google setup status](docs/google-cloud-setup.md).

WhatsApp is configured as `+61 409 871 882`; `WHATSAPP_NUMBER` can override it. Generation is intentionally disabled by default. Add `OPENAI_API_KEY` locally, then configure and publish both Vercel Firewall rules before public activation. See [setup and security notes](docs/business-ideas-setup.md). Never put secrets in `NEXT_PUBLIC_` variables. Rebuild after changing settings that affect the static homepage.

The economical default is `gpt-6-luna`, with reasoning disabled, standard service tier, Responses storage disabled, at most 6000 characters of public text, 1600 output tokens, one generation and no automatic retries or paid model escalation. Real quality must be evaluated before launch; the model can be changed through `BUSINESS_IDEAS_MODEL` to another model supporting these settings.

`npm run check` includes lint, type checking and deterministic security/API tests. Tests use a mock model only inside test files; production never returns simulated business ideas. One real local OpenAI request has also been verified end-to-end with a hypothetical business description. Broader model-quality evaluation and live Vercel Firewall enforcement are still required before public launch.

No database, authentication, CMS, analytics or new animation library was added. The original plan is in [business ideas plan](docs/business-ideas-plan.md).
## Design system

Tokens live at the top of `src/app/globals.css`: Inter Tight for display and body copy, IBM Plex Mono for labels, a paper/ink palette, and editorial motion timings. Section backgrounds use decorative glass/acrylic photography. Selected work has its own scoped styles in `src/components/sections/selected-work.css` and typed content in `src/data/selected-work.ts`.

Selected work shows one of seven projects at a time on desktop and mobile, with arrows, swipe, keyboard navigation and original client isotipos. Static project markup is server-rendered. Only the small controller runs on the client; there is no autoplay or animation dependency. Mockups use lazy `next/image`, with the next image loaded on navigation intent before swapping slides. Reduced-motion preferences are respected. Optimized WebP exports live in `public/images/work/`; original captures and generation prompts are preserved under `assets/selected-work/`.

The background stays stationary: transparent v3 device layers fade out in 160 ms and in over 340 ms, without translating the slide or its copy. A1 Estudio and StockIA use text-only project headings; their original isotipos remain in the selector. Device extraction prompts are preserved in `assets/selected-work/concepts/device-cutouts-prompts.md`.

Wordmarks come from the final 4K logos in `public/images/logos/`, exported trimmed and ink-coloured under `public/images/work/wordmarks/hq/`, each with a display width balanced for its proportions and weight. Every selector uses the same translucent glass surface; the active project has a dark background, not an underline. StockIA has no supplied wordmark, so its name stays in type.

All seven project CTAs open Benjamin's supplied live preview links in a new tab, including StockIA's `/comercio` route. The section title uses one consistent, non-italic typeface. Original captures remain archived under `assets/selected-work/`; generated mockup screens are illustrative, not pixel-exact evidence of the delivered interfaces. The existing Custom Operations Platform record is preserved as pending, not misidentified as StockIA. See [selected work notes](docs/selected-work-direction.md).

The section 02 design now uses the real OpenAI endpoint, source/evidence validation and contextual WhatsApp links, not preview results. Broader production evaluation and Vercel protections remain required before launch.
