import React from 'react';
import ArticleCard from './ArticleCard';
import Icon from '../../../components/AppIcon';


const ArticleGrid = ({ articles, onBookmark, onShare, onArticleView, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
            <div className="h-48 bg-muted"></div>
            <div className="p-4 lg:p-6 space-y-3">
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-muted rounded"></div>
                <div className="h-6 w-20 bg-muted rounded"></div>
              </div>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
              <div className="flex justify-between pt-4">
                <div className="h-4 w-32 bg-muted rounded"></div>
                <div className="h-4 w-20 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12 lg:py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
          <Icon name="FileText" size={32} color="var(--color-muted-foreground)" />
        </div>
        <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
          No Articles Found
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {articles.map((article, index) => (
        <ArticleCard
          key={`${article?._id || article?.id || index}-${index}`}
          article={article}
          onBookmark={onBookmark}
          onShare={onShare}
          onArticleView={onArticleView}
        />
      ))}
    </div>
  );
};

export default ArticleGrid;