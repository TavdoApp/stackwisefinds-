const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const draftsPath = path.join(__dirname, '..', 'data', 'reddit-content-drafts.json');
const answersPath = path.join(__dirname, '..', 'data', 'auto-published-answers.json');
const maxAnswersPerRun = 2;

function readJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90);
}

function isEligible(draft) {
  if (draft.status !== 'pending_review') return false;
  if (!draft.question || draft.question.length < 35 || draft.question.length > 150 || !draft.question.includes('?')) return false;
  if (!/^https:\/\/www\.reddit\.com\/r\/[a-z0-9_]+\/comments\//i.test(draft.sourceUrl || '')) return false;
  return ['alternatives', 'crm-selection', 'automation', 'ai-tools', 'tool-selection'].includes(draft.intent);
}

function frameworkFor(intent) {
  const common = [
    { heading: 'Start with the job to be done', body: 'Write down the outcome you need, the people who will use the software, and the workflow it must support. This prevents feature lists from driving the decision.' },
    { heading: 'Verify the evidence yourself', body: 'Use vendor documentation, a trial account, current pricing pages, and security documentation. Community discussions can suggest ideas, but they are not proof of product claims.' },
    { heading: 'Run a small comparison', body: 'Compare a short list against the same requirements, then test the highest-priority workflow before committing data, budget, or a long contract.' }
  ];
  const first = {
    alternatives: { heading: 'Define what must improve', body: 'For an alternative, identify the current limitation first: price, integrations, reporting, support, data export, or performance. A replacement only helps when it solves that specific constraint.' },
    'crm-selection': { heading: 'Map the sales process', body: 'Document lead sources, qualification stages, ownership rules, reporting needs, and required integrations. A CRM should match the real operating process before it is configured.' },
    automation: { heading: 'Choose a safe first workflow', body: 'Start with a low-risk, repeatable task and define its trigger, approval points, error handling, and owner. Expand automation only after the first workflow is reliable.' },
    'ai-tools': { heading: 'Set boundaries for AI use', body: 'Define acceptable inputs, privacy requirements, review steps, and the quality standard for outputs. Test representative tasks rather than relying on broad product claims.' },
    'tool-selection': { heading: 'Set decision criteria', body: 'Rank the requirements that matter most, such as integrations, collaboration, data control, support, budget, and time to implement.' }
  };
  return [first[intent] || first['tool-selection'], ...common];
}

function run() {
  const drafts = readJson(draftsPath, { schemaVersion: 1, updatedAt: null, drafts: [] });
  const answerData = readJson(answersPath, { schemaVersion: 1, updatedAt: null, answers: [] });
  const knownSources = new Set(answerData.answers.map((answer) => answer.sourceUrl));
  const publishedAt = new Date().toISOString();
  let published = 0;

  for (const draft of drafts.drafts) {
    if (published >= maxAnswersPerRun || !isEligible(draft) || knownSources.has(draft.sourceUrl)) continue;
    const slug = `${slugify(draft.question.replace(/\?+$/, ''))}-${crypto.createHash('sha256').update(draft.sourceUrl).digest('hex').slice(0, 8)}`;
    const answer = {
      id: `answer-${crypto.createHash('sha256').update(draft.sourceUrl).digest('hex').slice(0, 16)}`,
      slug,
      title: `How to evaluate: ${draft.question}`,
      question: draft.question,
      summary: 'A practical software-evaluation framework based on a publicly available community question.',
      category: 'Software Evaluation',
      intent: draft.intent,
      sourceUrl: draft.sourceUrl,
      sourceSubreddit: draft.source?.subreddit || 'reddit',
      publishedAt,
      canonicalUrl: `https://stakdock.com/guides/${slug}/`,
      sections: frameworkFor(draft.intent),
      isAutoAnswer: true,
      qualityChecks: { sourceTitleOnly: true, copiedPostBody: false, toolClaimsIncluded: false, ratingsIncluded: false }
    };
    answerData.answers.unshift(answer);
    draft.status = 'auto_published';
    draft.autoPublication = { publishedAt, canonicalUrl: answer.canonicalUrl, qualityChecks: answer.qualityChecks };
    knownSources.add(draft.sourceUrl);
    published += 1;
  }

  answerData.updatedAt = publishedAt;
  answerData.answers = answerData.answers.slice(0, 500);
  writeJson(answersPath, answerData);
  writeJson(draftsPath, drafts);
  console.log(`Published ${published} original answer pages. Reddit post bodies were not copied.`);
}

try { run(); } catch (error) { console.error(`Answer publishing failed: ${error.message}`); process.exit(1); }