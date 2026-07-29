const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const versusDir = path.join(publicDir, 'vs');
const alternativesDir = path.join(publicDir, 'alternatives');

if (!fs.existsSync(versusDir)) fs.mkdirSync(versusDir, { recursive: true });
if (!fs.existsSync(alternativesDir)) fs.mkdirSync(alternativesDir, { recursive: true });

const versusPages = [
  {
    slug: 'chatgpt-plus-vs-claude-ai',
    title: 'ChatGPT Plus vs Claude 3.5 Sonnet: Full 2026 Comparison',
    description: 'Detailed comparison of ChatGPT Plus (GPT-4o) vs Claude 3.5 Sonnet. Compare pricing, coding benchmarks, context window, and AI reasoning speed.',
    toolA: 'ChatGPT Plus',
    toolB: 'Claude 3.5 Sonnet'
  },
  {
    slug: 'kling-ai-vs-luma-dream-machine',
    title: 'Kling AI vs Luma Dream Machine: Best AI Video Generator?',
    description: 'Comprehensive side-by-side comparison of Kling AI vs Luma Dream Machine. Compare 1080p motion rendering, pricing, prompt control, and frame stability.',
    toolA: 'Kling AI',
    toolB: 'Luma Dream Machine'
  },
  {
    slug: 'cursor-ai-vs-github-copilot',
    title: 'Cursor AI vs GitHub Copilot: Which AI Code Editor Wins in 2026?',
    description: 'Compare Cursor AI vs GitHub Copilot. In-depth analysis of codebase indexing, multi-file edits, terminal AI commands, and pricing.',
    toolA: 'Cursor AI',
    toolB: 'GitHub Copilot'
  },
  {
    slug: 'v0-dev-vs-bolt-new',
    title: 'v0.dev vs Bolt.new: Best Generative UI & App Builder?',
    description: 'Compare Vercel v0.dev vs StackBlitz Bolt.new. Compare React component generation, Tailwind CSS output, full-stack preview, and pricing.',
    toolA: 'v0.dev',
    toolB: 'Bolt.new'
  },
  {
    slug: 'elevenlabs-vs-speechify',
    title: 'ElevenLabs vs Speechify: Best AI Voice & TTS Generator?',
    description: 'Side-by-side comparison of ElevenLabs vs Speechify. Compare voice cloning quality, text-to-speech naturalness, pricing, and language support.',
    toolA: 'ElevenLabs',
    toolB: 'Speechify'
  }
];

const alternativePages = [
  {
    slug: 'canny-alternatives',
    title: 'Top 7 Canny Alternatives for Collecting Feature Requests (2026)',
    description: 'Explore the best Canny alternatives for user feedback, feature request tracking, and roadmap management.',
    toolName: 'Canny'
  },
  {
    slug: 'notion-alternatives',
    title: 'Best Notion Alternatives for Knowledge Base & Docs (2026)',
    description: 'Discover top Notion alternatives for team documentation, project management, and workspace organization.',
    toolName: 'Notion'
  },
  {
    slug: 'chatgpt-alternatives',
    title: 'Top 10 ChatGPT Alternatives for Writing, Coding & Research',
    description: 'Compare top ChatGPT alternatives including Claude 3.5 Sonnet, Gemini Advanced, and Perplexity AI.',
    toolName: 'ChatGPT'
  }
];

function generateHtml({ title, description, canonicalUrl, targetUrl, heading, subheading }) {
  const linkUrl = targetUrl || canonicalUrl;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | StakDock</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:title" content="${title} | StakDock">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FAFBF7; color: #141E14; margin: 0; padding: 40px 20px; line-height: 1.6; }
    .card { max-width: 860px; margin: 0 auto; background: #ffffff; border: 1px solid #E2E8D8; border-radius: 24px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
    .badge { display: inline-block; background: #82A735; color: #ffffff; font-size: 12px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; margin-bottom: 16px; }
    h1 { font-size: 32px; font-weight: 800; margin-bottom: 16px; color: #141E14; }
    p { font-size: 17px; color: #4A5568; margin-bottom: 24px; }
    .btn { display: inline-flex; align-items: center; background: #82A735; color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 999px; transition: background 0.2s ease; }
    .btn:hover { background: #6E8F2B; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">StakDock Programmatic SEO Guide</div>
    <h1>${heading}</h1>
    <p>${subheading}</p>
    <p>${description}</p>
    <a href="${linkUrl}" class="btn">View Live Interactive Comparison on StakDock &rarr;</a>
  </div>
</body>
</html>`;
}

// Generate /vs/ pages
for (const page of versusPages) {
  const pageDir = path.join(versusDir, page.slug);
  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
  const html = generateHtml({
    title: page.title,
    description: page.description,
    canonicalUrl: `https://stakdock.com/vs/${page.slug}`,
    targetUrl: `https://stakdock.com/#vs-${page.slug}`,
    heading: page.title,
    subheading: `Detailed side-by-side analysis of ${page.toolA} vs ${page.toolB}.`
  });
  fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf8');
}

// Generate /alternatives/ pages
for (const page of alternativePages) {
  const pageDir = path.join(alternativesDir, page.slug);
  if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
  const html = generateHtml({
    title: page.title,
    description: page.description,
    canonicalUrl: `https://stakdock.com/alternatives/${page.slug}`,
    targetUrl: `https://stakdock.com/#alternatives-${page.slug}`,
    heading: page.title,
    subheading: `Top alternatives and competitors to ${page.toolName} verified by StakDock.`
  });
  fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf8');
}

console.log(`Generated ${versusPages.length} static /vs/ pages and ${alternativePages.length} static /alternatives/ pages.`);
