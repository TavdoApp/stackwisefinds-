/**
 * StakDock 2.0: Stack Intelligence Engine (Thin CommonJS Wrapper)
 *
 * CANONICAL SOURCE OF TRUTH:
 * src/utils/stackIntelligenceEngine.js
 *
 * This wrapper ensures 100% logic unification with zero duplicated algorithms.
 */

const path = require('path');

let esmModule = null;

async function getEngine() {
  if (!esmModule) {
    esmModule = await import('../src/utils/stackIntelligenceEngine.js');
  }
  return esmModule;
}

module.exports = {
  getEngine,
  // Helper to run engine functions
  async synthesizeStack(input) {
    const engine = await getEngine();
    return engine.synthesizeStack(input);
  },
  async calculateToolCost(tool, teamSize, preferAnnual, hostingPreference) {
    const engine = await getEngine();
    return engine.calculateToolCost(tool, teamSize, preferAnnual, hostingPreference);
  },
  async evaluateToolOverlap(toolA, toolB) {
    const engine = await getEngine();
    return engine.evaluateToolOverlap(toolA, toolB);
  },
  async evaluateIntegration(toolA, toolB) {
    const engine = await getEngine();
    return engine.evaluateIntegration(toolA, toolB);
  }
};
