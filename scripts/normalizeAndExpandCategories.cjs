const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/data/saasData.jsx');
let content = fs.readFileSync(targetPath, 'utf8');

// Category mapping rules to consolidate redundant slugs into canonical categories
const categoryMap = {
  'security-identity': 'cybersecurity-identity',
  'hosting-cloud': 'dev-cloud',
  'developer-tools': 'dev-cloud',
  'forms-surveys': 'forms-leadgen',
  'lead-generation': 'forms-leadgen',
  'finance-accounting': 'invoicing',
  'finance-payments': 'invoicing',
  'project-management': 'project-mgmt',
  'video-tools': 'trending-video-ai',
  'video-generators': 'trending-video-ai',
  'ai-image-video': 'trending-video-ai',
  'copywriting': 'ai-content',
  'ecommerce-platforms': 'ecommerce-funnels',
  'analytics-bi': 'analytics-heatmaps',
  'bi-data-analytics': 'analytics-heatmaps',
  'productivity-tools': 'time-productivity',
  'db-vector-search': 'database-engines'
};

// Map tool categories
for (const [oldCat, newCat] of Object.entries(categoryMap)) {
  const regex = new RegExp(`"category":\\s*"${oldCat}"`, 'g');
  content = content.replace(regex, `"category": "${newCat}"`);
}

// Master list of saasCategories
const updatedSaasCategories = [
  { "id": "all", "label": "All Software" },
  { "id": "ai-content", "label": "AI Copywriting & Text" },
  { "id": "trending-video-ai", "label": "AI Video & Motion" },
  { "id": "ai-music-audio", "label": "AI Music & Audio" },
  { "id": "design-creative", "label": "AI Image & Design" },
  { "id": "ai-coding-dev", "label": "AI Coding & Dev Assistants" },
  { "id": "meeting-ai", "label": "AI Meeting Transcribers" },
  { "id": "ad-creative", "label": "AI Ads & Visual Copy" },
  { "id": "crm", "label": "CRM & Sales Pipelines" },
  { "id": "invoicing", "label": "Invoicing & Financial Tools" },
  { "id": "email-marketing", "label": "Email Marketing & Automation" },
  { "id": "social-media", "label": "Social Media & Schedulers" },
  { "id": "project-mgmt", "label": "Project & Work Management" },
  { "id": "seo-analytics", "label": "SEO & Keyword Research" },
  { "id": "forms-leadgen", "label": "Forms & Lead Generation" },
  { "id": "ecommerce-funnels", "label": "E-Commerce & Sales Funnels" },
  { "id": "hr-payroll", "label": "HR & Global Payroll" },
  { "id": "customer-support", "label": "Customer Support & Helpdesk" },
  { "id": "dev-cloud", "label": "Developer & Cloud Infrastructure" },
  { "id": "devops-infrastructure", "label": "DevOps & IaC Automation" },
  { "id": "web-builders", "label": "Website Builders & CMS" },
  { "id": "analytics-heatmaps", "label": "Analytics, BI & Heatmaps" },
  { "id": "publishing-cms", "label": "Publishing & Newsletters" },
  { "id": "time-productivity", "label": "Productivity & Time Tracking" },
  { "id": "esign-documents", "label": "Document Automation & E-Sign" },
  { "id": "security-passwords", "label": "Password Managers & Privacy" },
  { "id": "cybersecurity-identity", "label": "Cybersecurity & Identity" },
  { "id": "nocode-databases", "label": "No-Code Apps & Relational DBs" },
  { "id": "database-engines", "label": "Databases & Real-Time Caches" },
  { "id": "open-source-self-hosted", "label": "Open-Source & Self-Hosted" },
  { "id": "collaboration-chat", "label": "Team Collaboration & Chat" },
  { "id": "api-management", "label": "API Gateways & Integration" },
  { "id": "testing-qa", "label": "Software Testing & QA" }
];

// Replace saasCategories array in file
const categoriesCode = `export const saasCategories = ${JSON.stringify(updatedSaasCategories, null, 2)};`;

content = content.replace(/export const saasCategories = \[[\s\S]*?\];/, categoriesCode);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully normalized categories and updated saasCategories in saasData.jsx!');
