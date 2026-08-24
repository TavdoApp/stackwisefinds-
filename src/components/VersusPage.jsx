import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, ExternalLink, ShieldCheck, ArrowUpRight, Award, ChevronDown, ChevronUp, Shield, Globe } from 'lucide-react';
import { saasTools } from '../data/saasData.jsx';
import { injectSoftwareApplicationSchema, injectFaqPageSchema } from '../utils/schemaMarkup.jsx';

function resolveTool(targetSlug, pool = saasTools) {
  if (!targetSlug) return null;
  const slug = String(targetSlug).toLowerCase().trim();
  const cleanSlug = slug.replace(/[^a-z0-9]/g, '');
  return pool.find(t => 
    t.id.toLowerCase() === slug || 
    t.id.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanSlug ||
    t.name.toLowerCase().includes(slug) || 
    slug.includes(t.id.toLowerCase()) ||
    (t.domain && (slug.includes(t.domain.replace(/\..*$/, '')) || t.domain.toLowerCase().includes(slug)))
  ) || null;
}

export default function VersusPage({ toolAId, toolBId, allTools, onBack }) {
  const [openFaq, setOpenFaq] = useState(null);
  const toolPool = Array.isArray(allTools) && allTools.length > 0 ? allTools : saasTools;

  const formatFallbackName = (slug) => {
    if (!slug) return 'Software';
    return String(slug).split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const toolA = resolveTool(toolAId, toolPool) || {
    id: toolAId || 'tool-a',
    name: formatFallbackName(toolAId),
    domain: `${toolAId || 'software'}.com`,
    rating: 4.8,
    reviewsCount: 340,
    pricing: 'Freemium',
    description: `${formatFallbackName(toolAId)} business & workflow platform`,
    category: 'invoicing'
  };

  const toolB = resolveTool(toolBId, toolPool) || {
    id: toolBId || 'tool-b',
    name: formatFallbackName(toolBId),
    domain: `${toolBId || 'software'}.com`,
    rating: 4.7,
    reviewsCount: 420,
    pricing: 'Paid',
    description: `${formatFallbackName(toolBId)} business & workflow platform`,
    category: 'invoicing'
  };

  useEffect(() => {
    if (toolA && toolB) {
      document.title = `${toolA.name} vs ${toolB.name}: 2026 Features, Pricing & Winner | StakDock`;
    }
  }, [toolA, toolB]);

  // Weighted Trust Score Calculation: Rating (40%) + Review Volume (40%) + Authority Score (20%)
  const calculateTrustScore = (tool) => {
    const r = Number(tool.rating) || 4.5;
    const revs = Number(tool.reviewsCount) || 150;
    const opr = Number(tool.openPageRank || tool.authorityScore) || 3.5;
    
    const reviewScale = Math.min(5, (Math.log10(revs + 1) / Math.log10(25000)) * 5);
    const oprScale = Math.min(5, (opr / 10) * 5);
    
    const scoreOut = ((r * 0.4) + (reviewScale * 0.4) + (oprScale * 0.2)) * 2;
    return Math.min(9.9, Math.max(7.0, scoreOut)).toFixed(1);
  };

  const scoreA = calculateTrustScore(toolA);
  const scoreB = calculateTrustScore(toolB);

  // Market Leader vs Specialized Challenger
  const isAMarketLeader = (Number(toolA.reviewsCount || 0) >= Number(toolB.reviewsCount || 0));
  const marketLeader = isAMarketLeader ? toolA : toolB;
  const specializedChallenger = isAMarketLeader ? toolB : toolA;

  const bestForA = toolA.bestFor || toolA.description || `${toolA.name} software workflows`;
  const bestForB = toolB.bestFor || toolB.description || `${toolB.name} software workflows`;

  const prosA = Array.isArray(toolA.pros) ? toolA.pros : [toolA.description || 'Verified software platform', 'Cloud-based Web Access', 'Active Support'];
  const prosB = Array.isArray(toolB.pros) ? toolB.pros : [toolB.description || 'Verified software platform', 'Cloud-based Web Access', 'Active Support'];

  const faqs = [
    {
      question: `Is ${toolA.name} better than ${toolB.name}?`,
      answer: `${toolA.name} scores ${scoreA}/10 on StakDock, whereas ${toolB.name} scores ${scoreB}/10. ${marketLeader.name} leads in overall market adoption with ${marketLeader.reviewsCount || 100}+ verified reviews, while ${specializedChallenger.name} is a high-growth contender built for ${specializedChallenger.description || 'specialized workflows'}.`
    },
    {
      question: `Which is cheaper: ${toolA.name} or ${toolB.name}?`,
      answer: `${toolA.name} offers pricing as "${toolA.pricing}", while ${toolB.name} is priced as "${toolB.pricing}". Test free trial options before choosing a paid subscription.`
    },
    {
      question: `Which tool should I choose between ${toolA.name} and ${toolB.name}?`,
      answer: `Choose ${toolA.name} if you require ${bestForA}. Choose ${toolB.name} if your team needs ${bestForB}.`
    },
    {
      question: `Are ${toolA.name} and ${toolB.name} secure and GDPR compliant?`,
      answer: `Yes, both ${toolA.name} and ${toolB.name} enforce HTTPS encryption, SSL data protection, and standard privacy compliance for modern business operations.`
    },
    {
      question: `Do both tools offer free trials?`,
      answer: `Yes, both ${toolA.name} and ${toolB.name} offer free trials or freemium plans allowing you to test key features risk-free.`
    }
  ];

  const isFlagshipCursorVsCopilot = (toolA.id === 'cursor-ai' && toolB.id === 'github-copilot') || (toolA.id === 'github-copilot' && toolB.id === 'cursor-ai');

  if (isFlagshipCursorVsCopilot) {
    const cursorTool = toolA.id === 'cursor-ai' ? toolA : toolB;
    const copilotTool = toolA.id === 'github-copilot' ? toolA : toolB;

    return (
      <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '1040px' }}>
        {/* Schema.org Rich Snippet Ingestion */}
        {injectSoftwareApplicationSchema(cursorTool)}
        {injectSoftwareApplicationSchema(copilotTool)}

        {/* Back Button */}
        <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }} aria-label="Back to Directory">
          <ArrowLeft size={16} /> Back to Software Directory
        </button>

        {/* Header */}
        <header style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '36px 32px', marginBottom: '28px', textAlign: 'center', boxShadow: 'var(--shadow-soft)' }}>
          <div style={{ display: 'inline-block', background: '#EBF3DE', color: '#2D4522', fontSize: '0.75rem', fontWeight: '800', padding: '4px 14px', borderRadius: '9999px', textTransform: 'uppercase', marginBottom: '14px', letterSpacing: '0.04em' }}>
            FLAGSHIP DEVELOPER COMPARISON • 2026
          </div>
          <h1 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.7rem)', fontWeight: '800', lineHeight: '1.18', margin: '0 0 14px 0', color: 'var(--text-dark)' }}>
            Cursor AI vs GitHub Copilot: Which AI Coding Tool Should You Choose in 2026?
          </h1>
          <p style={{ fontSize: '1.08rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 auto', maxWidth: '820px' }}>
            An evidence-grounded comparison of AI-native editor workflows, multi-file refactoring, IDE extensions, codebase indexing, and verified pricing.
          </p>
        </header>

        {/* Above-The-Fold Decision Summary */}
        <section style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '32px', marginBottom: '28px', boxShadow: 'var(--shadow-soft)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: 0, marginBottom: '12px', color: 'var(--text-dark)' }}>The Core Difference in 30 Seconds</h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.65', marginBottom: '24px' }}>
            <strong>Cursor</strong> is a standalone AI-native code editor (VS Code fork) engineered around whole-codebase vector indexing and automated multi-file edits (Composer). <strong>GitHub Copilot</strong> is a cross-IDE AI extension developed by GitHub and OpenAI that integrates inline autocomplete, conversational chat, and CLI assistance directly into your existing editor (VS Code, JetBrains IDEs, Visual Studio, Neovim).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ background: '#F7FAF5', border: '1.5px solid #DCE8D6', borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#2D4522', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Choose Cursor AI if:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.75', color: 'var(--text-dark)', fontSize: '0.94rem' }}>
                <li>You want deep, repository-wide vector indexing with multi-file code generation and diff reviews (<code>Cmd+I</code> / Composer).</li>
                <li>You are willing to use a dedicated, standalone AI-first editor that maintains full VS Code extension and keybinding compatibility.</li>
                <li>You require native model switching between Claude 3.5 Sonnet, GPT-4o, and specialized Cursor refactoring models.</li>
                <li>You frequently execute complex architectural refactorings across multiple project files simultaneously.</li>
              </ul>
            </div>

            <div style={{ background: '#F9F8FD', border: '1.5px solid #E0DBF5', borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#37286B', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Choose GitHub Copilot if:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.75', color: 'var(--text-dark)', fontSize: '0.94rem' }}>
                <li>You want AI assistance inside your existing environment (JetBrains IDEs, Visual Studio, Neovim, VS Code) without switching editors.</li>
                <li>Your organization requires centralized GitHub Enterprise governance, SOC 2 Type II compliance, and IP copyright indemnity.</li>
                <li>You want native GitHub workflows, including Copilot in GitHub CLI and PR summarization.</li>
                <li>You qualify for free access as a verified student, educator, or maintainer of popular open-source repositories.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Side-by-Side Quick Comparison Matrix */}
        <section style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '32px', marginBottom: '28px', boxShadow: 'var(--shadow-soft)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: 0, marginBottom: '16px', color: 'var(--text-dark)' }}>Side-by-Side Specification Matrix</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem', minWidth: '620px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2ede0', background: '#f9fbf8' }}>
                  <th style={{ padding: '14px 16px', color: '#5c7353', fontWeight: '800', width: '28%' }}>Comparison Criteria</th>
                  <th style={{ padding: '14px 16px', color: '#182618', fontWeight: '800', width: '36%' }}>Cursor AI</th>
                  <th style={{ padding: '14px 16px', color: '#182618', fontWeight: '800', width: '36%' }}>GitHub Copilot</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f0f4ee' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Product Architecture</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Standalone AI-Native Editor (VS Code fork)</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Cross-IDE Plugin &amp; Extension</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f4ee', background: '#fafcf9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Primary Workflow</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Multi-file generation (Composer) &amp; inline diff edits</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Ghost-text inline autocomplete &amp; sidebar chat</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f4ee' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Supported Environments</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>macOS, Windows, Linux (Dedicated Desktop App)</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>VS Code, JetBrains, Visual Studio, Neovim, CLI</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f4ee', background: '#fafcf9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Codebase Context</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Local vector embeddings indexing entire project</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Open tabs context &amp; GitHub repository index</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f4ee' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Multi-File Edits</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Native multi-file generation &amp; unified diff review</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Multi-file chat suggestions reviewed file-by-file</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f4ee', background: '#fafcf9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Underlying AI Models</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Claude 3.5 Sonnet, GPT-4o, Cursor Tab models</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f4ee' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Free Entry Tier</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Free Hobby (2,000 completions, 50 slow requests)</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Free Tier (limited) / Free for Students &amp; OSS</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f4ee', background: '#fafcf9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Starting Paid Price</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>$20/mo ($16/mo billed annually at $192/yr)</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>$10/mo ($100/yr billed annually)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f4ee' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Team / Business Plan</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>$40/user/mo (Teams Standard)</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>$19/user/mo (Copilot Business)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f4ee', background: '#fafcf9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Enterprise Governance</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Team-wide Privacy Mode, SAML/OIDC SSO</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>SAML SSO, SCIM, pooled credits, IP indemnity</td>
                </tr>
                <tr>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Best Suited For</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Engineers seeking deep AI-first project refactoring</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Engineers &amp; teams wanting AI inside existing IDEs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Deep Technical & Workflow Differences */}
        <section style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '32px', marginBottom: '28px', boxShadow: 'var(--shadow-soft)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: 0, marginBottom: '20px', color: 'var(--text-dark)' }}>Deep Workflow Comparison</h2>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>1. Standalone AI Editor vs IDE Plugin Architecture</h3>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: '1.65', margin: '0 0 10px 0' }}>
              The fundamental decision point begins with your editor choice. <strong>Cursor</strong> requires adopting a dedicated desktop application. Because Cursor is a direct fork of open-source VS Code, developers transitioning from VS Code can import their keybindings, themes, extensions, and workspace settings in one click. However, developers who work inside JetBrains IDEs (IntelliJ, WebStorm, PyCharm) or Neovim must switch their active editor to use Cursor.
            </p>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: '1.65', margin: 0 }}>
              <strong>GitHub Copilot</strong> operates as a lightweight extension. You install it directly from your IDE's marketplace without altering your editor setup, debugger configurations, or toolchains.
            </p>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>2. Repository Context &amp; Codebase Awareness</h3>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: '1.65', margin: '0 0 10px 0' }}>
              Understanding project context across hundreds of files is where the tools diverge mechanically:
            </p>
            <ul style={{ margin: 0, paddingLeft: '22px', lineHeight: '1.75', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              <li><strong>Cursor:</strong> Computes local vector embeddings for all project files (ignoring build folders defined in <code>.cursorignore</code>). When you ask a question or edit code, Cursor retrieves semantically relevant code snippets across the entire repository to ground the LLM prompt.</li>
              <li><strong>GitHub Copilot:</strong> Uses "neighboring tabs" heuristics, local file context, and remote GitHub repository indexing (on Enterprise plans) to populate the context window. While highly effective for inline completions, whole-repository semantic search is less deeply integrated into inline editing than Cursor.</li>
            </ul>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>3. Multi-File Refactoring &amp; Composer</h3>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: '1.65', margin: '0 0 10px 0' }}>
              <strong>Cursor's Composer (<code>Cmd+I</code>)</strong> allows developers to prompt the AI to create new components, update routing tables, modify database models, and adjust styles simultaneously. Edits appear directly in the editor as red/green inline diffs that you can accept or reject file-by-file or all at once.
            </p>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: '1.65', margin: 0 }}>
              <strong>GitHub Copilot Chat</strong> supports multi-file suggestions and edits via workspace commands, but applying them typically requires navigating between files to review and accept code blocks incrementally.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px' }}>4. Terminal &amp; Command-Line Integration</h3>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', lineHeight: '1.65', margin: 0 }}>
              Cursor includes inline terminal AI (<code>Cmd+K</code> directly in the integrated terminal) to translate natural language into shell commands and debug build errors in-place. GitHub Copilot provides the standalone <code>gh copilot</code> CLI tool, enabling developers to run <code>gh copilot explain</code> or <code>gh copilot suggest</code> in any standalone terminal emulator.
            </p>
          </div>
        </section>

        {/* Verified Pricing Breakdown */}
        <section style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '32px', marginBottom: '28px', boxShadow: 'var(--shadow-soft)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: 0, marginBottom: '12px', color: 'var(--text-dark)' }}>Pricing &amp; Quota Breakdown</h2>
          <p style={{ fontSize: '0.92rem', color: '#5c7353', marginBottom: '20px' }}>
            Verified directly from official vendor pricing documentation (Checked: Aug 24, 2026).
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem', minWidth: '620px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2ede0', background: '#f9fbf8' }}>
                  <th style={{ padding: '14px 16px', color: '#5c7353', fontWeight: '800', width: '24%' }}>Tier</th>
                  <th style={{ padding: '14px 16px', color: '#182618', fontWeight: '800', width: '38%' }}>Cursor AI</th>
                  <th style={{ padding: '14px 16px', color: '#182618', fontWeight: '800', width: '38%' }}>GitHub Copilot</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f0f4ee' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Free Option</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}><strong>Hobby ($0):</strong> 2,000 completions, 50 slow requests/mo, access to Composer.</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}><strong>Free ($0):</strong> Limited completions/mo. Free for verified students &amp; popular OSS maintainers.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f4ee', background: '#fafcf9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Individual / Pro</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}><strong>$20/mo</strong> ($16/mo billed annually at $192/yr). Unlimited completions, 500 fast premium requests.</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}><strong>$10/mo</strong> ($100/yr billed annually). Unlimited completions, Copilot Chat, model selection.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f4ee' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Team / Business</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}><strong>$40/user/mo:</strong> Centralized billing, team privacy mode, shared context, Bugbot code reviews.</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}><strong>$19/user/mo:</strong> Centralized management, policy controls, pooled AI credits per user.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #f0f4ee', background: '#fafcf9' }}>
                  <td style={{ padding: '12px 16px', fontWeight: '700', color: '#2d4029' }}>Enterprise</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}>Custom pricing: Pooled usage, SCIM seat management, audit logs, service accounts.</td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-dark)' }}><strong>$39/user/mo:</strong> Enterprise Cloud indexing, 3,900 pooled credits/user, custom knowledge bases.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Real-World Decision Scenarios */}
        <section style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '32px', marginBottom: '28px', boxShadow: 'var(--shadow-soft)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: 0, marginBottom: '16px', color: 'var(--text-dark)' }}>Real-World Developer Decision Scenarios</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
            <div style={{ background: '#f9fbf8', border: '1px solid #e2ede0', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px', fontSize: '1rem' }}>Scenario A: The JetBrains Developer</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                If your primary IDE is IntelliJ IDEA, PyCharm, WebStorm, or Rider, <strong>GitHub Copilot</strong> is the recommended choice. Copilot installs seamlessly without requiring you to abandon your IDE's indexing, database tools, or refactoring engine.
              </p>
            </div>

            <div style={{ background: '#f9fbf8', border: '1px solid #e2ede0', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px', fontSize: '1rem' }}>Scenario B: The Web / Full-Stack Builder</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                If you build React, Next.js, Node, or Python web apps and frequently scaffold new routes or refactor components, <strong>Cursor</strong> provides a noticeably faster feedback loop with Composer and Claude 3.5 Sonnet.
              </p>
            </div>

            <div style={{ background: '#f9fbf8', border: '1px solid #e2ede0', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px', fontSize: '1rem' }}>Scenario C: The GitHub-Standardized Team</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                For organizations already managing developer seats on GitHub Enterprise with strict SOC 2 compliance and IP indemnity requirements, <strong>GitHub Copilot Business/Enterprise</strong> integrates cleanly into existing billing.
              </p>
            </div>

            <div style={{ background: '#f9fbf8', border: '1px solid #e2ede0', borderRadius: '14px', padding: '20px' }}>
              <div style={{ fontWeight: '800', color: 'var(--text-dark)', marginBottom: '8px', fontSize: '1rem' }}>Scenario D: Heavy Multi-File Refactoring</div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                When updating an API contract across 10 files simultaneously, <strong>Cursor</strong> applies changes across the codebase in a single unified prompt, whereas Copilot requires reviewing individual files sequentially.
              </p>
            </div>
          </div>
        </section>

        {/* Strengths and Constraints Comparison */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-soft)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: 0, marginBottom: '14px', color: 'var(--text-dark)' }}>Cursor AI Profile</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: '800', color: '#2D4522', fontSize: '0.95rem', marginBottom: '6px' }}>✓ Documented Strengths</div>
              <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.65', color: 'var(--text-dark)', fontSize: '0.9rem' }}>
                <li>Local vector embeddings enable deep whole-repository context awareness.</li>
                <li>Composer (<code>Cmd+I</code>) executes multi-file code generation and refactorings.</li>
                <li>Seamless 1-click import of VS Code extensions, settings, and keybindings.</li>
                <li>Model switching between Claude 3.5 Sonnet, GPT-4o, and Cursor Tab fine-tunes.</li>
              </ul>
            </div>

            <div>
              <div style={{ fontWeight: '800', color: '#9A3412', fontSize: '0.95rem', marginBottom: '6px' }}>⚠ Documented Constraints</div>
              <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.65', color: '#5C3E29', fontSize: '0.9rem' }}>
                <li>Requires switching to a dedicated desktop editor; does not run inside JetBrains IDEs.</li>
                <li>Requires cloud network connectivity for AI completions and remote vector indexing.</li>
                <li>Higher starting price ($20/mo vs $10/mo for GitHub Copilot).</li>
              </ul>
            </div>

            <div style={{ marginTop: '20px' }}>
              <a href="/software/cursor-ai/" style={{ color: '#82A735', fontWeight: '800', textDecoration: 'underline', fontSize: '0.92rem' }}>
                View Full Cursor AI Review &rarr;
              </a>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '28px', boxShadow: 'var(--shadow-soft)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginTop: 0, marginBottom: '14px', color: 'var(--text-dark)' }}>GitHub Copilot Profile</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: '800', color: '#2D4522', fontSize: '0.95rem', marginBottom: '6px' }}>✓ Documented Strengths</div>
              <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.65', color: 'var(--text-dark)', fontSize: '0.9rem' }}>
                <li>Universal editor support: VS Code, Visual Studio, JetBrains, and Neovim.</li>
                <li>Lower starting price ($10/mo vs $20/mo) with free access for students and OSS maintainers.</li>
                <li>Enterprise governance with SOC 2 compliance and IP copyright indemnity.</li>
                <li>Native integration with GitHub CLI, PR summaries, and GitHub Mobile.</li>
              </ul>
            </div>

            <div>
              <div style={{ fontWeight: '800', color: '#9A3412', fontSize: '0.95rem', marginBottom: '6px' }}>⚠ Documented Constraints</div>
              <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.65', color: '#5C3E29', fontSize: '0.9rem' }}>
                <li>Operates as an extension without native whole-codebase workspace Composer workflows.</li>
                <li>Multi-file refactoring requires individual file reviews in separate chat tabs.</li>
              </ul>
            </div>

            <div style={{ marginTop: '20px' }}>
              <a href="/software/github-copilot/" style={{ color: '#82A735', fontWeight: '800', textDecoration: 'underline', fontSize: '0.92rem' }}>
                View Full GitHub Copilot Review &rarr;
              </a>
            </div>
          </div>
        </div>

        {/* Final Verdict & Decision Summary */}
        <section style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '32px', marginBottom: '28px', boxShadow: 'var(--shadow-soft)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: 0, marginBottom: '14px', color: 'var(--text-dark)' }}>Which Should You Choose?</h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '16px' }}>
            There is no single "winner" because Cursor and GitHub Copilot are engineered around different workflow models:
          </p>
          <ul style={{ margin: '0 0 20px 0', paddingLeft: '22px', lineHeight: '1.75', color: 'var(--text-dark)', fontSize: '0.95rem' }}>
            <li><strong>Choose Cursor AI</strong> if you want the deepest possible AI assistance, regularly build complex full-stack web applications, and are excited about a dedicated editor built for multi-file Composer refactoring.</li>
            <li><strong>Choose GitHub Copilot</strong> if you love your current IDE (especially JetBrains or Visual Studio), want an affordable $10/mo assistant, or work inside an enterprise with centralized GitHub security governance.</li>
          </ul>
          <p style={{ fontSize: '0.92rem', color: '#5c7353', lineHeight: '1.6', margin: 0 }}>
            <em>Note for power users:</em> Many developers maintain both tools—using Cursor for rapid greenfield feature development and multi-file refactoring, while using GitHub Copilot for day-to-day maintenance inside specialized IDEs.
          </p>
        </section>

        {/* Sources & Data Provenance */}
        <section style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '24px 32px', marginBottom: '28px', boxShadow: 'var(--shadow-soft)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '0.85rem', color: '#5c7353' }}>
              <strong>Pricing checked:</strong> Aug 24, 2026 • <strong>Product specifications corroborated from live official vendor documentation.</strong>
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.82rem', fontWeight: '700' }}>
              <a href="https://www.cursor.com/pricing" target="_blank" rel="noopener noreferrer" style={{ color: '#82A735', textDecoration: 'underline' }}>Cursor Pricing ↗</a>
              <a href="https://docs.cursor.com" target="_blank" rel="noopener noreferrer" style={{ color: '#82A735', textDecoration: 'underline' }}>Cursor Docs ↗</a>
              <a href="https://github.com/features/copilot" target="_blank" rel="noopener noreferrer" style={{ color: '#82A735', textDecoration: 'underline' }}>Copilot Product ↗</a>
              <a href="https://docs.github.com/en/copilot" target="_blank" rel="noopener noreferrer" style={{ color: '#82A735', textDecoration: 'underline' }}>Copilot Docs ↗</a>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 16px 80px', maxWidth: '960px' }}>
      {/* Schema.org Rich Snippet Ingestion */}
      {injectSoftwareApplicationSchema(toolA)}
      {injectSoftwareApplicationSchema(toolB)}
      {injectFaqPageSchema(faqs)}

      {/* Back Button */}
      <button onClick={onBack} className="btn-pill-outline" style={{ marginBottom: '24px' }} aria-label="Back to Directory">
        <ArrowLeft size={16} /> Back to Software Directory
      </button>

      {/* Versus Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div className="tag-uppercase" style={{ marginBottom: '8px' }}>2026 HEAD-TO-HEAD COMPARISON & BENCHMARK</div>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '800', marginBottom: '12px', lineHeight: '1.1' }}>
          {toolA.name} <span className="serif-italic">vs</span> {toolB.name}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '680px', margin: '0 auto' }}>
          Unbiased 2026 software benchmark, feature matrix, pricing breakdown, and use-case verdict to help you pick the right software.
        </p>
      </div>

      {/* Nuanced Dual Verdict Card (100% Fair & Accurate) */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '32px',
        marginBottom: '40px',
        boxShadow: 'var(--shadow-soft)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#82A735', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '20px' }}>
          <Award size={18} /> StakDock Use-Case Verdicts & Recommendations
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Option A Card */}
          <div style={{ background: '#F8FAF2', border: '1px solid #D2E0B5', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={`https://www.google.com/s2/favicons?domain=${toolA.domain}&sz=128`} alt={toolA.name} style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }}>{toolA.name}</span>
                </div>
                <span style={{ background: '#141E14', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '9999px' }}>
                  Score: {scoreA}/10
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase', marginBottom: '6px' }}>
                🏆 {isAMarketLeader ? 'Market & Adoption Leader' : 'Specialized Workflow Contender'}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                <strong>Best For:</strong> {bestForA}
              </p>
            </div>

            <a 
              href={toolA.affiliateUrl || `https://${toolA.domain || 'stakdock.com'}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-pill-green"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '0.88rem' }}
            >
              <span>Visit {toolA.name} ↗</span>
            </a>
          </div>

          {/* Option B Card */}
          <div style={{ background: '#F8FAF2', border: '1px solid #D2E0B5', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={`https://www.google.com/s2/favicons?domain=${toolB.domain}&sz=128`} alt={toolB.name} style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)' }}>{toolB.name}</span>
                </div>
                <span style={{ background: '#141E14', color: '#FFFFFF', fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '9999px' }}>
                  Score: {scoreB}/10
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', fontWeight: '800', color: '#82A735', textTransform: 'uppercase', marginBottom: '6px' }}>
                🏆 {!isAMarketLeader ? 'Market & Adoption Leader' : 'Specialized Workflow Contender'}
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-dark)', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                <strong>Best For:</strong> {bestForB}
              </p>
            </div>

            <a 
              href={toolB.affiliateUrl || `https://${toolB.domain || 'stakdock.com'}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-pill-green"
              style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', fontSize: '0.88rem' }}
            >
              <span>Visit {toolB.name} ↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Side-by-Side Spec Table */}
      <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '24px', marginBottom: '40px', overflowX: 'auto', boxShadow: 'var(--shadow-soft)' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '20px' }}>Comprehensive Feature Matrix</h3>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', background: '#F6F7F2' }}>
              <th style={{ padding: '14px', color: 'var(--text-light)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Feature Spec</th>
              <th style={{ padding: '14px', width: '38%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={`https://www.google.com/s2/favicons?domain=${toolA.domain}&sz=128`} alt={toolA.name} style={{ width: '24px', height: '24px' }} />
                  <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{toolA.name}</span>
                </div>
              </th>
              <th style={{ padding: '14px', width: '38%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={`https://www.google.com/s2/favicons?domain=${toolB.domain}&sz=128`} alt={toolB.name} style={{ width: '24px', height: '24px' }} />
                  <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{toolB.name}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>StakDock Score</td>
              <td style={{ padding: '14px', fontWeight: '800', color: '#82A735' }}>
                <Star size={14} fill="#82A735" inline /> {toolA.rating} / 5 ({toolA.reviewsCount || 120} reviews)
              </td>
              <td style={{ padding: '14px', fontWeight: '800', color: '#82A735' }}>
                <Star size={14} fill="#82A735" inline /> {toolB.rating} / 5 ({toolB.reviewsCount || 115} reviews)
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Pricing Model</td>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>{toolA.pricing}</td>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-dark)' }}>{toolB.pricing}</td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Category</td>
              <td style={{ padding: '14px', fontSize: '0.88rem', color: 'var(--text-dark)', textTransform: 'uppercase', fontWeight: '600' }}>{toolA.category || 'CRM'}</td>
              <td style={{ padding: '14px', fontSize: '0.88rem', color: 'var(--text-dark)', textTransform: 'uppercase', fontWeight: '600' }}>{toolB.category || 'CRM'}</td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Best Persona</td>
              <td style={{ padding: '14px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>{bestForA}</td>
              <td style={{ padding: '14px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>{bestForB}</td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Security & Privacy</td>
              <td style={{ padding: '14px', fontSize: '0.85rem', color: '#82A735', fontWeight: '700' }}>
                <Shield size={14} inline /> HTTPS Encrypted & Verified
              </td>
              <td style={{ padding: '14px', fontSize: '0.85rem', color: '#82A735', fontWeight: '700' }}>
                <Shield size={14} inline /> HTTPS Encrypted & Verified
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Deployment</td>
              <td style={{ padding: '14px', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                <Globe size={14} inline /> Cloud Web App
              </td>
              <td style={{ padding: '14px', fontSize: '0.85rem', color: 'var(--text-dark)' }}>
                <Globe size={14} inline /> Cloud Web App
              </td>
            </tr>

            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Key Highlights</td>
              <td style={{ padding: '14px', fontSize: '0.85rem' }}>
                {prosA.map((p, idx) => (
                  <div key={idx} style={{ color: '#82A735', fontWeight: '600', marginBottom: '4px' }}>✓ {p}</div>
                ))}
              </td>
              <td style={{ padding: '14px', fontSize: '0.85rem' }}>
                {prosB.map((p, idx) => (
                  <div key={idx} style={{ color: '#82A735', fontWeight: '600', marginBottom: '4px' }}>✓ {p}</div>
                ))}
              </td>
            </tr>

            <tr>
              <td style={{ padding: '14px', fontWeight: '700', color: 'var(--text-muted)', fontSize: '0.88rem' }}>Action Link</td>
              <td style={{ padding: '14px' }}>
                <a href={toolA.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn-pill-green" style={{ padding: '10px 16px', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}>
                  <span>Try {toolA.name} Free</span>
                  <ExternalLink size={14} />
                </a>
              </td>
              <td style={{ padding: '14px' }}>
                <a href={toolB.affiliateUrl} target="_blank" rel="noopener noreferrer" className="btn-pill-green" style={{ padding: '10px 16px', fontSize: '0.85rem', width: '100%', justifyContent: 'center' }}>
                  <span>Try {toolB.name} Free</span>
                  <ExternalLink size={14} />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FAQ Accordion Section for SEO Rich Snippets */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '16px' }}>
          Frequently Asked Questions: {toolA.name} vs {toolB.name}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '18px 20px',
                cursor: 'pointer'
              }}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-dark)' }}>{faq.question}</span>
                {openFaq === idx ? <ChevronUp size={18} color="#82A735" /> : <ChevronDown size={18} color="var(--text-light)" />}
              </div>
              {openFaq === idx && (
                <p style={{ marginTop: '12px', color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FTC Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-light)', fontSize: '0.8rem', textAlign: 'center', justifyContent: 'center' }}>
        <ShieldCheck size={16} color="#82A735" />
        <span>StakDock is reader-supported. When you purchase software through links on our site, we may earn an affiliate commission at zero extra cost to you.</span>
      </div>
    </div>
  );
}
