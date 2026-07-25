# Stackwise & Web App Security Rules

> **Mandatory Security Rules for all AI Agents working on Stackwise codebase.**

---

## 1. Non-Negotiable Security Rules

1. **Zero Secret Leaks**:
   - Never output, log, or commit `.env` contents, API keys, or tokens.
   - All Cloudflare API tokens, GitHub tokens, and payment API keys must be passed exclusively via environment variables or encrypted GitHub Secrets.

2. **Secure Outbound Links**:
   - All outgoing external links (`<a href="..." target="_blank">` or `window.open(...)`) MUST enforce `rel="noopener noreferrer"`.

3. **Input Sanitization**:
   - All user inputs in forms, search bars, and review modals must be sanitized and HTML-encoded to prevent XSS payloads.

4. **HTTPS Enforcement**:
   - All canonical links, OpenGraph tags, schema markup, and external resources must use strict `https://` URLs.

5. **Cloudflare Security Headers**:
   - Headers configured on Cloudflare Pages (`_headers`) must enforce `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Referrer-Policy: strict-origin-when-cross-origin`.

---

## 2. Core Architecture Rules
- **Framework & Styling:** Vite + React + Vanilla CSS (variables defined in `src/index.css`).
- **Data Source:** `src/data/saasData.jsx` (Verified Software Tools Dataset) & `src/data/articlesData.js` (High-Intent Buyer Guides).
- **Icons:** `lucide-react`.

---

## 3. Product Integrity & Performance Rules
- **Never Undo Completed Features:** Once a feature (e.g. 612 verified tools, brand logo engine, upvote system, legal policies, sitemaps) is verified, future code edits MUST NOT delete, remove, or degrade it.
- **Real Brand Domain Integrity:** Software tools MUST use valid company domains (e.g. `openai.com`, `framer.com`, `stripe.com`, `xuscrm.com`) so Clearbit & Google Favicons render crisp brand logos.
- **Paddle Compliance Integrity:** Footer links to Privacy Policy, Terms of Service, and Refund & Cancellation Policy MUST remain intact.

---

## 4. Build & Deployment Commands
- **Build Command:** `cmd /c npm run build`
- **Cloudflare Pages Deploy Command:**
  ```cmd
  npx wrangler pages deploy dist --project-name=stackwisefinds
  ```
