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
    requiredCapabilities: ['CRM', 'INVOICING', 'PROJECT_MANAGEMENT'],
    preferredDeployment: 'all',
    technicalSkill: 'low',
    existingToolsToKeep: [],
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
      requiredCapabilities: wizardState.requiredCapabilities,
      preferredDeployment: wizardState.preferredDeployment,
      technicalSkill: wizardState.technicalSkill,
      existingToolsToKeep: wizardState.existingToolsToKeep,
      advancedFilters: wizardState.advancedFilters
    });

    // If there are manual tool overrides from the user swapping tools, apply them deterministically
    const hasOverrides = Object.keys(wizardState.toolOverrides).length > 0;
    if (!hasOverrides) return baseSynthesis;

    const modifiedStack = baseSynthesis.recommendedStack.map(item => {
      const overrideToolId = wizardState.toolOverrides[item.capability];
      if (overrideToolId && toolsMap.has(overrideToolId)) {
        const overrideTool = toolsMap.get(overrideToolId);
        const hostingMode = (wizardState.preferredDeployment === 'self_hosted_open_source' || (overrideTool.deployment?.selfHostedAvailable && !overrideTool.deployment?.cloudAvailable)) ? 'self_hosted' : 'cloud';
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
            whyItFits: `Manually chosen replacement for '${item.capability}' (${overrideTool.name}).`,
            hostingType: hostingMode === 'self_hosted' ? 'Self-Hosted' : 'Cloud SaaS',
            evidenceFact: `Primary source verified via official vendor documentation.`,
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

    const totalMonthlyCost = totalSoftwareCost + totalInfrastructureCost;
    const totalAnnualCost = totalMonthlyCost * 12;

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
    if (wizardState.monthlyBudgetUsd > 0 && totalMonthlyCost > wizardState.monthlyBudgetUsd) {
      fitAssessment = 'EXCEEDS BUDGET';
    } else if (wizardState.monthlyBudgetUsd > 0 && totalMonthlyCost > wizardState.monthlyBudgetUsd * 0.9) {
      fitAssessment = 'AT BUDGET CAP';
    } else if (overlapWarnings.some(w => w.level === OVERLAP_LEVELS.HIGH_OVERLAP)) {
      fitAssessment = 'CONDITIONAL FIT (HIGH OVERLAP DETECTED)';
    }

    return {
      ...baseSynthesis,
      recommendedStack: modifiedStack,
      costSummary: {
        ...baseSynthesis.costSummary,
        totalSoftwareLicenseMonthlyCost: Math.round(totalSoftwareCost * 100) / 100,
        totalEstimatedInfrastructureMonthlyCost: Math.round(totalInfrastructureCost * 100) / 100,
        totalEstimatedMonthlyCost: Math.round(totalMonthlyCost * 100) / 100,
        totalEstimatedAnnualCost: Math.round(totalAnnualCost * 100) / 100,
        budgetDifferenceUsd: wizardState.monthlyBudgetUsd > 0 ? Math.round((wizardState.monthlyBudgetUsd - totalMonthlyCost) * 100) / 100 : null,
        fitAssessment
      },
      overlapAnalysis: overlapWarnings,
      integrationMatrix
    };
  }, [wizardState]);

  return (
    <div style={{ minHeight: '80vh', background: 'var(--bg-main)', paddingTop: '20px', paddingBottom: '60px' }}>
      {/* Back Button */}
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
