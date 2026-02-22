import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { viewArticle, summariseArticle } from '../../../utils/api';


const ArticleCard = ({ article, onBookmark, onShare, onArticleView }) => {
  const articleId = article?._id || article?.id;
  const [isBookmarked, setIsBookmarked] = useState(article?.isBookmarked || false);
  const [viewCount, setViewCount] = useState(article?.views || '0');
  const [summary, setSummary] = useState(null);
  const [isSummarising, setIsSummarising] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleBookmark = (e) => {
    e?.preventDefault();
    setIsBookmarked(prev => !prev);
    onBookmark?.(articleId);
  };

  const handleShare = (e) => {
    e?.preventDefault();
    onShare?.(article);
  };

  const handleArticleClick = async () => {
    try {
      const result = await viewArticle(articleId);
      if (result?.views !== undefined) {
        const v = result.views;
        setViewCount(v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v));
      }
    } catch (_) { }
    onArticleView?.();
  };

  const handleAiSummary = async (e) => {
    e?.preventDefault();
    if (summary) { setShowSummary(prev => !prev); return; }
    setIsSummarising(true);
    setShowSummary(true);
    try {
      const result = await summariseArticle(article);
      setSummary(result.summary);
    } catch (_) {
      setSummary('Unable to generate summary. Please try again.');
    } finally {
      setIsSummarising(false);
    }
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-success/10 text-success';
      case 'intermediate': return 'bg-warning/10 text-warning';
      case 'advanced': return 'bg-error/10 text-error';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-elevation-3 transition-smooth">
      <Link to={`/legal-library/${articleId}`} className="block" onClick={handleArticleClick}>
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article?.image}
            alt={article?.imageAlt}
            className="w-full h-full object-cover hover:scale-105 transition-smooth"
          />
          {article?.isFeatured && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-semibold">
              <Icon name="Star" size={14} color="currentColor" />
              Featured
            </div>
          )}
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleBookmark}
              className="p-2 bg-card/90 backdrop-blur-sm rounded-lg hover:bg-card transition-smooth"
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Icon
                name="Bookmark"
                size={18}
                color={isBookmarked ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
                strokeWidth={isBookmarked ? 0 : 2}
                fill={isBookmarked ? 'var(--color-primary)' : 'none'}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-card/90 backdrop-blur-sm rounded-lg hover:bg-card transition-smooth"
              aria-label="Share article"
            >
              <Icon name="Share2" size={18} color="var(--color-muted-foreground)" />
            </button>
          </div>
        </div>

        <div className="p-4 lg:p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
              <Icon name={article?.categoryIcon || 'FileText'} size={12} color="currentColor" />
              {article?.category}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(article?.difficulty)}`}>
              {article?.difficulty}
            </span>
          </div>

          <h3 className="text-lg font-heading font-semibold text-foreground mb-2 line-clamp-2">
            {article?.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {article?.excerpt}
          </p>
        </div>
      </Link>

      {/* AI Summary section — outside Link to avoid nav on click */}
      <div className="px-4 lg:px-6 pb-4 lg:pb-6">
        <button
          onClick={handleAiSummary}
          className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-smooth mb-2"
        >
          <Icon
            name={isSummarising ? 'Loader' : 'Sparkles'}
            size={13}
            color="currentColor"
          />
          {isSummarising ? 'Generating summary…' : showSummary && summary ? 'Hide AI Summary' : 'AI Summary'}
        </button>

        {showSummary && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 text-xs text-foreground leading-relaxed">
            {isSummarising ? (
              <div className="flex gap-1 items-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1 mb-1.5 text-primary font-medium">
                  <Icon name="Sparkles" size={11} color="currentColor" />
                  AI Summary
                </div>
                {summary}
              </>
            )}
          </div>
        )}

        {/* Stats footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border mt-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Icon name="Clock" size={14} color="currentColor" />
              {article?.readTime} min
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Eye" size={14} color="currentColor" />
              {viewCount}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="ThumbsUp" size={14} color="currentColor" />
              {article?.likes}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{article?.publishDate}</span>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;