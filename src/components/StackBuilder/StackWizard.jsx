/**
 * StakDock 2.0: Stack Builder Wizard Component (Step 1 to 6)
 *
 * Polished, high-information multi-step questionnaire guiding users to their
 * optimal software stack without lead-gen forms or fake AI claims.
 */

import React, { useState, useEffect } from 'react';
import {
  BUSINESS_PROFILES,
  CAPABILITY_TAXONOMY
} from '../../data/stackIntelligenceSchema.js';
import { seedTools } from '../../utils/stackIntelligenceEngine.js';
import { trackProductEvent } from '../../utils/affiliateTracker.js';
import {
  Layers,
  Users,
  DollarSign,
  CheckCircle2,
  Server,
  Shield,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Search,
  Sliders,
  Check,
  X,
  Lock,
  Sparkles
} from 'lucide-react';

const profileList = Object.values(BUSINESS_PROFILES);
const capabilityList = Object.entries(CAPABILITY_TAXONOMY).map(([key, value]) => ({
  id: key,
  label: value.label,
  subCapabilities: value.subCapabilities
}));

const teamSizeOptions = [
  { label: 'Solo (1 person)', value: 1 },
  { label: '2–5 team', value: 3 },
  { label: '6–10 team', value: 8 },
  { label: '11–25 team', value: 18 },
  { label: '26–50 team', value: 35 },
  { label: '51+ enterprise', value: 75 }
];

const budgetOptions = [
  { label: '$0 / Strictly Free', value: 0.01, display: '$0 Free Only' },
  { label: 'Under $50/mo', value: 50, display: '$50/mo' },
  { label: '$50–$100/mo', value: 100, display: '$100/mo' },
  { label: '$100–$250/mo', value: 250, display: '$250/mo' },
  { label: '$250–$500/mo', value: 500, display: '$500/mo' },
  { label: '$500–$1,000/mo', value: 1000, display: '$1,000/mo' },
  { label: 'No strict budget cap', value: 0, display: 'Unlimited' }
];

const hostingOptions = [
  {
    id: 'no_preference',
    title: 'No Preference / Best Fit',
    desc: 'Selects the best balance of cost, ease of use, and capability across SaaS and open source.'
  },
  {
    id: 'cloud_saas',
    title: 'Managed Cloud SaaS Preferred',
    desc: 'Prioritizes zero-maintenance cloud services. No server setup or DevOps required.'
  },
  {
    id: 'open_source_preferred',
    title: 'Open-Source Preferred',
    desc: 'Prefers open-source tools with self-hosting options, but permits managed cloud alternatives where necessary.'
  },
  {
    id: 'self_hosted_only',
    title: 'Self-Hosted & Docker Only',
    desc: 'Strictly filters for self-hostable software to ensure 100% data ownership and infrastructure sovereignty.'
  }
];

export default function StackWizard({
  wizardState,
  onUpdateState,
  onCompleteWizard
}) {
  const [step, setStep] = useState(1);
  const [toolSearch, setToolSearch] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    businessType,
    teamSize,
    monthlyBudgetUsd,
    budgetConstraintType,
    requiredCapabilities,
    preferredDeployment,
    technicalSkill,
    existingToolsToKeep,
    existingToolCosts,
    advancedFilters
  } = wizardState;

  // Filter tools for existing tools selector
  const filteredTools = seedTools.filter(t =>
    t.name.toLowerCase().includes(toolSearch.toLowerCase()) ||
    t.primaryCapability.toLowerCase().includes(toolSearch.toLowerCase()) ||
    t.category.toLowerCase().includes(toolSearch.toLowerCase())
  );

  const toggleCapability = (capId) => {
    if (requiredCapabilities.includes(capId)) {
      if (requiredCapabilities.length > 1) {
        onUpdateState({
          requiredCapabilities: requiredCapabilities.filter(c => c !== capId)
        });
      }
    } else {
      onUpdateState({
        requiredCapabilities: [...requiredCapabilities, capId]
      });
    }
  };

  const toggleExistingTool = (toolId) => {
    if (existingToolsToKeep.includes(toolId)) {
      const newCosts = { ...existingToolCosts };
      delete newCosts[toolId];
      onUpdateState({
        existingToolsToKeep: existingToolsToKeep.filter(id => id !== toolId),
        existingToolCosts: newCosts
      });
    } else {
      onUpdateState({
        existingToolsToKeep: [...existingToolsToKeep, toolId]
      });
    }
  };

  const isLowSkillSelfHostedConflict =
    preferredDeployment === 'self_hosted_only' &&
    technicalSkill === 'none';

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '20px 16px' }}>
      {/* Wizard Progress Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.05em', color: 'var(--primary-green-dark)', textTransform: 'uppercase' }}>
            STEP {step} OF 6
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
            {step === 1 && 'Business Profile'}
            {step === 2 && 'Team Size'}
            {step === 3 && 'Monthly Budget'}
            {step === 4 && 'Required Capabilities'}
            {step === 5 && 'Hosting & Deployment'}
            {step === 6 && 'Existing Software'}
          </span>
        </div>
        <div style={{ width: '100%', height: '6px', background: '#E2E8D8', borderRadius: '9999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${(step / 6) * 100}%`,
              height: '100%',
              background: '#82A735',
              transition: 'width 0.25s ease'
            }}
          />
        </div>
      </div>

      {/* STEP 1: BUSINESS PROFILE */}
      {step === 1 && (
        <div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
            What kind of business are you building?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
            StakDock tailors stack recommendations, feature priorities, and budget benchmarks to your operating model.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {profileList.map(profile => {
              const isSelected = businessType === profile.id;
              return (
                <div
                  key={profile.id}
                  onClick={() => {
                    onUpdateState({
                      businessType: profile.id,
                      requiredCapabilities: profile.priorityNeeds || requiredCapabilities,
                      monthlyBudgetUsd: profile.budgetGuidance || monthlyBudgetUsd
                    });
                  }}
                  style={{
                    border: isSelected ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: isSelected ? '#F4F7EE' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 4px 14px rgba(130, 167, 53, 0.12)' : 'var(--shadow-soft)'
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                      {profile.label}
                    </h3>
                    {isSelected && <CheckCircle2 size={18} color="#82A735" />}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Recommended capabilities:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {profile.priorityNeeds.slice(0, 3).map(need => (
                      <span
                        key={need}
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: isSelected ? '#E5EED6' : '#F6F7F2',
                          color: 'var(--text-dark)'
                        }}
                      >
                        {need.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: TEAM SIZE */}
      {step === 2 && (
        <div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
            How many people will use this software?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
            Per-seat software scales rapidly. StakDock calculates true seat pricing, flat-rate tiers, and unlimited user plans.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '32px' }}>
            {teamSizeOptions.map(opt => {
              const isSelected = teamSize === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => onUpdateState({ teamSize: opt.value })}
                  style={{
                    border: isSelected ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: isSelected ? '#F4F7EE' : '#FFFFFF',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontWeight: '800',
                    fontSize: '1rem',
                    color: isSelected ? 'var(--primary-green-dark)' : 'var(--text-dark)',
                    transition: 'all 0.15s ease'
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Users size={20} style={{ margin: '0 auto 8px', display: 'block', color: isSelected ? '#82A735' : 'var(--text-light)' }} />
                  {opt.label}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: MONTHLY BUDGET & HARD/SOFT CONSTRAINT */}
      {step === 3 && (
        <div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
            What is your target monthly software budget?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.5' }}>
            StakDock searches for credible combinations within your limit and alerts you if requested capabilities require paid tiers.
          </p>

          {/* Budget Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            {budgetOptions.map(opt => {
              const isSelected = monthlyBudgetUsd === opt.value;
              return (
                <div
                  key={opt.label}
                  onClick={() => onUpdateState({
                    monthlyBudgetUsd: opt.value,
                    budgetConstraintType: opt.value === 0 ? 'none' : (budgetConstraintType === 'none' ? 'hard' : budgetConstraintType)
                  })}
                  style={{
                    border: isSelected ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: isSelected ? '#F4F7EE' : '#FFFFFF',
                    borderRadius: '14px',
                    padding: '18px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontWeight: '800',
                    fontSize: '0.95rem',
                    color: isSelected ? 'var(--primary-green-dark)' : 'var(--text-dark)',
                    transition: 'all 0.15s ease'
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <DollarSign size={20} style={{ margin: '0 auto 8px', display: 'block', color: isSelected ? '#82A735' : 'var(--text-light)' }} />
                  {opt.label}
                </div>
              );
            })}
          </div>

          {/* Hard vs Soft Budget Selector */}
          {monthlyBudgetUsd > 0 && (
            <div style={{ background: '#F8F9F5', padding: '18px 20px', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
                Budget Strictness:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'hard', label: 'Hard Budget (Cannot exceed this limit)', desc: 'Engine strictly seeks combinations within this cap.' },
                  { id: 'soft', label: 'Soft Budget (Target amount)', desc: 'May recommend higher-tier tools if materially better.' }
                ].map(b => (
                  <div
                    key={b.id}
                    onClick={() => onUpdateState({ budgetConstraintType: b.id })}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: budgetConstraintType === b.id ? '2px solid #82A735' : '1px solid var(--border-color)',
                      background: budgetConstraintType === b.id ? '#FFFFFF' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: '800', fontSize: '0.86rem', color: 'var(--text-dark)' }}>{b.label}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: REQUIRED CAPABILITIES */}
      {step === 4 && (
        <div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
            Which functional capabilities does your business require?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.5' }}>
            Select all functional areas you need. StakDock checks for overlap and maps integrations across selected areas.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '28px' }}>
            {capabilityList.map(cap => {
              const isSelected = requiredCapabilities.includes(cap.id);
              return (
                <div
                  key={cap.id}
                  onClick={() => toggleCapability(cap.id)}
                  style={{
                    border: isSelected ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: isSelected ? '#F4F7EE' : '#FFFFFF',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                      {cap.label}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '2px' }}>
                      {cap.subCapabilities.slice(0, 2).map(s => s.replace('_', ' ')).join(', ')}
                    </div>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 size={18} color="#82A735" />
                  ) : (
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1px solid var(--border-color)' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 5: HOSTING & OWNERSHIP */}
      {step === 5 && (
        <div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
            Hosting & Deployment Preference
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: '1.5' }}>
            Choose between convenience and sovereignty. StakDock models true server hosting costs (~$4.50–$20/mo) for self-hosted software.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px', marginBottom: '24px' }}>
            {hostingOptions.map(opt => {
              const isSelected = preferredDeployment === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => onUpdateState({ preferredDeployment: opt.id })}
                  style={{
                    border: isSelected ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: isSelected ? '#F4F7EE' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    transition: 'all 0.15s ease'
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Server size={22} color={isSelected ? '#82A735' : 'var(--text-light)'} style={{ marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-dark)' }}>
                        {opt.title}
                      </div>
                      {isSelected && <CheckCircle2 size={18} color="#82A735" />}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                      {opt.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Technical Skill Level Selector */}
          <div style={{ background: '#F8F9F5', padding: '18px 20px', borderRadius: '14px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
              Your Team's Technical Comfort:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { id: 'none', label: 'Non-Technical (No server/Docker experience)' },
                { id: 'moderate', label: 'Comfortable with software setup & settings' },
                { id: 'developer', label: 'Full Software Engineer / DevOps' }
              ].map(lvl => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onUpdateState({ technicalSkill: lvl.id })}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: technicalSkill === lvl.id ? '2px solid #82A735' : '1px solid var(--border-color)',
                    background: technicalSkill === lvl.id ? '#FFFFFF' : 'transparent',
                    color: technicalSkill === lvl.id ? 'var(--primary-green-dark)' : 'var(--text-dark)',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            {isLowSkillSelfHostedConflict && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', padding: '10px 14px', background: '#FFF8E6', border: '1px solid #FFE08A', borderRadius: '8px', color: '#946C00', fontSize: '0.82rem' }}>
                <AlertTriangle size={16} />
                <span>
                  <strong>Technical Burden Notice:</strong> Self-hosting requires configuring VPS servers, DNS, SSL, and automated database backups. If you lack developer experience, managed SaaS is strongly recommended.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 6: EXISTING TOOLS & ADVANCED PREFERENCES */}
      {step === 6 && (
        <div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>
            Are you already using software you want to keep?
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px', lineHeight: '1.5' }}>
            Select any active tools. StakDock will retain them at $0 new incremental cost and avoid suggesting redundant replacements.
          </p>

          {/* Search Bar for Existing Tools */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '14px', color: 'var(--text-light)' }} />
            <input
              type="text"
              value={toolSearch}
              onChange={(e) => setToolSearch(e.target.value)}
              placeholder="Search verified tools (e.g. HubSpot, Notion, Stripe, Supabase)..."
              style={{
                width: '100%',
                padding: '12px 16px 12px 46px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                fontSize: '0.9rem',
                outline: 'none',
                background: '#FFFFFF'
              }}
            />
          </div>

          {/* Selected Badges */}
          {existingToolsToKeep.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {existingToolsToKeep.map(tId => {
                const tool = seedTools.find(t => t.toolId === tId);
                return (
                  <span
                    key={tId}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      background: '#82A735',
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: '800'
                    }}
                  >
                    {tool ? tool.name : tId}
                    <X
                      size={14}
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleExistingTool(tId)}
                    />
                  </span>
                );
              })}
            </div>
          )}

          {/* Tool Grid */}
          <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '12px', background: '#FFFFFF', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
              {filteredTools.map(tool => {
                const isSelected = existingToolsToKeep.includes(tool.toolId);
                return (
                  <div
                    key={tool.toolId}
                    onClick={() => toggleExistingTool(tool.toolId)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: isSelected ? '1px solid #82A735' : '1px solid var(--border-color)',
                      background: isSelected ? '#F4F7EE' : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      color: 'var(--text-dark)'
                    }}
                  >
                    <span>{tool.name}</span>
                    {isSelected && <Check size={14} color="#82A735" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional Advanced Preferences Collapsible */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '18px', marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '800',
                color: 'var(--primary-green-dark)'
              }}
            >
              <Sliders size={16} />
              <span>{showAdvanced ? 'Hide Advanced Filters' : 'Optional: Advanced Stack Constraints'}</span>
            </button>

            {showAdvanced && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginTop: '14px', background: '#F8F9F5', padding: '16px', borderRadius: '12px' }}>
                {[
                  { id: 'freePlanRequired', label: 'Free Plan Required' },
                  { id: 'openSourceRequired', label: 'Open Source (OSI/Fair-Code)' },
                  { id: 'apiRequired', label: 'REST / GraphQL API Required' },
                  { id: 'dataExportRequired', label: 'Data Export / No Lock-In' },
                  { id: 'lowLockInPreferred', label: 'Low Migration Risk Only' },
                  { id: 'dockerPreferred', label: 'Docker Compose Support' }
                ].map(f => {
                  const isChecked = Boolean(advancedFilters[f.id]);
                  return (
                    <label
                      key={f.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        color: 'var(--text-dark)',
                        cursor: 'pointer'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          onUpdateState({
                            advancedFilters: {
                              ...advancedFilters,
                              [f.id]: e.target.checked
                            }
                          });
                        }}
                      />
                      {f.label}
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
        {step > 1 ? (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="btn-pill-outline"
            style={{ padding: '10px 22px', fontSize: '0.9rem' }}
          >
            <ArrowLeft size={16} /> Back
          </button>
        ) : (
          <div />
        )}

        {step < 6 ? (
          <button
            type="button"
            onClick={() => {
              if (step === 1) {
                trackProductEvent('stack_builder_started', { business_profile: businessType });
              } else if (step === 4) {
                trackProductEvent('capabilities_selected', { capability_count: requiredCapabilities.length, capabilities: requiredCapabilities });
              }
              setStep(step + 1);
            }}
            className="btn-pill-green"
            style={{ padding: '10px 26px', fontSize: '0.95rem' }}
          >
            Continue <ArrowRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              trackProductEvent('stack_builder_completed', {
                business_profile: businessType,
                team_size: teamSize,
                budget: monthlyBudgetUsd,
                budget_type: budgetConstraintType,
                hosting_preference: preferredDeployment,
                capability_count: requiredCapabilities.length
              });
              onCompleteWizard();
            }}
            className="btn-pill-green"
            style={{ padding: '12px 32px', fontSize: '1rem', boxShadow: '0 4px 18px rgba(130, 167, 53, 0.35)' }}
          >
            Generate My Stack <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
