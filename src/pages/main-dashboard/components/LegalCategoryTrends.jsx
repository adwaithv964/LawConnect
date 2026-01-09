import React from 'react';
import Icon from '../../../components/AppIcon';

const LegalCategoryTrends = () => {
  const trendingCategories = [
    {
      category: 'Consumer Rights',
      queries: 245,
      trend: 'up',
      percentage: '+18%',
      icon: 'ShoppingCart',
      color: 'var(--color-primary)'
    },
    {
      category: 'Property Disputes',
      queries: 189,
      trend: 'up',
      percentage: '+12%',
      icon: 'Home',
      color: 'var(--color-secondary)'
    },
    {
      category: 'Cyber Fraud',
      queries: 167,
      trend: 'up',
      percentage: '+25%',
      icon: 'Laptop',
      color: 'var(--color-accent)'
    },
    {
      category: 'Employment Issues',
      queries: 134,
      trend: 'down',
      percentage: '-5%',
      icon: 'Briefcase',
      color: 'var(--color-warning)'
    }
  ];

  return (
    <div className="bg-card p-4 md:p-6 lg:p-8 rounded-xl border border-border shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="TrendingUp" size={24} color="var(--color-primary)" />
          <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
            Trending Legal Categories
          </h2>
        </div>
        <span className="text-xs md:text-sm text-muted-foreground">
          Last 30 days
        </span>
      </div>
      <div className="space-y-4">
        {trendingCategories?.map((category, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border border-border hover:shadow-elevation-1 transition-smooth"
          >
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-card">
                <Icon name={category?.icon} size={24} color={category?.color} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-semibold text-foreground mb-1">
                {category?.category}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground">
                {category?.queries} queries this month
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className={`flex items-center gap-1 ${category?.trend === 'up' ? 'text-success' : 'text-error'}`}>
                <Icon 
                  name={category?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                  size={16} 
                  color="currentColor" 
                />
                <span className="text-sm font-semibold">
                  {category?.percentage}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegalCategoryTrends;