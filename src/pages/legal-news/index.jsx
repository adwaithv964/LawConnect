import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import { getNewsItems } from '../../utils/api';

const CATEGORIES = [
    { id: 'all', label: 'All News', icon: 'Globe' },
    { id: 'supreme-court', label: 'Supreme Court', icon: 'Gavel' },
    { id: 'high-court', label: 'High Courts', icon: 'Scale' },
    { id: 'consumer', label: 'Consumer', icon: 'ShoppingCart' },
    { id: 'cyber', label: 'Cyber Law', icon: 'Shield' },
    { id: 'family', label: 'Family Law', icon: 'Users' },
    { id: 'criminal', label: 'Criminal Law', icon: 'AlertTriangle' },
];

function timeAgo(dateStr) {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

const NewsCard = ({ item }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-elevation-3 hover:border-primary/30 transition-smooth"
        >
            {/* Thumbnail */}
            <div className="relative h-44 overflow-hidden bg-muted flex-shrink-0">
                {item.image && !imgError ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <Icon name="Newspaper" size={40} color="var(--color-primary)" />
                    </div>
                )}
                {/* Source badge */}
                {item.source && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-foreground/80 backdrop-blur-sm text-background text-xs font-medium rounded-full">
                        {item.source}
                    </div>
                )}
                {/* External link hint */}
                <div className="absolute top-2 right-2 p-1.5 bg-card/90 rounded-lg opacity-0 group-hover:opacity-100 transition-smooth">
                    <Icon name="ExternalLink" size={14} color="var(--color-primary)" />
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 p-4 flex-1">
                <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-3 group-hover:text-primary transition-smooth">
                    {item.title}
                </h3>
                {item.snippet && (
                    <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
                        {item.snippet}
                    </p>
                )}
                <div className="flex items-center justify-between pt-2 mt-auto border-t border-border">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Icon name="Clock" size={12} color="currentColor" />
                        {timeAgo(item.pubDate)}
                    </span>
                    <span className="text-xs text-primary font-medium flex items-center gap-1">
                        Read more <Icon name="ArrowRight" size={12} color="currentColor" />
                    </span>
                </div>
            </div>
        </a>
    );
};

// Loading skeleton
const NewsSkeleton = () => (
    <div className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
        <div className="h-44 bg-muted" />
        <div className="p-4 space-y-3">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
            <div className="h-3 bg-muted rounded w-3/4" />
            <div className="flex justify-between pt-2 border-t border-border">
                <div className="h-3 w-16 bg-muted rounded" />
                <div className="h-3 w-20 bg-muted rounded" />
            </div>
        </div>
    </div>
);

const LegalNews = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [newsItems, setNewsItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastRefreshed, setLastRefreshed] = useState(null);

    const fetchNews = useCallback(async (cat = selectedCategory) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getNewsItems(cat, 24);
            setNewsItems(data?.items || []);
            setLastRefreshed(new Date());
        } catch (err) {
            setError('Failed to load news. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchNews(selectedCategory);
    }, [selectedCategory]);

    const handleCategoryChange = (catId) => {
        setSelectedCategory(catId);
    };

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Legal News – LawConnect</title>
                <meta name="description" content="Stay up to date with the latest Indian legal news including Supreme Court rulings, High Court decisions, and law updates." />
            </Helmet>

            <Header />
            <EmergencyAlertBanner />

            <main className="mx-4 lg:mx-6 py-6 lg:py-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-6 rounded-full bg-primary" />
                            <span className="text-xs font-semibold text-primary uppercase tracking-widest">Live Feed</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-1">
                            Legal News
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Real-time Indian legal news from Supreme Court, High Courts, and trusted sources.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {lastRefreshed && (
                            <span className="text-xs text-muted-foreground hidden sm:block">
                                Updated {timeAgo(lastRefreshed)}
                            </span>
                        )}
                        <button
                            onClick={() => fetchNews(selectedCategory)}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted transition-smooth font-medium text-sm disabled:opacity-50"
                        >
                            <Icon name={isLoading ? 'Loader' : 'RefreshCw'} size={16} className={isLoading ? 'animate-spin' : ''} color="currentColor" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-smooth whitespace-nowrap
                ${selectedCategory === cat.id
                                    ? 'bg-primary text-primary-foreground shadow-md'
                                    : 'bg-card border border-border text-foreground hover:bg-muted'
                                }`}
                        >
                            <Icon name={cat.icon} size={14} color="currentColor" />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error mb-6">
                        <Icon name="AlertCircle" size={20} color="currentColor" />
                        <span className="text-sm">{error}</span>
                        <button onClick={() => fetchNews(selectedCategory)} className="ml-auto text-sm font-medium underline">Retry</button>
                    </div>
                )}

                {/* News Count */}
                {!isLoading && newsItems.length > 0 && (
                    <p className="text-sm text-muted-foreground mb-4">
                        Showing <span className="font-semibold text-foreground">{newsItems.length}</span> articles
                    </p>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5">
                    {isLoading
                        ? Array.from({ length: 12 }).map((_, i) => <NewsSkeleton key={i} />)
                        : newsItems.map((item, idx) => (
                            <NewsCard key={`${item.link}-${idx}`} item={item} />
                        ))
                    }
                </div>

                {/* Empty state */}
                {!isLoading && newsItems.length === 0 && !error && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Icon name="Newspaper" size={28} color="var(--color-muted-foreground)" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">No news right now</h3>
                        <p className="text-muted-foreground text-sm">Try a different category or refresh to check again.</p>
                    </div>
                )}

                {/* Footer note */}
                <p className="text-center text-xs text-muted-foreground mt-10">
                    News sourced from Google News, The Hindu, and Times of India. Click any card to read the full article on the source website.
                </p>
            </main>
        </div>
    );
};

export default LegalNews;
