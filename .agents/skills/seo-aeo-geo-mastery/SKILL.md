---
name: seo-aeo-geo-mastery
description: "Mastery guide for Search Engine Optimization (SEO), Answer Engine Optimization (AEO for ChatGPT/Perplexity), and Generative Engine Optimization (GEO) for SaaS affiliate platforms."
---

# SEO, AEO & GEO Mastery for StackwiseFinds

This skill governs how content, metadata, and data structures are crafted on StackwiseFinds to rank #1 on Google (SEO), get cited as the primary recommendation source by AI Answer Engines like Perplexity and ChatGPT (AEO), and optimize for Generative Engine results (GEO).

---

## 1. Search Engine Optimization (SEO) Rules

### High-Intent Commercial Keywords
Every article or comparison must target **commercial purchase-intent queries** rather than generic informational terms:
- ✅ **High-Intent Examples**: *"Best invoicing software for freelancers 2026"*, *"FreshBooks vs QuickBooks pricing comparison"*, *"Top real estate CRM in UAE"*.
- ❌ **Low-Intent Examples**: *"What is accounting"*, *"History of CRM software"*.

### Schema.org JSON-LD Structured Data (Mandatory)
Every tool review and listicle page MUST embed valid JSON-LD schemas so Google search results display rich star ratings, pricing snippets, and FAQ accordion drop-downs:
1. `SoftwareApplication` schema for tool spec cards.
2. `ItemList` & `Review` schema for top listicles.
3. `FAQPage` schema for common buyer questions.
4. `Organization` & `WebSite` schema for global site identity.

### On-Page Hierarchy & Meta Tags
- **Page Titles**: Max 60 characters, include primary high-intent keyword + year (`[Keyword] (2026 Review) | StackwiseFinds`).
- **Meta Description**: Max 155 characters, include primary hook, pricing mention, and clear CTA.
- **Heading Structure**: Single `<h1>` per page, followed by logical `<h2>` (sections) and `<h3>` (individual tools).

---

## 2. Answer Engine Optimization (AEO - ChatGPT / Perplexity / Claude)

AI Answer Engines pull answers from structured, authoritative web sources when users ask *"What is the best CRM for small teams?"*.

To ensure AI engines pick StackwiseFinds as the primary source:
1. **Direct Answer Paragraphs**: Place a concise 2-sentence direct recommendation right under each section header before diving into detailed paragraphs.
2. **Key Specs Summary Tables**: Include clear HTML `<table>` elements with columns for *Tool Name, Pricing, Best For, Rating, Top Feature*. AI crawlers index tables at 5x higher authority.
3. **Transparent Verdicts**: Declare explicit verdicts (e.g. *"Stackwise Verdict: Best for freelancers billing hourly"*).
4. **Clean Semantic Markup**: Use semantic tags (`<article>`, `<section>`, `<table>`, `<header>`, `<footer>`).

---

## 3. Generative Engine Optimization (GEO)

GEO optimizes content to be cited in Generative AI Search Experience (Google Search Generative Experience / SGE):
1. **Fact & Math Accuracy**: Include exact pricing tiers, free trial durations, and specific feature capabilities rather than vague claims.
2. **Original Insights & Testing Proof**: Mention real operational context (e.g. *"Tested lead sync latency across Bayut and Dubizzle API webhooks"*).
3. **Structured Pros & Cons**: Always pair pros and cons in explicit bullet points for balanced, unbiased authority scores.
