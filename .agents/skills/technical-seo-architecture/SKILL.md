---
name: technical-seo-architecture
description: "Technical SEO guidelines covering sitemaps, robots.txt, Core Web Vitals, OpenGraph social meta tags, and SPA routing optimization."
---

# Technical SEO Architecture Skill

This skill defines the technical standards required to keep StackwiseFinds at 100/100 performance on Google Lighthouse, achieve sub-second TTFB, and maintain indexability across all search bots.

---

## 1. Core Web Vitals & Performance Standards

- **Largest Contentful Paint (LCP)**: Under 1.2 seconds.
- **First Input Delay (FID) / INP**: Under 50ms.
- **Cumulative Layout Shift (CLS)**: Exactly 0.00.

### Optimization Rules
1. **Font Loading**: Preconnect to Google Fonts and load with `display=swap`.
2. **Image Optimization**: Use WebP/SVG formats with explicit width & height attributes to prevent layout shift.
3. **Bundle Size**: Keep production JS bundle size under 220KB gzipped (achieved: 59.7KB).

---

## 2. Robots, Sitemap & Routing

### Robots.txt Configuration
`public/robots.txt` must explicitly allow search crawlers while blocking internal scratch endpoints:
```text
User-agent: *
Allow: /
Sitemap: https://stackwisefinds.com/sitemap.xml
```

### Sitemap XML Structure
`public/sitemap.xml` must automatically list all category routes and high-intent buyer guide URLs with `lastmod`, `changefreq`, and `priority` tags.

### OpenGraph & Twitter Social Cards
Every page must contain complete social sharing meta tags:
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type=website`
- `twitter:card=summary_large_image`, `twitter:site=@stackwisefinds`

---

## 3. SPA Route Fallback & Redirects

- `public/_redirects` file is maintained for Cloudflare Pages SPA routing:
  ```text
  /*    /index.html   200
  ```
- Ensures non-200 404 errors do not occur when users bookmark or directly navigate to sub-pages like `/guides/best-invoicing-software`.
