/**
 * Automated Dev.to API Article Publisher for StakDock
 * Publishes rich software reviews & comparison articles with DA 90+ backlinks and canonical URL tracking
 */

export async function postArticleToDevTo(env, { 
  softwareName, 
  tagline, 
  description, 
  category, 
  pricing, 
  features = [], 
  pros = [], 
  cons = [], 
  slug, 
  websiteUrl 
}) {
  const apiKey = (env && env.DEV_TO_API_KEY);

  if (!apiKey) {
    console.warn('Skipping Dev.to auto-post: Missing DEV_TO_API_KEY in Cloudflare environment variables.');
    return { success: false, reason: 'missing_api_key' };
  }

  const cleanSlug = slug || (softwareName || 'tool').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const canonicalUrl = `https://stakdock.com/software/${cleanSlug}/`;
  const alternativesUrl = `https://stakdock.com/alternatives/${cleanSlug}/`;

  // Format rich high-authority Markdown article
  const articleTitle = `${softwareName} Review 2026: Features, Pricing & Top Alternatives`;
  
  const featureList = Array.isArray(features) && features.length > 0
    ? features.map(f => `- **${f}**`).join('\n')
    : `- Verified software architecture & HTTPS SSL encryption\n- Cloud infrastructure & API integration\n- Workflow automation & team collaboration tools`;

  const prosList = Array.isArray(pros) && pros.length > 0
    ? pros.map(p => `- ✅ ${p}`).join('\n')
    : `- ✅ Fast setup and modern user experience\n- ✅ Freemium tier / free trial availability\n- ✅ Active development & verified security`;

  const consList = Array.isArray(cons) && cons.length > 0
    ? cons.map(c => `- ⚠️ ${c}`).join('\n')
    : `- ⚠️ Advanced enterprise integrations require higher pricing tiers`;

  const bodyMarkdown = `
# ${softwareName} In-Depth Review & Alternatives (2026)

**${softwareName}** has recently been reviewed and listed on [StakDock](https://stakdock.com/) — the software and AI launch directory.

> **Tagline:** ${tagline || description || 'Modern SaaS and AI platform for fast-growing businesses.'}

---

## ⚡ Key Highlights & Core Features
${featureList}

---

## 💰 Pricing & Availability
- **Starting Price:** ${pricing || 'Freemium / Free Tier Available'}
- **Deployment:** Cloud-Hosted SaaS & Web Platform
- **Official Website:** [${websiteUrl || 'Visit Official Site'}](${websiteUrl || canonicalUrl})

---

## ⚖️ Pros & Cons

### The Good:
${prosList}

### Considerations:
${consList}

---

## 🔍 Compare & Explore Alternatives
Looking for competitors or want to see how **${softwareName}** stacks up against alternatives?

👉 **[Explore the Full ${softwareName} Comparison Matrix on StakDock](${canonicalUrl})**

👉 **[View Top Verified ${softwareName} Competitors & Free Alternatives](${alternativesUrl})**

---

*Originally analyzed and published on [StakDock Software Launch Dock](${canonicalUrl})*.
`.trim();

  // Clean tags: lowercase alphanumeric, max 4 tags
  const defaultTags = ['saas', 'ai', 'productivity', 'webdev'];

  const payload = {
    article: {
      title: articleTitle,
      published: true,
      body_markdown: bodyMarkdown,
      tags: defaultTags,
      canonical_url: canonicalUrl
    }
  };

  try {
    const response = await fetch('https://dev.to/api/articles', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'User-Agent': 'StakDock-Publisher/1.0'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Dev.to article publish response:', JSON.stringify(data));

    if (response.ok && data && data.url) {
      return { success: true, articleUrl: data.url, id: data.id };
    } else {
      return { success: false, error: data };
    }
  } catch (err) {
    console.warn('Dev.to API request error:', err.message);
    return { success: false, error: err.message };
  }
}
