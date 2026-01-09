import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';


const ArticleCard = ({ article, onBookmark, onShare }) => {
  const [isBookmarked, setIsBookmarked] = useState(article?.isBookmarked);

  const handleBookmark = (e) => {
    e?.preventDefault();
    setIsBookmarked(!isBookmarked);
    onBookmark(article?.id);
  };

  const handleShare = (e) => {
    e?.preventDefault();
    onShare(article);
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-success/10 text-success';
      case 'intermediate':
        return 'bg-warning/10 text-warning';
      case 'advanced':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-elevation-3 transition-smooth">
      <Link to={`/legal-library/${article?.id}`} className="block">
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
                name={isBookmarked ? 'Bookmark' : 'Bookmark'} 
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
              <Icon name={article?.categoryIcon} size={12} color="currentColor" />
              {article?.category}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(article?.difficulty)}`}>
              {article?.difficulty}
            </span>
          </div>

          <h3 className="text-lg font-heading font-semibold text-foreground mb-2 line-clamp-2">
            {article?.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {article?.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Icon name="Clock" size={14} color="currentColor" />
                {article?.readTime} min
              </span>
              <span className="flex items-center gap-1">
                <Icon name="Eye" size={14} color="currentColor" />
                {article?.views}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="ThumbsUp" size={14} color="currentColor" />
                {article?.likes}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {article?.publishDate}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ArticleCard;