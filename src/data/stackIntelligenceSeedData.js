/**
 * StakDock 2.0: Stack Builder Seed Dataset V1.1 (Adversarial Hardened)
 *
 * 41 High-Value Software Tools with Claim-Level Primary Source Provenance,
 * Decoupled Software License vs Infrastructure Costs, and Rigorous Multi-State Typing.
 *
 * STRICT GOVERNANCE:
 * - Zero synthetic ratings or review counts.
 * - Software License Cost is explicitly separated from Server Infrastructure Cost.
 * - Non-commercial / Fair-Code licenses are accurately distinguished from standard OSI open source.
 * - Business-fit recommendations are transparently labeled as StakDock Editorial classifications.
 */

import {
  PRICING_MODELS,
  COST_CONFIDENCE,
  DEPLOYMENT_MODELS,
  LICENSE_TYPES,
  EVIDENCE_CLASSIFICATION
} from './stackIntelligenceSchema.js';

export const seedSoftwareTools = [
  // ==========================================
  // 1. CRM & SALES PIPELINES (3 Tools)
  // ==========================================
  {
    toolId: 'hubspot',
    name: 'HubSpot CRM',
    vendor: 'HubSpot, Inc.',
    website: 'https://www.hubspot.com',
    category: 'crm',
    primaryCapability: 'CRM',
    secondaryCapabilities: ['EMAIL_MARKETING', 'HELP_DESK', 'SCHEDULING'],
    featureTags: ['contact_management', 'sales_pipelines', 'lead_scoring', 'deal_tracking', 'email_sync', 'broadcast_newsletters', 'live_chat_widget', 'booking_links'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Free Core CRM includes up to 2,500 contacts and 1 basic deal pipeline. Branding on live chat and forms.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 15,
      minimumSeats: 1,
      annualDiscountPercent: 10,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Sales Hub Starter starts at $15/seat/mo billed annually ($20/seat monthly). Professional tier starts at $90/seat/mo ($1,080/yr minimum with 5 seats included for $450/mo).',
      pricingSourceUrl: 'https://www.hubspot.com/pricing/sales',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only. No self-hosted deployment option.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://legal.hubspot.com/terms-of-service'
    },
    businessFit: {
      businessTypes: ['small_agency', 'growing_agency', 'saas_startup', 'solo_founder'],
      teamSizeMin: 1,
      teamSizeMax: 250,
      technicalSkillRequired: 'low',
      bestFor: 'Growing sales teams and agencies needing an integrated ecosystem for contact management, email tracking, and deal pipelines.',
      notRecommendedFor: 'Privacy-focused self-hosters or solo freelancers with strictly zero-dollar ongoing software budgets.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['stripe', 'zapier', 'make', 'google-analytics', 'notion'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'json'],
      migrationDifficulty: 'moderate',
      vendorLockInRisk: 'high'
    },
    sources: [
      { title: 'HubSpot Official Pricing', url: 'https://www.hubspot.com/pricing/sales', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' },
      { title: 'HubSpot API Documentation', url: 'https://developers.hubspot.com/docs/api/overview', type: 'Official API Docs', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'pipedrive',
    name: 'Pipedrive',
    vendor: 'Pipedrive Inc.',
    website: 'https://www.pipedrive.com',
    category: 'crm',
    primaryCapability: 'CRM',
    secondaryCapabilities: ['AUTOMATION'],
    featureTags: ['contact_management', 'sales_pipelines', 'deal_tracking', 'email_sync', 'custom_properties', 'visual_flow_builder'],
    commercialModel: {
      pricingModel: PRICING_MODELS.PER_SEAT_MONTHLY,
      freePlanAvailable: false,
      freeTrialAvailable: true,
      freeTierLimits: '14-day free trial; no permanent free tier.',
      baseMonthlyPriceUsd: 14,
      pricePerSeatMonthlyUsd: 14,
      minimumSeats: 1,
      annualDiscountPercent: 33,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Essential plan is $14/user/mo billed annually ($21/mo monthly). Advanced is $29/user/mo annually ($39 monthly), Professional is $49/user/mo annually ($64 monthly).',
      pricingSourceUrl: 'https://www.pipedrive.com/en/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only. No self-hosted deployment option.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.pipedrive.com/en/terms-of-service'
    },
    businessFit: {
      businessTypes: ['small_agency', 'solo_founder', 'growing_agency'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'low',
      bestFor: 'Sales-driven teams that want a visual, activity-based Kanban pipeline without enterprise CRM clutter.',
      notRecommendedFor: 'Non-sales companies seeking an internal relational knowledge database.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['stripe', 'zapier', 'make', 'trello'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'json'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'moderate'
    },
    sources: [
      { title: 'Pipedrive Official Pricing', url: 'https://www.pipedrive.com/en/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'twenty',
    name: 'Twenty CRM',
    vendor: 'Twenty Technologies Inc.',
    website: 'https://twenty.com',
    category: 'crm',
    primaryCapability: 'CRM',
    secondaryCapabilities: ['DATABASE'],
    featureTags: ['contact_management', 'sales_pipelines', 'deal_tracking', 'custom_properties', 'relational_postgres'],
    commercialModel: {
      pricingModel: PRICING_MODELS.OPEN_SOURCE_FREE,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Self-hosted edition has unlimited contacts, users, and pipelines free forever on your server. Cloud managed tier is $9/user/mo.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: '100% Free and Open Source (AGPLv3) when self-hosted. Managed Cloud edition is $9/user/month for hosted infrastructure.',
      pricingSourceUrl: 'https://twenty.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: true,
      softwareLicenseCostMonthly: 0,
      minServerSpecs: '2 vCPU, 4GB RAM VPS (Docker Compose + PostgreSQL)',
      estimatedServerCostMonthlyRange: { minUsd: 8.00, maxUsd: 18.00 },
      maintenanceBurden: 'MODERATE',
      tcoNotes: 'Software license is $0. Requires a VPS server (~$8–$15/mo on Hetzner/DigitalOcean) with automated PostgreSQL backups and Docker updates.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: true,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: true,
      kubernetesAvailable: true,
      deploymentComplexity: 'low_docker'
    },
    licensing: {
      openSource: true,
      licenseType: LICENSE_TYPES.AGPL_V3,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://github.com/twentyhq/twenty/blob/main/LICENSE'
    },
    businessFit: {
      businessTypes: ['technical_founder_oss', 'saas_startup', 'small_agency', 'solo_founder'],
      teamSizeMin: 1,
      teamSizeMax: 50,
      technicalSkillRequired: 'moderate',
      bestFor: 'Developers and privacy-conscious teams wanting an extensible, open-source Salesforce / HubSpot alternative with full PostgreSQL database ownership.',
      notRecommendedFor: 'Non-technical business owners unable to manage a Docker container or Postgres instance.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['postgresql', 'n8n'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'json', 'sql'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Twenty Official GitHub', url: 'https://github.com/twentyhq/twenty', type: 'Official GitHub Repository', checkedAt: '2026-08-31', confidence: 'HIGH' },
      { title: 'Twenty Official Pricing', url: 'https://twenty.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },

  // ==========================================
  // 2. INVOICING & BILLING (3 Tools)
  // ==========================================
  {
    toolId: 'invoice-ninja',
    name: 'Invoice Ninja',
    vendor: 'Invoice Ninja LLC',
    website: 'https://www.invoiceninja.com',
    category: 'invoicing',
    primaryCapability: 'INVOICING',
    secondaryCapabilities: ['PAYMENTS'],
    featureTags: ['invoice_generation', 'client_portal', 'online_payments', 'recurring_billing', 'multi_currency', 'quotes_estimates', 'credit_card_processing'],
    commercialModel: {
      pricingModel: PRICING_MODELS.OPEN_SOURCE_FREE,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Self-hosted has zero client limits and zero invoice limits. Cloud Free tier is limited to 20 clients with Invoice Ninja branding.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 16,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: '100% Free self-hosted edition with zero client or invoice limits. Managed Cloud Ninja Pro plan is $14/month for unlimited clients (additional users $14/mo). Enterprise plan is $34/mo (up to 20 users).',
      pricingSourceUrl: 'https://www.invoiceninja.com/pricing/',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: true,
      softwareLicenseCostMonthly: 0,
      minServerSpecs: '1 vCPU, 1GB RAM VPS (PHP 8.2 + MySQL/MariaDB)',
      estimatedServerCostMonthlyRange: { minUsd: 4.50, maxUsd: 10.00 },
      maintenanceBurden: 'LOW',
      tcoNotes: 'Software license is $0. Requires a lightweight VPS (~$4.50–$6/mo) and custom domain with cron jobs for automated invoice emails.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: true,
      desktopAvailable: true,
      mobileAvailable: true,
      dockerAvailable: true,
      kubernetesAvailable: false,
      deploymentComplexity: 'low_docker'
    },
    licensing: {
      openSource: true,
      licenseType: LICENSE_TYPES.AGPL_V3,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://github.com/invoiceninja/invoiceninja/blob/v5-develop/LICENSE'
    },
    businessFit: {
      businessTypes: ['solo_freelancer', 'small_agency', 'technical_founder_oss', 'solo_founder'],
      teamSizeMin: 1,
      teamSizeMax: 30,
      technicalSkillRequired: 'low',
      bestFor: 'Freelancers, consultants, and agencies seeking professional client invoicing, custom payment portals, and multi-gateway Stripe integration without monthly subscription fees.',
      notRecommendedFor: 'Companies requiring an automated double-entry general ledger or native payroll processing.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['stripe', 'zapier', 'n8n'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'json', 'pdf', 'sql'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Invoice Ninja Official Pricing', url: 'https://www.invoiceninja.com/pricing/', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' },
      { title: 'Invoice Ninja GitHub', url: 'https://github.com/invoiceninja/invoiceninja', type: 'Official GitHub Repository', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'wave-invoicing',
    name: 'Wave Invoicing',
    vendor: 'Wave Financial Inc.',
    website: 'https://www.waveapps.com',
    category: 'invoicing',
    primaryCapability: 'INVOICING',
    secondaryCapabilities: ['ACCOUNTING', 'PAYMENTS'],
    featureTags: ['invoice_generation', 'online_payments', 'recurring_billing', 'general_ledger', 'bank_feed_reconciliation', 'credit_card_processing', 'ach_direct_debit'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREE_FOREVER,
      freePlanAvailable: true,
      freeTrialAvailable: false,
      freeTierLimits: 'Free Starter plan includes unlimited invoices, customers, and basic bookkeeping. Card payments incur processing fees.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 2.9,
      transactionFeeFixedUsd: 0.60,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Starter plan is 100% free with unlimited invoices and bookkeeping. Pro plan is $16/month (or $170/year) adding automated bank imports and receipt scanning. Card processing: 2.9% + $0.60 per transaction; ACH: 1% ($1 min).',
      pricingSourceUrl: 'https://www.waveapps.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only. No self-hosted option.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.waveapps.com/legal/terms-of-service'
    },
    businessFit: {
      businessTypes: ['solo_freelancer', 'solo_founder', 'creator_media'],
      teamSizeMin: 1,
      teamSizeMax: 5,
      technicalSkillRequired: 'none',
      bestFor: 'Solo freelancers and micro-businesses seeking zero-subscription hosted invoicing with integrated basic double-entry accounting.',
      notRecommendedFor: 'Software agencies needing custom webhooks, REST API access, or self-hosted data isolation.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['zapier'],
      apiAvailable: false,
      webhooksAvailable: false,
      automationPlatforms: ['zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'pdf'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Wave Official Pricing Page', url: 'https://www.waveapps.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'stripe',
    name: 'Stripe',
    vendor: 'Stripe, Inc.',
    website: 'https://stripe.com',
    category: 'payments',
    primaryCapability: 'PAYMENTS',
    secondaryCapabilities: ['INVOICING'],
    featureTags: ['credit_card_processing', 'ach_direct_debit', 'global_currencies', 'checkout_pages', 'subscription_metering', 'fraud_prevention', 'invoice_generation'],
    commercialModel: {
      pricingModel: PRICING_MODELS.USAGE_BASED,
      freePlanAvailable: true,
      freeTrialAvailable: false,
      freeTierLimits: 'Zero monthly fixed subscription fee. Pay-as-you-go per transaction. First 25 invoices/month are free; 0.4% per paid invoice thereafter.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 2.9,
      transactionFeeFixedUsd: 0.30,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Pay-as-you-go with 2.9% + $0.30 per successful US card transaction. Invoicing: 25 free/mo, 0.4% per paid invoice thereafter. Billing is 0.5% on recurring charges.',
      pricingSourceUrl: 'https://stripe.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud payment gateway infrastructure only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://stripe.com/legal/ssa'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'small_agency', 'solo_founder', 'creator_media', 'growing_agency'],
      teamSizeMin: 1,
      teamSizeMax: 1000,
      technicalSkillRequired: 'moderate',
      bestFor: 'Any business collecting global payments, selling SaaS subscriptions, or embedding programmatic checkout flows.',
      notRecommendedFor: 'In-person physical retail POS-only operations.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['hubspot', 'invoice-ninja', 'notion', 'zapier', 'make', 'n8n', 'supabase'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'json'],
      migrationDifficulty: 'moderate',
      vendorLockInRisk: 'moderate'
    },
    sources: [
      { title: 'Stripe Official Pricing', url: 'https://stripe.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },

  // ==========================================
  // 3. ACCOUNTING & BOOKKEEPING (2 Tools)
  // ==========================================
  {
    toolId: 'quickbooks-online',
    name: 'QuickBooks Online',
    vendor: 'Intuit Inc.',
    website: 'https://quickbooks.intuit.com',
    category: 'accounting',
    primaryCapability: 'ACCOUNTING',
    secondaryCapabilities: ['INVOICING', 'PAYMENTS'],
    featureTags: ['general_ledger', 'bank_feed_reconciliation', 'chart_of_accounts', 'tax_reporting', 'financial_statements', 'accounts_payable', 'invoice_generation'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FLAT_MONTHLY,
      freePlanAvailable: false,
      freeTrialAvailable: true,
      freeTierLimits: '30-day free trial; no permanent free tier.',
      baseMonthlyPriceUsd: 35,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 2.99,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Simple Start is $35/mo (1 user). Essentials is $65/mo (3 users). Plus is $99/mo (5 users). Advanced is $235/mo (25 users). Intuit frequently offers 50% off for the first 3 months.',
      pricingSourceUrl: 'https://quickbooks.intuit.com/pricing/',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://quickbooks.intuit.com/terms-of-service/'
    },
    businessFit: {
      businessTypes: ['small_agency', 'growing_agency', 'solo_founder'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'low',
      bestFor: 'Established businesses working with CPAs requiring standard GAAP financial statements and automated tax preparation.',
      notRecommendedFor: 'Early-stage bootstrapped startups looking to minimize fixed monthly SaaS overhead.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['stripe', 'hubspot', 'zapier'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['zapier', 'make']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'excel', 'pdf'],
      migrationDifficulty: 'high',
      vendorLockInRisk: 'high'
    },
    sources: [
      { title: 'QuickBooks Official Pricing', url: 'https://quickbooks.intuit.com/pricing/', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'xero',
    name: 'Xero',
    vendor: 'Xero Limited',
    website: 'https://www.xero.com',
    category: 'accounting',
    primaryCapability: 'ACCOUNTING',
    secondaryCapabilities: ['INVOICING'],
    featureTags: ['general_ledger', 'bank_feed_reconciliation', 'chart_of_accounts', 'tax_reporting', 'financial_statements', 'accounts_payable', 'invoice_generation'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FLAT_MONTHLY,
      freePlanAvailable: false,
      freeTrialAvailable: true,
      freeTierLimits: '30-day free trial; no permanent free tier.',
      baseMonthlyPriceUsd: 15,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Early plan is $15/month (limited to 20 invoices). Growing plan is $42/month (unlimited invoices). Established is $78/month (multi-currency & expenses). All plans include unlimited user seats.',
      pricingSourceUrl: 'https://www.xero.com/us/pricing-plans/',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.xero.com/us/legal/terms/'
    },
    businessFit: {
      businessTypes: ['small_agency', 'growing_agency', 'solo_founder'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'low',
      bestFor: 'Agencies and small businesses that want clean accounting with unlimited team user access without paying per-seat penalties.',
      notRecommendedFor: 'Very large enterprises needing custom on-premise ERP ledgers.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['stripe', 'hubspot', 'zapier', 'make'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['zapier', 'make', 'n8n']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'excel', 'pdf'],
      migrationDifficulty: 'moderate',
      vendorLockInRisk: 'moderate'
    },
    sources: [
      { title: 'Xero Official Pricing', url: 'https://www.xero.com/us/pricing-plans/', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },

  // ==========================================
  // 4. PROJECT & WORK MANAGEMENT (4 Tools)
  // ==========================================
  {
    toolId: 'notion',
    name: 'Notion',
    vendor: 'Notion Labs, Inc.',
    website: 'https://www.notion.so',
    category: 'project-mgmt',
    primaryCapability: 'PROJECT_MANAGEMENT',
    secondaryCapabilities: ['WEBSITE_CMS', 'DATABASE'],
    featureTags: ['task_tracking', 'kanban_boards', 'document_docs', 'relational_databases', 'custom_properties', 'blog_publishing'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Free for individuals with unlimited pages/blocks and up to 10 guest collaborators. Limited file upload size (5MB).',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 10,
      minimumSeats: 1,
      annualDiscountPercent: 20,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free for individuals. Plus plan is $10/user/mo billed annually ($12/mo monthly) for collaborative team workspaces. Business plan is $15/user/mo billed annually ($18/mo monthly).',
      pricingSourceUrl: 'https://www.notion.so/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: true,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.notion.so/terms'
    },
    businessFit: {
      businessTypes: ['solo_freelancer', 'small_agency', 'saas_startup', 'solo_founder', 'creator_media'],
      teamSizeMin: 1,
      teamSizeMax: 250,
      technicalSkillRequired: 'none',
      bestFor: 'Teams that want a flexible, connected workspace for docs, project task boards, internal wikis, and relational operational databases in one tool.',
      notRecommendedFor: 'Hard-core software sprint engineering teams requiring rigid git-native issue tracking and CLI shortcuts.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['slack', 'github', 'google-analytics', 'zapier', 'make'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['markdown', 'csv', 'html', 'pdf'],
      migrationDifficulty: 'moderate',
      vendorLockInRisk: 'moderate'
    },
    sources: [
      { title: 'Notion Official Pricing', url: 'https://www.notion.so/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'linear',
    name: 'Linear',
    vendor: 'Linear Orbit, Inc.',
    website: 'https://linear.app',
    category: 'project-mgmt',
    primaryCapability: 'PROJECT_MANAGEMENT',
    secondaryCapabilities: ['DEVELOPMENT_AI'],
    featureTags: ['task_tracking', 'kanban_boards', 'sprint_planning', 'gantt_timeline', 'git_diff_review'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Free tier includes up to 250 active issues and unlimited workspace members.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 8,
      minimumSeats: 1,
      annualDiscountPercent: 20,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free for up to 250 active issues with unlimited members. Standard plan is $8/user/mo billed annually ($10/mo monthly) for unlimited issues. Plus is $14/user/mo annually ($16 monthly).',
      pricingSourceUrl: 'https://linear.app/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: true,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://linear.app/terms'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'technical_founder_oss', 'small_agency'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'low',
      bestFor: 'Software engineering startups and product builders wanting blazing fast, keyboard-first issue tracking synchronized directly with GitHub PRs.',
      notRecommendedFor: 'Non-technical marketing or legal teams wanting generic spreadsheet databases.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['github', 'slack', 'sentry', 'zapier'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'json'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Linear Official Pricing', url: 'https://linear.app/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'clickup',
    name: 'ClickUp',
    vendor: 'Manta Software, Inc. (ClickUp)',
    website: 'https://clickup.com',
    category: 'project-mgmt',
    primaryCapability: 'PROJECT_MANAGEMENT',
    secondaryCapabilities: ['AUTOMATION', 'CRM'],
    featureTags: ['task_tracking', 'kanban_boards', 'sprint_planning', 'gantt_timeline', 'document_docs', 'visual_flow_builder'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Free plan includes 100MB storage, unlimited tasks, and unlimited members. Advanced views limited.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 7,
      minimumSeats: 1,
      annualDiscountPercent: 30,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free Forever plan includes 100MB storage. Unlimited plan is $7/user/mo billed annually ($10 monthly). Business is $12/user/mo billed annually ($19 monthly).',
      pricingSourceUrl: 'https://clickup.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: true,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://clickup.com/terms'
    },
    businessFit: {
      businessTypes: ['small_agency', 'growing_agency', 'solo_founder'],
      teamSizeMin: 1,
      teamSizeMax: 300,
      technicalSkillRequired: 'low',
      bestFor: 'Agencies wanting an all-in-one suite combining task hierarchies, time tracking, Gantt charts, docs, and client dashboards.',
      notRecommendedFor: 'Teams looking for lightweight minimalism without complex nested sub-menus.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['hubspot', 'slack', 'google-analytics', 'zapier', 'make'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'json'],
      migrationDifficulty: 'moderate',
      vendorLockInRisk: 'moderate'
    },
    sources: [
      { title: 'ClickUp Official Pricing', url: 'https://clickup.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'trello',
    name: 'Trello',
    vendor: 'Atlassian Pty Ltd',
    website: 'https://trello.com',
    category: 'project-mgmt',
    primaryCapability: 'PROJECT_MANAGEMENT',
    secondaryCapabilities: ['AUTOMATION'],
    featureTags: ['task_tracking', 'kanban_boards', 'visual_flow_builder'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Free plan includes up to 10 workspace boards and unlimited power-ups.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 5,
      minimumSeats: 1,
      annualDiscountPercent: 17,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free for up to 10 workspace boards. Standard plan is $5/user/mo billed annually ($6 monthly). Premium is $10/user/mo billed annually ($12.50 monthly).',
      pricingSourceUrl: 'https://trello.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: true,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.atlassian.com/legal/customer-agreement'
    },
    businessFit: {
      businessTypes: ['solo_freelancer', 'creator_media', 'solo_founder'],
      teamSizeMin: 1,
      teamSizeMax: 20,
      technicalSkillRequired: 'none',
      bestFor: 'Simple, frictionless visual task management for non-technical individuals and small teams.',
      notRecommendedFor: 'Software engineering teams requiring complex sprint epics, velocity charts, and code commit links.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['slack', 'zapier', 'make'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['json', 'csv'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Trello Official Pricing', url: 'https://trello.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },

  // ==========================================
  // 5. EMAIL MARKETING & NEWSLETTERS (4 Tools)
  // ==========================================
  {
    toolId: 'brevo',
    name: 'Brevo',
    vendor: 'Sendinblue SAS (Brevo)',
    website: 'https://www.brevo.com',
    category: 'email-marketing',
    primaryCapability: 'EMAIL_MARKETING',
    secondaryCapabilities: ['CRM', 'HELP_DESK'],
    featureTags: ['broadcast_newsletters', 'drip_automations', 'subscriber_segmentation', 'signup_forms', 'transactional_api', 'contact_management', 'live_chat_widget'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Free plan includes unlimited contact storage with a 300 emails/day send limit. Brevo logo on footer.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 10,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free tier includes unlimited contacts and 300 emails/day. Starter plan starts at $25/month for 20,000 emails/month ($22.50/mo annually) with unlimited contacts and zero daily send limits. Business tier starts at $65/mo for 20k emails with multi-user access and marketing automation.',
      pricingSourceUrl: 'https://www.brevo.com/pricing/',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS and API delivery network only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.brevo.com/legal/termsofuse/'
    },
    businessFit: {
      businessTypes: ['small_agency', 'solo_founder', 'saas_startup', 'solo_freelancer'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'low',
      bestFor: 'Businesses that want to store large contact lists without paying contact-tier penalties, combining marketing newsletters with transactional SMTP emails.',
      notRecommendedFor: 'Dedicated high-end newsletter creators needing paid subscriber paywalls.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['wordpress', 'hubspot', 'zapier', 'make', 'n8n'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Brevo Official Pricing', url: 'https://www.brevo.com/pricing/', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'convertkit',
    name: 'Kit (ConvertKit)',
    vendor: 'ConvertKit Inc. (Kit)',
    website: 'https://kit.com',
    category: 'email-marketing',
    primaryCapability: 'EMAIL_MARKETING',
    secondaryCapabilities: ['PAYMENTS', 'WEBSITE_CMS'],
    featureTags: ['broadcast_newsletters', 'drip_automations', 'subscriber_segmentation', 'signup_forms', 'landing_pages', 'subscription_metering'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Free Newsletter plan for up to 10,000 subscribers includes basic broadcasts and forms. Advanced automations locked.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 17,
      transactionFeePercent: 3.5,
      transactionFeeFixedUsd: 0.30,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free Newsletter plan for up to 10,000 subscribers. Creator plan starts at $29/month ($25/mo billed annually) for up to 1,000 subscribers with visual automation funnels and paid recommendations. Creator Pro starts at $59/mo ($50/mo annually).',
      pricingSourceUrl: 'https://kit.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://kit.com/terms'
    },
    businessFit: {
      businessTypes: ['creator_media', 'solo_founder', 'solo_freelancer'],
      teamSizeMin: 1,
      teamSizeMax: 20,
      technicalSkillRequired: 'low',
      bestFor: 'Creators, writers, course creators, and podcasters monetizing an audience through visual email sequences, paid newsletters, and digital products.',
      notRecommendedFor: 'E-commerce stores with multi-variant product catalog transactional needs.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['stripe', 'wordpress', 'notion', 'zapier', 'make'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Kit Official Pricing', url: 'https://kit.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'mailchimp',
    name: 'Mailchimp',
    vendor: 'The Rocket Science Group LLC (Intuit)',
    website: 'https://mailchimp.com',
    category: 'email-marketing',
    primaryCapability: 'EMAIL_MARKETING',
    secondaryCapabilities: ['WEBSITE_CMS'],
    featureTags: ['broadcast_newsletters', 'drip_automations', 'subscriber_segmentation', 'signup_forms', 'landing_pages'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Free plan limited to 500 contacts and 1,000 monthly sends (500/day limit). Mailchimp branding on all emails.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free plan limited to 500 contacts. Essentials starts at $13/mo for 500 contacts (scaling sharply to $45/mo for 2.5k contacts). Standard starts at $20/mo for 500 contacts ($75/mo for 2.5k contacts).',
      pricingSourceUrl: 'https://mailchimp.com/pricing/marketing/',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.intuit.com/legal/terms/en-us/mailchimp/'
    },
    businessFit: {
      businessTypes: ['small_agency', 'solo_founder'],
      teamSizeMin: 1,
      teamSizeMax: 50,
      technicalSkillRequired: 'none',
      bestFor: 'Traditional small businesses wanting a well-known, simple drag-and-drop newsletter builder.',
      notRecommendedFor: 'Fast-growing startups wanting cost-efficient list growth without steep subscriber tier escalations.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['wordpress', 'stripe', 'hubspot', 'zapier'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'moderate'
    },
    sources: [
      { title: 'Mailchimp Official Pricing', url: 'https://mailchimp.com/pricing/marketing/', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'resend',
    name: 'Resend',
    vendor: 'Resend Labs, Inc.',
    website: 'https://resend.com',
    category: 'email-marketing',
    primaryCapability: 'EMAIL_MARKETING',
    secondaryCapabilities: ['DEVELOPMENT_AI'],
    featureTags: ['transactional_api', 'broadcast_newsletters', 'signup_forms'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: false,
      freeTierLimits: 'Free tier includes 3,000 emails/month (100 emails/day) and 1 custom sending domain.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free tier includes 3,000 emails/month. Pro plan is $20/month for 50,000 emails/month and unlimited domains. Additional emails cost $0.90 per 1,000.',
      pricingSourceUrl: 'https://resend.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud Email API delivery network.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://resend.com/legal/terms'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'technical_founder_oss', 'small_agency'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'developer',
      bestFor: 'Developers and React/Next.js founders building modern applications who want transactional emails written with React Email components and verified deliverability.',
      notRecommendedFor: 'Non-technical marketing teams wanting a purely visual no-code newsletter builder.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['supabase', 'github'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['json'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Resend Official Pricing', url: 'https://resend.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },

  // ==========================================
  // 6. WORKFLOW AUTOMATION (3 Tools)
  // ==========================================
  {
    toolId: 'n8n',
    name: 'n8n',
    vendor: 'n8n GmbH',
    website: 'https://n8n.io',
    category: 'automation',
    primaryCapability: 'AUTOMATION',
    secondaryCapabilities: ['DEVELOPMENT_AI'],
    featureTags: ['visual_flow_builder', 'webhook_triggers', 'multi_step_branching', 'code_step_execution', 'scheduled_jobs', 'api_connectors'],
    commercialModel: {
      pricingModel: PRICING_MODELS.OPEN_SOURCE_FREE,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Self-hosted Community edition includes unlimited workflows and executions free forever on your server under Sustainable Use License.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 20,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: '100% Free self-hosted Community edition for internal company use. Managed Cloud Starter plan is $20/month ($20/mo billed annually, or €24/mo monthly) for 2,500 workflow executions. Pro is $50/mo for 10,000 executions.',
      pricingSourceUrl: 'https://n8n.io/pricing/',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: true,
      softwareLicenseCostMonthly: 0,
      minServerSpecs: '1 vCPU, 1GB–2GB RAM VPS (Docker / Node.js + SQLite/Postgres)',
      estimatedServerCostMonthlyRange: { minUsd: 4.50, maxUsd: 12.00 },
      maintenanceBurden: 'LOW',
      tcoNotes: 'Software license is $0 for internal business automation. Requires a lightweight VPS ($4.50–$6/mo on Hetzner/DigitalOcean) with Docker Compose and persistent SQLite/Postgres volume.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: true,
      desktopAvailable: true,
      mobileAvailable: false,
      dockerAvailable: true,
      kubernetesAvailable: true,
      deploymentComplexity: 'low_docker'
    },
    licensing: {
      openSource: false, // Fair-code / Sustainable Use License (source available, not OSI open source due to commercial embedding restrictions)
      licenseType: LICENSE_TYPES.BSL_FAIR_CODE,
      commercialUseAllowed: true, // Commercial internal use allowed; resale as managed service restricted
      licenseSourceUrl: 'https://github.com/n8n-io/n8n/blob/master/LICENSE.md'
    },
    businessFit: {
      businessTypes: ['technical_founder_oss', 'saas_startup', 'small_agency', 'solo_founder'],
      teamSizeMin: 1,
      teamSizeMax: 200,
      technicalSkillRequired: 'moderate',
      bestFor: 'Developers, technical founders, and agencies wanting high-volume workflow automation, AI agent orchestration, and custom JavaScript/Python code execution without paying per-task SaaS tax.',
      notRecommendedFor: 'Complete non-technical business users seeking simple 2-step click-and-done integrations without understanding webhooks or JSON structures.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['hubspot', 'pipedrive', 'stripe', 'notion', 'linear', 'resend', 'brevo', 'postgresql', 'supabase', 'twenty'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['json'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'n8n Official Pricing', url: 'https://n8n.io/pricing/', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' },
      { title: 'n8n GitHub Repository', url: 'https://github.com/n8n-io/n8n', type: 'Official GitHub Repository', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'make',
    name: 'Make (Integromat)',
    vendor: 'Celonis Inc. (Make)',
    website: 'https://www.make.com',
    category: 'automation',
    primaryCapability: 'AUTOMATION',
    secondaryCapabilities: [],
    featureTags: ['visual_flow_builder', 'webhook_triggers', 'multi_step_branching', 'scheduled_jobs', 'api_connectors'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: false,
      freeTierLimits: 'Free plan includes 1,000 operations/month and 2 active scenarios. 15-minute minimum execution interval.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 15,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free plan includes 1,000 operations/month. Core plan starts at $9/month ($10.59 monthly) for 10,000 operations. Pro plan starts at $16/mo for 10,000 operations with custom variables and full-text execution search.',
      pricingSourceUrl: 'https://www.make.com/en/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.make.com/en/terms-and-conditions'
    },
    businessFit: {
      businessTypes: ['small_agency', 'solo_founder', 'growing_agency', 'creator_media'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'low',
      bestFor: 'Agencies and operations managers wanting complex visual branching, array iterators/aggregators, and robust error handling at a fraction of Zapier pricing.',
      notRecommendedFor: 'Companies strictly demanding on-premise air-gapped data hosting.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['hubspot', 'pipedrive', 'stripe', 'notion', 'clickup', 'trello', 'brevo', 'mailchimp', 'quickbooks-online', 'xero'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['make']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['json'],
      migrationDifficulty: 'moderate',
      vendorLockInRisk: 'moderate'
    },
    sources: [
      { title: 'Make Official Pricing', url: 'https://www.make.com/en/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'zapier',
    name: 'Zapier',
    vendor: 'Zapier Inc.',
    website: 'https://zapier.com',
    category: 'automation',
    primaryCapability: 'AUTOMATION',
    secondaryCapabilities: [],
    featureTags: ['visual_flow_builder', 'webhook_triggers', 'multi_step_branching', 'scheduled_jobs', 'api_connectors'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Free plan includes 100 tasks/month and single-step Zaps only (1 trigger -> 1 action).',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 33,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free plan includes 100 tasks/month. Starter plan is $19.99/mo billed annually ($29.99 monthly) for 750 tasks/mo and multi-step Zaps. Professional starts at $49/mo ($73.50 monthly) for 2,000 tasks.',
      pricingSourceUrl: 'https://zapier.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://zapier.com/legal/terms-of-service'
    },
    businessFit: {
      businessTypes: ['solo_freelancer', 'solo_founder', 'small_agency'],
      teamSizeMin: 1,
      teamSizeMax: 50,
      technicalSkillRequired: 'none',
      bestFor: 'Non-technical business founders who want the absolute broadest connector ecosystem (6,000+ apps) with zero setup friction.',
      notRecommendedFor: 'High-volume automation workflows where per-task billing quickly costs hundreds of dollars per month.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['hubspot', 'pipedrive', 'stripe', 'notion', 'trello', 'clickup', 'mailchimp', 'quickbooks-online'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['json'],
      migrationDifficulty: 'moderate',
      vendorLockInRisk: 'moderate'
    },
    sources: [
      { title: 'Zapier Official Pricing', url: 'https://zapier.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },

  // ==========================================
  // 7. DEVELOPER & AI CODING (2 Tools)
  // ==========================================
  {
    toolId: 'cursor-ai',
    name: 'Cursor AI',
    vendor: 'Anysphere, Inc.',
    website: 'https://www.cursor.com',
    category: 'ai-coding-dev',
    primaryCapability: 'DEVELOPMENT_AI',
    secondaryCapabilities: [],
    featureTags: ['ai_code_generation', 'context_aware_chat', 'terminal_integration', 'git_diff_review', 'codebase_indexing'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Hobby plan is free with 2,000 completions and 50 slow premium requests.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 20,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Hobby plan is free. Pro plan is $20/month with unlimited completions, 500 fast premium requests/mo (Claude 3.5 Sonnet / GPT-4o), and unlimited slow requests. Business is $40/user/mo.',
      pricingSourceUrl: 'https://www.cursor.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Desktop binary with Anysphere cloud LLM backend proxy.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: true,
      mobileAvailable: false,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.cursor.com/terms-of-service'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'technical_founder_oss', 'solo_founder'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'developer',
      bestFor: 'Software developers building applications who want full-codebase indexing, multi-file agentic edits (Composer), and instant diff reviews.',
      notRecommendedFor: 'Non-technical founders without basic programming knowledge.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['github'],
      apiAvailable: false,
      webhooksAvailable: false,
      automationPlatforms: []
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['local_files'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Cursor Official Pricing', url: 'https://www.cursor.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'github-copilot',
    name: 'GitHub Copilot',
    vendor: 'GitHub, Inc. (Microsoft)',
    website: 'https://github.com/features/copilot',
    category: 'ai-coding-dev',
    primaryCapability: 'DEVELOPMENT_AI',
    secondaryCapabilities: [],
    featureTags: ['ai_code_generation', 'context_aware_chat', 'terminal_integration', 'git_diff_review'],
    commercialModel: {
      pricingModel: PRICING_MODELS.PER_SEAT_MONTHLY,
      freePlanAvailable: false,
      freeTrialAvailable: true,
      freeTierLimits: '30-day free trial for individuals; no permanent free tier.',
      baseMonthlyPriceUsd: 10,
      pricePerSeatMonthlyUsd: 10,
      minimumSeats: 1,
      annualDiscountPercent: 17,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Copilot Individual is $10/month (or $100/year). Copilot Business is $19/user/month adding organization policy controls and IP indemnity. Copilot Enterprise is $39/user/month.',
      pricingSourceUrl: 'https://github.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'IDE Extension connecting to Microsoft cloud API.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: true,
      mobileAvailable: false,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features#github-copilot'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'small_agency', 'technical_founder_oss'],
      teamSizeMin: 1,
      teamSizeMax: 500,
      technicalSkillRequired: 'developer',
      bestFor: 'Development teams embedded in standard VS Code / JetBrains ecosystems wanting inline autocomplete and PR assistance backed by Microsoft enterprise agreements.',
      notRecommendedFor: 'Teams looking for autonomous multi-file terminal refactoring.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['github'],
      apiAvailable: true,
      webhooksAvailable: false,
      automationPlatforms: []
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['local_files'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'GitHub Official Pricing', url: 'https://github.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },

  // ==========================================
  // 8. CLOUD HOSTING & INFRASTRUCTURE (5 Tools)
  // ==========================================
  {
    toolId: 'hetzner',
    name: 'Hetzner Cloud',
    vendor: 'Hetzner Online GmbH',
    website: 'https://www.hetzner.com/cloud',
    category: 'cloud-infrastructure',
    primaryCapability: 'HOSTING',
    secondaryCapabilities: [],
    featureTags: ['vps_compute', 'static_edge_hosting', 'automated_backups'],
    commercialModel: {
      pricingModel: PRICING_MODELS.USAGE_BASED,
      freePlanAvailable: false,
      freeTrialAvailable: false,
      freeTierLimits: 'No permanent free tier. Pay-as-you-go hourly/monthly per VM.',
      baseMonthlyPriceUsd: 4.50,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'CAX11 (ARM64 2 vCPU, 4GB RAM, 40GB NVMe) is ~€3.79/mo (~$4.15 USD/mo). CPX11 (x86 2 vCPU, 2GB RAM, 40GB NVMe) is ~€4.35/mo (~$4.75 USD/mo). Includes 20TB traffic.',
      pricingSourceUrl: 'https://www.hetzner.com/cloud',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Provider of VPS infrastructure for running self-hosted applications.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: true,
      kubernetesAvailable: true,
      deploymentComplexity: 'low_docker'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.hetzner.com/legal/terms-and-conditions'
    },
    businessFit: {
      businessTypes: ['technical_founder_oss', 'saas_startup', 'solo_founder', 'small_agency'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'developer',
      bestFor: 'Cost-conscious developers and founders wanting ultra-cheap, high-performance NVMe cloud VPS servers for Docker deployments (n8n, Invoice Ninja, Postgres, Supabase).',
      notRecommendedFor: 'Non-technical founders without Linux command-line and SSH knowledge.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['docker', 'kubernetes'],
      apiAvailable: true,
      webhooksAvailable: false,
      automationPlatforms: []
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['snapshots', 'backups'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Hetzner Official Pricing', url: 'https://www.hetzner.com/cloud', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'vultr',
    name: 'Vultr',
    vendor: 'The Constant Company, LLC (Vultr)',
    website: 'https://www.vultr.com',
    category: 'cloud-infrastructure',
    primaryCapability: 'HOSTING',
    secondaryCapabilities: ['DATABASE'],
    featureTags: ['vps_compute', 'managed_kubernetes', 'container_deployment', 'automated_backups'],
    commercialModel: {
      pricingModel: PRICING_MODELS.USAGE_BASED,
      freePlanAvailable: false,
      freeTrialAvailable: false,
      freeTierLimits: 'No permanent free tier. Pay-as-you-go per VM.',
      baseMonthlyPriceUsd: 5,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Cloud Compute instances start at $5/month (1 vCPU, 1GB RAM, 25GB SSD, 1TB bandwidth). High Performance NVMe starts at $6/month. 32 global datacenter locations.',
      pricingSourceUrl: 'https://www.vultr.com/pricing/',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Provider of cloud VPS compute.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: true,
      kubernetesAvailable: true,
      deploymentComplexity: 'low_docker'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.vultr.com/legal/tos/'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'technical_founder_oss', 'small_agency'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'developer',
      bestFor: 'Developers needing global low-latency edge deployment across North America, Europe, Asia, and Latin America.',
      notRecommendedFor: 'Teams demanding fully managed zero-configuration PaaS.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['docker', 'kubernetes'],
      apiAvailable: true,
      webhooksAvailable: false,
      automationPlatforms: []
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['snapshots', 'backups'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Vultr Official Pricing', url: 'https://www.vultr.com/pricing/', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'render',
    name: 'Render',
    vendor: 'Render Services, Inc.',
    website: 'https://render.com',
    category: 'cloud-infrastructure',
    primaryCapability: 'HOSTING',
    secondaryCapabilities: ['DATABASE'],
    featureTags: ['container_deployment', 'serverless_functions', 'static_edge_hosting', 'relational_postgres', 'cdn_ssl'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: false,
      freeTierLimits: 'Free web services spin down after 15m inactivity (cold starts ~50s). Free Postgres expires after 30 days.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free tier for static sites and spinning-down web services. Individual Starter plan is $7/month per web service (always-on 512MB RAM). Managed Postgres starts at $7/month.',
      pricingSourceUrl: 'https://render.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Managed cloud PaaS platform.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: true,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://render.com/terms'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'solo_founder', 'small_agency'],
      teamSizeMin: 1,
      teamSizeMax: 30,
      technicalSkillRequired: 'low',
      bestFor: 'Founders building Node.js, Python, Ruby, Go, or Docker apps wanting Heroku-like git-push ease with automatic SSL and managed databases.',
      notRecommendedFor: 'Cost-sensitive teams deploying 20+ microservices who would save 70% using raw Hetzner VPS.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['github', 'postgresql'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: []
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['docker', 'sql'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Render Official Pricing', url: 'https://render.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'digitalocean',
    name: 'DigitalOcean',
    vendor: 'DigitalOcean, LLC',
    website: 'https://www.digitalocean.com',
    category: 'cloud-infrastructure',
    primaryCapability: 'HOSTING',
    secondaryCapabilities: ['DATABASE'],
    featureTags: ['vps_compute', 'managed_kubernetes', 'container_deployment', 'relational_postgres', 'automated_backups'],
    commercialModel: {
      pricingModel: PRICING_MODELS.USAGE_BASED,
      freePlanAvailable: false,
      freeTrialAvailable: true,
      freeTierLimits: 'No permanent free tier; $200 60-day credit for new accounts.',
      baseMonthlyPriceUsd: 4,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Basic Droplets start at $4/month (512MB RAM, 1 vCPU, 10GB SSD) and $6/month (1GB RAM, 1 vCPU, 25GB SSD, 1TB transfer). Managed PostgreSQL starts at $15/month.',
      pricingSourceUrl: 'https://www.digitalocean.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud infrastructure provider.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: true,
      kubernetesAvailable: true,
      deploymentComplexity: 'low_docker'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.digitalocean.com/legal/terms-of-service-agreement'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'small_agency', 'technical_founder_oss'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'developer',
      bestFor: 'Startups wanting standard cloud compute backed by comprehensive 1-click marketplace applications (WordPress, Docker, Supabase, n8n).',
      notRecommendedFor: 'Teams looking for the absolute cheapest bare compute in Europe where Hetzner provides more RAM per dollar.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['docker', 'kubernetes', 'github'],
      apiAvailable: true,
      webhooksAvailable: false,
      automationPlatforms: []
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['snapshots', 'backups'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'DigitalOcean Official Pricing', url: 'https://www.digitalocean.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'aws',
    name: 'Amazon Web Services (AWS)',
    vendor: 'Amazon Web Services, Inc.',
    website: 'https://aws.amazon.com',
    category: 'cloud-infrastructure',
    primaryCapability: 'HOSTING',
    secondaryCapabilities: ['DATABASE', 'AUTH'],
    featureTags: ['vps_compute', 'managed_kubernetes', 'container_deployment', 'serverless_functions', 'static_edge_hosting', 'cdn_ssl', 'relational_postgres', 'fulltext_search', 'document_nosql'],
    commercialModel: {
      pricingModel: PRICING_MODELS.USAGE_BASED,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: '750 hours/month of t2.micro/t3.micro for first 12 months. 5GB S3, 1M Lambda requests/mo forever.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.MEDIUM,
      pricingNotes: 'Free tier for first 12 months. Pay-as-you-go metered pricing thereafter. Small production app typically runs ~$30–$100/mo; scaling workloads can easily exceed thousands.',
      pricingSourceUrl: 'https://aws.amazon.com/pricing/',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Global hyper-scale cloud provider.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: true,
      kubernetesAvailable: true,
      deploymentComplexity: 'high_k8s'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://aws.amazon.com/service-terms/'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'growing_agency'],
      teamSizeMin: 1,
      teamSizeMax: 1000,
      technicalSkillRequired: 'developer',
      bestFor: 'Scaling engineering teams requiring enterprise compliance (SOC2, HIPAA, ISO), infinite multi-region elasticity, and advanced managed cloud services.',
      notRecommendedFor: 'Early-stage solo founders or small agencies without dedicated DevOps engineers to prevent unexpected billing spikes.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['docker', 'kubernetes', 'github'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: []
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['snapshots', 's3', 'sql'],
      migrationDifficulty: 'high',
      vendorLockInRisk: 'high'
    },
    sources: [
      { title: 'AWS Official Pricing', url: 'https://aws.amazon.com/pricing/', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },

  // ==========================================
  // 9. DATABASE & SEARCH (4 Tools)
  // ==========================================
  {
    toolId: 'supabase',
    name: 'Supabase',
    vendor: 'Supabase, Inc.',
    website: 'https://supabase.com',
    category: 'nocode-databases',
    primaryCapability: 'DATABASE',
    secondaryCapabilities: ['AUTH', 'HOSTING'],
    featureTags: ['relational_postgres', 'realtime_subscriptions', 'vector_embeddings', 'automated_backups', 'social_login', 'jwt_session_management', 'serverless_functions'],
    commercialModel: {
      pricingModel: PRICING_MODELS.OPEN_SOURCE_FREE,
      freePlanAvailable: true,
      freeTrialAvailable: false,
      freeTierLimits: 'Cloud Free plan includes 500MB database, 50,000 monthly active users, and 1GB file storage (pauses after 1 week inactivity). Self-hosted has unlimited users & database size.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: '100% Free and Open Source (Apache 2.0) when self-hosted via Docker. Managed Cloud Pro plan is $25/month per project with 8GB database, 100k MAU, and daily backups.',
      pricingSourceUrl: 'https://supabase.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: true,
      softwareLicenseCostMonthly: 0,
      minServerSpecs: '2 vCPU, 4GB RAM VPS (Docker Compose: Studio, Kong, GoTrue, PostgREST, Realtime, Postgres)',
      estimatedServerCostMonthlyRange: { minUsd: 8.00, maxUsd: 20.00 },
      maintenanceBurden: 'MODERATE',
      tcoNotes: 'Software is free Apache 2.0. Full self-hosted Supabase stack runs 6+ Docker containers requiring at least 4GB RAM (~$8–$15/mo VPS).'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: true,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: true,
      kubernetesAvailable: true,
      deploymentComplexity: 'low_docker'
    },
    licensing: {
      openSource: true,
      licenseType: LICENSE_TYPES.APACHE_2_0,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://github.com/supabase/supabase/blob/master/LICENSE'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'technical_founder_oss', 'solo_founder', 'small_agency'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'developer',
      bestFor: 'Developers building full-stack web and mobile applications wanting instant PostgreSQL with Row-Level Security, auto-generated REST/GraphQL APIs, Auth, and Storage.',
      notRecommendedFor: 'Non-technical business owners seeking a no-code visual table without SQL awareness.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['resend', 'stripe', 'github', 'n8n'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['sql', 'csv', 'json'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Supabase Official Pricing', url: 'https://supabase.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' },
      { title: 'Supabase GitHub', url: 'https://github.com/supabase/supabase', type: 'Official GitHub Repository', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'postgresql',
    name: 'PostgreSQL',
    vendor: 'PostgreSQL Global Development Group',
    website: 'https://www.postgresql.org',
    category: 'nocode-databases',
    primaryCapability: 'DATABASE',
    secondaryCapabilities: [],
    featureTags: ['relational_postgres', 'fulltext_search', 'vector_embeddings', 'automated_backups'],
    commercialModel: {
      pricingModel: PRICING_MODELS.OPEN_SOURCE_FREE,
      freePlanAvailable: true,
      freeTrialAvailable: false,
      freeTierLimits: '100% Free Open Source database engine with zero limits or license restrictions.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: '100% Free and Open Source under the PostgreSQL License (permissive BSD-style license). No software licensing costs.',
      pricingSourceUrl: 'https://www.postgresql.org/about/licence/',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: true,
      softwareLicenseCostMonthly: 0,
      minServerSpecs: '1 vCPU, 1GB RAM minimum (Scales with database size)',
      estimatedServerCostMonthlyRange: { minUsd: 4.50, maxUsd: 15.00 },
      maintenanceBurden: 'LOW',
      tcoNotes: 'Software license is $0. Runs natively or in Docker on any Linux VPS (~$4.50/mo).'
    },
    deployment: {
      cloudAvailable: false,
      selfHostedAvailable: true,
      desktopAvailable: true,
      mobileAvailable: false,
      dockerAvailable: true,
      kubernetesAvailable: true,
      deploymentComplexity: 'low_docker'
    },
    licensing: {
      openSource: true,
      licenseType: LICENSE_TYPES.POSTGRESQL_LICENSE,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.postgresql.org/about/licence/'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'technical_founder_oss', 'small_agency', 'growing_agency'],
      teamSizeMin: 1,
      teamSizeMax: 1000,
      technicalSkillRequired: 'developer',
      bestFor: 'Universal industry-standard relational database for ACID transaction integrity, JSONB semi-structured data, and pgvector semantic embeddings.',
      notRecommendedFor: 'Non-technical founders looking for hosted spreadsheets.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['supabase', 'twenty', 'n8n'],
      apiAvailable: true,
      webhooksAvailable: false,
      automationPlatforms: ['n8n']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['sql', 'csv'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'PostgreSQL License', url: 'https://www.postgresql.org/about/licence/', type: 'Official License Document', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'opensearch',
    name: 'OpenSearch',
    vendor: 'OpenSearch Community (Linux Foundation / AWS)',
    website: 'https://opensearch.org',
    category: 'nocode-databases',
    primaryCapability: 'DATABASE',
    secondaryCapabilities: ['ANALYTICS'],
    featureTags: ['fulltext_search', 'vector_embeddings', 'automated_backups', 'event_tracking'],
    commercialModel: {
      pricingModel: PRICING_MODELS.OPEN_SOURCE_FREE,
      freePlanAvailable: true,
      freeTrialAvailable: false,
      freeTierLimits: '100% Free Apache 2.0 Open Source search engine on your own servers.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: '100% Free and Open Source (Apache 2.0). Managed AWS OpenSearch Service pricing starts at ~$20/mo for small single-node clusters.',
      pricingSourceUrl: 'https://opensearch.org/docs/latest/',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: true,
      softwareLicenseCostMonthly: 0,
      minServerSpecs: '2 vCPU, 4GB RAM minimum (JVM memory heap requires 2GB+)',
      estimatedServerCostMonthlyRange: { minUsd: 8.00, maxUsd: 25.00 },
      maintenanceBurden: 'MODERATE',
      tcoNotes: 'Software license is $0. Requires 4GB+ RAM server (~$8–$20/mo) for Java heap memory and shard management.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: true,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: true,
      kubernetesAvailable: true,
      deploymentComplexity: 'moderate'
    },
    licensing: {
      openSource: true,
      licenseType: LICENSE_TYPES.APACHE_2_0,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://github.com/opensearch-project/OpenSearch/blob/main/LICENSE.txt'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'technical_founder_oss', 'growing_agency'],
      teamSizeMin: 1,
      teamSizeMax: 500,
      technicalSkillRequired: 'developer',
      bestFor: 'Applications requiring high-throughput full-text search, multi-tenant log aggregation, vector search, and faceted indexing under a true open-source Apache 2.0 license.',
      notRecommendedFor: 'Simple SQLite or Postgres setups that can handle search via basic pg_trgm or pgvector.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['docker', 'kubernetes', 'aws'],
      apiAvailable: true,
      webhooksAvailable: false,
      automationPlatforms: []
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['json', 'snapshots'],
      migrationDifficulty: 'moderate',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'OpenSearch GitHub', url: 'https://github.com/opensearch-project/OpenSearch', type: 'Official GitHub Repository', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'elasticsearch',
    name: 'Elasticsearch',
    vendor: 'Elastic N.V.',
    website: 'https://www.elastic.co',
    category: 'nocode-databases',
    primaryCapability: 'DATABASE',
    secondaryCapabilities: ['ANALYTICS'],
    featureTags: ['fulltext_search', 'vector_embeddings', 'automated_backups', 'event_tracking'],
    commercialModel: {
      pricingModel: PRICING_MODELS.OPEN_SOURCE_FREE,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Free self-hosted basic features under AGPLv3 / Elastic License v2. Elastic Cloud offers 14-day free trial.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'AGPLv3 / Elastic License dual-licensed for self-hosting. Elastic Cloud managed SaaS starts at ~$95/month for Standard tier.',
      pricingSourceUrl: 'https://www.elastic.co/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: true,
      softwareLicenseCostMonthly: 0,
      minServerSpecs: '2 vCPU, 4GB–8GB RAM',
      estimatedServerCostMonthlyRange: { minUsd: 12.00, maxUsd: 35.00 },
      maintenanceBurden: 'MODERATE',
      tcoNotes: 'Software license is free for self-hosting. Requires robust VPS memory allocation (~$12–$35/mo).'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: true,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: true,
      kubernetesAvailable: true,
      deploymentComplexity: 'moderate'
    },
    licensing: {
      openSource: true,
      licenseType: LICENSE_TYPES.ELASTIC_2_0,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://github.com/elastic/elasticsearch/blob/main/licenses/ELASTIC-LICENSE-2.0.txt'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'growing_agency'],
      teamSizeMin: 1,
      teamSizeMax: 1000,
      technicalSkillRequired: 'developer',
      bestFor: 'Enterprise log analytics, observability, and full-text document search with official Kibana integrations.',
      notRecommendedFor: 'Lightweight applications that require simple embedded databases.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['docker', 'kubernetes'],
      apiAvailable: true,
      webhooksAvailable: false,
      automationPlatforms: []
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['json', 'snapshots'],
      migrationDifficulty: 'moderate',
      vendorLockInRisk: 'moderate'
    },
    sources: [
      { title: 'Elasticsearch Pricing', url: 'https://www.elastic.co/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },

  // ==========================================
  // 10. AUTHENTICATION & USER MANAGEMENT (2 Tools)
  // ==========================================
  {
    toolId: 'clerk',
    name: 'Clerk',
    vendor: 'Clerk Inc.',
    website: 'https://clerk.com',
    category: 'cloud-infrastructure',
    primaryCapability: 'AUTH',
    secondaryCapabilities: [],
    featureTags: ['social_login', 'mfa_security', 'jwt_session_management', 'user_roles_rbac', 'organization_tenancy', 'passwordless'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: false,
      freeTierLimits: 'Free tier includes up to 10,000 monthly active users (MAU) and unlimited social logins with Clerk branding.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free tier includes up to 10,000 MAU. Pro plan is $25/month with 10,000 MAU included ($0.02 per additional MAU), custom domains, and white-label emails.',
      pricingSourceUrl: 'https://clerk.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Managed cloud authentication API.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://clerk.com/legal/terms'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'solo_founder', 'small_agency'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'developer',
      bestFor: 'React, Next.js, and Expo/React Native developers wanting pre-built, polished sign-up modals, session management, and multi-tenant organization switching.',
      notRecommendedFor: 'Legacy enterprise PHP or on-premise Active Directory environments.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['supabase', 'stripe', 'github'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['json', 'csv'],
      migrationDifficulty: 'moderate',
      vendorLockInRisk: 'moderate'
    },
    sources: [
      { title: 'Clerk Official Pricing', url: 'https://clerk.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'auth0',
    name: 'Auth0 by Okta',
    vendor: 'Okta, Inc.',
    website: 'https://auth0.com',
    category: 'cloud-infrastructure',
    primaryCapability: 'AUTH',
    secondaryCapabilities: [],
    featureTags: ['social_login', 'mfa_security', 'jwt_session_management', 'user_roles_rbac', 'organization_tenancy', 'passwordless'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREEMIUM,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Free tier includes up to 7,500 active users and unlimited social logins with Auth0 branding.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 10,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free tier includes up to 7,500 active users. Essentials plan starts at $35/month for 500 MAU. Professional starts at $240/month for 5,000 MAU.',
      pricingSourceUrl: 'https://auth0.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Managed cloud authentication identity platform.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://auth0.com/terms'
    },
    businessFit: {
      businessTypes: ['growing_agency', 'saas_startup'],
      teamSizeMin: 1,
      teamSizeMax: 1000,
      technicalSkillRequired: 'developer',
      bestFor: 'B2B enterprise applications needing SAML SSO, Okta directory synchronization, and enterprise identity federation.',
      notRecommendedFor: 'Early-stage consumer startups wanting lightweight, inexpensive authentication.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['aws', 'github'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: []
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['json'],
      migrationDifficulty: 'moderate',
      vendorLockInRisk: 'high'
    },
    sources: [
      { title: 'Auth0 Official Pricing', url: 'https://auth0.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },

  // ==========================================
  // 11. ANALYTICS & PRODUCT INTELLIGENCE (3 Tools)
  // ==========================================
  {
    toolId: 'posthog',
    name: 'PostHog',
    vendor: 'PostHog, Inc.',
    website: 'https://posthog.com',
    category: 'seo-analytics',
    primaryCapability: 'ANALYTICS',
    secondaryCapabilities: [],
    featureTags: ['event_tracking', 'pageview_analytics', 'funnel_analysis', 'session_recordings', 'feature_flags'],
    commercialModel: {
      pricingModel: PRICING_MODELS.OPEN_SOURCE_FREE,
      freePlanAvailable: true,
      freeTrialAvailable: false,
      freeTierLimits: 'Cloud free allowances: 1 million events/mo, 5,000 session recordings/mo, and 1 million feature flag evaluations/mo free forever.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: '100% Free Open Source (MIT) self-hosted Community edition. Cloud edition has generous free tiers (1M events/mo free), with metered billing thereafter ($0.000248/event).',
      pricingSourceUrl: 'https://posthog.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: true,
      softwareLicenseCostMonthly: 0,
      minServerSpecs: '4 vCPU, 8GB–16GB RAM (ClickHouse + Kafka + Redis + Postgres + Node.js)',
      estimatedServerCostMonthlyRange: { minUsd: 20.00, maxUsd: 50.00 },
      maintenanceBurden: 'HIGH_DEV',
      tcoNotes: 'Software is free MIT. Self-hosting PostHog requires significant compute (ClickHouse + Kafka, minimum 8GB RAM ~$20–$40/mo VPS) and ongoing database maintenance.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: true,
      desktopAvailable: false,
      mobileAvailable: true,
      dockerAvailable: true,
      kubernetesAvailable: true,
      deploymentComplexity: 'moderate'
    },
    licensing: {
      openSource: true,
      licenseType: LICENSE_TYPES.MIT,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://github.com/PostHog/posthog/blob/master/LICENSE'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'technical_founder_oss', 'solo_founder', 'small_agency'],
      teamSizeMin: 1,
      teamSizeMax: 200,
      technicalSkillRequired: 'low',
      bestFor: 'Product founders and SaaS engineering teams wanting all-in-one product analytics, session replay videos, user retention funnels, and feature flags in a single SDK.',
      notRecommendedFor: 'Basic content bloggers who only need aggregate visitor counts without event telemetry.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['supabase', 'stripe', 'hubspot', 'github', 'zapier', 'n8n'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['json', 'csv', 's3'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'PostHog Official Pricing', url: 'https://posthog.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' },
      { title: 'PostHog GitHub Repository', url: 'https://github.com/PostHog/posthog', type: 'Official GitHub Repository', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'plausible',
    name: 'Plausible Analytics',
    vendor: 'Plausible Insights OÜ',
    website: 'https://plausible.io',
    category: 'seo-analytics',
    primaryCapability: 'ANALYTICS',
    secondaryCapabilities: [],
    featureTags: ['pageview_analytics', 'funnel_analysis', 'privacy_cookieless'],
    commercialModel: {
      pricingModel: PRICING_MODELS.OPEN_SOURCE_FREE,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Self-hosted has unlimited pageviews and sites free on your server. Cloud edition offers 30-day free trial.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 17,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: '100% Free and Open Source (AGPLv3) self-hosted on your server. Managed Cloud plan starts at $9/month ($7.50/mo billed annually) for up to 10,000 monthly pageviews across unlimited websites.',
      pricingSourceUrl: 'https://plausible.io/#pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: true,
      softwareLicenseCostMonthly: 0,
      minServerSpecs: '1 vCPU, 1GB–2GB RAM VPS (ClickHouse + PostgreSQL + Plausible container)',
      estimatedServerCostMonthlyRange: { minUsd: 4.50, maxUsd: 12.00 },
      maintenanceBurden: 'LOW',
      tcoNotes: 'Software license is $0. Lightweight self-hosting runs cleanly on a small Hetzner VPS (~$4.50/mo).'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: true,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: true,
      kubernetesAvailable: false,
      deploymentComplexity: 'low_docker'
    },
    licensing: {
      openSource: true,
      licenseType: LICENSE_TYPES.AGPL_V3,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://github.com/plausible/analytics/blob/master/LICENSE'
    },
    businessFit: {
      businessTypes: ['solo_freelancer', 'creator_media', 'small_agency', 'technical_founder_oss', 'solo_founder'],
      teamSizeMin: 1,
      teamSizeMax: 50,
      technicalSkillRequired: 'none',
      bestFor: 'Websites and creators wanting lightweight (<1KB script), privacy-friendly, cookieless Google Analytics alternative with zero GDPR banner overhead.',
      notRecommendedFor: 'Product managers requiring full session recordings, heatmaps, and in-depth user identity stitching.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['wordpress', 'ghost', 'notion'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['zapier', 'n8n']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Plausible Official Pricing', url: 'https://plausible.io/#pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' },
      { title: 'Plausible GitHub', url: 'https://github.com/plausible/analytics', type: 'Official GitHub Repository', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'google-analytics',
    name: 'Google Analytics 4',
    vendor: 'Google LLC',
    website: 'https://analytics.google.com',
    category: 'seo-analytics',
    primaryCapability: 'ANALYTICS',
    secondaryCapabilities: [],
    featureTags: ['pageview_analytics', 'event_tracking', 'funnel_analysis'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FREE_FOREVER,
      freePlanAvailable: true,
      freeTrialAvailable: false,
      freeTierLimits: '100% Free standard edition up to 10 million events per month. 14-month maximum event data retention.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: '100% Free standard edition. Google Analytics 360 enterprise tier is ~$50,000/year.',
      pricingSourceUrl: 'https://marketingplatform.google.com/about/analytics/pricing/',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Google cloud hosted service.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://marketingplatform.google.com/about/analytics/terms/us/'
    },
    businessFit: {
      businessTypes: ['small_agency', 'growing_agency', 'solo_founder', 'creator_media'],
      teamSizeMin: 1,
      teamSizeMax: 1000,
      technicalSkillRequired: 'low',
      bestFor: 'Marketers and agencies running Google Ads campaigns needing native conversion tracking and attribution modeling.',
      notRecommendedFor: 'Privacy-focused founders avoiding cookie banners and Google tracking scripts.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['google-ads', 'bigquery', 'hubspot'],
      apiAvailable: true,
      webhooksAvailable: false,
      automationPlatforms: ['zapier', 'make']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'bigquery'],
      migrationDifficulty: 'moderate',
      vendorLockInRisk: 'moderate'
    },
    sources: [
      { title: 'Google Analytics Official', url: 'https://marketingplatform.google.com/about/analytics/', type: 'Official Website', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },

  // ==========================================
  // 12. CUSTOMER SUPPORT & HELP DESK (3 Tools)
  // ==========================================
  {
    toolId: 'chatwoot',
    name: 'Chatwoot',
    vendor: 'Chatwoot Inc.',
    website: 'https://www.chatwoot.com',
    category: 'crm',
    primaryCapability: 'HELP_DESK',
    secondaryCapabilities: ['CRM'],
    featureTags: ['live_chat_widget', 'shared_team_inbox', 'knowledge_base', 'ticket_management', 'omnichannel_messaging', 'contact_management'],
    commercialModel: {
      pricingModel: PRICING_MODELS.OPEN_SOURCE_FREE,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Self-hosted Community edition has unlimited agents and inboxes free forever. Cloud Hacker tier is free for up to 2 agents.',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 20,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: '100% Free and Open Source (MIT) Community edition when self-hosted with unlimited agents and inboxes. Managed Cloud Hacker tier is free for up to 2 agents. Cloud Startups plan is $19/agent/month.',
      pricingSourceUrl: 'https://www.chatwoot.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: true,
      softwareLicenseCostMonthly: 0,
      minServerSpecs: '2 vCPU, 2GB–4GB RAM VPS (Rails + PostgreSQL + Redis)',
      estimatedServerCostMonthlyRange: { minUsd: 6.00, maxUsd: 15.00 },
      maintenanceBurden: 'MODERATE',
      tcoNotes: 'Software license is $0 MIT. Requires a 2GB+ RAM VPS (~$6–$12/mo) running Docker with automated PostgreSQL backups.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: true,
      desktopAvailable: true,
      mobileAvailable: true,
      dockerAvailable: true,
      kubernetesAvailable: true,
      deploymentComplexity: 'low_docker'
    },
    licensing: {
      openSource: true,
      licenseType: LICENSE_TYPES.MIT,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://github.com/chatwoot/chatwoot/blob/develop/LICENSE'
    },
    businessFit: {
      businessTypes: ['technical_founder_oss', 'saas_startup', 'small_agency', 'solo_founder'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'low',
      bestFor: 'Startups and developers wanting an open-source Intercom alternative connecting Live Chat, Email, WhatsApp, Telegram, and Facebook into one unified team inbox.',
      notRecommendedFor: 'Enterprise teams wanting complex outbound sales sequences.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['slack', 'n8n', 'stripe'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'json', 'sql'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Chatwoot Official Pricing', url: 'https://www.chatwoot.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' },
      { title: 'Chatwoot GitHub Repository', url: 'https://github.com/chatwoot/chatwoot', type: 'Official GitHub Repository', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'crisp',
    name: 'Crisp',
    vendor: 'Crisp IM SAS',
    website: 'https://crisp.chat',
    category: 'crm',
    primaryCapability: 'HELP_DESK',
    secondaryCapabilities: ['CRM'],
    featureTags: ['live_chat_widget', 'shared_team_inbox', 'knowledge_base', 'ticket_management', 'contact_management'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FLAT_MONTHLY,
      freePlanAvailable: true,
      freeTrialAvailable: true,
      freeTierLimits: 'Basic plan is free forever for up to 2 seats (live chat only; 30-day contact history).',
      baseMonthlyPriceUsd: 0,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 20,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Basic plan is free forever (2 seats). Pro plan is flat $25/month for up to 4 seats with shared inbox, triggers, and audio messages. Unlimited plan is flat $95/month for up to 20 seats with knowledge base, bots, and automated CRM.',
      pricingSourceUrl: 'https://crisp.chat/en/pricing/',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: true,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://crisp.chat/en/terms/'
    },
    businessFit: {
      businessTypes: ['saas_startup', 'small_agency', 'solo_founder'],
      teamSizeMin: 1,
      teamSizeMax: 20,
      technicalSkillRequired: 'none',
      bestFor: 'Early-stage SaaS startups wanting a flat-rate customer chat widget and shared inbox without per-agent fees.',
      notRecommendedFor: 'Companies strictly demanding on-premise self-hosting.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['hubspot', 'slack', 'zapier', 'make'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['n8n', 'make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'json'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'moderate'
    },
    sources: [
      { title: 'Crisp Official Pricing', url: 'https://crisp.chat/en/pricing/', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'intercom',
    name: 'Intercom',
    vendor: 'Intercom, Inc.',
    website: 'https://www.intercom.com',
    category: 'crm',
    primaryCapability: 'HELP_DESK',
    secondaryCapabilities: ['CRM', 'EMAIL_MARKETING'],
    featureTags: ['live_chat_widget', 'shared_team_inbox', 'knowledge_base', 'ticket_management', 'omnichannel_messaging', 'contact_management', 'drip_automations'],
    commercialModel: {
      pricingModel: PRICING_MODELS.PER_SEAT_MONTHLY,
      freePlanAvailable: false,
      freeTrialAvailable: true,
      freeTierLimits: '14-day free trial; no permanent free tier.',
      baseMonthlyPriceUsd: 39,
      pricePerSeatMonthlyUsd: 39,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Essential plan starts at $39/seat/month. Advanced is $99/seat/month. Expert is $139/seat/month. Fin AI Agent resolutions cost $0.99 per successful resolution.',
      pricingSourceUrl: 'https://www.intercom.com/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS only.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.intercom.com/legal/terms-and-policies'
    },
    businessFit: {
      businessTypes: ['growing_agency', 'saas_startup'],
      teamSizeMin: 5,
      teamSizeMax: 1000,
      technicalSkillRequired: 'low',
      bestFor: 'Funded SaaS companies wanting autonomous AI customer support (Fin AI) combined with outbound onboarding tours and product messaging.',
      notRecommendedFor: 'Bootstrapped founders or agencies with strict cost limits.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['hubspot', 'stripe', 'slack', 'salesforce', 'zapier'],
      apiAvailable: true,
      webhooksAvailable: true,
      automationPlatforms: ['make', 'zapier']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'json'],
      migrationDifficulty: 'high',
      vendorLockInRisk: 'high'
    },
    sources: [
      { title: 'Intercom Official Pricing', url: 'https://www.intercom.com/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },

  // ==========================================
  // 13. SEO & SEARCH INTELLIGENCE (3 Tools)
  // ==========================================
  {
    toolId: 'se-ranking',
    name: 'SE Ranking',
    vendor: 'SE Ranking Ltd',
    website: 'https://seranking.com',
    category: 'seo-analytics',
    primaryCapability: 'SEO',
    secondaryCapabilities: [],
    featureTags: ['keyword_rank_tracking', 'backlink_analysis', 'technical_site_audit', 'serp_competitor_research', 'content_optimization'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FLAT_MONTHLY,
      freePlanAvailable: false,
      freeTrialAvailable: true,
      freeTierLimits: '14-day free trial; no permanent free tier.',
      baseMonthlyPriceUsd: 55,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 20,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Essential plan starts at $55/month ($44/mo billed annually) for 750 daily rank tracking keywords and 10 website projects. Pro plan is $109/month ($87.20/mo annually) for 2,000 keywords and 3 user seats. Business is $239/month for 5,000 keywords and 5 seats.',
      pricingSourceUrl: 'https://seranking.com/pricing.html',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS platform.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: true,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://seranking.com/terms.html'
    },
    businessFit: {
      businessTypes: ['small_agency', 'solo_founder', 'growing_agency', 'creator_media'],
      teamSizeMin: 1,
      teamSizeMax: 50,
      technicalSkillRequired: 'low',
      bestFor: 'Agencies and site owners wanting an accurate, affordable all-in-one SEO suite covering daily rank tracking, backlink audits, and white-label client reports at half the price of Ahrefs or Semrush.',
      notRecommendedFor: 'Enterprise data scientists needing unlimited raw API scraping without rate limits.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['google-analytics', 'google-search-console', 'zapier'],
      apiAvailable: true,
      webhooksAvailable: false,
      automationPlatforms: ['zapier', 'make']
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'excel', 'pdf'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'SE Ranking Official Pricing', url: 'https://seranking.com/pricing.html', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'moz-pro',
    name: 'Moz Pro',
    vendor: 'SEOMoz, Inc. (Ziff Davis)',
    website: 'https://moz.com',
    category: 'seo-analytics',
    primaryCapability: 'SEO',
    secondaryCapabilities: [],
    featureTags: ['keyword_rank_tracking', 'backlink_analysis', 'technical_site_audit', 'serp_competitor_research'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FLAT_MONTHLY,
      freePlanAvailable: false,
      freeTrialAvailable: true,
      freeTierLimits: '30-day free trial; no permanent free tier.',
      baseMonthlyPriceUsd: 99,
      pricePerSeatMonthlyUsd: 0,
      minimumSeats: 1,
      annualDiscountPercent: 20,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Standard plan is $99/month ($79/mo billed annually) for 300 keyword tracking rankings and 1 user seat. Medium is $179/month ($143/mo annually) for 1,500 keywords and 2 user seats. Premium is $299/mo.',
      pricingSourceUrl: 'https://moz.com/products/pro/pricing',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: false,
      softwareLicenseCostMonthly: null,
      minServerSpecs: null,
      estimatedServerCostMonthlyRange: null,
      maintenanceBurden: 'NOT_APPLICABLE',
      tcoNotes: 'Cloud SaaS platform.'
    },
    deployment: {
      cloudAvailable: true,
      selfHostedAvailable: false,
      desktopAvailable: false,
      mobileAvailable: false,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://moz.com/terms-of-use'
    },
    businessFit: {
      businessTypes: ['small_agency', 'growing_agency'],
      teamSizeMin: 1,
      teamSizeMax: 30,
      technicalSkillRequired: 'low',
      bestFor: 'SEO consultants relying on historical Domain Authority (DA) metrics and Keyword Difficulty indexes.',
      notRecommendedFor: 'High-frequency daily rank tracking where SE Ranking provides 2.5x more keywords per dollar.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['google-analytics'],
      apiAvailable: true,
      webhooksAvailable: false,
      automationPlatforms: []
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'pdf'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Moz Pro Official Pricing', url: 'https://moz.com/products/pro/pricing', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  },
  {
    toolId: 'screaming-frog-seo-spider',
    name: 'Screaming Frog SEO Spider',
    vendor: 'Screaming Frog Ltd',
    website: 'https://www.screamingfrog.co.uk/seo-spider/',
    category: 'seo-analytics',
    primaryCapability: 'SEO',
    secondaryCapabilities: [],
    featureTags: ['technical_site_audit'],
    commercialModel: {
      pricingModel: PRICING_MODELS.FLAT_MONTHLY,
      freePlanAvailable: true,
      freeTrialAvailable: false,
      freeTierLimits: 'Free edition is limited to 500 URLs per site crawl. Custom extraction, JavaScript rendering, and Google Search Console integration locked.',
      baseMonthlyPriceUsd: 21.58, // £209/year = ~$259 USD/year = ~$21.58/mo
      pricePerSeatMonthlyUsd: 21.58,
      minimumSeats: 1,
      annualDiscountPercent: 0,
      transactionFeePercent: 0,
      transactionFeeFixedUsd: 0,
      costConfidence: COST_CONFIDENCE.HIGH,
      pricingNotes: 'Free edition crawls up to 500 URLs per audit. Paid annual license is £209/year (~$259 USD/year, or ~$21.58/mo equivalent) for unlimited URL desktop site crawls, JavaScript rendering, and custom extraction.',
      pricingSourceUrl: 'https://www.screamingfrog.co.uk/seo-spider/pricing/',
      pricingVerifiedAt: '2026-08-31T20:00:00Z'
    },
    selfHostModel: {
      supported: true,
      softwareLicenseCostMonthly: 21.58,
      minServerSpecs: 'Runs on local desktop machine (macOS / Windows / Linux with 4GB+ RAM)',
      estimatedServerCostMonthlyRange: { minUsd: 0, maxUsd: 0 },
      maintenanceBurden: 'LOW',
      tcoNotes: 'Desktop software executed locally on user machine; requires zero cloud server infrastructure.'
    },
    deployment: {
      cloudAvailable: false,
      selfHostedAvailable: true,
      desktopAvailable: true,
      mobileAvailable: false,
      dockerAvailable: false,
      kubernetesAvailable: false,
      deploymentComplexity: 'none'
    },
    licensing: {
      openSource: false,
      licenseType: LICENSE_TYPES.PROPRIETARY_SAAS,
      commercialUseAllowed: true,
      licenseSourceUrl: 'https://www.screamingfrog.co.uk/seo-spider/terms-of-use/'
    },
    businessFit: {
      businessTypes: ['small_agency', 'growing_agency', 'technical_founder_oss', 'solo_freelancer'],
      teamSizeMin: 1,
      teamSizeMax: 100,
      technicalSkillRequired: 'moderate',
      bestFor: 'Technical SEO specialists, web developers, and agencies needing deep local desktop website crawls, canonical audit verification, redirect chain detection, and broken link analysis.',
      notRecommendedFor: 'Users wanting cloud automated scheduled ranking trackers.',
      evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
    },
    integrations: {
      nativeIntegrations: ['google-analytics', 'google-search-console'],
      apiAvailable: true,
      webhooksAvailable: false,
      automationPlatforms: []
    },
    dataAndPortability: {
      dataExportAvailable: true,
      exportFormats: ['csv', 'excel', 'json'],
      migrationDifficulty: 'low',
      vendorLockInRisk: 'low'
    },
    sources: [
      { title: 'Screaming Frog Official Pricing', url: 'https://www.screamingfrog.co.uk/seo-spider/pricing/', type: 'Official Pricing Page', checkedAt: '2026-08-31', confidence: 'HIGH' }
    ]
  }
];

export function getSeedToolById(id) {
  return seedSoftwareTools.find(t => t.toolId === id) || null;
}

export function getAllSeedTools() {
  return seedSoftwareTools;
}
