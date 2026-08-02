const fs = require('fs');
const path = require('path');

const answersPath = path.join(__dirname, '..', 'data', 'auto-published-answers.json');
const outputRoot = path.join(__dirname, '..', 'public', 'guides');
const baseUrl = 'https://stakdock.com';

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

const answerData = fs.existsSync(answersPath) ? JSON.parse(fs.readFileSync(answersPath, 'utf8')) : { answers: [] };
for (const answer of answerData.answers || []) {
  const directory = path.join(outputRoot, answer.slug);
  const sections = (answer.sections || []).map((section) => `<section><h2>${escapeHtml(section.heading)}</h2><p>${escapeHtml(section.body)}</p></section>`).join('\n');
  const pubDateRaw = answer.publishedAt || new Date().toISOString();
  const formattedDate = new Date(pubDateRaw).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const schemaJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': answer.title,
    'description': answer.summary,
    'datePublished': pubDateRaw,
    'dateModified': pubDateRaw,
    'mainEntityOfPage': answer.canonicalUrl,
    'author': { '@type': 'Organization', 'name': 'StakDock', 'url': 'https://stakdock.com' },
    'publisher': { '@type': 'Organization', 'name': 'StakDock', 'url': 'https://stakdock.com' }
  });

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(answer.title)} | StakDock</title><meta name="description" content="${escapeHtml(answer.summary)}"><link rel="canonical" href="${escapeHtml(answer.canonicalUrl)}"><meta property="og:title" content="${escapeHtml(answer.title)} | StakDock"><meta property="og:description" content="${escapeHtml(answer.summary)}"><meta property="og:url" content="${escapeHtml(answer.canonicalUrl)}"><script type="application/ld+json">${schemaJson}</script><style>body{font-family:system-ui,sans-serif;line-height:1.65;color:#142014;margin:0;background:#f7f9f4}main{max-width:760px;margin:40px auto;padding:36px;background:#fff;border-radius:18px}a{color:#52751d}h1{line-height:1.2}h2{margin-top:32px}small{color:#586358}.pub-date{color:#586358;font-size:0.88rem;margin-bottom:24px;display:flex;align-items:center;gap:6px}</style></head><body><main><p><a href="${baseUrl}">StakDock</a> / Software evaluation</p><h1>${escapeHtml(answer.question)}</h1><div class="pub-date">📅 Published on ${formattedDate} &bull; StakDock Editorial</div><p>${escapeHtml(answer.summary)}</p>${sections}<section><h2>Source and method</h2><p>This page uses the public question title as research inspiration. It does not copy the Reddit post body or claim that community comments verify software quality. Review current vendor information before making a purchase decision.</p><p><a href="${escapeHtml(answer.sourceUrl)}" rel="noopener noreferrer">View the public discussion source</a></p></section><p><a href="${baseUrl}">Explore StakDock software tools</a></p></main></body></html>`;
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), html, 'utf8');
}
console.log(`Generated ${(answerData.answers || []).length} static answer pages.`);