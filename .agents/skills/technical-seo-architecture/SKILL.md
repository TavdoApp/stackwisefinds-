---
name: technical-seo-architecture
description: "Technical SEO & Programmatic Indexing standards covering dual 200 OK flat files, full semantic SSR bodies, sitemaps, robots.txt, canonical tag alignment, and automated CI verification."
---

# Technical SEO & Programmatic Indexing Architecture Skill

This skill defines the non-negotiable technical SEO standards required to keep StakDock indexing 100% of its 4,169 programmatic pages with zero redirect conflicts, sub-second TTFB, and instant crawler comprehension.

---

## 1. Dual 200 OK Flat-File Architecture (Zero 308 Redirects)

Cloudflare Pages automatically issues 308 redirects for directory folders if a corresponding `.html` flat file is missing. To guarantee that every URL in `public/sitemap.xml` returns `HTTP 200 OK` on the first hit:
* Every page generated in `scripts/prerenderDistPages.cjs` MUST produce:
  1. `dist/[route]/[slug]/index.html` (for trailing-slash requests)
  2. `dist/[route]/[slug].html` (for non-trailing-slash requests)
* **Canonical URL Enforcement**: Canonical tags MUST strictly match the exact sitemap URL without trailing slash mismatches:
  ```html
  <link rel="canonical" href="https://stakdock.com/software/cursor-ai" />
  ```

---

## 2. Full Semantic SSR Prerendering (Never Empty `<div id="root">`)

Search engine crawlers (Googlebot, Bingbot, PerplexityBot, ClaudeBot, GPTBot) must never receive an empty JavaScript shell. `scripts/prerenderDistPages.cjs` MUST inject rich semantic HTML directly inside `<div id="root">`:
* **H1 Heading**: Distinct, keyword-rich title for every software, comparison, alternative, or category page.
* **Rating & Pricing Badges**: Real ratings, review counts, pricing models, and free tier tags.
* **Overview & Features**: Structured paragraphs and bulleted capabilities list.
* **Internal Linking**: Direct `<a href="...">` links to related alternative competitor tools and head-to-head comparison pages.
* **FAQ Section**: Semantic FAQ questions and complete answers matching JSON-LD schema.

---

## 3. Automated CI / Build Integrity Gate

`scripts/verifySeoIntegrity.cjs` runs automatically as part of `npm run build`:
1. Validates 100% of URLs in `public/sitemap.xml` exist as static `.html` files in `dist/`.
2. Validates zero pages contain empty `<div id="root"></div>` tags.
3. Validates canonical tag alignment across all 4,169 pages.
4. Fails the build immediately if even one route fails verification.

---

## 4. Crawl Budget & Sitemap Hygiene

* `public/sitemap.xml` must only update `lastmod` timestamps when page content actually changes.
* Never run automated scripts that mass-update `lastmod` on all 4,000+ URLs every 24 hours to prevent crawl budget fatigue.
* Trigger `npm run ping-indexnow` upon verified builds to notify Bing and edge search engines.
