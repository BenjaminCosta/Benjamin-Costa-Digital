# Selected work — review assets

Implemented in the Next.js app on `codex/selected-work-direction`; not deployed. `preview.html` remains the historical review board, not the actual carousel. Open the app at `http://127.0.0.1:3000/#work` to review the implementation.

The approved single-project layout uses seven original isotipos, supplied wordmarks where usable, seven generated daylight/glass mockups and a matching decorative background. Optimized exports are in `public/images/work/`. Source screenshots remain linked for projects whose live URLs are not confirmed. New generation prompts and provenance are in `concepts/carousel-prompts.md`. No source captures or branding originals were edited.

Final app proof: `concepts/carousel-desktop-final.png` and `concepts/carousel-mobile-final.png`. Production-mode local preview is available at `http://127.0.0.1:3001/#work`. All 45 tests, lint, type checking and production build passed; responsive navigation was verified in the browser. Five wordmarks have additional lossless WebP exports under `public/images/work/wordmarks/`; supplied PNGs are preserved.

- `preview.html`: responsive, zero-JavaScript review board for the seven projects. Open directly in a browser, or serve **this directory only** locally. Five project titles use supplied wordmarks; StockIA and A1 use their isotipo plus text. A horizontal native-scroll selector uses all seven isotipos. The first two cards show generated v2 mockups, clearly labelled as concepts; the other five retain original screenshot files in CSS frames. Original captures remain linked. Large PNGs are review sources, not optimized production assets.
- `brand-assets/logos/` and `brand-assets/isotipos/`: unchanged copies of the two user-supplied directories under `Documents/Benjamin Costa Digital/public/images/`. SVG viewBox wrappers trim empty wordmark padding; CSS makes white wordmarks readable on the light review background. No lettering is recreated. Several logo exports need better originals before production; A1’s wordmark is damaged, StockIA’s is absent.
- `source-captures/desktop/` and `source-captures/mobile/`: all 28 original PNGs from the supplied ZIP, unchanged.
- `concepts/mr-moustache-glass-v1.png` and `concepts/kirra-dive-glass-v1.png`: generated 1536 × 1024 review concepts. Shared composition, glass and daylight; not approved final media, small screen details may differ from the originals.
- `concepts/prompts.md`: full prompts and reference roles; generated using the built-in image tool, not the OpenAI API key configured for the website.
- `concepts/mr-moustache-glass-v2.png` and `concepts/kirra-dive-glass-v2.png`: revised 1536 × 1024 concepts with angled laptops, foreground phones, palm shadows and thick beveled glass. Screens remain generated approximations, not pixel-exact composites. v1 files are preserved for comparison.
- `concepts/prompts-v2.md`: full v2 prompts and reference provenance.
- `concepts/preview-brands-desktop.png` and `concepts/preview-brands-mobile.png`: revised review-board proof with original branding and v2 imagery.
- `concepts/preview-desktop.png` and `concepts/preview-mobile.png`: browser verification captures of the review board.
- `../../docs/selected-work-direction.md`: research, proposed copy, art direction per project, source/link confidence, logo issues and implementation plan.

Before publishing, confirm exact project URLs and Benjamin’s delivered scope and obtain cleaner logo exports. The generated device screens are illustrative approximations; the authentic captures remain separately available. Do not ship all master PNGs or review boards. The actual carousel has no autoplay or animation dependency.
