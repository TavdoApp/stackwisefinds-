import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ToolCard from './components/ToolCard';
import CategoryNav from './components/CategoryNav';
import CategoryGrid from './components/CategoryGrid';
import Footer from './components/Footer';
import SponsoredBanner from './components/SponsoredBanner';

import { saasTools, saasCategories } from './data/saasData.jsx';
import { highIntentArticles } from './data/articlesData';
import { injectGlobalOrganizationSchema } from './utils/schemaMarkup.jsx';
import { ArrowUpRight, Sparkles, Scale, Search, Layers, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

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
  const [currentView, setCurrentView] = useState('directory');
  const [currentLang, setCurrentLang] = useState('en');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedVersus, setSelectedVersus] = useState({ toolAId: 'freshbooks', toolBId: 'quickbooks' });
  const [selectedAlternativeToolId, setSelectedAlternativeToolId] = useState('freshbooks');
  const [selectedReviewTool, setSelectedReviewTool] = useState(null);
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

  // Sleek Pagination State (20 tools per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Compare & Modal states
  const [selectedCompareIds, setSelectedCompareIds] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showWizardModal, setShowWizardModal] = useState(false);

  // Listen to URL Hash / Query Parameter for direct deep linking & article subroutes
  useEffect(() => {
    const handleUrlRouting = () => {
      const hash = window.location.hash.toLowerCase().replace('#', '');
      const search = window.location.search.toLowerCase();

      if (hash.startsWith('guide-') || search.includes('article=')) {
        const artId = hash.replace('guide-', '').trim();
        const found = highIntentArticles.find(a => a.id === artId);
        if (found) {
          setSelectedArticle(found);
          setCurrentView('article-detail');
        }
      } else if (hash === 'terms' || search.includes('page=terms')) {
        setLegalView('terms');
        setCurrentView('legal-view');
      } else if (hash === 'refund' || search.includes('page=refund')) {
        setLegalView('refund');
        setCurrentView('legal-view');
      } else if (hash === 'privacy' || search.includes('page=privacy')) {
        setLegalView('privacy');
        setCurrentView('legal-view');
      } else if (hash === 'pricing' || search.includes('page=pricing')) {
        setShowVendorModal(true);
      }
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    return () => window.removeEventListener('hashchange', handleUrlRouting);
  }, []);

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
    const found = highIntentArticles.find(a => a.id === articleId) || highIntentArticles[0];
    setSelectedArticle(found);
    setCurrentView('article-detail');
    window.location.hash = `guide-${found.id}`;
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
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (tool.features && tool.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesFree = !filterFreeOnly || tool.isFreeTier;
    const matchesOpenSource = !filterOpenSourceOnly || tool.isOpenSource;
    const isAiTool = tool.category.includes('ai') || tool.name.toLowerCase().includes('ai') || tool.description.toLowerCase().includes('ai');
    const matchesTrending = !filterTrendingOnly || (isAiTool && (tool.badge?.includes('TRENDING') || tool.badge?.includes('LAUNCH') || tool.badge?.includes('STANDARD') || tool.rating >= 4.8));

    return matchesSearch && matchesCategory && matchesFree && matchesOpenSource && matchesTrending;
  });

  // Calculate Pagination Slices
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTools = filteredTools.slice(startIndex, startIndex + itemsPerPage);

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
          if (view === 'directory') window.location.hash = '';
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
                onExploreClick={() => {
                  const el = document.getElementById('directory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onReadGuidesClick={() => {
                  const el = document.getElementById('guides-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                onOpenWizardClick={() => setShowWizardModal(true)}
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
                    <select
                      value={selectedAlternativeToolId}
                      onChange={(e) => setSelectedAlternativeToolId(e.target.value)}
                      aria-label="Select tool to view alternatives"
                      style={{ padding: '8px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: '#FFFFFF', fontWeight: '700', fontSize: '0.88rem', outline: 'none' }}
                    >
                      {saasTools.slice(0, 100).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>

                    <button 
                      onClick={() => setCurrentView('alternatives-detail')} 
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
                    <select
                      value={selectedVersus.toolAId}
                      onChange={(e) => setSelectedVersus({ ...selectedVersus, toolAId: e.target.value })}
                      aria-label="Select first tool for pairwise comparison"
                      style={{ padding: '8px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: '#F6F7F2', fontWeight: '700', fontSize: '0.88rem', outline: 'none' }}
                    >
                      {saasTools.slice(0, 100).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>

                    <span style={{ fontWeight: '800', color: 'var(--primary-green-dark)' }}>VS</span>

                    <select
                      value={selectedVersus.toolBId}
                      onChange={(e) => setSelectedVersus({ ...selectedVersus, toolBId: e.target.value })}
                      aria-label="Select second tool for pairwise comparison"
                      style={{ padding: '8px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: '#F6F7F2', fontWeight: '700', fontSize: '0.88rem', outline: 'none' }}
                    >
                      {saasTools.slice(0, 100).map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>

                    <button 
                      onClick={() => setCurrentView('versus-detail')} 
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

                    {/* Search Bar */}
                    <div style={{ position: 'relative', minWidth: '260px' }}>
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

                  {/* Directory Paginated List */}
                  <div>
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
                        currentLang={currentLang}
                      />
                    ))}
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
                        onClick={() => handleSelectArticleById(art.id)}
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
                  window.location.hash = '';
                }}
              />
            )}

            {currentView === 'versus-detail' && (
              <VersusPage
                toolAId={selectedVersus.toolAId}
                toolBId={selectedVersus.toolBId}
                onBack={() => {
                  setCurrentView('directory');
                  window.location.hash = '';
                }}
              />
            )}

            {currentView === 'alternatives-detail' && (
              <AlternativesView
                targetToolId={selectedAlternativeToolId}
                onBack={() => {
                  setCurrentView('directory');
                  window.location.hash = '';
                }}
              />
            )}

            {currentView === 'legal-view' && (
              <LegalViews
                legalView={legalView}
                onBack={() => {
                  setCurrentView('directory');
                  window.location.hash = '';
                }}
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
            onClose={() => setShowShowCompareModal(false)}
          />
        )}

        {showVendorModal && (
          <VendorModal
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
        onOpenVendorModal={() => setShowVendorModal(true)} 
        onSelectArticle={handleSelectArticleById}
        onOpenLegalView={handleOpenLegalView}
      />
    </div>
  );
}
