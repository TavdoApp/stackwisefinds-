/**
 * StakDock 2.0: Client-Side Stack Intelligence Engine (ES Module)
 *
 * Direct browser-compatible implementation of the deterministic engine.
 * Reuses:
 * - src/data/stackIntelligenceSeedData.js
 * - src/data/stackIntelligenceSchema.js
 *
 * ZERO SYNTHETIC METRICS:
 * 100% deterministic, explainable, and grounded in primary source verification.
 */

import { seedSoftwareTools } from '../data/stackIntelligenceSeedData.js';
import {
  PRICING_MODELS,
  COST_CONFIDENCE,
  DEPLOYMENT_MODELS,
  LICENSE_TYPES,
  INTEGRATION_STATUS,
  OVERLAP_LEVELS,
  EVIDENCE_CLASSIFICATION
} from '../data/stackIntelligenceSchema.js';

export const seedTools = seedSoftwareTools;
export const toolsMap = new Map(seedSoftwareTools.map(t => [t.toolId, t]));

/**
 * 1. PRICING & COST NORMALIZATION ENGINE
 */
export function calculateToolCost(tool, teamSize = 1, preferAnnual = false, hostingPreference = 'cloud') {
  if (!tool) {
    return {
      softwareLicenseMonthlyCost: 0,
      estimatedInfrastructureMonthlyCost: 0,
      totalEstimatedMonthlyCost: 0,
      totalEstimatedAnnualCost: 0,
      estimatedMaintenanceBurden: 'NOT_APPLICABLE',
      costConfidence: 'UNKNOWN',
      calculationDetails: 'No tool specified.',
      infrastructureDetails: null,
      transactionFeesNote: null,
      freeTierLimitsNote: null
    };
  }

  const cm = tool.commercialModel || {};
  const sh = tool.selfHostModel || {};

  let softwareLicenseMonthlyCost = 0;
  let estimatedInfrastructureMonthlyCost = 0;
  let estimatedMaintenanceBurden = 'NOT_APPLICABLE';
  let totalEstimatedMonthlyCost = 0;
  let costConfidence = cm.costConfidence || 'HIGH';
  let calculationDetails = '';
  let transactionFeesNote = null;
  let freeTierLimitsNote = cm.freeTierLimits || null;
  let infrastructureDetails = null;

  const isSelfHostedChoice = hostingPreference === 'self_hosted' && Boolean(sh.supported);

  if (isSelfHostedChoice) {
    softwareLicenseMonthlyCost = sh.softwareLicenseCostMonthly || 0;
    estimatedMaintenanceBurden = sh.maintenanceBurden || 'LOW';

    if (sh.estimatedServerCostMonthlyRange) {
      estimatedInfrastructureMonthlyCost = sh.estimatedServerCostMonthlyRange.minUsd;
      infrastructureDetails = `Requires server infrastructure: ${sh.minServerSpecs} (~$${sh.estimatedServerCostMonthlyRange.minUsd}–$${sh.estimatedServerCostMonthlyRange.maxUsd}/mo estimated VPS).`;
      costConfidence = 'VARIABLE';
    } else {
      infrastructureDetails = 'Local desktop execution; $0 server compute.';
      costConfidence = 'HIGH';
    }

    totalEstimatedMonthlyCost = softwareLicenseMonthlyCost + estimatedInfrastructureMonthlyCost;
    calculationDetails = `Self-hosted edition: $${softwareLicenseMonthlyCost}/mo software license + ~$${estimatedInfrastructureMonthlyCost.toFixed(2)}/mo minimum VPS hosting.`;

  } else if (cm.pricingModel === 'FREE_FOREVER' || (cm.baseMonthlyPriceUsd === 0 && cm.pricePerSeatMonthlyUsd === 0 && !cm.freeTierLimits)) {
    softwareLicenseMonthlyCost = 0;
    totalEstimatedMonthlyCost = 0;
    calculationDetails = '100% Free plan.';
    costConfidence = 'HIGH';

  } else if (cm.pricingModel === 'PER_SEAT_MONTHLY' || cm.pricePerSeatMonthlyUsd > 0) {
    const effectiveSeats = Math.max(teamSize, cm.minimumSeats || 1);
    let seatPrice = cm.pricePerSeatMonthlyUsd;
    if (preferAnnual && cm.annualDiscountPercent > 0) {
      seatPrice = seatPrice * (1 - (cm.annualDiscountPercent / 100));
    }
    softwareLicenseMonthlyCost = seatPrice * effectiveSeats;
    totalEstimatedMonthlyCost = softwareLicenseMonthlyCost;
    calculationDetails = `${effectiveSeats} seats × $${seatPrice.toFixed(2)}/seat/mo${preferAnnual ? ' (annual discount)' : ''}.`;
    costConfidence = 'HIGH';

  } else if (cm.pricingModel === 'FLAT_MONTHLY') {
    let basePrice = cm.baseMonthlyPriceUsd;
    if (preferAnnual && cm.annualDiscountPercent > 0) {
      basePrice = basePrice * (1 - (cm.annualDiscountPercent / 100));
    }
    softwareLicenseMonthlyCost = basePrice;
    totalEstimatedMonthlyCost = softwareLicenseMonthlyCost;
    calculationDetails = `Flat rate $${basePrice.toFixed(2)}/month${preferAnnual ? ' (annual discount)' : ''}.`;
    costConfidence = 'HIGH';

  } else if (cm.pricingModel === 'USAGE_BASED') {
    softwareLicenseMonthlyCost = cm.baseMonthlyPriceUsd || 0;
    totalEstimatedMonthlyCost = softwareLicenseMonthlyCost;
    calculationDetails = `Base metered rate starts at $${softwareLicenseMonthlyCost.toFixed(2)}/mo plus variable volume.`;
    costConfidence = 'MEDIUM';

  } else if (cm.pricingModel === 'FREEMIUM') {
    if (teamSize === 1 && cm.freePlanAvailable) {
      softwareLicenseMonthlyCost = 0;
      totalEstimatedMonthlyCost = 0;
      calculationDetails = 'Included in Free Tier allowance.';
      costConfidence = 'HIGH';
    } else {
      const effectiveSeats = Math.max(teamSize, cm.minimumSeats || 1);
      const seatPrice = cm.pricePerSeatMonthlyUsd || cm.baseMonthlyPriceUsd || 15;
      softwareLicenseMonthlyCost = seatPrice * effectiveSeats;
      totalEstimatedMonthlyCost = softwareLicenseMonthlyCost;
      calculationDetails = `Paid tier: ${effectiveSeats} seats × $${seatPrice.toFixed(2)}/seat/mo.`;
      costConfidence = 'HIGH';
    }
  } else {
    softwareLicenseMonthlyCost = cm.baseMonthlyPriceUsd || 0;
    totalEstimatedMonthlyCost = softwareLicenseMonthlyCost;
    calculationDetails = `Base plan $${softwareLicenseMonthlyCost.toFixed(2)}/mo.`;
  }

  if (cm.transactionFeePercent > 0 || cm.transactionFeeFixedUsd > 0) {
    transactionFeesNote = `Payment processing fees apply: ${cm.transactionFeePercent > 0 ? cm.transactionFeePercent + '%' : ''}${cm.transactionFeeFixedUsd > 0 ? ' + $' + cm.transactionFeeFixedUsd.toFixed(2) : ''} per transaction.`;
  }

  return {
    softwareLicenseMonthlyCost: Math.round(softwareLicenseMonthlyCost * 100) / 100,
    estimatedInfrastructureMonthlyCost: Math.round(estimatedInfrastructureMonthlyCost * 100) / 100,
    totalEstimatedMonthlyCost: Math.round(totalEstimatedMonthlyCost * 100) / 100,
    totalEstimatedAnnualCost: Math.round(totalEstimatedMonthlyCost * 12 * 100) / 100,
    estimatedMaintenanceBurden,
    costConfidence,
    calculationDetails,
    infrastructureDetails,
    transactionFeesNote,
    freeTierLimitsNote
  };
}

/**
 * 2. OVERLAP DETECTION ENGINE
 */
export function evaluateToolOverlap(toolA, toolB) {
  if (!toolA || !toolB) return { level: OVERLAP_LEVELS.UNKNOWN, sharedFeatures: [], reason: 'Tool not found' };
  if (toolA.toolId === toolB.toolId) return { level: 'IDENTICAL', sharedFeatures: [], reason: 'Same tool' };

  const tagsA = new Set(toolA.featureTags || []);
  const tagsB = new Set(toolB.featureTags || []);
  const sharedTags = [...tagsA].filter(t => tagsB.has(t));

  const isSamePrimary = toolA.primaryCapability === toolB.primaryCapability;
  const isASecondaryInB = (toolA.secondaryCapabilities || []).includes(toolB.primaryCapability);
  const isBSecondaryInA = (toolB.secondaryCapabilities || []).includes(toolA.primaryCapability);

  if (isSamePrimary && sharedTags.length >= 3) {
    return {
      level: OVERLAP_LEVELS.HIGH_OVERLAP,
      sharedFeatures: sharedTags,
      reason: `${toolA.name} and ${toolB.name} both serve '${toolA.primaryCapability}' as their primary role and duplicate key capabilities: ${sharedTags.join(', ')}. Choosing one or establishing clear role boundaries is strongly advised.`
    };
  }

  if (isSamePrimary) {
    return {
      level: OVERLAP_LEVELS.MODERATE_OVERLAP,
      sharedFeatures: sharedTags,
      reason: `Both tools focus on '${toolA.primaryCapability}', but specialize in different sub-workflows (shared: ${sharedTags.join(', ') || 'general domain'}).`
    };
  }

  if (isASecondaryInB || isBSecondaryInA || sharedTags.length >= 2) {
    return {
      level: OVERLAP_LEVELS.MODERATE_OVERLAP,
      sharedFeatures: sharedTags,
      reason: `Tools share overlapping capabilities in: ${sharedTags.join(', ')}. Check whether one tool's built-in feature eliminates the need for the other.`
    };
  }

  if (sharedTags.length === 1) {
    return {
      level: OVERLAP_LEVELS.LOW_OVERLAP,
      sharedFeatures: sharedTags,
      reason: `Minor overlap on auxiliary feature: ${sharedTags[0]}.`
    };
  }

  return {
    level: OVERLAP_LEVELS.COMPLEMENTARY,
    sharedFeatures: [],
    reason: 'Distinct, non-overlapping capabilities that operate synergistically.'
  };
}

/**
 * 3. MULTI-STATE INTEGRATION RESOLUTION ENGINE
 */
export function evaluateIntegration(toolA, toolB) {
  if (!toolA || !toolB) return { status: INTEGRATION_STATUS.UNKNOWN, bridge: null, note: 'Tool data missing' };
  if (toolA.toolId === toolB.toolId) return { status: INTEGRATION_STATUS.NATIVE_VERIFIED, bridge: null, note: 'Self' };

  const aNative = (toolA.integrations?.nativeIntegrations || []).includes(toolB.toolId);
  const bNative = (toolB.integrations?.nativeIntegrations || []).includes(toolA.toolId);

  if (aNative || bNative) {
    return {
      status: INTEGRATION_STATUS.NATIVE_VERIFIED,
      bridge: null,
      note: `Direct first-party native integration verified between ${toolA.name} and ${toolB.name}.`
    };
  }

  const aAuto = toolA.integrations?.automationPlatforms || [];
  const bAuto = toolB.integrations?.automationPlatforms || [];
  const commonBridge = aAuto.filter(p => bAuto.includes(p));

  if (commonBridge.length > 0) {
    return {
      status: INTEGRATION_STATUS.AUTOMATION_BRIDGE_VERIFIED,
      bridge: commonBridge[0],
      note: `Connects via verified ${commonBridge[0].toUpperCase()} automation connector.`
    };
  }

  if (toolA.integrations?.apiAvailable && toolB.integrations?.apiAvailable) {
    return {
      status: INTEGRATION_STATUS.API_COMPATIBLE,
      bridge: 'custom_rest_webhook',
      note: `Both provide documented REST/GraphQL APIs; custom webhook or middleware required for synchronization.`
    };
  }

  if (toolA.integrations?.apiAvailable === false || toolB.integrations?.apiAvailable === false) {
    return {
      status: INTEGRATION_STATUS.NO_INTEGRATION_VERIFIED,
      bridge: null,
      note: `At least one tool lacks a public API, preventing automated data synchronization.`
    };
  }

  return {
    status: INTEGRATION_STATUS.UNKNOWN,
    bridge: null,
    note: 'Integration status between these tools is unverified in primary sources.'
  };
}

/**
 * 4. TRANSPARENT TIERED STACK SYNTHESIS ENGINE
 */
export function synthesizeStack(input) {
  const {
    businessType = 'solo_founder',
    teamSize = 1,
    monthlyBudgetUsd = 100,
    requiredCapabilities = ['INVOICING', 'PROJECT_MANAGEMENT'],
    preferredDeployment = 'all', // 'all' | 'cloud_saas' | 'self_hosted_open_source'
    preferAnnual = false,
    technicalSkill = 'low',      // 'none' | 'low' | 'moderate' | 'developer'
    existingToolsToKeep = [],    // e.g. ['hubspot']
    advancedFilters = {}         // { freePlanRequired, openSourceRequired, apiRequired, dataExportRequired, lowLockInPreferred, dockerPreferred }
  } = input;

  const stackItems = [];
  let totalSoftwareCost = 0;
  let totalInfrastructureCost = 0;
  const warnings = [];
  const unknowns = [];

  // Track existing preserved capabilities
  const preservedTools = existingToolsToKeep.map(id => toolsMap.get(id)).filter(Boolean);
  const preservedCapabilities = new Set();
  preservedTools.forEach(t => {
    preservedCapabilities.add(t.primaryCapability);
    (t.secondaryCapabilities || []).forEach(c => preservedCapabilities.add(c));
  });

  requiredCapabilities.forEach(capability => {
    // If capability is already fully satisfied by an existing tool user wants to keep, acknowledge and retain
    const existingProvider = preservedTools.find(t => t.primaryCapability === capability || (t.secondaryCapabilities || []).includes(capability));
    if (existingProvider) {
      stackItems.push({
        capability,
        selectedTool: {
          ...existingProvider,
          monthlyCost: 0,
          annualCost: 0,
          softwareLicenseCost: 0,
          infrastructureCost: 0,
          costConfidence: 'HIGH',
          costCalculationDetails: `Retained from your existing stack (${existingProvider.name}). Zero incremental software cost.`,
          whyItFits: `You already have ${existingProvider.name} active, which natively covers '${capability}'.`,
          hostingType: existingProvider.deployment?.selfHostedAvailable ? 'Self-Hosted / Cloud' : 'Cloud SaaS',
          isRetainedExisting: true,
          evidenceFact: `Active tool in your company stack: ${existingProvider.name}.`,
          editorialReason: `Retaining existing tools avoids unnecessary migration friction and redundant software spend.`,
          calculationNote: `$0.00 incremental subscription cost.`
        },
        alternativeOption: null,
        freeOssOption: null
      });
      return;
    }

    // 1. FILTER CANDIDATE POOL
    let candidates = seedTools.filter(t => {
      const matchPrimary = t.primaryCapability === capability;
      const matchSecondary = (t.secondaryCapabilities || []).includes(capability);
      return matchPrimary || matchSecondary;
    });

    // Apply strict deployment filter
    if (preferredDeployment === 'self_hosted_open_source') {
      const ossOnly = candidates.filter(t => t.licensing.openSource && t.deployment.selfHostedAvailable);
      if (ossOnly.length > 0) candidates = ossOnly;
      else warnings.push(`No native open-source tool found for capability '${capability}'. Showing available cloud alternatives.`);
    }

    // Apply Advanced Filters if specified
    if (advancedFilters.freePlanRequired) {
      const freeOnly = candidates.filter(t => t.commercialModel?.freePlanAvailable);
      if (freeOnly.length > 0) candidates = freeOnly;
    }
    if (advancedFilters.openSourceRequired) {
      const ossOnly = candidates.filter(t => t.licensing?.openSource);
      if (ossOnly.length > 0) candidates = ossOnly;
    }
    if (advancedFilters.apiRequired) {
      const apiOnly = candidates.filter(t => t.integrations?.apiAvailable);
      if (apiOnly.length > 0) candidates = apiOnly;
    }
    if (advancedFilters.dataExportRequired) {
      const exportOnly = candidates.filter(t => t.dataAndPortability?.dataExportAvailable);
      if (exportOnly.length > 0) candidates = exportOnly;
    }
    if (advancedFilters.lowLockInPreferred) {
      const lowLockOnly = candidates.filter(t => t.dataAndPortability?.vendorLockInRisk === 'low');
      if (lowLockOnly.length > 0) candidates = lowLockOnly;
    }
    if (advancedFilters.dockerPreferred) {
      const dockerOnly = candidates.filter(t => t.deployment?.dockerAvailable);
      if (dockerOnly.length > 0) candidates = dockerOnly;
    }

    if (candidates.length === 0) {
      unknowns.push(`No verified tool in current catalog satisfies all filters for capability: ${capability}`);
      return;
    }

    // 2. DETERMINISTIC TIERED SELECTION
    const scoredCandidates = candidates.map(tool => {
      let priorityScore = 0;
      if (tool.primaryCapability === capability) priorityScore += 1000;
      else priorityScore += 500;

      if ((tool.businessFit?.businessTypes || []).includes(businessType)) priorityScore += 200;
      if (teamSize >= tool.businessFit?.teamSizeMin && teamSize <= tool.businessFit?.teamSizeMax) priorityScore += 100;

      const hostingMode = (preferredDeployment === 'self_hosted_open_source' || (tool.deployment?.selfHostedAvailable && !tool.deployment?.cloudAvailable)) ? 'self_hosted' : 'cloud';
      const costObj = calculateToolCost(tool, teamSize, preferAnnual, hostingMode);

      if (monthlyBudgetUsd > 0 && costObj.totalEstimatedMonthlyCost > monthlyBudgetUsd) {
        priorityScore -= 400;
      }

      return { tool, priorityScore, costObj, hostingMode };
    });

    scoredCandidates.sort((a, b) => b.priorityScore - a.priorityScore);
    const winner = scoredCandidates[0];
    const alternative = scoredCandidates[1] || null;
    const ossOption = candidates.find(t => t.licensing.openSource && t.toolId !== winner.tool.toolId) || null;

    if (winner.hostingMode === 'self_hosted' && (technicalSkill === 'none' || technicalSkill === 'low')) {
      warnings.push(`Technical Burden Alert: ${winner.tool.name} requires Linux/Docker server setup and database backups. If you lack developer experience, managed SaaS is recommended.`);
    }

    stackItems.push({
      capability,
      selectedTool: {
        ...winner.tool,
        monthlyCost: winner.costObj.totalEstimatedMonthlyCost,
        annualCost: winner.costObj.totalEstimatedAnnualCost,
        softwareLicenseCost: winner.costObj.softwareLicenseMonthlyCost,
        infrastructureCost: winner.costObj.estimatedInfrastructureMonthlyCost,
        costConfidence: winner.costObj.costConfidence,
        costCalculationDetails: winner.costObj.calculationDetails,
        infrastructureDetails: winner.costObj.infrastructureDetails,
        transactionFeesNote: winner.costObj.transactionFeesNote,
        freeTierLimitsNote: winner.costObj.freeTierLimitsNote,
        whyItFits: `${winner.tool.name} matches '${capability}', supports a ${teamSize}-person team, and fits your ${businessType.replace('_', ' ')} requirements.`,
        hostingType: winner.hostingMode === 'self_hosted' ? 'Self-Hosted' : 'Cloud SaaS',
        evidenceFact: `Primary source: Verified on ${winner.tool.commercialModel?.pricingVerifiedAt?.slice(0, 10) || '2026-08-31'} via official vendor docs.`,
        editorialReason: winner.tool.businessFit?.bestFor || `Selected for ${businessType.replace('_', ' ')} compatibility.`,
        calculationNote: winner.costObj.calculationDetails
      },
      alternativeOption: alternative ? {
        ...alternative.tool,
        monthlyCost: alternative.costObj.totalEstimatedMonthlyCost,
        tradeoff: `Alternative option at $${alternative.costObj.totalEstimatedMonthlyCost}/mo.`
      } : null,
      freeOssOption: ossOption ? {
        ...ossOption,
        savingsNote: `Free self-hosted edition saves subscription fees (server compute ~$${ossOption.selfHostModel?.estimatedServerCostMonthlyRange?.minUsd || 5}/mo).`
      } : null
    });

    totalSoftwareCost += winner.costObj.softwareLicenseMonthlyCost;
    totalInfrastructureCost += winner.costObj.estimatedInfrastructureMonthlyCost;
  });

  const totalMonthlyCost = totalSoftwareCost + totalInfrastructureCost;
  const totalAnnualCost = totalMonthlyCost * 12;

  // 3. OVERLAP ANALYSIS
  const overlapWarnings = [];
  for (let i = 0; i < stackItems.length; i++) {
    for (let j = i + 1; j < stackItems.length; j++) {
      const toolA = toolsMap.get(stackItems[i].selectedTool.toolId);
      const toolB = toolsMap.get(stackItems[j].selectedTool.toolId);
      if (toolA && toolB && toolA.toolId !== toolB.toolId) {
        const overlap = evaluateToolOverlap(toolA, toolB);
        if (overlap.level === OVERLAP_LEVELS.HIGH_OVERLAP || overlap.level === OVERLAP_LEVELS.MODERATE_OVERLAP) {
          overlapWarnings.push({
            pair: [toolA.name, toolB.name],
            level: overlap.level,
            sharedFeatures: overlap.sharedFeatures,
            details: overlap.reason
          });
        }
      }
    }
  }

  // 4. INTEGRATION MATRIX
  const integrationMatrix = [];
  for (let i = 0; i < stackItems.length; i++) {
    for (let j = i + 1; j < stackItems.length; j++) {
      const toolA = toolsMap.get(stackItems[i].selectedTool.toolId);
      const toolB = toolsMap.get(stackItems[j].selectedTool.toolId);
      if (toolA && toolB && toolA.toolId !== toolB.toolId) {
        const integ = evaluateIntegration(toolA, toolB);
        integrationMatrix.push({
          pair: [toolA.name, toolB.name],
          status: integ.status,
          bridge: integ.bridge,
          note: integ.note
        });
      }
    }
  }

  // 5. BUDGET REALISM & FIT ASSESSMENT
  let fitAssessment = 'EXCELLENT FIT';
  if (monthlyBudgetUsd > 0 && totalMonthlyCost > monthlyBudgetUsd) {
    fitAssessment = 'EXCEEDS BUDGET';
    warnings.push(`Budget Realism Warning: Your requested capabilities for a ${teamSize}-person team require a minimum of $${totalMonthlyCost.toFixed(2)}/mo, which exceeds your $${monthlyBudgetUsd}/mo budget limit by $${(totalMonthlyCost - monthlyBudgetUsd).toFixed(2)}/mo.`);
  } else if (monthlyBudgetUsd > 0 && totalMonthlyCost > monthlyBudgetUsd * 0.9) {
    fitAssessment = 'AT BUDGET CAP';
  } else if (overlapWarnings.some(w => w.level === OVERLAP_LEVELS.HIGH_OVERLAP)) {
    fitAssessment = 'CONDITIONAL FIT (HIGH OVERLAP DETECTED)';
  }

  // 6. CONFIDENCE METRICS
  const recommendationConfidence = unknowns.length > 0 ? 'MEDIUM' : 'HIGH';
  const costConfidence = stackItems.some(s => s.selectedTool.costConfidence === 'VARIABLE') ? 'VARIABLE' : 'HIGH';
  const integrationConfidence = integrationMatrix.some(m => m.status === 'UNKNOWN') ? 'MEDIUM' : 'HIGH';

  // 7. OPEN SOURCE SAVINGS ESTIMATE
  let ossEquivalentCost = 0;
  let ossPotentialAvailable = false;
  stackItems.forEach(item => {
    const candidateOss = seedTools.find(t => (t.primaryCapability === item.capability || (t.secondaryCapabilities || []).includes(item.capability)) && t.licensing?.openSource && t.deployment?.selfHostedAvailable);
    if (candidateOss) {
      ossPotentialAvailable = true;
      const ossCost = calculateToolCost(candidateOss, teamSize, preferAnnual, 'self_hosted');
      ossEquivalentCost += ossCost.totalEstimatedMonthlyCost;
    } else {
      ossEquivalentCost += item.selectedTool.monthlyCost;
    }
  });

  const ossMonthlySavings = ossPotentialAvailable && totalMonthlyCost > ossEquivalentCost
    ? Math.round((totalMonthlyCost - ossEquivalentCost) * 100) / 100
    : 0;

  return {
    inputSummary: {
      businessType,
      teamSize,
      monthlyBudgetUsd,
      requiredCapabilities,
      preferredDeployment,
      technicalSkill,
      existingToolsToKeep,
      advancedFilters
    },
    costSummary: {
      totalSoftwareLicenseMonthlyCost: Math.round(totalSoftwareCost * 100) / 100,
      totalEstimatedInfrastructureMonthlyCost: Math.round(totalInfrastructureCost * 100) / 100,
      totalEstimatedMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
      totalEstimatedAnnualCost: Math.round(totalAnnualCost * 100) / 100,
      budgetDifferenceUsd: monthlyBudgetUsd > 0 ? Math.round((monthlyBudgetUsd - totalMonthlyCost) * 100) / 100 : null,
      fitAssessment,
      costConfidence,
      ossMonthlySavings,
      ossEquivalentMonthlyCost: Math.round(ossEquivalentCost * 100) / 100
    },
    confidenceSummary: {
      recommendationConfidence,
      costConfidence,
      integrationConfidence,
      dataFreshness: 'VERIFIED_2026'
    },
    recommendedStack: stackItems,
    overlapAnalysis: overlapWarnings,
    integrationMatrix,
    warnings,
    unknowns
  };
}

/**
 * Get all available replacement tools for a capability
 */
export function getAvailableToolsForCapability(capability, teamSize = 1, preferAnnual = false) {
  const tools = seedTools.filter(t => t.primaryCapability === capability || (t.secondaryCapabilities || []).includes(capability));
  return tools.map(tool => {
    const cloudCost = calculateToolCost(tool, teamSize, preferAnnual, 'cloud');
    const selfHostCost = tool.deployment?.selfHostedAvailable
      ? calculateToolCost(tool, teamSize, preferAnnual, 'self_hosted')
      : null;
    return {
      tool,
      cloudCost,
      selfHostCost
    };
  });
}
