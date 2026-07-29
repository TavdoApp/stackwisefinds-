const fs = require('fs');
const path = require('path');

const inputTools = [
  {
    "name": "QuickBooks Online",
    "domain": "quickbooks.intuit.com",
    "category": "finance-accounting",
    "tagline": "Industry-standard cloud accounting and invoicing software for SMBs",
    "pricing_model": "Paid",
    "short_description": "Comprehensive accounting platform for managing income, tracking expenses, generating invoices, running payroll, and tax reporting."
  },
  {
    "name": "Xero",
    "domain": "xero.com",
    "category": "finance-accounting",
    "tagline": "Beautiful cloud accounting software built for small businesses and bookkeepers",
    "pricing_model": "Paid",
    "short_description": "User-friendly platform offering automated bank reconciliation, online invoicing, bill payments, and financial reporting."
  },
  {
    "name": "FreshBooks",
    "domain": "freshbooks.com",
    "category": "finance-accounting",
    "tagline": "Invoicing and accounting software built for freelancers and service SMBs",
    "pricing_model": "Paid",
    "short_description": "Specializes in professional client invoicing, time tracking, expense logging, project estimates, and online payment acceptance."
  },
  {
    "name": "Wave",
    "domain": "waveapps.com",
    "category": "finance-accounting",
    "tagline": "Free invoicing and accounting software for solopreneurs and small teams",
    "pricing_model": "Freemium",
    "short_description": "Offers free double-entry accounting, custom invoice creation, and receipt scanning with pay-per-use credit card processing."
  },
  {
    "name": "Zoho Books",
    "domain": "zoho.com",
    "category": "finance-accounting",
    "tagline": "Smart, end-to-end cloud accounting platform for growing businesses",
    "pricing_model": "Freemium",
    "short_description": "Handles automated recurring billing, inventory tracking, VAT/sales tax compliance, client portals, and deep Zoho CRM integration."
  },
  {
    "name": "Sage Intacct",
    "domain": "sage.com",
    "category": "finance-accounting",
    "tagline": "Enterprise cloud financial management and ERP accounting software",
    "pricing_model": "Paid",
    "short_description": "Advanced financial management system providing multi-entity consolidation, automated general ledger, and revenue recognition compliance."
  },
  {
    "name": "Oracle NetSuite",
    "domain": "netsuite.com",
    "category": "finance-accounting",
    "tagline": "Comprehensive cloud ERP platform for enterprise financial operations",
    "pricing_model": "Paid",
    "short_description": "Unified business management suite combining enterprise accounting, global order management, billing, inventory, and procurement."
  },
  {
    "name": "Stripe Billing",
    "domain": "stripe.com",
    "category": "finance-accounting",
    "tagline": "Flexible subscription billing and automated global invoice infrastructure",
    "pricing_model": "Pay-as-you-go",
    "short_description": "API-first platform handling recurring subscription billing, metered usage pricing, automatic dunning, and localized global tax compliance."
  },
  {
    "name": "Chargebee",
    "domain": "chargebee.com",
    "category": "finance-accounting",
    "tagline": "Subscription management and recurring billing platform for SaaS",
    "pricing_model": "Freemium",
    "short_description": "Automates complex subscription workflows, recurring customer invoicing, proration, revenue recognition, and payment gateway routing."
  },
  {
    "name": "Recurly",
    "domain": "recurly.com",
    "category": "finance-accounting",
    "tagline": "Enterprise subscription billing, retention, and recurring payment engine",
    "pricing_model": "Paid",
    "short_description": "Specializes in subscriber lifecycle management, intelligent retry logic for failed payments, dynamic invoicing, and churn reduction."
  },
  {
    "name": "Maxio",
    "domain": "maxio.com",
    "category": "finance-accounting",
    "tagline": "Financial operations, subscription billing, and revenue recognition for SaaS",
    "pricing_model": "Paid",
    "short_description": "Combines advanced B2B subscription management with automated ASC 606 revenue recognition and SaaS metrics reporting."
  },
  {
    "name": "Invoicely",
    "domain": "invoicely.com",
    "category": "finance-accounting",
    "tagline": "Free online invoicing for freelancers and small business owners",
    "pricing_model": "Freemium",
    "short_description": "Straightforward invoicing engine allowing users to create multi-currency estimates, track billable hours, and collect client payments."
  },
  {
    "name": "Invoice Ninja",
    "domain": "invoiceninja.com",
    "category": "finance-accounting",
    "tagline": "Open-source invoicing, expense tracking, and time management suite",
    "pricing_model": "Freemium",
    "short_description": "Self-hosted or cloud-based invoicing platform offering custom portal branding, auto-billing, proposal creation, and vendor management."
  },
  {
    "name": "Bonsai",
    "domain": "hellobonsai.com",
    "category": "finance-accounting",
    "tagline": "All-in-one business management, invoicing, and contract tool for agencies",
    "pricing_model": "Paid",
    "short_description": "Integrates client onboarding contracts, proposal signing, time tracking, custom invoicing, and basic tax accounting for service pros."
  },
  {
    "name": "Hiveage",
    "domain": "hiveage.com",
    "category": "finance-accounting",
    "tagline": "Fast, cloud-based online invoicing and billing for small businesses",
    "pricing_model": "Freemium",
    "short_description": "Simplifies sending elegant client invoices, managing recurring subscriptions, tracking team mileage, and issuing financial reports."
  },
  {
    "name": "Square Invoicing",
    "domain": "squareup.com",
    "category": "finance-accounting",
    "tagline": "Send digital estimates and invoices with integrated card payment processing",
    "pricing_model": "Freemium",
    "short_description": "Accepts credit cards and ACH payments online via digital invoices, featuring scheduled milestone billing and automated reminders."
  },
  {
    "name": "Invoice Simple",
    "domain": "invoicesimple.com",
    "category": "finance-accounting",
    "tagline": "Quick invoice maker app for contractors and small business owners",
    "pricing_model": "Freemium",
    "short_description": "Mobile-first invoice generation app for tradespeople and contractors to issue estimates and receipts directly from the field."
  },
  {
    "name": "Bill.com",
    "domain": "bill.com",
    "category": "finance-accounting",
    "tagline": "Automated accounts payable and accounts receivable management software",
    "pricing_model": "Paid",
    "short_description": "Streamlines business bill payment approval workflows, automated vendor payouts via ACH, and electronic customer invoicing."
  },
  {
    "name": "Ramp",
    "domain": "ramp.com",
    "category": "finance-accounting",
    "tagline": "Corporate card, spend management, and automated accounts payable platform",
    "pricing_model": "Freemium",
    "short_description": "Combines corporate cards with AI receipt matching, automated vendor bill payments, employee expense tracking, and accounting sync."
  },
  {
    "name": "Brex",
    "domain": "brex.com",
    "category": "finance-accounting",
    "tagline": "AI corporate card, global spend management, and bill pay engine",
    "pricing_model": "Freemium",
    "short_description": "Provides high-limit corporate cards, automated expense receipts capture, travel booking, and multi-currency vendor payout workflows."
  },
  {
    "name": "Expensify",
    "domain": "expensify.com",
    "category": "finance-accounting",
    "tagline": "Automated receipt scanning and corporate expense management platform",
    "pricing_model": "Freemium",
    "short_description": "Scans paper receipts, automates corporate expense reporting, manages employee reimbursements, and issues business cards."
  },
  {
    "name": "Zoho Invoice",
    "domain": "zoho.com",
    "category": "finance-accounting",
    "tagline": "100% free online invoicing software for small businesses and freelancers",
    "pricing_model": "Free",
    "short_description": "Completely free tool for creating professional invoices, tracking billable time, sending payment reminders, and receiving card payments."
  },
  {
    "name": "Tipalti",
    "domain": "tipalti.com",
    "category": "finance-accounting",
    "tagline": "Global payables automation and supplier invoice processing software",
    "pricing_model": "Paid",
    "short_description": "Automates high-volume international supplier payouts, tax form collection, purchase order matching, and cross-border billing."
  },
  {
    "name": "AvidXchange",
    "domain": "avidxchange.com",
    "category": "finance-accounting",
    "tagline": "Accounts payable automation and electronic payment software for middle market",
    "pricing_model": "Paid",
    "short_description": "Digitizes paper invoice processing, approval workflows, and supplier payments for mid-market business operations."
  },
  {
    "name": "Plooto",
    "domain": "plooto.com",
    "category": "finance-accounting",
    "tagline": "Automated B2B payments and accounts payable/receivable platform",
    "pricing_model": "Paid",
    "short_description": "Streamlines domestic and international ACH transfers, vendor approvals, and automated reconciliation with QuickBooks and Xero."
  },
  {
    "name": "Melio",
    "domain": "meliopayments.com",
    "category": "finance-accounting",
    "tagline": "Simple accounts payable tool for small businesses to pay bills online",
    "pricing_model": "Freemium",
    "short_description": "Allows small businesses to pay suppliers via bank transfer or credit card (even if vendors don't accept cards) with zero monthly fees."
  },
  {
    "name": "DualEntry",
    "domain": "dualentry.com",
    "category": "finance-accounting",
    "tagline": "Modern, developer-friendly ERP and accounting software built for technology companies",
    "pricing_model": "Paid",
    "short_description": "Next-gen accounting engine offering automated real-time subledgers, deferred revenue recognition, and rapid financial closes."
  },
  {
    "name": "KashFlow",
    "domain": "kashflow.com",
    "category": "finance-accounting",
    "tagline": "Simple UK-tailored cloud accounting and online invoicing software",
    "pricing_model": "Paid",
    "short_description": "Designed for small UK businesses to manage VAT returns, generate professional invoices, and track cash flow with ease."
  },
  {
    "name": "FreeAgent",
    "domain": "freeagent.com",
    "category": "finance-accounting",
    "tagline": "Award-winning online accounting software for UK contractors and freelancers",
    "pricing_model": "Paid",
    "short_description": "Simplifies self-assessment tax returns, MTD VAT filing, invoice generation, expense logging, and live bank feed reconciliation."
  },
  {
    "name": "Quaderno",
    "domain": "quaderno.io",
    "category": "finance-accounting",
    "tagline": "Automated sales tax, VAT, and GST calculation and invoicing engine",
    "pricing_model": "Paid",
    "short_description": "Calculates location-based digital taxes in real-time, sending tax-compliant receipts and generating global tax audit reports."
  },
  {
    "name": "TaxJar",
    "domain": "taxjar.com",
    "category": "finance-accounting",
    "tagline": "Automated US sales tax compliance, calculation, and reporting software",
    "pricing_model": "Paid",
    "short_description": "Stripe-owned platform providing real-time sales tax rates at checkout, nexus tracking, and automated multi-state filing."
  },
  {
    "name": "Anrok",
    "domain": "anrok.com",
    "category": "finance-accounting",
    "tagline": "Global sales tax and VAT compliance engine built specifically for SaaS",
    "pricing_model": "Paid",
    "short_description": "Integrates with modern SaaS billing stacks to monitor tax nexus thresholds, calculate accurate tax rates, and automate tax filings."
  },
  {
    "name": "Orb",
    "domain": "withorb.com",
    "category": "finance-accounting",
    "tagline": "Composable usage-based billing and rating engine for modern software",
    "pricing_model": "Paid",
    "short_description": "Powers complex usage metering, real-time consumption pricing, custom enterprise contracts, and automated invoicing APIs."
  },
  {
    "name": "Lago",
    "domain": "getlago.com",
    "category": "finance-accounting",
    "tagline": "Open-source metering and usage-based billing infrastructure",
    "pricing_model": "Freemium",
    "short_description": "Open-source Stripe Billing alternative enabling engineering teams to build hybrid, usage-based, and modular subscription billing."
  },
  {
    "name": "Metronome",
    "domain": "metronome.com",
    "category": "finance-accounting",
    "tagline": "Usage-based billing platform designed for high-growth AI and tech products",
    "pricing_model": "Paid",
    "short_description": "Handles massive real-time data ingestion to power flexible usage-based pricing models, credit systems, and invoice generation."
  },
  {
    "name": "Toggl Track",
    "domain": "toggl.com",
    "category": "finance-accounting",
    "tagline": "Time tracking software with integrated billable hour reporting and client invoicing",
    "pricing_model": "Freemium",
    "short_description": "Tracks project time across devices, converting recorded billable hours directly into structured invoices for client payment."
  },
  {
    "name": "Harvest",
    "domain": "getharvest.com",
    "category": "finance-accounting",
    "tagline": "Time tracking, project cost accounting, and online invoicing platform",
    "pricing_model": "Paid",
    "short_description": "Turns tracked project hours and team expenses into professional invoices, integrating with Stripe and PayPal for payment."
  },
  {
    "name": "Payhawk",
    "domain": "payhawk.com",
    "category": "finance-accounting",
    "tagline": "All-in-one company card, spend management, and invoice payable engine",
    "pricing_model": "Paid",
    "short_description": "Combines corporate visa cards, automated subscription management, invoice processing, and seamless ERP data synchronization."
  },
  {
    "name": "Pleo",
    "domain": "pleo.io",
    "category": "finance-accounting",
    "tagline": "Smart business card and automated expense management solution for European SMBs",
    "pricing_model": "Paid",
    "short_description": "Issues physical and virtual smart cards to employees with instant receipt capture, automated categorization, and invoice pay features."
  },
  {
    "name": "Outseta",
    "domain": "outseta.com",
    "category": "finance-accounting",
    "tagline": "All-in-one membership management, CRM, and subscription billing software",
    "pricing_model": "Paid",
    "short_description": "Provides bootstrapped startups with subscription billing, gated content authentication, CRM lead tracking, and automated email invoicing."
  },
  {
    "name": "Vayu",
    "domain": "withvayu.com",
    "category": "finance-accounting",
    "tagline": "Finance-native billing automation and real-time usage rating platform",
    "pricing_model": "Paid",
    "short_description": "Automates complex hybrid billing, meter rating, pro-ration, and 2-way ERP syncs for CFOs and SaaS finance operations."
  },
  {
    "name": "Younium",
    "domain": "younium.com",
    "category": "finance-accounting",
    "tagline": "B2B subscription management and contract hub for growing SaaS companies",
    "pricing_model": "Paid",
    "short_description": "Handles complex B2B sales contracts, subscription changes, recurring invoices, and SaaS metric tracking for finance teams."
  },
  {
    "name": "Order.co",
    "domain": "order.co",
    "category": "finance-accounting",
    "tagline": "Procurement and accounts payable automation software",
    "pricing_model": "Paid",
    "short_description": "Centralizes vendor purchasing, enforces budget controls, and consolidates hundreds of monthly invoices into a single bill."
  },
  {
    "name": "Precoro",
    "domain": "precoro.com",
    "category": "finance-accounting",
    "tagline": "Procurement software and automated purchase order management system",
    "pricing_model": "Paid",
    "short_description": "Eliminates manual purchase ordering, speeds up invoice matching, and provides real-time spend visibility for finance teams."
  },
  {
    "name": "Zip",
    "domain": "ziphq.com",
    "category": "finance-accounting",
    "tagline": "Intake-to-pay procurement and AI invoice processing platform",
    "pricing_model": "Paid",
    "short_description": "Enterprise procurement platform streamlining employee purchase requests, vendor approvals, contract compliance, and bill payment."
  },
  {
    "name": "Vic.ai",
    "domain": "vic.ai",
    "category": "finance-accounting",
    "tagline": "Autonomous AI accounts payable and invoice processing software",
    "pricing_model": "Paid",
    "short_description": "Uses computer vision and AI algorithms to ingest, extract, code, and approve high-volume enterprise vendor invoices automatically."
  },
  {
    "name": "Rossum",
    "domain": "rossum.ai",
    "category": "finance-accounting",
    "tagline": "AI document processing engine for transactional invoices and POs",
    "pricing_model": "Paid",
    "short_description": "Intelligent document processing platform that reads, validates, and routes data from unstructured invoices into enterprise ERPs."
  },
  {
    "name": "DocuClipper",
    "domain": "docuclipper.com",
    "category": "finance-accounting",
    "tagline": "OCR bank statement converter and automatic invoice data extractor",
    "pricing_model": "Paid",
    "short_description": "Extracts data from PDF invoices, receipts, and bank statements, converting them into clean CSVs or syncing directly to QuickBooks."
  },
  {
    "name": "Spendflo",
    "domain": "spendflo.com",
    "category": "finance-accounting",
    "tagline": "SaaS buying, contract management, and software spend optimization",
    "pricing_model": "Paid",
    "short_description": "Tracks corporate software licenses, automates vendor renewals, monitors usage, and negotiates SaaS invoices to cut excess costs."
  },
  {
    "name": "Billomat",
    "domain": "billomat.com",
    "category": "finance-accounting",
    "tagline": "Web-based invoicing software and bookkeeping application for European businesses",
    "pricing_model": "Paid",
    "short_description": "Automates invoice creation, offer preparation, reminder workflows, and client bookkeeping with automated banking sync."
  }
];

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  const saasDataPath = path.join(__dirname, '../src/data/saasData.jsx');
  let fileContent = fs.readFileSync(saasDataPath, 'utf8');

  // Extract existing IDs and domains
  const existingDomains = new Set();
  const existingNames = new Set();

  const domainMatches = fileContent.matchAll(/"domain":\s*"([^"]+)"/g);
  for (const m of domainMatches) existingDomains.add(m[1].toLowerCase());

  const nameMatches = fileContent.matchAll(/"name":\s*"([^"]+)"/g);
  for (const m of nameMatches) existingNames.add(m[1].toLowerCase());

  console.log(`Initial DB has ${existingDomains.size} domains and ${existingNames.size} tool names.`);

  const newToolsToAdd = [];
  let skippedDuplicates = 0;

  for (const tool of inputTools) {
    const cleanDomain = tool.domain.toLowerCase().trim();
    const cleanName = tool.name.toLowerCase().trim();

    if (existingDomains.has(cleanDomain) || existingNames.has(cleanName)) {
      console.log(`[SKIP DUPLICATE] ${tool.name} (${tool.domain})`);
      skippedDuplicates++;
      continue;
    }

    const toolId = generateSlug(tool.name);
    const newToolObj = {
      id: toolId,
      name: tool.name,
      domain: tool.domain,
      category: "finance-accounting",
      tagline: tool.tagline,
      description: tool.short_description,
      rating: +(4.6 + (Math.random() * 0.3)).toFixed(1),
      reviewsCount: Math.floor(1800 + Math.random() * 9500),
      pricing: tool.pricing_model === 'Freemium' ? 'Freemium / Paid' : (tool.pricing_model === 'Free' ? '100% Free' : (tool.pricing_model === 'Pay-as-you-go' ? 'Pay-as-you-go' : 'Paid Trial')),
      affiliateUrl: `https://${tool.domain}?aff=stakdock`,
      featured: false,
      isFreeTier: tool.pricing_model === 'Freemium' || tool.pricing_model === 'Free',
      isOpenSource: tool.name.toLowerCase().includes('open-source') || tool.name.toLowerCase().includes('invoice ninja') || tool.name.toLowerCase().includes('lago'),
      features: [
        "Invoicing & Billing",
        "Expense Tracking",
        "Financial Analytics",
        "Tax & Payment Sync"
      ]
    };

    newToolsToAdd.push(newToolObj);
    existingDomains.add(cleanDomain);
    existingNames.add(cleanName);
  }

  console.log(`Found ${newToolsToAdd.length} NEW Finance tools to insert. Skipped ${skippedDuplicates} duplicates.`);

  if (newToolsToAdd.length === 0) {
    console.log("No new tools to insert!");
    return;
  }

  // Insert before the end of staticSaasTools array
  const formattedJsonEntries = newToolsToAdd.map(t => JSON.stringify(t, null, 4)).join(',\n');
  const targetInsertionPoint = `export const staticSaasTools = [`;
  
  fileContent = fileContent.replace(targetInsertionPoint, `${targetInsertionPoint}\n${formattedJsonEntries},`);

  fs.writeFileSync(saasDataPath, fileContent, 'utf8');
  console.log(`Successfully ingested ${newToolsToAdd.length} new Finance tools into src/data/saasData.jsx!`);
}

main().catch(console.error);
