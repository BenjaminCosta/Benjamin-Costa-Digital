# Benjamin Costa Digital

Production-ready foundation for Benjamin Costa's personal and business website. The semantic landing-page structure and initial content are in place; final art direction, imagery, integrations, and interaction design are intentionally deferred.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Server Components by default
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
  components/   Server-rendered layout and landing sections
  data/         Typed project and testimonial content
  lib/          Shared server-first utilities
  types/        Shared TypeScript types
public/         Static editorial and project assets
```

## Deployment

The project is configured for Vercel. Set `SITE_URL` to the canonical production URL in the Vercel project settings before launch.

## Design system

Tokens live at the top of `src/app/globals.css`: Inter Tight for display and body copy, IBM Plex Mono for labels, a paper/ink palette with no accent colour, and editorial motion timings. The mobile layout follows the approved mockups; image areas render neutral placeholders (`MediaSlot`) until final photography is added.

Desktop layouts, final imagery, external integrations, analytics and working contact actions are not implemented yet.
