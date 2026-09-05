const fs = require('fs');
const path = require('path');
const { readAllTools, readCategories } = require('../scripts/toolData.cjs');

async function evaluateQuality() {
  const tools = readAllTools();
  const categories = readCategories();
  const toolMap = new Map(tools.map(t => [t.id, t]));

  const seedModule = await import('../src/data/stackIntelligenceSeedData.js');
  const seedTools = seedModule.seedSoftwareTools || [];
  const seedMap = new Map(seedTools.map(t => [t.toolId, t]));

  console.log('--- DATA QUALITY AUDIT ACROSS ALL 1,788 TOOLS ---');
  let hasPricing = 0;
  let hasFeatures = 0;
  let hasProsCons = 0;
  let hasBestFor = 0;
  let hasDescription = 0;
  let hasCuratedAlts = 0;
  let hasStackIntel = 0;
  let wordCountUnder50 = 0;
  let wordCount100to300 = 0;
  let wordCount300Plus = 0;

  tools.forEach(t => {
    if (t.pricing && t.pricing !== 'Freemium' && t.pricing !== 'Contact for Pricing') hasPricing++;
    if (Array.isArray(t.features) && t.features.length >= 3) hasFeatures++;
    if (Array.isArray(t.pros) && t.pros.length >= 2 && Array.isArray(t.cons) && t.cons.length >= 1) hasProsCons++;
    if (t.bestFor && t.bestFor.length > 15) hasBestFor++;
    if (t.description && t.description.length > 50) hasDescription++;
    if (Array.isArray(t.curatedAlternatives) && t.curatedAlternatives.length >= 2) hasCuratedAlts++;
    if (seedMap.has(t.id)) hasStackIntel++;

    const text = [
      t.name, t.description, t.tagline, t.bestFor,
      ...(t.features || []),
      ...(t.pros || []),
      ...(t.cons || [])
    ].join(' ');
    const wc = text.split(/\s+/).filter(Boolean).length;
    if (wc < 50) wordCountUnder50++;
    else if (wc < 150) wordCount100to300++;
    else wordCount300Plus++;
  });

  console.log(`Total tools: ${tools.length}`);
  console.log(`Covered in Stack Intelligence: ${hasStackIntel}`);
  console.log(`Rich Description (>50 chars): ${hasDescription}`);
  console.log(`Rich Features (>=3): ${hasFeatures}`);
  console.log(`Rich Pros/Cons: ${hasProsCons}`);
  console.log(`Rich BestFor audience: ${hasBestFor}`);
  console.log(`Curated Alternatives: ${hasCuratedAlts}`);
  console.log(`Word count distribution in database:`);
  console.log(`  < 50 words: ${wordCountUnder50}`);
  console.log(`  50 - 150 words: ${wordCount100to300}`);
  console.log(`  150+ words: ${wordCount300Plus}`);

  // Check how many tools can be upgraded or are already high quality
  console.log('\n--- SCORING AND CLASSIFYING ALL ROUTES ---');

  // Let's sample 50 software pages, 30 alternatives, 30 vs, 20 best to measure template similarity
  const sampleSoftware = tools.slice(0, 50);
  const sampleAlts = tools.slice(0, 30);
  
  // Calculate unique phrases vs repetitive phrases
  const phraseCounts = {};
  sampleSoftware.forEach(t => {
    const desc = t.description || '';
    const sentences = desc.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);
    sentences.forEach(s => {
      // normalize tool name
      const norm = s.replace(new RegExp(t.name, 'gi'), '{TOOL_NAME}').toLowerCase();
      phraseCounts[norm] = (phraseCounts[norm] || 0) + 1;
    });
  });

  const repeatedPhrases = Object.entries(phraseCounts).filter(([_, c]) => c > 1);
  console.log(`Sampled 50 software pages: Found ${repeatedPhrases.length} repeated sentence patterns across tools.`);
}

evaluateQuality().catch(console.error);
