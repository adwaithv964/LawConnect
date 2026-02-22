import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  logActivity,
  getArticles,
  syncArticles,
  getArticleStats,
  getTrendingArticles,
  getRecentlyViewed,
  getRecommendedArticles,
  toggleArticleBookmark,
  getCases,
  smartSearch,
  suggestQuestions,
} from '../../utils/api';
// ... rest of imports remain the same

// ─── LegalLibrary Component START ─────────────────────────────────────────
// (To be injected further down using another instruction block to match correctly)
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import CaseStatusIndicator from '../../components/ui/CaseStatusIndicator';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import FilterPanel from './components/FilterPanel';
import ArticleGrid from './components/ArticleGrid';
import TrendingArticles from './components/TrendingArticles';
import RecentlyViewed from './components/RecentlyViewed';
import RecommendedArticles from './components/RecommendedArticles';
import QuickStats from './components/QuickStats';
import AiQAPanel from './components/AiQAPanel';
import AiSearchSuggestions from './components/AiSearchSuggestions';
import LegalResearchPanel from './components/LegalResearchPanel';
import LawBrowser from './components/LawBrowser';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

// ─── Category definitions ─────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: 'LayoutGrid' },
  { id: 'consumer', name: 'Consumer Rights', icon: 'ShoppingCart' },
  { id: 'property', name: 'Property Law', icon: 'Home' },
  { id: 'cyber', name: 'Cyber Crimes', icon: 'Shield' },
  { id: 'family', name: 'Family Law', icon: 'Users' },
  { id: 'constitutional', name: 'Constitutional Rights', icon: 'Scale' },
];

function timeAgoLabel(date) {
  if (!date) return '';
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 172800) return 'Yesterday';
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function normaliseArticle(a) {
  return {
    ...a,
    id: a._id,
    publishDate: a.publishDate
      ? new Date(a.publishDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : '',
    viewedAt: a.viewedAt ? timeAgoLabel(a.viewedAt) : undefined,
    views: a.views >= 1000 ? `${(a.views / 1000).toFixed(1)}k` : String(a.views || 0),
  };
}

const LegalLibrary = () => {
  // ── Filters / search ─────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [difficultyLevel, setDifficultyLevel] = useState('all');
  const [contentType, setContentType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);
  const [isResearchPanelOpen, setIsResearchPanelOpen] = useState(false);

  // ── Pagination ────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // ── Articles ──────────────────────────────────────────────────────────────
  const [articles, setArticles] = useState([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [quickStats, setQuickStats] = useState([
    { id: 1, icon: 'FileText', value: '—', label: 'Total Articles' },
    { id: 2, icon: 'Eye', value: '—', label: 'Total Reads' },
    { id: 3, icon: 'BookOpen', value: '—', label: 'Categories' },
    { id: 4, icon: 'TrendingUp', value: '—', label: 'New This Month' },
  ]);
  const [activeCasesCount, setActiveCasesCount] = useState(0);

  // ── AI state ──────────────────────────────────────────────────────────────
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiSearchIntent, setAiSearchIntent] = useState('');
  const [isSyncingNews, setIsSyncingNews] = useState(false);

  // ── Loading / error ───────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const searchDebounce = useRef(null);
  const aiDebounce = useRef(null);

  // ── Sync News ────────────────────────────────────────────────────────────
  const handleSyncNews = async () => {
    setIsSyncingNews(true);
    setError(null);
    try {
      const res = await syncArticles();
      if (res.count > 0) {
        fetchArticles({ append: false, pageNum: 1 });
      } else {
        setError('No new articles found right now.');
      }
    } catch (err) {
      setError('Failed to sync new articles.');
    } finally {
      setIsSyncingNews(false);
    }
  };

  // ── Fetch articles ───────────────────────────────────────────────────────
  const fetchArticles = useCallback(async (opts = {}) => {
    const { append = false, pageNum = 1 } = opts;
    if (!append) setIsLoading(true);
    else setIsLoadingMore(true);
    setError(null);
    try {
      const result = await getArticles({
        search: searchQuery,
        category: selectedCategory,
        difficulty: difficultyLevel,
        sort: sortBy,
        page: pageNum,
        limit: 9,
        curated: true,
      });
      const normalised = (result.articles || []).map(normaliseArticle);
      setArticles(prev => append ? [...prev, ...normalised] : normalised);
      setTotalArticles(result.total || 0);
      setHasMore(result.hasMore || false);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || 'Failed to load articles');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [searchQuery, selectedCategory, difficultyLevel, sortBy]);

  // ── Initial sidebar + stats load ─────────────────────────────────────────
  useEffect(() => {
    logActivity({
      type: 'library', title: 'Legal Library Visited',
      description: 'Browsed legal articles and resources',
      link: '/legal-library', icon: 'BookOpen',
      iconColor: 'var(--color-warning)'
    }).catch(() => { });

    Promise.all([
      getTrendingArticles(),
      getRecentlyViewed(),
      getRecommendedArticles(),
      getArticleStats(),
      getCases(),
    ]).then(([trending, recent, recommended, stats, cases]) => {
      setTrendingArticles((trending || []).map(normaliseArticle));
      setRecentlyViewed((recent || []).map(normaliseArticle));
      setRecommendedArticles((recommended || []).map(a => ({
        ...normaliseArticle(a),
        rating: (4.5 + Math.random() * 0.5).toFixed(1),
        basedOn: a.category,
      })));
      if (stats) {
        setQuickStats([
          { id: 1, icon: 'FileText', value: String(stats.total || 0), label: 'Total Articles' },
          { id: 2, icon: 'Eye', value: String(stats.readers || '0'), label: 'Total Reads' },
          { id: 3, icon: 'BookOpen', value: String(stats.categories || 0), label: 'Categories' },
          { id: 4, icon: 'TrendingUp', value: String(stats.newThisMonth || 0), label: 'New This Month' },
        ]);
      }
      const activeCases = (cases || []).filter(c =>
        ['active', 'pending', 'Active', 'Pending'].includes(c.status)
      );
      setActiveCasesCount(activeCases.length);
    }).catch(() => { });
  }, []);

  // ── Articles re-fetch when filters change ────────────────────────────────
  useEffect(() => {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      fetchArticles({ append: false, pageNum: 1 });
    }, searchQuery ? 400 : 0);
    return () => clearTimeout(searchDebounce.current);
  }, [fetchArticles]);

  // ── AI Smart Search: runs when searchQuery changes (debounced 700ms) ─────
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 5) {
      setAiSuggestions([]);
      setAiSearchIntent('');
      return;
    }
    if (aiDebounce.current) clearTimeout(aiDebounce.current);
    aiDebounce.current = setTimeout(async () => {
      setIsAiSearching(true);
      try {
        const result = await smartSearch(searchQuery);
        setAiSuggestions(result.suggestions || []);
        setAiSearchIntent(result.intent || '');
        // Auto-suggest category if confident
        if (result.suggestedCategory && result.suggestedCategory !== 'all') {
          setSelectedCategory(result.suggestedCategory);
        }
      } catch (_) {
        setAiSuggestions([]);
      } finally {
        setIsAiSearching(false);
      }
    }, 700);
    return () => clearTimeout(aiDebounce.current);
  }, [searchQuery]);

  // ── Refresh recently-viewed sidebar ──────────────────────────────────────
  const refreshRecentlyViewed = useCallback(() => {
    getRecentlyViewed()
      .then(recent => setRecentlyViewed((recent || []).map(normaliseArticle)))
      .catch(() => { });
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleBookmark = useCallback(async (articleId) => {
    try {
      await toggleArticleBookmark(articleId);
      setArticles(prev =>
        prev.map(a => a._id === articleId || a.id === articleId
          ? { ...a, isBookmarked: !a.isBookmarked } : a
        )
      );
    } catch (err) { console.error('Bookmark error:', err); }
  }, []);

  const handleShare = useCallback((article) => {
    if (navigator.share) {
      navigator.share({ title: article?.title, text: article?.excerpt, url: window.location.href }).catch(() => { });
    } else {
      navigator.clipboard?.writeText(window.location.href).catch(() => { });
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    fetchArticles({ append: true, pageNum: page + 1 });
  }, [fetchArticles, page]);

  const handleClearFilters = () => {
    setContentType('all');
    setDifficultyLevel('all');
    setSortBy('recent');
  };

  // When AI suggests a question, set it as the search
  const handleSelectSuggestion = (q) => {
    setSearchQuery(q);
    setAiSuggestions([]);
  };

  const hasActiveFilters = contentType !== 'all' || difficultyLevel !== 'all' || sortBy !== 'recent';

  const categoriesWithCounts = CATEGORIES.map(cat => ({
    ...cat,
    count: cat.id === 'all' ? totalArticles : 0,
  }));

  return (
    <>
      <Helmet>
        <title>Legal Library - LawConnect</title>
        <meta name="description" content="AI-powered legal library with smart search, article summaries, and a legal Q&A assistant." />
      </Helmet>

      {/* Legal Research Sliding Panel */}
      <LegalResearchPanel
        articles={articles}
        isOpen={isResearchPanelOpen}
        onClose={() => setIsResearchPanelOpen(false)}
        onArticleGenerated={() => fetchArticles({ append: false, pageNum: 1 })}
      />
      {isResearchPanelOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsResearchPanelOpen(false)} />
      )}

      <div className="min-h-screen bg-background">
        <Header />
        <EmergencyAlertBanner />
        <CaseStatusIndicator />
        <OfflineStatusIndicator />

        <main className="pt-32 lg:pt-36 pb-12 lg:pb-16">
          <div className="mx-4 lg:mx-6">

            {/* Page header */}
            <div className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Legal Library
                </h1>
                <p className="text-base lg:text-lg text-muted-foreground">
                  Explore our comprehensive collection of legal articles, guides, and resources.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Sync News Button */}
                <button
                  onClick={handleSyncNews}
                  disabled={isSyncingNews}
                  className="flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-smooth font-semibold text-sm disabled:opacity-50"
                >
                  <Icon name={isSyncingNews ? "Loader" : "RefreshCw"} size={18} className={isSyncingNews ? "animate-spin" : ""} color="currentColor" />
                  {isSyncingNews ? 'Syncing...' : 'Sync Latest News'}
                </button>

                {/* AI Ask Button — prominent CTA */}
                <button
                  onClick={() => setIsResearchPanelOpen(true)}
                  className="flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-primary/70 transition-smooth font-semibold text-sm"
                >
                  <Icon name="Scale" size={18} color="currentColor" />
                  Legal Research AI
                </button>
              </div>
            </div>

            {/* Stats bar */}
            <QuickStats stats={quickStats} />

            {/* Error banner */}
            {error && (
              <div className="mt-4 flex items-center gap-3 p-4 bg-error/10 border border-error/20 rounded-xl text-error">
                <Icon name="AlertCircle" size={18} color="currentColor" />
                <span className="text-sm">{error}</span>
                <Button variant="ghost" size="sm" onClick={() => fetchArticles()}>Retry</Button>
              </div>
            )}

            {/* Search + AI suggestions */}
            <div className="mt-6 lg:mt-8 mb-6 lg:mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearchSubmit={() => fetchArticles({ append: false, pageNum: 1 })}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  iconName="SlidersHorizontal"
                  iconPosition="left"
                  className="lg:hidden"
                >
                  Filters
                </Button>
              </div>

              {/* AI intent hint */}
              {aiSearchIntent && (
                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                  <Icon name="Sparkles" size={12} color="var(--color-primary)" />
                  <span className="text-primary font-medium">AI:</span>
                  {aiSearchIntent}
                </p>
              )}

              {/* AI suggested follow-up questions */}
              <AiSearchSuggestions
                suggestions={aiSuggestions}
                onSelectQuestion={handleSelectSuggestion}
                isLoading={isAiSearching}
              />
            </div>

            {/* Main 3-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

              {/* Left sidebar — categories + filters */}
              <aside className={`lg:col-span-3 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <CategoryFilter
                  categories={categoriesWithCounts}
                  selectedCategory={selectedCategory}
                  onCategoryChange={(cat) => setSelectedCategory(cat)}
                />
                <FilterPanel
                  contentType={contentType}
                  difficultyLevel={difficultyLevel}
                  sortBy={sortBy}
                  onContentTypeChange={setContentType}
                  onDifficultyChange={setDifficultyLevel}
                  onSortChange={setSortBy}
                  onClearFilters={handleClearFilters}
                  hasActiveFilters={hasActiveFilters}
                />

                {/* Law Browser mini-widget */}
                <div
                  onClick={() => setIsResearchPanelOpen(true)}
                  className="cursor-pointer p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-smooth"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Scale" size={16} color="var(--color-primary)" />
                    <span className="text-sm font-semibold text-primary">Indian Legal AI</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Browse IPC/BNS, CrPC/BNSS, Constitution, Consumer law — with live web citations.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {['BNS', 'IPC', 'BNSS', 'Constitution', 'Consumer'].map(t => (
                      <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">{t}</span>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Centre — article grid */}
              <div className="lg:col-span-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {isLoading
                      ? 'Loading articles…'
                      : `Showing ${articles.length} of ${totalArticles} article${totalArticles !== 1 ? 's' : ''}`
                    }
                  </p>
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { setSearchQuery(''); setAiSuggestions([]); setAiSearchIntent(''); }}
                      iconName="X"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Clear search
                    </Button>
                  )}
                </div>

                <ArticleGrid
                  articles={articles}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                  onArticleView={refreshRecentlyViewed}
                  isLoading={isLoading}
                />

                {!isLoading && hasMore && (
                  <div className="mt-8 text-center">
                    <Button
                      variant="outline"
                      iconName={isLoadingMore ? 'Loader' : 'RefreshCw'}
                      iconPosition="left"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                    >
                      {isLoadingMore ? 'Loading…' : 'Load More Articles'}
                    </Button>
                  </div>
                )}

                {!isLoading && !hasMore && articles.length > 0 && (
                  <p className="mt-8 text-center text-sm text-muted-foreground">
                    All {totalArticles} articles loaded
                  </p>
                )}
              </div>

              {/* Right sidebar */}
              <aside className="lg:col-span-3 space-y-6">
                <TrendingArticles articles={trendingArticles} />
                <RecentlyViewed articles={recentlyViewed} />
                <RecommendedArticles articles={recommendedArticles} />
              </aside>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default LegalLibrary;