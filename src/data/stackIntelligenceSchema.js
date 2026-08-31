/**
 * StakDock 2.0: Stack Intelligence Schema V1.1 (Adversarial Hardened)
 *
 * Defines the normalized schema, capability taxonomy, pricing models,
 * deployment flags, integration types, license types, and business profiles required
 * for the StakDock Stack Intelligence Engine and Stack Builder.
 *
 * GOVERNANCE RULES:
 * - 3-State / Multi-state handling: Unknown is distinct from False/Negative.
 * - Software License Cost is strictly decoupled from Infrastructure Operating Cost.
 * - Evidence Classification distinguishes Vendor Source Facts from Editorial Analysis.
 */

export const PRICING_MODELS = {
  FLAT_MONTHLY: 'FLAT_MONTHLY',
  PER_SEAT_MONTHLY: 'PER_SEAT_MONTHLY',
  USAGE_BASED: 'USAGE_BASED',
  FREE_FOREVER: 'FREE_FOREVER',
  FREEMIUM: 'FREEMIUM',
  ONE_TIME_LTD: 'ONE_TIME_LTD',
  OPEN_SOURCE_FREE: 'OPEN_SOURCE_FREE',
  ENTERPRISE_CUSTOM: 'ENTERPRISE_CUSTOM'
};

export const COST_CONFIDENCE = {
  HIGH: 'HIGH',         // Explicit published numeric price verified via official pricing page
  MEDIUM: 'MEDIUM',     // Published base price + variable tier/usage thresholds
  VARIABLE: 'VARIABLE', // Open-source self-hosted: software $0, server/infrastructure cost applies
  UNKNOWN: 'UNKNOWN'     // Contact Sales / Custom Quote
};

export const DEPLOYMENT_MODELS = {
  CLOUD_SAAS: 'CLOUD_SAAS',
  SELF_HOSTED_DOCKER: 'SELF_HOSTED_DOCKER',
  SELF_HOSTED_K8S: 'SELF_HOSTED_K8S',
  DESKTOP_NATIVE: 'DESKTOP_NATIVE',
  WORDPRESS_PLUGIN: 'WORDPRESS_PLUGIN',
  BROWSER_EXTENSION: 'BROWSER_EXTENSION',
  CLI_NPM: 'CLI_NPM'
};

export const LICENSE_TYPES = {
  PROPRIETARY_SAAS: 'PROPRIETARY_SAAS',
  AGPL_V3: 'AGPL_V3',
  MIT: 'MIT',
  APACHE_2_0: 'APACHE_2_0',
  GPL_V3: 'GPL_V3',
  BSL_FAIR_CODE: 'BSL_FAIR_CODE',
  ELASTIC_2_0: 'ELASTIC_2_0',
  POSTGRESQL_LICENSE: 'POSTGRESQL_LICENSE'
};

export const INTEGRATION_STATUS = {
  NATIVE_VERIFIED: 'NATIVE_VERIFIED',                     // First-party native plugin/integration verified in docs
  AUTOMATION_BRIDGE_VERIFIED: 'AUTOMATION_BRIDGE_VERIFIED', // Verified connector via n8n, Make, or Zapier
  API_COMPATIBLE: 'API_COMPATIBLE',                       // Public REST/GraphQL APIs documented on both ends
  CUSTOM_INTEGRATION_REQUIRED: 'CUSTOM_INTEGRATION_REQUIRED', // API exists but requires webhook/middleware development
  NO_INTEGRATION_VERIFIED: 'NO_INTEGRATION_VERIFIED',     // Explicitly known to lack interoperability
  UNKNOWN: 'UNKNOWN'                                       // Unverified integration status
};

export const OVERLAP_LEVELS = {
  HIGH_OVERLAP: 'HIGH_OVERLAP',           // Core capabilities heavily duplicate (paying for both is usually wasteful)
  MODERATE_OVERLAP: 'MODERATE_OVERLAP',   // Shared secondary features (may be justified by specific workflow needs)
  LOW_OVERLAP: 'LOW_OVERLAP',             // Minor auxiliary overlap
  COMPLEMENTARY: 'COMPLEMENTARY',         // Distinct capabilities that integrate naturally
  UNKNOWN: 'UNKNOWN'
};

export const EVIDENCE_CLASSIFICATION = {
  SOURCE_FACT: 'SOURCE_FACT',                             // Verifiable from official vendor docs/pricing
  STAKDOCK_EDITORIAL_CLASSIFICATION: 'STAKDOCK_EDITORIAL', // StakDock expert analysis/recommendation heuristic
  ENGINE_DERIVED: 'ENGINE_DERIVED',                       // Computed algorithmically by Stack Intelligence engine
  UNKNOWN: 'UNKNOWN'
};

export const FRESHNESS_CLASSES = {
  VERY_VOLATILE: 'VERY_VOLATILE',   // Pricing, promotional tiers, limits, transaction fees (Review: 30 days)
  VOLATILE: 'VOLATILE',             // Features, free plan quotas, native integrations (Review: 90 days)
  MODERATE: 'MODERATE',             // Deployment methods, API architecture (Review: 180 days)
  LOW_VOLATILITY: 'LOW_VOLATILITY'  // License type, legal entity, foundational tech (Review: 365 days)
};

export const BUSINESS_PROFILES = {
  SOLO_FREELANCER: {
    id: 'solo_freelancer',
    label: 'Solo Freelancer',
    defaultTeamSize: 1,
    budgetGuidance: 50,
    priorityNeeds: ['INVOICING', 'PROJECT_MANAGEMENT', 'EMAIL_MARKETING'],
    evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
  },
  SOLO_FOUNDER: {
    id: 'solo_founder',
    label: 'Solo Founder / Bootstrapper',
    defaultTeamSize: 1,
    budgetGuidance: 100,
    priorityNeeds: ['CRM', 'AUTOMATION', 'HOSTING', 'PAYMENTS', 'ANALYTICS'],
    evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
  },
  SMALL_AGENCY: {
    id: 'small_agency',
    label: 'Small Agency (2–10 team)',
    defaultTeamSize: 5,
    budgetGuidance: 150,
    priorityNeeds: ['CRM', 'PROJECT_MANAGEMENT', 'INVOICING', 'AUTOMATION', 'EMAIL_MARKETING'],
    evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
  },
  GROWING_AGENCY: {
    id: 'growing_agency',
    label: 'Growing Agency (11–50 team)',
    defaultTeamSize: 20,
    budgetGuidance: 500,
    priorityNeeds: ['CRM', 'PROJECT_MANAGEMENT', 'INVOICING', 'HELP_DESK', 'AUTOMATION'],
    evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
  },
  SAAS_STARTUP: {
    id: 'saas_startup',
    label: 'SaaS Startup',
    defaultTeamSize: 3,
    budgetGuidance: 250,
    priorityNeeds: ['HOSTING', 'DATABASE', 'AUTH', 'ANALYTICS', 'HELP_DESK', 'EMAIL_MARKETING'],
    evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
  },
  CREATOR_MEDIA: {
    id: 'creator_media',
    label: 'Creator / Media Brand',
    defaultTeamSize: 2,
    budgetGuidance: 75,
    priorityNeeds: ['EMAIL_MARKETING', 'WEBSITE_CMS', 'PAYMENTS', 'ANALYTICS'],
    evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
  },
  TECHNICAL_FOUNDER_OSS: {
    id: 'technical_founder_oss',
    label: 'Technical Founder (Self-Hosted / OSS Preference)',
    defaultTeamSize: 2,
    budgetGuidance: 100,
    priorityNeeds: ['CRM', 'AUTOMATION', 'ANALYTICS', 'INVOICING', 'DATABASE'],
    evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
  },
  LOCAL_BUSINESS: {
    id: 'local_business',
    label: 'Local & Service Business',
    defaultTeamSize: 3,
    budgetGuidance: 100,
    priorityNeeds: ['CRM', 'INVOICING', 'WEBSITE_CMS', 'SCHEDULING', 'HELP_DESK'],
    evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
  },
  ECOMMERCE_BRAND: {
    id: 'ecommerce_brand',
    label: 'E-Commerce / Online Store',
    defaultTeamSize: 3,
    budgetGuidance: 150,
    priorityNeeds: ['ECOMMERCE', 'PAYMENTS', 'EMAIL_MARKETING', 'HELP_DESK', 'ANALYTICS'],
    evidenceType: EVIDENCE_CLASSIFICATION.STAKDOCK_EDITORIAL_CLASSIFICATION
  }
};

/**
 * Normalized Capability Taxonomy
 * Structured hierarchically to power capability filtering and granular overlap detection.
 */
export const CAPABILITY_TAXONOMY = {
  CRM: {
    label: 'CRM & Pipeline Management',
    subCapabilities: ['contact_management', 'sales_pipelines', 'lead_scoring', 'deal_tracking', 'email_sync', 'custom_properties']
  },
  INVOICING: {
    label: 'Invoicing & Billing',
    subCapabilities: ['invoice_generation', 'client_portal', 'online_payments', 'recurring_billing', 'multi_currency', 'quotes_estimates']
  },
  ACCOUNTING: {
    label: 'Accounting & Bookkeeping',
    subCapabilities: ['general_ledger', 'bank_feed_reconciliation', 'chart_of_accounts', 'tax_reporting', 'financial_statements', 'accounts_payable']
  },
  PROJECT_MANAGEMENT: {
    label: 'Project & Task Management',
    subCapabilities: ['task_tracking', 'kanban_boards', 'sprint_planning', 'gantt_timeline', 'document_docs', 'relational_databases']
  },
  EMAIL_MARKETING: {
    label: 'Email Marketing & Newsletters',
    subCapabilities: ['broadcast_newsletters', 'drip_automations', 'subscriber_segmentation', 'signup_forms', 'landing_pages', 'transactional_api']
  },
  AUTOMATION: {
    label: 'Workflow Automation & iPaaS',
    subCapabilities: ['visual_flow_builder', 'webhook_triggers', 'multi_step_branching', 'code_step_execution', 'scheduled_jobs', 'api_connectors']
  },
  DEVELOPMENT_AI: {
    label: 'AI Coding & Development',
    subCapabilities: ['ai_code_generation', 'context_aware_chat', 'terminal_integration', 'git_diff_review', 'codebase_indexing']
  },
  HOSTING: {
    label: 'Cloud Hosting & Infrastructure',
    subCapabilities: ['vps_compute', 'managed_kubernetes', 'container_deployment', 'serverless_functions', 'static_edge_hosting', 'cdn_ssl']
  },
  DATABASE: {
    label: 'Database & Search Backend',
    subCapabilities: ['relational_postgres', 'fulltext_search', 'document_nosql', 'realtime_subscriptions', 'vector_embeddings', 'automated_backups']
  },
  AUTH: {
    label: 'Authentication & User Management',
    subCapabilities: ['social_login', 'mfa_security', 'jwt_session_management', 'user_roles_rbac', 'organization_tenancy', 'passwordless']
  },
  ANALYTICS: {
    label: 'Analytics & Product Intelligence',
    subCapabilities: ['event_tracking', 'pageview_analytics', 'funnel_analysis', 'session_recordings', 'feature_flags', 'privacy_cookieless']
  },
  HELP_DESK: {
    label: 'Customer Support & Help Desk',
    subCapabilities: ['live_chat_widget', 'shared_team_inbox', 'knowledge_base', 'ticket_management', 'omnichannel_messaging', 'sla_rules']
  },
  PAYMENTS: {
    label: 'Payment Processing & Gateways',
    subCapabilities: ['credit_card_processing', 'ach_direct_debit', 'global_currencies', 'checkout_pages', 'subscription_metering', 'fraud_prevention']
  },
  SEO: {
    label: 'SEO & Search Intelligence',
    subCapabilities: ['keyword_rank_tracking', 'backlink_analysis', 'technical_site_audit', 'serp_competitor_research', 'content_optimization']
  },
  SCHEDULING: {
    label: 'Calendar & Meeting Scheduling',
    subCapabilities: ['booking_links', 'calendar_sync', 'round_robin_assignment', 'automated_reminders', 'paid_appointments']
  },
  WEBSITE_CMS: {
    label: 'Website Builder & CMS',
    subCapabilities: ['visual_page_builder', 'headless_api_cms', 'blog_publishing', 'custom_domains', 'seo_metadata_control']
  },
  ECOMMERCE: {
    label: 'E-Commerce & Storefront',
    subCapabilities: ['online_storefront', 'product_catalog', 'inventory_tracking', 'checkout_cart', 'shipping_fulfillment', 'order_management']
  },
  FORMS_SURVEYS: {
    label: 'Forms & Survey Builder',
    subCapabilities: ['form_builder', 'conditional_logic', 'file_upload_fields', 'survey_scoring', 'webhook_dispatch', 'embed_widgets']
  },
  E_SIGNATURES: {
    label: 'E-Signatures & Document Workflow',
    subCapabilities: ['contract_signing', 'audit_trail', 'reusable_templates', 'multi_signer_flow', 'legally_binding_compliance']
  },
  MONITORING_DEVOPS: {
    label: 'Error Tracking & System APM',
    subCapabilities: ['exception_tracking', 'performance_apm', 'uptime_alerts', 'log_aggregation', 'release_health_metrics']
  }
};
