# StakDock Delivery Rules

These rules apply to the entire StakDock repository.

## Operating Scope

- Deploy only through GitHub Actions and Cloudflare Pages, Workers, and D1.
- Never modify, provision, or depend on a VPS.
- Treat `https://stakdock.com` as the only canonical public domain.
- Preserve permanent redirects from legacy Stackwise domains.

## Regression Prevention & Fixed-Work Integrity Rule (NON-NEGOTIABLE)

- **Zero Regression Policy**: Once a feature, fix, or rule is completed, approved, or verified (e.g. 301 domain redirects, Wikipedia SVG logos, UI detail page design, D1 write confirmation), NO agent may modify, revert, overwrite, or break it in future iterations.
- **Cloudflare Pages Middleware Protection**: Legacy domain `stackwisefinds.com` 301 redirects to `https://stakdock.com` MUST be enforced via `functions/_middleware.js` in Cloudflare Pages so edge 301 redirects execute on 100% of requests before any static file or SPA route is evaluated.
- **Verification Before Handoff**: Every pull request, deployment, or code change MUST re-verify that previously fixed core features (301 redirects, logo resolution, detail view rendering) remain 100% functional.

## Secrets and Access

- Never print, commit, paste, or log secrets, API tokens, D1 credentials, or `.env` values.
- Use encrypted GitHub Actions secrets and Cloudflare Worker secrets only.
- Revoke and replace any credential exposed in a terminal, chat, commit, or log.
- Do not change a secret name or deployment credential without verifying the corresponding GitHub workflow uses it.

## Cloudflare Delivery Gate

- `wrangler.toml` must contain real, non-placeholder resource IDs before deployment.
- Apply D1 migrations before deploying Worker code that depends on them.
- A deployment is complete only after its exact GitHub Actions run URL reports success.
- Report exact run URLs, never only workflow landing pages.
- Verify public APIs fail closed when required bindings or secrets are unavailable.

## Product and Content Integrity

- Do not auto-publish vendor submissions or sponsored listings. Discovered tools and Reddit-inspired answer pages may publish only through their documented automated quality gates; answer pages must use original text, cite a public source, and never copy Reddit post bodies or make unsupported tool claims.
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
