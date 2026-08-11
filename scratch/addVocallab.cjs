const fs = require('fs');
const path = require('path');

const masterPath = path.join(__dirname, '..', 'data', 'saas-tools-master.json');
const raw = fs.readFileSync(masterPath, 'utf8');
const tools = JSON.parse(raw);

const vocallabTool = {
  id: 'vocallab-ai',
  name: 'Vocallab AI',
  domain: 'vocallab.ai',
  description: 'Vocallab AI is an advanced AI voice generation, voice cloning, and audio synthesis platform for creators, podcasters, and video production teams.',
  category: 'ai-tools',
  rating: 4.9,
  reviewsCount: 24,
  pricing: 'Freemium',
  pricingModel: 'Freemium',
  affiliateUrl: 'https://vocallab.ai',
  websiteUrl: 'https://vocallab.ai',
  openPageRank: 4.2,
  authorityScore: 4.2,
  submittedByVendor: true,
  submittedAt: new Date().toISOString()
};

const existingIndex = tools.findIndex(t => t.id === 'vocallab-ai' || t.name.toLowerCase() === 'vocallab ai');
if (existingIndex >= 0) {
  tools[existingIndex] = vocallabTool;
} else {
  tools.unshift(vocallabTool);
}

fs.writeFileSync(masterPath, JSON.stringify(tools, null, 2), 'utf8');
console.log('✨ Vocallab AI successfully added to saas-tools-master.json! Total tools:', tools.length);
