const fs = require('fs');
const path = require('path');

const toolObj = {
  id: "splitmatepro",
  name: "SplitMatePro",
  domain: "splitmatepro.com",
  category: "crm",
  tagline: "Property management & tenant expense sharing automation platform",
  description: "Automates property management, tenant lead tracking, expense splitting, and rent collection for landlords and real estate operations.",
  rating: 4.9,
  reviewsCount: 180,
  pricing: "Freemium",
  websiteUrl: "https://splitmatepro.com",
  affiliateUrl: "https://splitmatepro.com",
  badge: "Verified Tool",
  featured: true,
  monthlyVisits: "45K",
  verifiedStatus: "Verified",
  isFreeTier: true,
  isOpenSource: false
};

const saasDataPath = path.join(__dirname, '..', 'src', 'data', 'saasData.jsx');
let content = fs.readFileSync(saasDataPath, 'utf8');

const targetInsertionMarker = 'export const staticSaasTools = [';
const insertionIndex = content.indexOf(targetInsertionMarker);

if (insertionIndex !== -1) {
  const splitPos = insertionIndex + targetInsertionMarker.length;
  const newEntryStr = JSON.stringify(toolObj, null, 4);
  const updatedContent = content.slice(0, splitPos) + '\n  ' + newEntryStr + ',' + content.slice(splitPos);
  fs.writeFileSync(saasDataPath, updatedContent, 'utf8');
  console.log('🎉 SplitMatePro successfully published to StakDock catalog!');
} else {
  console.error('Could not find staticSaasTools array insertion point.');
}
