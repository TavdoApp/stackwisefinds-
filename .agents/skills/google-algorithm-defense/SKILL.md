---
name: google-algorithm-defense
description: "Non-negotiable engineering and content guidelines to protect StakDock from Google Core Updates, Spam Updates, Scaled Content Abuse penalties, and URL cannibalization."
---

# Google Algorithm Defense & Quality Compliance Skill

This skill defines the non-negotiable engineering, architectural, and content standards required to protect StakDock against Google algorithmic penalties (Spam Updates, Helpful Content, Scaled Content Abuse) and ensure long-term organic search stability.

---

## 1. Anti-Scaled Content Abuse Standards (Google Spam Policy 2026)

Google explicitly penalizes websites that mass-generate programmatic pages using repetitive, low-entropy text templates with minimal unique value.

### Mandatory Rules:
1. **No Boilerplate FAQ Loops**:
   - ❌ **NEVER** mass-generate identical FAQ answers where only the tool name is swapped (e.g., *"Is [Tool] free? [Tool] operates on a [Pricing] model..."*).
   - ✅ Every FAQ or structured answer must contain tool-specific data (exact pricing numbers, free trial lengths, platform support, specific integrations).
2. **Template Entropy & Uniqueness (Max 30% Overlap)**:
   - Programmatic templates must pull rich, variable data fields (unique feature lists, pros/cons, pricing plans, developer tools, integration ecosystems).
   - No two pages in `/software/`, `/alternatives/`, or `/vs/` may share more than 30% identical text structure.
3. **No Doorway Pages or Thin Redirect Cards**:
   - Every page MUST provide immediate, standalone utility to the user.
   - ❌ A page that merely shows a title, a 2-sentence summary, and a button to visit another page is classified as a "Doorway Page" and is strictly prohibited.
   - ✅ Every comparison or tool page must include a full data scorecard, feature comparison table, and structured verdict.

---

## 2. Strict Canonical URL & Anti-Cannibalization Architecture

Google Search Console must never index multiple URL variants for the same resource.

### Mandatory Rules:
1. **Single Canonical Format**:
   - All page URLs must strictly enforce a trailing slash: `https://stakdock.com/[section]/[slug]/`
   - Canonical tags in `<head>` must match this exact format:
     ```html
     <link rel="canonical" href="https://stakdock.com/software/cursor-ai/" />
     ```
2. **Zero Dual 200 OK Files**:
   - Never generate both `dist/software/tool.html` and `dist/software/tool/index.html` as independent 200 OK endpoints.
   - Output exclusively to folder-based canonical structures (`dist/[section]/[slug]/index.html`).
3. **301 Permanent Redirects**:
   - Non-trailing-slash requests (`/software/tool`) must 301-redirect to `/software/tool/`.
   - Insecure HTTP requests must 301-redirect to `https://stakdock.com`.

---

## 3. High-Entropy Page Requirements

Every public-facing programmatic page must meet the following minimum content criteria:

| Page Type | Minimum Requirements |
| :--- | :--- |
| **`/software/:id/`** | • Full tool scorecard (Rating, Pricing, Free Tier, Open Source tag)<br>• Comprehensive feature checklist (min 4 specific features)<br>• Curated "Top 3 Alternatives" grid with direct comparison links<br>• Real domain & vendor attribution |
| **`/alternatives/:id/`** | • Categorized alternatives (Free, Open-Source, Enterprise)<br>• Comparative feature matrix<br>• Explicit "How to Choose" guidance based on use-case |
| **`/vs/:toolA-vs-:toolB/`** | • Side-by-side comparison table (Pricing, Features, Ratings, Best For)<br>• Pros & Cons breakdown for both tools<br>• Clear, objective verdict ("Choose Tool A if... Choose Tool B if...") |

---

## 4. Schema.org E-E-A-T & Quality Guardrails

1. **`SoftwareApplication` Schema**:
   - Must include authentic `name`, `applicationCategory`, `operatingSystem`, and verified `offers` pricing.
   - Aggregate ratings must reflect real community data, not fabricated high scores.
2. **`ItemList` Schema**:
   - Used on category and alternative hubs with accurate positional rankings.
3. **No Fabricated FAQ Schema**:
   - Only embed `FAQPage` JSON-LD if the questions and answers on the page provide genuine, specific information.

---

## 5. Automated Build Verification Gate

Before any release or deployment, `scripts/verifyGoogleCompliance.cjs` must execute as part of `npm run build`:
- Fails build if duplicate canonical URLs or trailing-slash mismatches are detected.
- Fails build if boilerplate repetition exceeds the 30% threshold.
- Fails build if any page has fewer than 250 words of rich content.
