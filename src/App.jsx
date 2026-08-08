import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ToolCard from './components/ToolCard';
import CategoryNav from './components/CategoryNav';
import CategoryGrid from './components/CategoryGrid';
import Footer from './components/Footer';
import SponsoredBanner from './components/SponsoredBanner';
import CategoryGridPage from './components/CategoryGridPage';
import RankingPage from './components/RankingPage';
import AdvertisePage from './components/AdvertisePage';

import { saasTools, saasCategories } from './data/saasData.jsx';
import { highIntentArticles } from './data/articlesData';
import { injectGlobalOrganizationSchema } from './utils/schemaMarkup.jsx';
import { ArrowUpRight, Sparkles, Scale, Search, Layers, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

import AiNewsSidebar from './components/AiNewsSidebar';
import FeaturedSidebar from './components/FeaturedSidebar';

import ToolDetailPage from './components/ToolDetailPage';
import ToolSearchInput from './components/ToolSearchInput';

// Lazy Loaded Modal & Detail Views for High Performance & Micro-Bundle Splitting
const ComparisonModal = lazy(() => import('./components/ComparisonModal'));
const VendorModal = lazy(() => import('./components/VendorModal'));
const StackWizardModal = lazy(() => import('./components/StackWizardModal'));
const ReviewModal = lazy(() => import('./components/ReviewModal'));
const ArticleView = lazy(() => import('./components/ArticleView'));
const VersusPage = lazy(() => import('./components/VersusPage'));
const AlternativesView = lazy(() => import('./components/AlternativesView'));
const LegalViews = lazy(() => import('./components/LegalViews'));
const BookmarkDrawer = lazy(() => import('./components/BookmarkDrawer'));
const BadgeEmbedModal = lazy(() => import('./components/BadgeEmbedModal'));

// Robust React Error Boundary to Guarantee Zero White Screens
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '80px 20px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-dark)' }}>Page Render Error</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
            We encountered a temporary rendering issue. Please click below to return to the software directory.
          </p>
          <button onClick={() => { this.setState({ hasError: false }); window.location.hash = ''; window.location.reload(); }} className="btn-pill-green">
            Return to Software Directory
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [selectedVersus, setSelectedVersus] = useState(() => {
    if (typeof window === 'undefined') return { toolAId: 'freshbooks', toolBId: 'quickbooks' };
    const p = window.location.pathname.toLowerCase();
    if (p.startsWith('/vs/')) {
      const parts = p.replace('/vs/', '').replace(/\/$/, '').split('-vs-');
      if (parts.length === 2) return { toolAId: parts[0], toolBId: parts[1] };
    }
    return { toolAId: 'freshbooks', toolBId: 'quickbooks' };
  });

  const [currentView, setCurrentView] = useState(() => {
    if (typeof window === 'undefined') return 'directory';
    const p = window.location.pathname.toLowerCase();
    if (p.startsWith('/vs/')) return 'versus-detail';
    if (p.startsWith('/software/') || p.startsWith('/tool/')) return 'tool-detail';
    if (p.startsWith('/alternatives/')) return 'alternatives-detail';
    if (p.startsWith('/guides/')) return 'article-detail';
    if (p === '/categories') return 'category-grid';
    return 'directory';
  });
  const [currentLang, setCurrentLang] = useState('en');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedAlternativeToolId, setSelectedAlternativeToolId] = useState('freshbooks');
  const [selectedReviewTool, setSelectedReviewTool] = useState(null);
  const [selectedToolDetailId, setSelectedToolDetailId] = useState('cursor-ai');
  const [legalView, setLegalView] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Bookmarking / Saved Stack State with LocalStorage Persistence
  const [showBookmarkDrawer, setShowBookmarkDrawer] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('stakdock_bookmarks');
      return saved ? JSON.parse(saved) : ['cursor-ai', 'claude-ai', 'n8n', 'xuscrm'];
    } catch {
      return ['cursor-ai', 'claude-ai', 'n8n', 'xuscrm'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('stakdock_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [bookmarkedIds]);

  const handleToggleBookmark = (toolId) => {
    setBookmarkedIds(prev => 
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
  };

  // Upvote Community Tracker
  const [upvotesState, setUpvotesState] = useState({
    'chatgpt-plus': 489,
    'claude-ai': 342,
    'sora-openai': 512,
    'cursor-ai': 298,
    'xuscrm': 410
  });

  const handleUpvoteTool = (toolId) => {
    setUpvotesState(prev => ({
      ...prev,
      [toolId]: (prev[toolId] || 120) + 1
    }));
  };
  
  // Growth Hack #2 Filters: Free Tier, Open Source & Trending AI
  const [filterFreeOnly, setFilterFreeOnly] = useState(false);
  const [filterOpenSourceOnly, setFilterOpenSourceOnly] = useState(false);
  const [filterTrendingOnly, setFilterTrendingOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  // Sleek Pagination State (20 tools per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Compare & Modal states
  const [selectedCompareIds, setSelectedCompareIds] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [vendorModalPackage, setVendorModalPackage] = useState('free');
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  const handleOpenVendorModal = (pkg = 'free') => {
    setVendorModalPackage(typeof pkg === 'string' ? pkg : 'free');
    setShowVendorModal(true);
  };

  const handleSelectToolDetail = (tId) => {
    setSelectedToolDetailId(tId);
    setCurrentView('tool-detail');
    window.history.pushState(null, '', `/software/${tId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (art) => {
    if (!art) return;
    setSelectedArticle(art);
    setCurrentView('article-detail');
    const slug = art.slug || art.id;
    window.history.pushState(null, '', `/guides/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to URL Hash / Query Parameter for direct deep linking & article subroutes
  useEffect(() => {
    const handleUrlRouting = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      const search = window.location.search.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      if (pathname.startsWith('/software/')) {
        const toolSlug = pathname.replace('/software/', '').replace(/\/$/, '');
        setSelectedToolDetailId(toolSlug);
        setCurrentView('tool-detail');
        return;
      }

      if (pathname.startsWith('/tool/')) {
        const toolSlug = pathname.replace('/tool/', '').replace(/\/$/, '');
        setSelectedToolDetailId(toolSlug);
        setCurrentView('tool-detail');
        return;
      }

      if (pathname.startsWith('/vs/')) {
        const vsSlug = pathname.replace('/vs/', '').replace(/\/$/, '');
        const parts = vsSlug.split('-vs-');
        if (parts.length === 2) {
          setSelectedVersus({ toolAId: parts[0], toolBId: parts[1] });
          setCurrentView('versus-detail');
          return;
        }
      }

      if (pathname.startsWith('/alternatives/')) {
        const altSlug = pathname.replace('/alternatives/', '').replace(/\/$/, '');
        const baseId = altSlug.replace('-alternatives', '');
        setSelectedAlternativeToolId(baseId);
        setCurrentView('alternatives-detail');
        return;
      }

      if (pathname === '/privacy' || hash === 'privacy' || search.includes('page=privacy')) {
        setLegalView('privacy');
        setCurrentView('privacy');
        return;
      }

      if (pathname === '/terms' || hash === 'terms' || search.includes('page=terms')) {
        setLegalView('terms');
        setCurrentView('terms');
        return;
      }

      if (pathname === '/refund' || hash === 'refund' || search.includes('page=refund')) {
        setLegalView('refund');
        setCurrentView('refund');
        return;
      }

      if (pathname === '/disclosure' || hash === 'disclosure' || search.includes('page=disclosure')) {
        setLegalView('disclosure');
        setCurrentView('disclosure');
        return;
      }

      if (pathname === '/pricing' || pathname === '/advertise' || hash === 'pricing' || hash === 'advertise' || search.includes('page=pricing')) {
        setCurrentView('advertise');
        return;
      }

      if (pathname === '/ranking' || hash === 'ranking') {
        setCurrentView('ranking');
        return;
      }

      if (pathname === '/categories' || hash === 'categories') {
        setCurrentView('category-grid');
        return;
      }

      if (pathname.startsWith('/guides/')) {
        const rawSlug = pathname.replace('/guides/', '').replace(/\/$/, '');
        const normSlug = decodeURIComponent(rawSlug).toLowerCase();
        const found = highIntentArticles.find(a => {
          if (!a) return false;
          const aId = (a.id || '').toLowerCase();
          const aSlug = (a.slug || '').toLowerCase();
          const aCanon = (a.canonicalUrl || '').toLowerCase();
          return aSlug === normSlug || aId === normSlug || aId === `guide-${normSlug}` || (aCanon && aCanon.includes(`/guides/${normSlug}`));
        });
        if (found) {
          setSelectedArticle(found);
          setCurrentView('article-detail');
          return;
        } else {
          setCurrentView('articles');
          return;
        }
      }

      if (pathname === '/guides' || hash === 'guides') {
        setCurrentView('articles');
        return;
      }

      if (hash.startsWith('vs-')) {
        const vsSlug = hash.replace('vs-', '');
        const parts = vsSlug.split('-vs-');
        if (parts.length === 2) {
          setSelectedVersus({ toolAId: parts[0], toolBId: parts[1] });
          setCurrentView('versus-detail');
        }
      } else if (hash.startsWith('alternatives-')) {
        const altId = hash.replace('alternatives-', '').replace('-alternatives', '');
        setSelectedAlternativeToolId(altId);
        setCurrentView('alternatives-detail');
      } else if (hash.startsWith('guide-') || search.includes('article=')) {
        const artId = hash.replace('guide-', '').trim().toLowerCase();
        const found = highIntentArticles.find(a => (a.id || '').toLowerCase() === artId || (a.slug || '').toLowerCase() === artId);
        if (found) {
          setSelectedArticle(found);
          setCurrentView('article-detail');
        }
      } else if (pathname === '/' || pathname === '') {
        setCurrentView('directory');
      }
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    window.addEventListener('popstate', handleUrlRouting);
    return () => {
      window.removeEventListener('hashchange', handleUrlRouting);
      window.removeEventListener('popstate', handleUrlRouting);
    };
  }, []);

  // Sync client-side document.title and meta description for SEO & AEO
  useEffect(() => {
    let titleStr = 'StakDock — The SaaS & AI Software Launch Dock (2026)';
    let descStr = 'Discover, compare, and stack top-rated SaaS tools, AI generators, and software platforms for 2026.';

    if (currentView === 'tool-detail' && selectedToolDetailId) {
      const t = saasTools.find(tool => tool.id === selectedToolDetailId);
      if (t) {
        titleStr = `${t.name} Review 2026: Pricing, Features & Alternatives | StakDock`;
        descStr = t.description ? `${t.name} review (2026): ${t.description} Compare pricing (${t.pricing || 'Freemium'}), ratings (${t.rating || '4.8'}★), and top alternatives on StakDock.` : `In-depth ${t.name} review (2026). Compare ${t.name} pricing, features, pros & cons, ratings, and alternatives.`;
      }
    } else if (currentView === 'alternatives-detail' && selectedAlternativeToolId) {
      const t = saasTools.find(tool => tool.id === selectedAlternativeToolId);
      if (t) {
        titleStr = `7 Best ${t.name} Alternatives & Competitors (2026) | StakDock`;
        descStr = `Looking for the best alternatives to ${t.name}? Compare top verified ${t.name} competitors in 2026 by features, pricing plans, free trials, and user ratings on StakDock.`;
      }
    } else if (currentView === 'versus-detail' && selectedVersus) {
      const tA = saasTools.find(t => t.id === selectedVersus.toolAId);
      const tB = saasTools.find(t => t.id === selectedVersus.toolBId);
      if (tA && tB) {
        titleStr = `${tA.name} vs ${tB.name}: 2026 Comparison, Pricing & Winner | StakDock`;
        descStr = `Detailed ${tA.name} vs ${tB.name} comparison (2026). Compare feature matrix, pricing plans, integration capabilities, and user consensus to pick the winning software.`;
      }
    } else if (currentView === 'article-detail' && selectedArticle) {
      const rawTitle = selectedArticle.title || selectedArticle.question || 'Buyer Guide';
      const guideTitle = rawTitle.includes('2026') ? rawTitle : `${rawTitle} (2026 Guide)`;
      titleStr = `${guideTitle} | StakDock`;
      descStr = selectedArticle.summary ? `${selectedArticle.summary} Compare top verified software picks, pricing, and buyer evaluation frameworks on StakDock.` : 'Software buyer guide and evaluation framework on StakDock.';
    } else if (currentView === 'category-grid') {
      titleStr = 'Browse Software & AI Categories (2026) | StakDock';
      descStr = 'Explore verified software categories: AI Content, CRM, Developer Tools, Marketing Automation, and Analytics.';
    } else if (currentView === 'ranking') {
      titleStr = 'Top 100 Highest Rated SaaS & AI Software (2026) | StakDock';
      descStr = 'Compare the top 100 highest rated SaaS tools and AI software ranked by traffic, user reviews, and verified features.';
    } else if (currentView === 'advertise') {
      titleStr = 'Advertise & List Your Software | StakDock';
      descStr = 'Reach 50,000+ purchasing managers and tech founders on StakDock with directory indexing and sponsored listing spots.';
    }

    document.title = titleStr;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', descStr);
  }, [currentView, selectedToolDetailId, selectedAlternativeToolId, selectedVersus, selectedArticle]);

  // Toggle compare item
  const handleToggleCompare = (toolId) => {
    if (selectedCompareIds.includes(toolId)) {
      setSelectedCompareIds(selectedCompareIds.filter(id => id !== toolId));
    } else {
      if (selectedCompareIds.length >= 4) {
        alert('You can compare up to 4 tools at once.');
        return;
      }
      setSelectedCompareIds([...selectedCompareIds, toolId]);
    }
  };

  const handleSelectArticleById = (articleId) => {
    const found = highIntentArticles.find(a => a.id === articleId || a.slug === articleId) || highIntentArticles[0];
    const targetSlug = found.slug || found.id;
    const targetPath = found.canonicalUrl ? new URL(found.canonicalUrl).pathname : `/guides/${targetSlug}`;

    setSelectedArticle(found);
    setCurrentView('article-detail');
    window.history.pushState(null, '', targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegalView = (viewName) => {
    setLegalView(viewName);
    setCurrentView('legal-view');
    window.location.hash = viewName;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter tools logic
  const filteredTools = saasTools.filter((tool) => {
    if (!tool) return false;

    const name = tool.name || '';
    const desc = tool.description || '';
    const cat = tool.category || '';
    const search = searchTerm.toLowerCase();

    const matchesSearch = name.toLowerCase().includes(search) ||
                          desc.toLowerCase().includes(search) ||
                          (tool.features && Array.isArray(tool.features) && tool.features.some(f => typeof f === 'string' && f.toLowerCase().includes(search)));
    
    const matchesCategory = selectedCategory === 'all' || cat === selectedCategory;
    const matchesFree = !filterFreeOnly || tool.isFreeTier;
    const matchesOpenSource = !filterOpenSourceOnly || tool.isOpenSource;
    const isAiTool = cat.includes('ai') || name.toLowerCase().includes('ai') || desc.toLowerCase().includes('ai');
    const matchesTrending = !filterTrendingOnly || (isAiTool && (tool.badge?.includes('TRENDING') || tool.badge?.includes('LAUNCH') || tool.badge?.includes('STANDARD') || (tool.rating || 0) >= 4.8));

    return matchesSearch && matchesCategory && matchesFree && matchesOpenSource && matchesTrending;
  });

  const sortedTools = [...filteredTools].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
    return (b.reviewsCount || 0) - (a.reviewsCount || 0);
  });

  // Calculate Pagination Slices
  const totalPages = Math.ceil(sortedTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTools = sortedTools.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const el = document.getElementById('directory-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Compact Ellipsis Pagination Helper
  const getPaginationRange = (current, total) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
      return [1, 2, 3, 4, 5, '...', total];
    }
    if (current >= total - 3) {
      return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  const compareTools = saasTools.filter(t => selectedCompareIds.includes(t.id));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Global Schema.org Ingestion */}
      {injectGlobalOrganizationSchema()}

      {/* Toolify & BetaList Feature: Top Sponsored Banner */}
      <SponsoredBanner onOpenVendorModal={() => setShowVendorModal(true)} />

      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setSelectedArticle(null);
          setSelectedToolDetailId(null);
          if (view === 'directory') {
            window.location.hash = '';
            window.history.pushState(null, '', '/');
          }
        }}
        compareCount={selectedCompareIds.length}
        onOpenCompareModal={() => setShowCompareModal(true)}
        onOpenVendorModal={() => setShowVendorModal(true)}
        onOpenWizardModal={() => setShowWizardModal(true)}
        bookmarkCount={bookmarkedIds.length}
        onOpenBookmarkDrawer={() => setShowBookmarkDrawer(true)}
        currentLang={currentLang}
        onChangeLang={(langCode) => {
          setCurrentLang(langCode);
          document.documentElement.lang = langCode;
        }}
      />

      <ErrorBoundary>
        <main style={{ flex: 1 }}>
          {currentView === 'directory' && (
            <>
              {/* Hero Section */}
              <Hero
                currentLang={currentLang}
                searchTerm={searchTerm}
                onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
                onSearchSubmit={() => {
                  const el = document.getElementById('directory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                totalToolsCount={saasTools.length}
                onExploreClick={() => {
                  const el = document.getElementById('directory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onReadGuidesClick={() => {
                  const el = document.getElementById('guides-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onOpenWizardClick={() => setShowWizardModal(true)}
                onOpenSubmitClick={() => setShowVendorModal(true)}
              />

              {/* Growth Hack #1 Bar: Alternatives To [Software] */}
              <section style={{ background: 'var(--bg-sage)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '20px 0' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={20} color="#82A735" />
                    <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-dark)' }}>Growth Engine: Alternatives to Any Tool</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Alternatives to:</span>
                    
                    <ToolSearchInput
                      selectedTool={saasTools.find(t => t.id === selectedAlternativeToolId) || saasTools[0]}
                      onSelectTool={(tool) => tool && setSelectedAlternativeToolId(tool.id)}
                      tools={saasTools}
                      placeholder="Select Tool..."
                      background="#FFFFFF"
                      ariaLabel="Select tool to view alternatives"
                    />

                    <button 
                      onClick={() => {
                        const targetId = selectedAlternativeToolId || (saasTools[0] && saasTools[0].id);
                        if (targetId) {
                          window.history.pushState(null, '', `/alternatives/${targetId}`);
                          setCurrentView('alternatives-detail');
                        }
                      }} 
                      className="btn-pill-green"
                      style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                      aria-label="View Alternatives"
                    >
                      <span>View Alternatives</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </section>

              {/* Instant Programmatic Tool Versus Bar */}
              <section style={{ background: '#FFFFFF', borderBottom: '1px solid var(--border-color)', padding: '20px 0' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Scale size={20} color="#82A735" />
                    <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-dark)' }}>VS Pair Comparison:</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <ToolSearchInput
                      selectedTool={saasTools.find(t => t.id === selectedVersus.toolAId) || saasTools[0]}
                      onSelectTool={(tool) => tool && setSelectedVersus({ ...selectedVersus, toolAId: tool.id })}
                      tools={saasTools}
                      placeholder="Tool 1..."
                      background="#F6F7F2"
                      ariaLabel="Select first tool for pairwise comparison"
                    />

                    <span style={{ fontWeight: '800', color: 'var(--primary-green-dark)' }}>VS</span>

                    <ToolSearchInput
                      selectedTool={saasTools.find(t => t.id === selectedVersus.toolBId) || saasTools[1]}
                      onSelectTool={(tool) => tool && setSelectedVersus({ ...selectedVersus, toolBId: tool.id })}
                      tools={saasTools}
                      placeholder="Tool 2..."
                      background="#F6F7F2"
                      ariaLabel="Select second tool for pairwise comparison"
                    />

                    <button 
                      onClick={() => {
                        const tA = selectedVersus.toolAId || (saasTools[0] && saasTools[0].id);
                        const tB = selectedVersus.toolBId || (saasTools[1] && saasTools[1].id);
                        if (tA && tB) {
                          window.history.pushState(null, '', `/vs/${tA}-vs-${tB}`);
                          setCurrentView('versus-detail');
                        }
                      }} 
                      className="btn-pill-green"
                      style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                      aria-label="Compare tools now"
                    >
                      <span>Compare Now</span>
                      <ArrowUpRight size={15} />
                    </button>
                  </div>
                </div>
              </section>

              {/* Section 2: Software Directory */}
              <section id="directory-section" style={{ padding: '60px 0', background: '#FFFFFF' }}>
                <div className="container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div className="tag-uppercase" style={{ marginBottom: '6px' }}>VERIFIED DIRECTORY ({filteredTools.length} TOOLS)</div>
                      <h2 style={{ fontSize: '2.4rem', fontWeight: '800' }}>Explore Worldwide Software</h2>
                    </div>

                    {/* Search Bar & Sort Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ position: 'relative', minWidth: '240px' }}>
                        <Search size={18} color="var(--text-light)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          type="text"
                          placeholder="Search tools..."
                          value={searchTerm}
                          aria-label="Search software tools"
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 14px 10px 42px',
                            borderRadius: '9999px',
                            border: '1px solid var(--border-color)',
                            background: '#F6F7F2',
                            fontSize: '0.9rem',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <select
                        value={sortBy}
                        onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                        aria-label="Sort software tools"
                        style={{
                          padding: '10px 16px',
                          borderRadius: '9999px',
                          border: '1px solid var(--border-color)',
                          background: '#FFFFFF',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          color: 'var(--text-dark)',
                          cursor: 'pointer',
                          outline: 'none'
                        }}
                      >
                        <option value="popular">Sort: Most Popular</option>
                        <option value="rating">Sort: Top Rated</option>
                        <option value="name">Sort: Name (A-Z)</option>
                      </select>
                    </div>
                  </div>

                  {/* Toolify Feature: Category Explorer Grid */}
                  <CategoryGrid
                    selectedCategory={selectedCategory}
                    onSelectCategory={(catId) => {
                      setSelectedCategory(catId);
                      setCurrentPage(1);
                    }}
                  />

                  {/* Single-Row Horizontal Category Slider Component */}
                  <CategoryNav
                    categories={saasCategories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={(catId) => {
                      setSelectedCategory(catId);
                      setCurrentPage(1);
                    }}
                    filterFreeOnly={filterFreeOnly}
                    onToggleFreeOnly={() => {
                      setFilterFreeOnly(!filterFreeOnly);
                      setCurrentPage(1);
                    }}
                    filterOpenSourceOnly={filterOpenSourceOnly}
                    onToggleOpenSourceOnly={() => {
                      setFilterOpenSourceOnly(!filterOpenSourceOnly);
                      setCurrentPage(1);
                    }}
                    filterTrendingOnly={filterTrendingOnly}
                    onToggleTrendingOnly={() => {
                      setFilterTrendingOnly(!filterTrendingOnly);
                      setCurrentPage(1);
                    }}
                    currentLang={currentLang}
                  />

                  {/* Toolify 3-Column Layout Engine */}
                  <div className="toolify-3col-layout">
                    {/* Left Column: Featured Spotlights */}
                    <div className="toolify-col-left">
                      <FeaturedSidebar 
                        onSelectTool={handleSelectToolDetail} 
                        onOpenVendorModal={() => setShowVendorModal(true)}
                      />
                    </div>

                    {/* Center Column: Main Directory List */}
                    <div className="toolify-col-main">
                      {paginatedTools.map((tool) => (
                        <ToolCard
                          key={tool.id}
                          tool={tool}
                          isSelectedForCompare={selectedCompareIds.includes(tool.id)}
                          onToggleCompare={handleToggleCompare}
                          onOpenReviewModal={(t) => setSelectedReviewTool(t)}
                          onUpvoteTool={handleUpvoteTool}
                          upvotes={upvotesState[tool.id] || 120}
                          isBookmarked={bookmarkedIds.includes(tool.id)}
                          onToggleBookmark={handleToggleBookmark}
                          onSelectTool={handleSelectToolDetail}
                          onSelectCategory={(catId) => { setSelectedCategory(catId); setCurrentPage(1); const el = document.getElementById('directory-section'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}
                          currentLang={currentLang}
                        />
                      ))}
                    </div>

                    {/* Right Column: Real-Time AI News & Leaderboard Sidebar */}
                    <div className="toolify-col-right">
                      <AiNewsSidebar 
                        onSelectTool={handleSelectToolDetail}
                        onSelectArticle={(art) => handleSelectArticle(art)}
                      />
                    </div>
                  </div>

                  {/* Sleek Compact Ellipsis Single-Row Pagination Bar */}
                  {totalPages > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '40px', flexWrap: 'nowrap' }}>
                      <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="btn-pill-outline"
                        style={{ padding: '8px 16px', fontSize: '0.85rem', opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                        aria-label="Previous page"
                      >
                        <ChevronLeft size={16} /> Prev
                      </button>

                      {getPaginationRange(currentPage, totalPages).map((item, index) => {
                        if (item === '...') {
                          return (
                            <span key={`dots-${index}`} style={{ padding: '0 6px', color: 'var(--text-light)', fontWeight: '800' }}>
                              ...
                            </span>
                          );
                        }

                        return (
                          <button
                            key={item}
                            onClick={() => handlePageChange(item)}
                            aria-label={`Go to page ${item}`}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '12px',
                              border: '1px solid var(--border-color)',
                              background: currentPage === item ? '#82A735' : '#FFFFFF',
                              color: currentPage === item ? '#FFFFFF' : 'var(--text-dark)',
                              fontWeight: '800',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {item}
                          </button>
                        );
                      })}

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="btn-pill-outline"
                        style={{ padding: '8px 16px', fontSize: '0.85rem', opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                        aria-label="Next page"
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Vendor Promotion Callout Section ($199/yr Featured Tier) */}
              <section style={{ padding: '40px 0', background: 'var(--bg-sage)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Sparkles size={28} color="#82A735" />
                    <div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-dark)' }}>Are you a SaaS Founder?</h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Get your software featured in front of 50,000+ active purchasing managers and solopreneurs.</p>
                    </div>
                  </div>

                  <button onClick={() => setShowVendorModal(true)} className="btn-pill-green" style={{ padding: '12px 24px' }} aria-label="Apply for Featured Spot">
                    <span>Apply for Featured Spot ($199/yr)</span>
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </section>

              {/* Section 3: Useful Reads (Guides / Listicles) */}
              <section id="guides-section" style={{ padding: '60px 0' }}>
                <div className="container">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div className="tag-uppercase" style={{ marginBottom: '8px' }}>FRESH FROM THE STACK</div>
                      <h2 style={{ fontSize: '2.4rem', fontWeight: '800' }}>
                        Useful reads. <span className="serif-italic">Zero fluff.</span>
                      </h2>
                    </div>
                    <button onClick={() => setCurrentView('articles')} className="btn-pill-outline" aria-label="See all guides">
                      <span>See all guides</span>
                      <ArrowUpRight size={16} />
                    </button>
                  </div>

                  {/* Sleek Elegant Article Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {highIntentArticles.map((art) => (
                      <div 
                        key={art.id}
                        onClick={() => handleSelectArticle(art)}
                        style={{ 
                          background: '#FFFFFF', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: '20px', 
                          overflow: 'hidden', 
                          cursor: 'pointer', 
                          boxShadow: 'var(--shadow-soft)',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Read article: ${art.title}`}
                      >
                        {/* Premium Clean Sage Banner */}
                        <div style={{ 
                          background: 'var(--bg-sage)', 
                          borderBottom: '1px solid var(--border-color)', 
                          padding: '14px 20px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between'
                        }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.06em', color: 'var(--primary-green-dark)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <BookOpen size={13} color="var(--primary-green-dark)" /> {art.category}
                          </span>
                          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                            {art.readTime}
                          </span>
                        </div>

                        {/* Content Body */}
                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div className="tag-uppercase" style={{ marginBottom: '8px', fontSize: '0.7rem', color: 'var(--text-light)' }}>
                              UPDATED {art.publishDate}
                            </div>
                            <h3 style={{ fontSize: '1.18rem', fontWeight: '800', color: 'var(--text-dark)', marginBottom: '10px', lineHeight: '1.35' }}>
                              {art.title}
                            </h3>
                            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
                              {art.summary}
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-green-dark)', fontWeight: '700', fontSize: '0.85rem' }}>
                            <span>Read Full Guide</span>
                            <ArrowUpRight size={15} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}

          <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', fontWeight: '700' }}>Loading...</div>}>
            {currentView === 'articles' && (
              <section className="container" style={{ padding: '60px 16px' }}>
                <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
                  <div className="tag-uppercase" style={{ marginBottom: '8px' }}>BUYER GUIDES</div>
                  <h1 style={{ fontSize: '2.6rem', fontWeight: '800', marginBottom: '12px' }}>
                    Practical Guides. <span className="serif-italic">Zero fluff.</span>
                  </h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                    Independent research, pricing breakdowns, and software feature matrix comparisons to help you choose the right stack.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                  {highIntentArticles.map((art) => (
                    <div
                      key={art.id}
                      onClick={() => handleSelectArticleById(art.id)}
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid var(--border-color)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-soft)',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <div style={{
                        background: 'var(--bg-sage)',
                        borderBottom: '1px solid var(--border-color)',
                        padding: '14px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.06em', color: 'var(--primary-green-dark)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <BookOpen size={13} color="var(--primary-green-dark)" /> {art.category}
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                          {art.readTime}
                        </span>
                      </div>

                      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div className="tag-uppercase" style={{ marginBottom: '8px', fontSize: '0.7rem', color: 'var(--text-light)' }}>
                            UPDATED {art.publishDate}
                          </div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '10px', lineHeight: '1.35' }}>
                            {art.title}
                          </h3>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5' }}>
                            {art.summary}
                          </p>
                        </div>

                        <button className="btn-pill-green" style={{ padding: '8px 16px', fontSize: '0.82rem', alignSelf: 'flex-start' }} aria-label={`Read article: ${art.title}`}>
                          Read Article <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {currentView === 'article-detail' && selectedArticle && (
              <ArticleView
                article={selectedArticle}
                onBack={() => {
                  setCurrentView('directory');
                  setSelectedArticle(null);
                  window.location.hash = '';
                  window.history.pushState(null, '', '/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentView === 'versus-detail' && (
              <VersusPage
                toolAId={selectedVersus.toolAId}
                toolBId={selectedVersus.toolBId}
                onBack={() => {
                  setCurrentView('directory');
                  setSelectedVersus(null);
                  window.location.hash = '';
                  window.history.pushState(null, '', '/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentView === 'alternatives-detail' && (
              <AlternativesView
                targetToolId={selectedAlternativeToolId}
                onBack={() => {
                  setCurrentView('directory');
                  window.location.hash = '';
                  window.history.pushState(null, '', '/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {currentView === 'category-grid' && (
              <CategoryGridPage
                onSelectCategory={(catId) => {
                  setSelectedCategory(catId);
                  setCurrentView('directory');
                  window.history.pushState(null, '', '/');
                  const el = document.getElementById('directory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onBack={() => {
                  setCurrentView('directory');
                  window.history.pushState(null, '', '/');
                }}
              />
            )}

            {currentView === 'ranking' && (
              <RankingPage
                onSelectTool={(tId) => {
                  setSelectedToolDetailId(tId);
                  setCurrentView('tool-detail');
                }}
                onSelectCategory={(catId) => {
                  setSelectedCategory(catId);
                  setCurrentView('directory');
                  window.history.pushState(null, '', '/');
                }}
              />
            )}

            {currentView === 'advertise' && (
              <AdvertisePage
                onOpenVendorModal={handleOpenVendorModal}
              />
            )}

            {(currentView === 'privacy' || currentView === 'terms' || currentView === 'refund' || currentView === 'disclosure' || currentView === 'legal-view') && (
              <LegalViews
                view={legalView || currentView}
                onBack={() => {
                  setCurrentView('directory');
                  window.location.hash = '';
                  window.history.pushState(null, '', '/');
                }}
              />
            )}

            {currentView === 'tool-detail' && (
              <ToolDetailPage
                toolId={selectedToolDetailId}
                onBack={() => {
                  setCurrentView('directory');
                  setSelectedToolDetailId(null);
                  window.location.hash = '';
                  window.history.pushState(null, '', '/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenReviewModal={(t) => setSelectedReviewTool(t)}
                onToggleCompare={handleToggleCompare}
                isSelectedForCompare={selectedCompareIds.includes(selectedToolDetailId)}
                onOpenBadgeModal={() => setShowBadgeModal(true)}
              />
            )}
          </Suspense>
        </main>
      </ErrorBoundary>

      {/* Modals Suspense */}
      <Suspense fallback={null}>
        {showCompareModal && (
          <ComparisonModal
            tools={compareTools}
            onClose={() => setShowCompareModal(false)}
          />
        )}

        {showVendorModal && (
          <VendorModal
            initialPackage={vendorModalPackage}
            onClose={() => setShowVendorModal(false)}
          />
        )}

        {showWizardModal && (
          <StackWizardModal
            onClose={() => setShowWizardModal(false)}
          />
        )}

        {selectedReviewTool && (
          <ReviewModal
            tool={selectedReviewTool}
            onClose={() => setSelectedReviewTool(null)}
          />
        )}

        {showBadgeModal && (
          <BadgeEmbedModal
            onClose={() => setShowBadgeModal(false)}
          />
        )}

        <BookmarkDrawer
          isOpen={showBookmarkDrawer}
          onClose={() => setShowBookmarkDrawer(false)}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
          onClearBookmarks={() => setBookmarkedIds([])}
        />
      </Suspense>

      {/* Footer */}
      <Footer 
        setCurrentView={setCurrentView}
        setLegalView={setLegalView}
        setSelectedCategory={setSelectedCategory}
        currentLang={currentLang}
        onChangeLang={setCurrentLang}
        onOpenBadgeModal={() => setShowBadgeModal(true)}
      />
    </div>
  );
}
