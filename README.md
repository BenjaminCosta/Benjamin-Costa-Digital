# Benjamin Costa Digital

Production-ready foundation for Benjamin Costa's personal and business website. The semantic landing-page structure and initial content are in place; final art direction, imagery, integrations, and interaction design are intentionally deferred.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Server Components by default, with one interactive island for the business ideas tool
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

No database, authentication, CMS, analytics, new animation library or generic component library was added. The rest of the site is intentionally still at the foundation stage. Final visual design remains deferred. The original plan is in [business ideas plan](docs/business-ideas-plan.md).
