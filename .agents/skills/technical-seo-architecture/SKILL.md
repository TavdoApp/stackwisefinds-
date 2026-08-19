---
name: technical-seo-architecture
description: "Technical SEO & Programmatic Indexing standards covering single canonical trailing-slash architecture, full semantic SSR bodies, sitemaps, robots.txt, canonical tag alignment, and automated CI verification."
---

# Technical SEO & Programmatic Indexing Architecture Skill

This skill defines the non-negotiable technical SEO standards required to keep StakDock indexing its programmatic pages with zero duplicate URLs, clean 301 redirects, sub-second TTFB, and instant crawler comprehension.

---

## 1. Single Canonical Trailing-Slash Architecture (Zero Duplication)

To prevent URL cannibalization and split indexing in Google Search Console:
* All pages are generated strictly as folder-based index files:
  `dist/[route]/[slug]/index.html`
* **Canonical URL Enforcement**: Canonical tags MUST strictly end with a trailing slash:
  ```html
  <link rel="canonical" href="https://stakdock.com/software/cursor-ai/" />
  ```
* **301 Permanent Redirect Rule**:
  Any non-trailing-slash request (`/software/cursor-ai`) is 301-redirected to `/software/cursor-ai/`.
* **Zero Dual 200 OK Files**: Never generate standalone `.html` files (`dist/software/cursor-ai.html`) that create two 200 OK variants of the same page.

---

## 2. Full Semantic SSR Prerendering (Never Empty `<div id="root">`)

Search engine crawlers (Googlebot, Bingbot, PerplexityBot, ClaudeBot, GPTBot) must never receive an empty JavaScript shell. `scripts/prerenderDistPages.cjs` MUST inject rich semantic HTML directly inside `<div id="root">`:
* **H1 Heading**: Distinct, keyword-rich title for every software, comparison, alternative, or category page.
* **Rating & Pricing Badges**: Real ratings, review counts, pricing models, and free tier tags.
* **Overview & Detailed Features**: Structured paragraphs and bulleted capabilities list.
* **Internal Linking**: Direct `<a href="...">` links to related alternative competitor tools and head-to-head comparison pages.
* **Rich Comparison Tables**: Side-by-side matrices and structured scorecards.

---

## 3. Automated CI / Build Integrity Gate

`scripts/verifyGoogleCompliance.cjs` and `scripts/verifySeoIntegrity.cjs` run automatically as part of `npm run build`:
1. Validates 100% of URLs in `public/sitemap.xml` exist as static `index.html` files in `dist/`.
2. Validates zero pages contain empty `<div id="root"></div>` tags.
3. Validates canonical tag alignment (trailing slashes + HTTPS) across all pages.
4. Validates anti-boilerplate entropy and minimum word counts.
5. Fails the build immediately if even one route fails verification.

---

## 4. Crawl Budget & Sitemap Hygiene

* `public/sitemap.xml` must only update `lastmod` timestamps when page content actually changes.
* Never run automated scripts that mass-update `lastmod` on all URLs every 24 hours to prevent crawl budget fatigue.
* Trigger `npm run ping-indexnow` upon verified builds to notify Bing and edge search engines.
