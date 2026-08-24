import autoPublishedAnswerData from '../../data/auto-published-answers.json';
import { officialGuides } from './guidesData.js';

export const staticHighIntentArticles = officialGuides.map(g => ({
  id: g.id,
  slug: g.slug,
  title: g.title,
  summary: g.summary,
  category: g.category,
  publishDate: g.publishDate,
  readTime: g.readTime,
  author: g.author,
  methodologyNote: g.methodologyNote,
  executiveSummary: g.executiveSummary,
  comparisonTable: g.comparisonTable,
  sections: g.sections,
  recommendedToolIds: g.recommendedToolIds,
  content: `
    <h3>${g.title}</h3>
    <p>${g.executiveSummary}</p>
    ${g.sections.map(s => `<h4>${s.heading}</h4><p>${s.content}</p>`).join('\n')}
  `
}));

export const highIntentArticles = [
  ...(Array.isArray(autoPublishedAnswerData.answers) ? autoPublishedAnswerData.answers : []),
  ...staticHighIntentArticles
];
