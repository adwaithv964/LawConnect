import React from 'react';
import Icon from '../../../components/AppIcon';

// Static categories with metadata — counts come from live MongoDB data
const LEGAL_CATEGORIES = [
  { category: 'Consumer Rights', icon: 'ShoppingCart', color: 'var(--color-primary)' },
  { category: 'Property Disputes', icon: 'Home', color: 'var(--color-secondary)' },
  { category: 'Cyber Fraud', icon: 'Laptop', color: 'var(--color-accent)' },
  { category: 'Employment Issues', icon: 'Briefcase', color: 'var(--color-warning)' },
  { category: 'Family Law', icon: 'Heart', color: 'var(--color-success)' },
  { category: 'Criminal Law', icon: 'Scale', color: 'var(--color-foreground)' },
];

const LegalCategoryTrends = ({ categoryBreakdown = {} }) => {
  // Merge live counts into the static category list, sort by count desc
  const categories = LEGAL_CATEGORIES
    .map(cat => ({
      ...cat,
      count: categoryBreakdown[cat.category] || 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Also pick up any extra categories from the user's documents/cases not in static list
  const extraKeys = Object.keys(categoryBreakdown).filter(
    key => !LEGAL_CATEGORIES.find(c => c.category === key) && key !== 'Uncategorized' && key !== 'Other'
  );

  const displayList = [
    ...categories.slice(0, 4),
    ...extraKeys.slice(0, 2).map(key => ({
      category: key,
      icon: 'FileText',
      color: 'var(--color-muted-foreground)',
      count: categoryBreakdown[key] || 0,
    }))
  ];

  const hasAnyData = displayList.some(c => c.count > 0);

  return (
    <div className="bg-card p-4 md:p-6 lg:p-8 rounded-xl border border-border shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="TrendingUp" size={24} color="var(--color-primary)" />
          <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
            Your Legal Categories
          </h2>
        </div>
        <span className="text-xs md:text-sm text-muted-foreground">
          {hasAnyData ? 'From your activity' : 'Platform average'}
        </span>
      </div>
      <div className="space-y-3">
        {displayList.map((cat, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border border-border hover:shadow-elevation-1 transition-smooth"
          >
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-card">
                <Icon name={cat.icon} size={20} color={cat.color} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-foreground">{cat.category}</h3>
              <p className="text-xs text-muted-foreground">
                {cat.count > 0 ? `${cat.count} item${cat.count > 1 ? 's' : ''}` : 'No activity yet'}
              </p>
            </div>
            {cat.count > 0 && (
              <div className="flex-shrink-0 text-right">
                <span className="text-lg font-bold" style={{ color: cat.color }}>
                  {cat.count}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {!hasAnyData && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Create cases or upload documents to see your category breakdown here.
        </p>
      )}
    </div>
  );
};

export default LegalCategoryTrends;