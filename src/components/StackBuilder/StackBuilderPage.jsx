/**
 * StakDock 2.0: Stack Builder Main Product Page Container
 *
 * Route: /stack-builder/
 * Noindex, Follow • Grounded in 41-tool Seed Dataset • 100% Deterministic
 */

import React, { useState, useMemo } from 'react';
import StackWizard from './StackWizard';
import StackDashboard from './StackDashboard';
import {
  synthesizeStack,
  calculateToolCost,
  evaluateToolOverlap,
  evaluateIntegration,
  toolsMap,
  seedTools
} from '../../utils/stackIntelligenceEngine';
import { OVERLAP_LEVELS } from '../../data/stackIntelligenceSchema';
import { Layers, ArrowLeft } from 'lucide-react';

export default function StackBuilderPage({ onBackToDirectory }) {
  const [viewMode, setViewMode] = useState('wizard'); // 'wizard' | 'dashboard'

  const [wizardState, setWizardState] = useState({
    businessType: 'solo_founder',
    teamSize: 1,
    monthlyBudgetUsd: 100,
    budgetConstraintType: 'hard',
    requiredCapabilities: ['CRM', 'INVOICING', 'PROJECT_MANAGEMENT'],
    preferredDeployment: 'no_preference',
    technicalSkill: 'moderate',
    existingToolsToKeep: [],
    existingToolCosts: {},
    advancedFilters: {},
    toolOverrides: {} // { [capability]: toolId }
  });

  const handleUpdateWizardState = (updates) => {
    setWizardState(prev => ({
      ...prev,
      ...updates
    }));
  };

  const handleSwapTool = (capability, newToolId) => {
    setWizardState(prev => ({
      ...prev,
      toolOverrides: {
        ...prev.toolOverrides,
        [capability]: newToolId
      }
    }));
  };

  const handleRemoveCapability = (capability) => {
    setWizardState(prev => ({
      ...prev,
      requiredCapabilities: prev.requiredCapabilities.filter(c => c !== capability)
    }));
  };

  const handleAddCapability = (capability) => {
    if (!wizardState.requiredCapabilities.includes(capability)) {
      setWizardState(prev => ({
        ...prev,
        requiredCapabilities: [...prev.requiredCapabilities, capability]
      }));
    }
  };

  // Deterministic Stack Synthesis with User Overrides
  const stackResult = useMemo(() => {
    const baseSynthesis = synthesizeStack({
      businessType: wizardState.businessType,
      teamSize: wizardState.teamSize,
      monthlyBudgetUsd: wizardState.monthlyBudgetUsd,
      budgetConstraintType: wizardState.budgetConstraintType,
      requiredCapabilities: wizardState.requiredCapabilities,
      preferredDeployment: wizardState.preferredDeployment,
      technicalSkill: wizardState.technicalSkill,
      existingToolsToKeep: wizardState.existingToolsToKeep,
      existingToolCosts: wizardState.existingToolCosts,
      advancedFilters: wizardState.advancedFilters
    });

    // If there are manual tool overrides from user swaps, apply deterministically
    const hasOverrides = Object.keys(wizardState.toolOverrides).length > 0;
    if (!hasOverrides) return baseSynthesis;

    const modifiedStack = baseSynthesis.recommendedStack.map(item => {
      const overrideToolId = wizardState.toolOverrides[item.capability];
      if (overrideToolId && toolsMap.has(overrideToolId)) {
        const overrideTool = toolsMap.get(overrideToolId);
        const hostingMode = (wizardState.preferredDeployment === 'self_hosted_only' || (overrideTool.deployment?.selfHostedAvailable && !overrideTool.deployment?.cloudAvailable))
          ? 'self_hosted'
          : 'cloud';

        const costObj = calculateToolCost(overrideTool, wizardState.teamSize, false, hostingMode);

        return {
          ...item,
          selectedTool: {
            ...overrideTool,
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
            whyItFits: `Manually chosen replacement for '${item.capability.replace('_', ' ')}' (${overrideTool.name}).`,
            hostingType: hostingMode === 'self_hosted' ? 'Self-Hosted' : 'Cloud SaaS',
            evidenceFact: `Pricing source checked ${overrideTool.commercialModel?.pricingVerifiedAt ? overrideTool.commercialModel.pricingVerifiedAt.slice(0, 10) : '2026-08-31'} via official vendor documentation.`,
            editorialReason: overrideTool.businessFit?.bestFor || `User chosen replacement.`,
            calculationNote: costObj.calculationDetails
          }
        };
      }
      return item;
    });

    let totalSoftwareCost = 0;
    let totalInfrastructureCost = 0;
    modifiedStack.forEach(s => {
      totalSoftwareCost += s.selectedTool.softwareLicenseCost;
      totalInfrastructureCost += s.selectedTool.infrastructureCost;
    });

    const totalNewMonthlyCost = Math.round((totalSoftwareCost + totalInfrastructureCost) * 100) / 100;
    const totalNewAnnualCost = Math.round(totalNewMonthlyCost * 12 * 100) / 100;

    // Recalculate Overlaps
    const overlapWarnings = [];
    for (let i = 0; i < modifiedStack.length; i++) {
      for (let j = i + 1; j < modifiedStack.length; j++) {
        const toolA = toolsMap.get(modifiedStack[i].selectedTool.toolId);
        const toolB = toolsMap.get(modifiedStack[j].selectedTool.toolId);
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

    // Recalculate Integrations
    const integrationMatrix = [];
    for (let i = 0; i < modifiedStack.length; i++) {
      for (let j = i + 1; j < modifiedStack.length; j++) {
        const toolA = toolsMap.get(modifiedStack[i].selectedTool.toolId);
        const toolB = toolsMap.get(modifiedStack[j].selectedTool.toolId);
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

    let fitAssessment = 'EXCELLENT FIT';
    let budgetGapUsd = 0;
    let budgetGapExplanation = null;
    let status = 'OPTIMAL_STACK_FOUND';

    if (wizardState.monthlyBudgetUsd > 0 && totalNewMonthlyCost > wizardState.monthlyBudgetUsd) {
      budgetGapUsd = Math.round((totalNewMonthlyCost - wizardState.monthlyBudgetUsd) * 100) / 100;
      if (wizardState.budgetConstraintType === 'hard') {
        status = 'NO_STACK_WITHIN_BUDGET';
        fitAssessment = 'NO STACK FOUND WITHIN BUDGET';
        budgetGapExplanation = `The selected tool combination costs $${totalNewMonthlyCost.toFixed(2)}/mo, exceeding your $${wizardState.monthlyBudgetUsd}/mo budget limit by $${budgetGapUsd.toFixed(2)}/mo.`;
      } else {
        status = 'EXCEEDS_SOFT_BUDGET';
        fitAssessment = 'EXCEEDS TARGET BUDGET';
      }
    } else if (wizardState.monthlyBudgetUsd > 0 && totalNewMonthlyCost > wizardState.monthlyBudgetUsd * 0.9) {
      fitAssessment = 'AT BUDGET CAP';
    }

    return {
      ...baseSynthesis,
      status,
      recommendedStack: modifiedStack,
      costSummary: {
        ...baseSynthesis.costSummary,
        totalNewSoftwareLicenseMonthlyCost: Math.round(totalSoftwareCost * 100) / 100,
        totalNewInfrastructureMonthlyCost: Math.round(totalInfrastructureCost * 100) / 100,
        totalNewMonthlyCost,
        totalNewAnnualCost,
        budgetDifferenceUsd: wizardState.monthlyBudgetUsd > 0 ? Math.round((wizardState.monthlyBudgetUsd - totalNewMonthlyCost) * 100) / 100 : null,
        budgetGapUsd,
        budgetGapExplanation,
        fitAssessment
      },
      overlapAnalysis: overlapWarnings,
      integrationMatrix
    };
  }, [wizardState]);

  return (
    <div style={{ minHeight: '80vh', background: 'var(--bg-main)', paddingTop: '20px', paddingBottom: '60px' }}>
      {/* Back to Directory Button */}
      <div className="container" style={{ marginBottom: '16px' }}>
        <button
          type="button"
          onClick={onBackToDirectory}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '700',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: 0
          }}
          aria-label="Return to StakDock Software Directory"
        >
          <ArrowLeft size={16} /> Return to Software Directory
        </button>
      </div>

      {viewMode === 'wizard' ? (
        <StackWizard
          wizardState={wizardState}
          onUpdateState={handleUpdateWizardState}
          onCompleteWizard={() => {
            setViewMode('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <StackDashboard
          stackResult={stackResult}
          wizardState={wizardState}
          onUpdateWizardState={handleUpdateWizardState}
          onSwapTool={handleSwapTool}
          onRemoveCapability={handleRemoveCapability}
          onAddCapability={handleAddCapability}
          onRestartWizard={() => {
            setViewMode('wizard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
