import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RecommendedArticles = ({ articles }) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 lg:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="Sparkles" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Recommended for You
        </h3>
      </div>
      <div className="space-y-4">
        {articles?.map((article) => (
          <Link
            key={article?.id}
            to={`/legal-library/${article?.id}`}
            className="block p-3 rounded-lg hover:bg-muted transition-smooth"
          >
            <div className="flex gap-3 mb-2">
              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                <Image
                  src={article?.image}
                  alt={article?.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium mb-1">
                  {article?.category}
                </span>
                <h4 className="text-sm font-medium text-foreground line-clamp-2">
                  {article?.title}
                </h4>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Based on your interest in {article?.basedOn}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Icon name="Clock" size={12} color="currentColor" />
                {article?.readTime} min
              </span>
              <span className="flex items-center gap-1">
                <Icon name="Star" size={12} color="currentColor" />
                {article?.rating}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecommendedArticles;