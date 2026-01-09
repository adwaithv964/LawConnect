import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrendingArticles = ({ articles }) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 lg:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Trending Now
        </h3>
      </div>
      <div className="space-y-4">
        {articles?.map((article, index) => (
          <Link
            key={article?.id}
            to={`/legal-library/${article?.id}`}
            className="flex gap-3 p-3 rounded-lg hover:bg-muted transition-smooth"
          >
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={article?.image}
                alt={article?.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs font-bold">
                  {index + 1}
                </span>
                <span className="text-xs text-primary font-medium">
                  {article?.category}
                </span>
              </div>
              <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                {article?.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Icon name="Eye" size={12} color="currentColor" />
                  {article?.views}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Clock" size={12} color="currentColor" />
                  {article?.readTime} min
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingArticles;