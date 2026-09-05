const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('../scripts/toolData.cjs');

async function checkIndexableTools() {
  const tools = readAllTools();
  const toolMap = new Map(tools.map(t => [t.id, t]));

  const seedModule = await import('../src/data/stackIntelligenceSeedData.js');
  const seedTools = seedModule.seedSoftwareTools || [];
  const seedMap = new Map(seedTools.map(t => [t.toolId, t]));

  const classificationScript = require('./classifyInventory.cjs');
  // Or import logic directly

  console.log(`Checking data completeness for all indexable candidate tools...`);
  console.log(`Seed tools count: ${seedTools.length}`);
}

checkIndexableTools().catch(console.error);
