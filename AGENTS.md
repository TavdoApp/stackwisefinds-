# StakDock Delivery Rules

These rules apply to the entire StakDock repository.

## Operating Scope

- Deploy only through GitHub Actions and Cloudflare Pages, Workers, and D1.
- Never modify, provision, or depend on a VPS.
- Treat `https://stakdock.com` as the only canonical public domain.
- Preserve permanent redirects from legacy Stackwise domains.

## Regression Prevention & Fixed-Work Integrity Rule (NON-NEGOTIABLE)

- **Zero Regression Policy**: Once a feature, fix, or rule is completed, approved, or verified (e.g. 301 domain redirects, Wikipedia SVG logos, UI detail page design, D1 write confirmation), NO agent may modify, revert, overwrite, or break it in future iterations.
- **Approved Work Protection & Explicit Permission Gate**: If working on ANY task that might modify, touch, refactor, or risk breaking previously approved layouts or components (e.g. `Sticky 3-Column Editorial Grid`, `FeaturedSidebar`, `AiNewsSidebar`, `ToolDetailPage`, `ArticleView`, `VersusPage`, `AlternativesView`), **YOU MUST STOP IMMEDIATELY**, explain the exact risk to the user, and **wait for explicit written permission before making any changes**.
- **Safety Anchor Tag (`APPROVED_3COLUMNS_V1`)**: Git tag `APPROVED_3COLUMNS_V1` points to the exact 100% verified, approved homepage 3-column sticky layout.
- **Locked Files**: `FeaturedSidebar.jsx`, `AiNewsSidebar.jsx`, and `.toolify-3col-layout` in `src/index.css` are in a **Hard Lock Zone**. Any bug fix elsewhere (e.g. `ArticleView`, `ToolDetailPage`, `VersusPage`) MUST be made strictly inside its own isolated file without modifying the 3-column homepage files.
- **Cloudflare Pages Middleware Protection**: Legacy domain `stackwisefinds.com` 301 redirects to `https://stakdock.com` MUST be enforced via `functions/_middleware.js` in Cloudflare Pages so edge 301 redirects execute on 100% of requests before any static file or SPA route is evaluated.
- **Verification Before Handoff**: Every pull request, deployment, or code change MUST re-verify that previously fixed core features (301 redirects, logo resolution, detail view rendering, sticky 3-column layout) remain 100% functional.

## Technical SEO & Programmatic Indexing Gate (NON-NEGOTIABLE)

- **Single Canonical Trailing-Slash Architecture**: All programmatic routes (`/software/:id/`, `/alternatives/:id/`, `/vs/:slug/`, `/best/:id/`, `/categories/`, `/ranking/`, etc.) MUST generate folder-based `index.html` files in `dist/`. Standalone `.html` files (`dist/software/tool.html`) that create duplicate 200 OK endpoints are STRICTLY PROHIBITED.
- **Strict Canonical Tag Match**: Every page's `<link rel="canonical">` MUST strictly end with a trailing slash (`https://stakdock.com/.../`) matching the exact sitemap URL.
- **301 Permanent Redirects**: Non-trailing-slash requests (`/software/tool`) and HTTP requests MUST 301-redirect to their trailing-slash HTTPS canonical.
- **Full Semantic SSR Body**: Every generated page MUST contain rich semantic HTML inside `<div id="root">` (H1 heading, rating summary, pricing badges, tool overview, key features list, alternative competitor cards, and detailed comparison tables). Never output an empty `<div id="root"></div>` shell.
- **Sitemap `lastmod` Protection**: Never mass-overwrite `lastmod` across all URLs in automated cron jobs to prevent search engine crawl spikes.

## Google Algorithm Defense & Quality Compliance Gate (NON-NEGOTIABLE)

- **Anti-Scaled Content Abuse Standard**: Programmatic pages must never use repetitive boilerplate FAQ loops where only the tool name changes. Every page must contain distinct, dynamic tool-specific data (exact pricing, real features, platform compatibility).
- **Template Entropy & Uniqueness**: Maximum 30% template overlap between any two generated pages. Every comparison page (`/vs/`) must feature a full side-by-side spec comparison table, pros/cons, and distinct verdict.
- **Anti-Thin Content**: Every public page must contain a minimum of 250 words of structured, rich editorial content. Doorway pages or lightweight redirect cards are strictly prohibited.
- **Automated CI Google Compliance Gate**: `npm run build` MUST automatically execute `scripts/verifyGoogleCompliance.cjs` and `scripts/verifySeoIntegrity.cjs`. If any route violates canonical trailing slashes, contains empty shells, or exceeds template boilerplate thresholds, the build MUST abort immediately.

## Secrets and Access

- Never print, commit, paste, or log secrets, API tokens, D1 credentials, or `.env` values.
- Use encrypted GitHub Actions secrets and Cloudflare Worker secrets only.
- Revoke and replace any credential exposed in a terminal, chat, commit, or log.
- Do not change a secret name or deployment credential without verifying the corresponding GitHub workflow uses it.

## Cloudflare Delivery Gate & Mandatory Production Deployment (NON-NEGOTIABLE)

- **Mandatory Production Deployment**: Every completed task, feature, or bug fix MUST be built (`npm run build`), SEO-verified (`scripts/verifySeoIntegrity.cjs`), committed, and pushed to `origin/main`. 
- **Automated CI/CD Pipeline**: Every push to `main` automatically triggers `.github/workflows/deploy-pages.yml` to build and deploy Cloudflare Pages and `.github/workflows/deploy-worker.yml` for Cloudflare Workers.
- **Verification on Live Production**: No task or handoff is complete until the live production URL (`https://stakdock.com`) has been tested and verified to reflect the changes.
- `wrangler.toml` must contain real, non-placeholder resource IDs before deployment.
- Apply D1 migrations before deploying Worker code that depends on them.
- A deployment is complete only after its exact GitHub Actions run URL reports success.
- Report exact run URLs, never only workflow landing pages.
- Verify public APIs fail closed when required bindings or secrets are unavailable.

## Product and Content Integrity

- Do not auto-publish vendor submissions or sponsored listings. Automated RSS/scraper tool ingestion is PERMANENTLY STOPPED to prevent expired or parked domain listings. Tools are added exclusively via manual editorial review or the official Vendor Submission portal (`/api/submit-vendor`). Answer pages must use original text, cite a public source, and never copy Reddit post bodies or make unsupported tool claims.
- Require editorial review, official-site verification, duplicate checking, and content-quality review before publishing.
- Do not fabricate ratings, reviews, pricing, tool ownership, traffic, rankings, testimonials, or FAQs.
- Mark sponsored and affiliate content clearly and keep affiliate disclosure visible.
- Preserve user privacy: collect only necessary personal data, document it in the privacy policy, and do not store IP addresses or fingerprinting data unless explicitly approved.

## Security Requirements

- Sanitize and validate every public input on the server side.
- Apply rate limiting and abuse controls to public submission and telemetry endpoints.
- External links opened in a new tab must use `rel="noopener noreferrer"`.
- Use HTTPS for canonical URLs, metadata, schema markup, and external resources.
- Keep Cloudflare security headers in `public/_headers` intact.

## Change and Validation Process

- Make focused changes; do not use `git add .` for feature work.
- Never force-push, reset, or remove existing verified features without explicit user approval.
- Run relevant checks before handoff: `npm run build`, `git diff --check`, and syntax checks for changed Worker or script files.
- For database work, prove write and read persistence, then remove test records.
- State clearly what was verified, what remains unverified, and any risks.

## Phase Control

- Do not start a new phase until the current phase has defined acceptance evidence.
- Keep a short implementation plan for multi-step work and update it as work completes.
- CTO review must distinguish confirmed facts from implementation claims.
