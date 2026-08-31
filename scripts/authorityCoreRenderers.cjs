/**
 * StakDock Unified Authority Core Renderers Entrypoint (Phase 4C.2)
 * Aggregates all Trust Layer, Batch 1, Batch 2, and CORE-A Upgrade renderers.
 */

const { renderSsrNavbar } = require('./renderers/commonNav.cjs');
const trustRenderers = require('./renderers/trustRenderers.cjs');
const batch1Renderers = require('./renderers/batch1Renderers.cjs');
const batch2Renderers = require('./renderers/batch2Renderers.cjs');
const coreAUpgradeRenderers = require('./renderers/coreAUpgradeRenderers.cjs');

const customRecoveryWaveRenderers = require('./customRecoveryWaveRenderers.cjs');

module.exports = {
  renderSsrNavbar,
  ...trustRenderers,
  ...batch1Renderers,
  ...batch2Renderers,
  ...coreAUpgradeRenderers,
  ...customRecoveryWaveRenderers
};
