/**
 * StakDock 2.0: Stack Intelligence Schema V1
 *
 * Defines the normalized schema, capability taxonomy, pricing models,
 * deployment flags, integration types, and business profiles required
 * for the StakDock Stack Intelligence Engine and Stack Builder.
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
  HIGH: 'HIGH',       // Explicit published numeric price verified via official pricing page
  MEDIUM: 'MEDIUM',   // Published base price + variable tier/usage thresholds
  VARIABLE: 'VARIABLE', // Open-source self-hosted: software $0, but server/infrastructure cost applies
  UNKNOWN: 'UNKNOWN'   // Contact Sales / Quote required
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
  ELASTIC_2_0: 'ELASTIC_2_0'
};

export const INTEGRATION_STATUS = {
  NATIVE: 'NATIVE',                     // First-party native plugin/integration documented
  API_COMPATIBLE: 'API_COMPATIBLE',     // Documented REST / GraphQL / gRPC API available
  WEBHOOK_COMPATIBLE: 'WEBHOOK_COMPATIBLE', // Inbound / Outbound webhooks supported
  AUTOMATION_BRIDGE: 'AUTOMATION_BRIDGE',   // Connects via n8n, Make, or Zapier
  NO_KNOWN_INTEGRATION: 'NO_KNOWN_INTEGRATION',
  UNKNOWN: 'UNKNOWN'
};

export const OVERLAP_LEVELS = {
  PRIMARY_OVERLAP: 'PRIMARY_OVERLAP',     // Core capability is identical (paying for both is wasteful)
  PARTIAL_OVERLAP: 'PARTIAL_OVERLAP',     // Secondary features overlap (may be justified by workflow)
  COMPLEMENTARY: 'COMPLEMENTARY',         // Distinct capabilities that integrate naturally
  NO_OVERLAP: 'NO_OVERLAP'
};

export const BUSINESS_PROFILES = {
  SOLO_FREELANCER: {
    id: 'solo_freelancer',
    label: 'Solo Freelancer',
    defaultTeamSize: 1,
    budgetGuidance: 50,
    priorityNeeds: ['INVOICING', 'PROJECT_MANAGEMENT', 'EMAIL_MARKETING']
  },
  SOLO_FOUNDER: {
    id: 'solo_founder',
    label: 'Solo Founder / Bootstrapper',
    defaultTeamSize: 1,
    budgetGuidance: 100,
    priorityNeeds: ['CRM', 'AUTOMATION', 'HOSTING', 'PAYMENTS', 'ANALYTICS']
  },
  SMALL_AGENCY: {
    id: 'small_agency',
    label: 'Small Agency (2–10 team)',
    defaultTeamSize: 5,
    budgetGuidance: 150,
    priorityNeeds: ['CRM', 'PROJECT_MANAGEMENT', 'INVOICING', 'AUTOMATION', 'EMAIL_MARKETING']
  },
  GROWING_AGENCY: {
    id: 'growing_agency',
    label: 'Growing Agency (11–50 team)',
    defaultTeamSize: 20,
    budgetGuidance: 500,
    priorityNeeds: ['CRM', 'PROJECT_MANAGEMENT', 'INVOICING', 'HELP_DESK', 'AUTOMATION']
  },
  SAAS_STARTUP: {
    id: 'saas_startup',
    label: 'SaaS Startup',
    defaultTeamSize: 3,
    budgetGuidance: 250,
    priorityNeeds: ['HOSTING', 'DATABASE', 'AUTH', 'ANALYTICS', 'HELP_DESK', 'EMAIL_MARKETING']
  },
  CREATOR_MEDIA: {
    id: 'creator_media',
    label: 'Creator / Media Brand',
    defaultTeamSize: 2,
    budgetGuidance: 75,
    priorityNeeds: ['EMAIL_MARKETING', 'WEBSITE_CMS', 'PAYMENTS', 'ANALYTICS']
  },
  TECHNICAL_FOUNDER_OSS: {
    id: 'technical_founder_oss',
    label: 'Technical Founder (Self-Hosted / OSS Preference)',
    defaultTeamSize: 2,
    budgetGuidance: 100,
    priorityNeeds: ['CRM', 'AUTOMATION', 'ANALYTICS', 'INVOICING', 'DATABASE']
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
  }
};
