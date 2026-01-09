import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const RecentlyViewed = ({ articles }) => {
  if (articles?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card rounded-xl border border-border p-4 lg:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon name="History" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Recently Viewed
        </h3>
      </div>
      <div className="space-y-3">
        {articles?.map((article) => (
          <Link
            key={article?.id}
            to={`/legal-library/${article?.id}`}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-smooth"
          >
            <Icon name={article?.categoryIcon} size={18} color="var(--color-primary)" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                {article?.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{article?.category}</span>
                <span>•</span>
                <span>{article?.viewedAt}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;