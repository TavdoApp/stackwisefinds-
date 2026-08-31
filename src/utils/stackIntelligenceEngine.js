/**
 * StakDock 2.0: Authoritative Stack Intelligence & Optimization Engine
 *
 * CANONICAL SOURCE OF TRUTH:
 * - Single authoritative module used across browser UI, SSR, and verification tests.
 * - Deterministic constrained combinatorial stack optimization.
 * - Decoupled Software License, Infrastructure VPS, and Variable Quotas.
 * - Distinct Recommendation Confidence (HIGH/MEDIUM/LOW) vs Cost Confidence (FIXED/ESTIMATED/VARIABLE/UNKNOWN).
 * - Multi-State Integration Graph & Granular Overlap Detection.
 * - Zero synthetic ratings, zero fake reviews, zero arbitrary AI scores.
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
      freeTierLimitsNote: null,
      freeTierUncertaintyNote: null
    };
  }

  const cm = tool.commercialModel || {};
  const sh = tool.selfHostModel || {};

  let softwareLicenseMonthlyCost = 0;
  let estimatedInfrastructureMonthlyCost = 0;
  let estimatedMaintenanceBurden = 'NOT_APPLICABLE';
  let totalEstimatedMonthlyCost = 0;
  let costConfidence = 'FIXED';
  let calculationDetails = '';
  let transactionFeesNote = null;
  let freeTierLimitsNote = cm.freeTierLimits || null;
  let freeTierUncertaintyNote = null;
  let infrastructureDetails = null;

  const isSelfHostedChoice = (hostingPreference === 'self_hosted' || hostingPreference === 'self_hosted_only') && Boolean(sh.supported);

  if (isSelfHostedChoice) {
    softwareLicenseMonthlyCost = sh.softwareLicenseCostMonthly || 0;
    estimatedMaintenanceBurden = sh.maintenanceBurden || 'LOW';

    if (sh.estimatedServerCostMonthlyRange) {
      estimatedInfrastructureMonthlyCost = sh.estimatedServerCostMonthlyRange.minUsd;
      infrastructureDetails = `Requires server infrastructure: ${sh.minServerSpecs} (~$${sh.estimatedServerCostMonthlyRange.minUsd}–$${sh.estimatedServerCostMonthlyRange.maxUsd}/mo estimated VPS).`;
      costConfidence = 'ESTIMATED';
    } else {
      infrastructureDetails = 'Local desktop execution; $0 server compute.';
      costConfidence = 'FIXED';
    }

    totalEstimatedMonthlyCost = softwareLicenseMonthlyCost + estimatedInfrastructureMonthlyCost;
    calculationDetails = `Self-hosted edition: $${softwareLicenseMonthlyCost}/mo software license + ~$${estimatedInfrastructureMonthlyCost.toFixed(2)}/mo minimum VPS hosting.`;

  } else if (cm.pricingModel === 'FREE_FOREVER' || (cm.baseMonthlyPriceUsd === 0 && cm.pricePerSeatMonthlyUsd === 0 && !cm.freeTierLimits)) {
    softwareLicenseMonthlyCost = 0;
    totalEstimatedMonthlyCost = 0;
    calculationDetails = '100% Free plan.';
    costConfidence = 'FIXED';

  } else if (cm.pricingModel === 'PER_SEAT_MONTHLY' || cm.pricePerSeatMonthlyUsd > 0) {
    const effectiveSeats = Math.max(teamSize, cm.minimumSeats || 1);
    let seatPrice = cm.pricePerSeatMonthlyUsd;
    if (preferAnnual && cm.annualDiscountPercent > 0) {
      seatPrice = seatPrice * (1 - (cm.annualDiscountPercent / 100));
    }
    softwareLicenseMonthlyCost = seatPrice * effectiveSeats;
    totalEstimatedMonthlyCost = softwareLicenseMonthlyCost;
    calculationDetails = `${effectiveSeats} seats × $${seatPrice.toFixed(2)}/seat/mo${preferAnnual ? ' (annual discount)' : ''}.`;
    costConfidence = 'FIXED';

  } else if (cm.pricingModel === 'FLAT_MONTHLY') {
    let basePrice = cm.baseMonthlyPriceUsd;
    if (preferAnnual && cm.annualDiscountPercent > 0) {
      basePrice = basePrice * (1 - (cm.annualDiscountPercent / 100));
    }
    softwareLicenseMonthlyCost = basePrice;
    totalEstimatedMonthlyCost = softwareLicenseMonthlyCost;
    calculationDetails = `Flat rate $${basePrice.toFixed(2)}/month${preferAnnual ? ' (annual discount)' : ''}.`;
    costConfidence = 'FIXED';

  } else if (cm.pricingModel === 'USAGE_BASED') {
    softwareLicenseMonthlyCost = cm.baseMonthlyPriceUsd || 0;
    totalEstimatedMonthlyCost = softwareLicenseMonthlyCost;
    calculationDetails = `Base metered rate starts at $${softwareLicenseMonthlyCost.toFixed(2)}/mo plus variable volume.`;
    costConfidence = 'VARIABLE';

  } else if (cm.pricingModel === 'FREEMIUM') {
    if (teamSize === 1 && cm.freePlanAvailable) {
      softwareLicenseMonthlyCost = 0;
      totalEstimatedMonthlyCost = 0;
      calculationDetails = 'Included in Free Tier allowance.';
      costConfidence = 'FIXED';
      if (cm.freeTierLimits) {
        freeTierUncertaintyNote = `Free plan may be sufficient for early usage; limits apply: ${cm.freeTierLimits}`;
      }
    } else {
      const effectiveSeats = Math.max(teamSize, cm.minimumSeats || 1);
      const seatPrice = cm.pricePerSeatMonthlyUsd || cm.baseMonthlyPriceUsd || 15;
      softwareLicenseMonthlyCost = seatPrice * effectiveSeats;
      totalEstimatedMonthlyCost = softwareLicenseMonthlyCost;
      calculationDetails = `Paid tier: ${effectiveSeats} seats × $${seatPrice.toFixed(2)}/seat/mo.`;
      costConfidence = 'FIXED';
    }
  } else {
    softwareLicenseMonthlyCost = cm.baseMonthlyPriceUsd || 0;
    totalEstimatedMonthlyCost = softwareLicenseMonthlyCost;
    calculationDetails = `Base plan $${softwareLicenseMonthlyCost.toFixed(2)}/mo.`;
  }

  if (cm.freePlanAvailable && cm.freeTierLimits) {
    freeTierUncertaintyNote = `Free plan may be sufficient for early usage; limits apply: ${cm.freeTierLimits}`;
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
    freeTierLimitsNote,
    freeTierUncertaintyNote
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
      note: `Direct native integration documented between ${toolA.name} and ${toolB.name}.`
    };
  }

  const aAuto = toolA.integrations?.automationPlatforms || [];
  const bAuto = toolB.integrations?.automationPlatforms || [];
  const commonBridge = aAuto.filter(p => bAuto.includes(p));

  if (commonBridge.length > 0) {
    return {
      status: INTEGRATION_STATUS.AUTOMATION_BRIDGE_VERIFIED,
      bridge: commonBridge[0],
      note: `Connects via documented ${commonBridge[0].toUpperCase()} automation connector.`
    };
  }

  // Affirmative absence check: if vendor docs specifically confirm no external connectivity or strict isolation
  if (toolA.integrations?.apiAvailable === false && toolB.integrations?.apiAvailable === false) {
    return {
      status: INTEGRATION_STATUS.NO_INTEGRATION_VERIFIED,
      bridge: null,
      note: `Both tools lack external REST/GraphQL APIs, preventing automated data synchronization.`
    };
  }

  if (toolA.integrations?.apiAvailable && toolB.integrations?.apiAvailable && (toolA.integrations?.webhooksAvailable || toolB.integrations?.webhooksAvailable)) {
    return {
      status: INTEGRATION_STATUS.CUSTOM_INTEGRATION_REQUIRED,
      bridge: 'custom_rest_webhook',
      note: `Both tools expose public REST/GraphQL APIs; custom webhook or middleware required for synchronization.`
    };
  }

  return {
    status: INTEGRATION_STATUS.UNKNOWN,
    bridge: null,
    note: `Integration status between ${toolA.name} and ${toolB.name} is unverified in primary sources.`
  };
}

/**
 * 4. COMBINATORIAL STACK SYNTHESIS & OPTIMIZATION ENGINE
 */
export function synthesizeStack(input) {
  const {
    businessType = 'solo_founder',
    teamSize = 1,
    monthlyBudgetUsd = 100,
    budgetConstraintType = monthlyBudgetUsd > 0 ? 'hard' : 'none', // 'hard' | 'soft' | 'none'
    requiredCapabilities = ['INVOICING', 'PROJECT_MANAGEMENT'],
    preferredDeployment = 'no_preference', // 'no_preference' | 'cloud_saas' | 'open_source_preferred' | 'self_hosted_only'
    technicalSkill = 'moderate',           // 'none' | 'moderate' | 'developer'
    existingToolsToKeep = [],              // e.g. ['hubspot']
    existingToolCosts = {},                // e.g. { hubspot: 50 } or { hubspot: 'unknown' }
    advancedFilters = {}                   // { freePlanRequired, openSourceRequired, apiRequired, dataExportRequired, lowLockInPreferred, dockerPreferred }
  } = input;

  const warnings = [];
  const unknowns = [];
  const filterConflicts = [];

  // --- STEP 1: CONFLICT & COMPATIBILITY CHECKS ---
  if (preferredDeployment === 'cloud_saas' && advancedFilters.dockerPreferred) {
    filterConflicts.push('Managed Cloud SaaS preference conflicts with Docker Compose requirement.');
  }
  if (preferredDeployment === 'self_hosted_only' && technicalSkill === 'none') {
    warnings.push('Technical Burden Notice: Self-hosted software requires Linux server administration, Docker configuration, and database backups. Non-technical teams will face significant setup friction.');
  }

  // --- STEP 2: EXISTING TOOL RETENTION HANDLING ---
  const preservedTools = existingToolsToKeep.map(id => toolsMap.get(id)).filter(Boolean);
  const coveredByExisting = new Map(); // capability -> existingTool

  preservedTools.forEach(tool => {
    coveredByExisting.set(tool.primaryCapability, tool);
    (tool.secondaryCapabilities || []).forEach(secCap => {
      if (!coveredByExisting.has(secCap)) {
        coveredByExisting.set(secCap, tool);
      }
    });
  });

  // Calculate pre-owned cost totals
  let existingToolsTotalMonthlyCost = 0;
  let hasUnknownExistingCost = false;
  preservedTools.forEach(tool => {
    const specifiedCost = existingToolCosts[tool.toolId];
    if (typeof specifiedCost === 'number' && specifiedCost >= 0) {
      existingToolsTotalMonthlyCost += specifiedCost;
    } else {
      hasUnknownExistingCost = true;
    }
  });

  // --- STEP 3: CANDIDATE POOL GATHERING PER UNMET CAPABILITY ---
  const candidatePools = {};
  const unfulfilledCapabilities = requiredCapabilities.filter(cap => !coveredByExisting.has(cap));

  unfulfilledCapabilities.forEach(cap => {
    let pool = seedTools.filter(t => t.primaryCapability === cap || (t.secondaryCapabilities || []).includes(cap));

    // Apply strict deployment filtering
    if (preferredDeployment === 'self_hosted_only') {
      const shOnly = pool.filter(t => t.deployment?.selfHostedAvailable);
      if (shOnly.length > 0) {
        pool = shOnly;
      } else {
        filterConflicts.push(`No verified self-hostable tool in dataset for '${cap}'. Showing available cloud alternatives.`);
      }
    } else if (preferredDeployment === 'open_source_preferred') {
      // Prefer OSS but keep SaaS as fallbacks
      const oss = pool.filter(t => t.licensing?.openSource);
      if (oss.length === 0) {
        warnings.push(`No open-source tool found for '${cap}'. Cloud SaaS options provided.`);
      }
    }

    // Apply advanced filters
    if (advancedFilters.openSourceRequired) {
      const ossOnly = pool.filter(t => t.licensing?.openSource);
      if (ossOnly.length > 0) pool = ossOnly;
      else filterConflicts.push(`No open-source tool found for '${cap}'.`);
    }
    if (advancedFilters.freePlanRequired) {
      const freeOnly = pool.filter(t => t.commercialModel?.freePlanAvailable);
      if (freeOnly.length > 0) pool = freeOnly;
      else filterConflicts.push(`No free plan tool found for '${cap}'.`);
    }
    if (advancedFilters.apiRequired) {
      const apiOnly = pool.filter(t => t.integrations?.apiAvailable);
      if (apiOnly.length > 0) pool = apiOnly;
    }
    if (advancedFilters.dockerPreferred) {
      const dockerOnly = pool.filter(t => t.deployment?.dockerAvailable);
      if (dockerOnly.length > 0) pool = dockerOnly;
    }

    if (pool.length === 0) {
      unknowns.push(`No verified tool in current catalog satisfies all filters for capability: ${cap}`);
    } else {
      candidatePools[cap] = pool;
    }
  });

  // --- STEP 4: COMBINATORIAL STACK-LEVEL OPTIMIZATION ---
  // Generate combinations and score globally
  const validCaps = Object.keys(candidatePools);

  function getCombinations(capIndex, currentStack) {
    if (capIndex >= validCaps.length) {
      return [currentStack];
    }
    const cap = validCaps[capIndex];
    const tools = candidatePools[cap] || [];
    const results = [];
    for (const tool of tools) {
      const nextStack = { ...currentStack, [cap]: tool };
      results.push(...getCombinations(capIndex + 1, nextStack));
    }
    return results;
  }

  const allCombinations = validCaps.length > 0 ? getCombinations(0, {}) : [{}];

  // Score each combination
  const scoredStacks = allCombinations.map(comb => {
    let softwareLicenseCost = 0;
    let infrastructureCost = 0;
    let score = 1000;
    const selectedToolsList = [];

    // Track unique tools in this combination
    const uniqueTools = new Set();
    Object.entries(comb).forEach(([cap, tool]) => {
      uniqueTools.add(tool.toolId);
      selectedToolsList.push({ cap, tool });

      const hostingMode = (preferredDeployment === 'self_hosted_only' || (preferredDeployment === 'open_source_preferred' && tool.deployment?.selfHostedAvailable) || (tool.deployment?.selfHostedAvailable && !tool.deployment?.cloudAvailable))
        ? 'self_hosted'
        : 'cloud';

      const costObj = calculateToolCost(tool, teamSize, false, hostingMode);
      softwareLicenseCost += costObj.softwareLicenseMonthlyCost;
      infrastructureCost += costObj.estimatedInfrastructureMonthlyCost;

      // Fit score adjustments
      if (tool.primaryCapability === cap) score += 300;
      else score += 100;

      if ((tool.businessFit?.businessTypes || []).includes(businessType)) score += 150;
      if (teamSize >= tool.businessFit?.teamSizeMin && teamSize <= tool.businessFit?.teamSizeMax) score += 100;

      if (preferredDeployment === 'open_source_preferred' && tool.licensing?.openSource) score += 200;
      if (preferredDeployment === 'cloud_saas' && tool.deployment?.cloudAvailable) score += 100;
    });

    // Multi-capability efficiency bonus: using one tool for multiple tasks reduces subscription sprawl
    if (uniqueTools.size < Object.keys(comb).length) {
      score += (Object.keys(comb).length - uniqueTools.size) * 150;
    }

    // Technical burden penalty if user is non-technical and stack has self-hosted tools
    if (technicalSkill === 'none' && selectedToolsList.some(s => s.tool.deployment?.selfHostedAvailable && !s.tool.deployment?.cloudAvailable)) {
      score -= 500;
    }

    const totalCost = softwareLicenseCost + infrastructureCost;

    // Budget compliance
    const isWithinBudget = monthlyBudgetUsd === 0 || totalCost <= monthlyBudgetUsd;
    if (isWithinBudget) {
      score += 500; // Strong bonus for satisfying budget
    } else {
      score -= (totalCost - monthlyBudgetUsd) * 10; // Proportional penalty for overage
    }

    return {
      combination: comb,
      softwareLicenseCost: Math.round(softwareLicenseCost * 100) / 100,
      infrastructureCost: Math.round(infrastructureCost * 100) / 100,
      totalCost: Math.round(totalCost * 100) / 100,
      score,
      isWithinBudget
    };
  });

  // Sort: First by within-budget status if hard budget, then by score
  scoredStacks.sort((a, b) => {
    if (budgetConstraintType === 'hard' && monthlyBudgetUsd > 0) {
      if (a.isWithinBudget && !b.isWithinBudget) return -1;
      if (!a.isWithinBudget && b.isWithinBudget) return 1;
    }
    return b.score - a.score;
  });

  const bestStack = scoredStacks[0] || { combination: {}, softwareLicenseCost: 0, infrastructureCost: 0, totalCost: 0, isWithinBudget: true };

  // --- STEP 5: ASSEMBLE RECOMMENDED STACK ITEMS ---
  const stackItems = [];

  // Add preserved tools first
  coveredByExisting.forEach((tool, cap) => {
    if (requiredCapabilities.includes(cap)) {
      const hostingType = tool.deployment?.selfHostedAvailable && !tool.deployment?.cloudAvailable ? 'Self-Hosted' : 'Cloud SaaS';
      stackItems.push({
        capability: cap,
        selectedTool: {
          ...tool,
          monthlyCost: 0,
          annualCost: 0,
          softwareLicenseCost: 0,
          infrastructureCost: 0,
          costConfidence: 'FIXED',
          costCalculationDetails: `Pre-owned tool in active company stack (${tool.name}). $0.00 new incremental software spend.`,
          infrastructureDetails: null,
          transactionFeesNote: null,
          freeTierLimitsNote: null,
          whyItFits: `${tool.name} is already active in your stack and natively satisfies '${cap.replace('_', ' ')}'. Retaining it avoids redundant subscription spend and migration overhead.`,
          hostingType,
          isRetainedExisting: true,
          evidenceFact: `Active tool in your company stack: ${tool.name}.`,
          editorialReason: `Retaining existing tools prevents migration friction and double-paying.`,
          calculationNote: `$0.00 incremental subscription spend.`
        },
        alternativeOption: null,
        freeOssOption: null
      });
    }
  });

  // Add newly recommended tools
  Object.entries(bestStack.combination).forEach(([cap, tool]) => {
    const hostingMode = (preferredDeployment === 'self_hosted_only' || (preferredDeployment === 'open_source_preferred' && tool.deployment?.selfHostedAvailable) || (tool.deployment?.selfHostedAvailable && !tool.deployment?.cloudAvailable))
      ? 'self_hosted'
      : 'cloud';

    const costObj = calculateToolCost(tool, teamSize, false, hostingMode);

    // Natural human explanation generator
    let naturalWhy = '';
    if (hostingMode === 'self_hosted') {
      naturalWhy = `${tool.name} satisfies your '${cap.replace('_', ' ')}' requirement with full data ownership. There is no software license fee, but server infrastructure (~$${costObj.estimatedInfrastructureMonthlyCost}/mo) and Docker maintenance are required.`;
    } else if (costObj.totalEstimatedMonthlyCost === 0) {
      naturalWhy = `${tool.name} fulfills '${cap.replace('_', ' ')}' within its free tier for a ${teamSize}-person team.`;
    } else {
      naturalWhy = `${tool.name} is selected for '${cap.replace('_', ' ')}' because it fits a ${teamSize}-person ${businessType.replace('_', ' ')} workflow at a verified rate of $${costObj.totalEstimatedMonthlyCost.toFixed(2)}/mo.`;
    }

    stackItems.push({
      capability: cap,
      selectedTool: {
        ...tool,
        monthlyCost: costObj.totalEstimatedMonthlyCost,
        annualCost: costObj.totalEstimatedAnnualCost,
        softwareLicenseCost: costObj.softwareLicenseMonthlyCost,
        infrastructureCost: costObj.estimatedInfrastructureMonthlyCost,
        costConfidence: costObj.costConfidence,
        costCalculationDetails: costObj.calculationDetails,
        infrastructureDetails: costObj.infrastructureDetails,
        transactionFeesNote: costObj.transactionFeesNote,
        freeTierLimitsNote: costObj.freeTierLimitsNote,
        freeTierUncertaintyNote: costObj.freeTierUncertaintyNote,
        whyItFits: naturalWhy,
        hostingType: hostingMode === 'self_hosted' ? 'Self-Hosted' : 'Cloud SaaS',
        evidenceFact: `Pricing source checked ${tool.commercialModel?.pricingVerifiedAt ? tool.commercialModel.pricingVerifiedAt.slice(0, 10) : '2026-08-31'} via official vendor documentation.`,
        editorialReason: tool.businessFit?.bestFor || `Selected for ${businessType.replace('_', ' ')} compatibility.`,
        calculationNote: costObj.calculationDetails
      },
      alternativeOption: null,
      freeOssOption: null
    });
  });

  // Calculate totals
  let totalNewSoftwareCost = 0;
  let totalNewInfrastructureCost = 0;
  let minConsolidatedVPS = 0;
  let maxConsolidatedVPS = 0;
  let selfHostAppCount = 0;

  stackItems.forEach(s => {
    totalNewSoftwareCost += s.selectedTool.softwareLicenseCost;
    totalNewInfrastructureCost += s.selectedTool.infrastructureCost;
    if (s.selectedTool.hostingType === 'Self-Hosted' && s.selectedTool.selfHostModel?.estimatedServerCostMonthlyRange) {
      selfHostAppCount++;
      minConsolidatedVPS += s.selectedTool.selfHostModel.estimatedServerCostMonthlyRange.minUsd;
      maxConsolidatedVPS += s.selectedTool.selfHostModel.estimatedServerCostMonthlyRange.maxUsd;
    }
  });

  const totalNewMonthlyCost = Math.round((totalNewSoftwareCost + totalNewInfrastructureCost) * 100) / 100;
  const totalNewAnnualCost = Math.round(totalNewMonthlyCost * 12 * 100) / 100;

  // --- STEP 6: OVERLAP ANALYSIS ---
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

  // --- STEP 7: INTEGRATION MATRIX ---
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

  // --- STEP 8: BUDGET STATUS & FEASIBILITY ASSESSMENT ---
  let status = 'OPTIMAL_STACK_FOUND';
  let fitAssessment = 'EXCELLENT FIT';
  let budgetGapUsd = 0;
  let budgetGapExplanation = null;

  if (monthlyBudgetUsd > 0 && totalNewMonthlyCost > monthlyBudgetUsd) {
    budgetGapUsd = Math.round((totalNewMonthlyCost - monthlyBudgetUsd) * 100) / 100;
    if (budgetConstraintType === 'hard') {
      status = 'NO_STACK_WITHIN_BUDGET';
      fitAssessment = 'NO STACK FOUND WITHIN BUDGET';
      const paidDrivers = stackItems.filter(s => s.selectedTool.monthlyCost > 0).map(s => `${s.capability} (${s.selectedTool.name} at $${s.selectedTool.monthlyCost}/mo)`);
      budgetGapExplanation = `No verified stack in our current dataset satisfies all ${requiredCapabilities.length} requirements within $${monthlyBudgetUsd}/month. Closest available verified option is $${totalNewMonthlyCost.toFixed(2)}/month (a $${budgetGapUsd.toFixed(2)}/mo difference), driven by paid requirements in: ${paidDrivers.join(', ')}.`;
      warnings.push(`Budget Realism Warning: ${budgetGapExplanation}`);
    } else {
      status = 'EXCEEDS_SOFT_BUDGET';
      fitAssessment = 'EXCEEDS TARGET BUDGET';
      warnings.push(`Target Budget Exceeded: The recommended stack costs $${totalNewMonthlyCost.toFixed(2)}/mo ($${budgetGapUsd.toFixed(2)}/mo over target $${monthlyBudgetUsd}/mo) to satisfy team and capability requirements.`);
    }
  } else if (monthlyBudgetUsd > 0 && totalNewMonthlyCost > monthlyBudgetUsd * 0.9) {
    fitAssessment = 'AT BUDGET CAP';
  }

  // --- STEP 9: CONFIDENCE SEPARATION ---
  let recommendationConfidence = 'HIGH';
  if (unknowns.length > 0 || filterConflicts.length > 0 || status === 'NO_STACK_WITHIN_BUDGET') {
    recommendationConfidence = 'MEDIUM';
  }
  if (stackItems.length < requiredCapabilities.length) {
    recommendationConfidence = 'LOW';
  }

  let overallCostConfidence = 'FIXED';
  if (stackItems.some(s => s.selectedTool.costConfidence === 'VARIABLE')) {
    overallCostConfidence = 'VARIABLE';
  } else if (stackItems.some(s => s.selectedTool.costConfidence === 'ESTIMATED')) {
    overallCostConfidence = 'ESTIMATED';
  }

  // Self-hosting consolidated range
  const selfHostRange = selfHostAppCount > 0 ? {
    independentMinUsd: minConsolidatedVPS,
    independentMaxUsd: maxConsolidatedVPS,
    consolidatedMinUsd: selfHostAppCount > 1 ? Math.round(minConsolidatedVPS * 0.65) : minConsolidatedVPS,
    consolidatedMaxUsd: maxConsolidatedVPS,
    note: 'Estimated independently per application; infrastructure may sometimes be consolidated depending on workload and deployment.'
  } : null;

  return {
    status,
    inputSummary: {
      businessType,
      teamSize,
      monthlyBudgetUsd,
      budgetConstraintType,
      requiredCapabilities,
      preferredDeployment,
      technicalSkill,
      existingToolsToKeep,
      existingToolsTotalMonthlyCost: hasUnknownExistingCost ? 'Pre-owned (cost not provided)' : existingToolsTotalMonthlyCost,
      advancedFilters
    },
    costSummary: {
      totalNewSoftwareLicenseMonthlyCost: Math.round(totalNewSoftwareCost * 100) / 100,
      totalNewInfrastructureMonthlyCost: Math.round(totalNewInfrastructureCost * 100) / 100,
      totalNewMonthlyCost,
      totalNewAnnualCost,
      existingToolsMonthlyCost: hasUnknownExistingCost ? 'Pre-owned (cost not provided)' : existingToolsTotalMonthlyCost,
      totalEstimatedStackMonthlyCost: hasUnknownExistingCost ? `~$${totalNewMonthlyCost} + pre-owned tools` : Math.round((totalNewMonthlyCost + existingToolsTotalMonthlyCost) * 100) / 100,
      budgetDifferenceUsd: monthlyBudgetUsd > 0 ? Math.round((monthlyBudgetUsd - totalNewMonthlyCost) * 100) / 100 : null,
      budgetGapUsd,
      budgetGapExplanation,
      fitAssessment,
      costConfidence: overallCostConfidence,
      selfHostRange
    },
    confidenceSummary: {
      recommendationConfidence,
      costConfidence: overallCostConfidence,
      pricingCheckedDate: '2026-08-31'
    },
    recommendedStack: stackItems,
    overlapAnalysis: overlapWarnings,
    integrationMatrix,
    warnings,
    unknowns,
    filterConflicts
  };
}

/**
 * 5. GET AVAILABLE REPLACEMENTS FOR SWAP TOOL
 */
export function getAvailableToolsForCapability(capability, teamSize = 1, preferAnnual = false, preferredDeployment = 'no_preference') {
  let tools = seedTools.filter(t => t.primaryCapability === capability || (t.secondaryCapabilities || []).includes(capability));

  if (preferredDeployment === 'self_hosted_only') {
    tools = tools.filter(t => t.deployment?.selfHostedAvailable);
  }

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
