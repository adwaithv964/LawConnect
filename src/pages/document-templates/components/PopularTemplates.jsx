import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PopularTemplates = ({ onPreview }) => {
  const popularTemplates = [
    {
      id: 6,
      name: 'Rent Agreement',
      category: 'Property',
      downloads: 4231,
      rating: 4.8,
      icon: 'Home'
    },
    {
      id: 3,
      name: 'Cyber Crime FIR',
      category: 'Cyber',
      downloads: 3156,
      rating: 4.9,
      icon: 'Shield'
    },
    {
      id: 1,
      name: 'Consumer Complaint',
      category: 'Consumer',
      downloads: 2847,
      rating: 4.8,
      icon: 'ShoppingCart'
    }
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
          Most Popular Templates
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {popularTemplates?.map((template) => (
          <div
            key={template?.id}
            className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-smooth"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon name={template?.icon} size={20} color="var(--color-primary)" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-1">{template?.name}</h3>
                <p className="text-xs text-muted-foreground">{template?.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Icon name="Download" size={12} color="currentColor" />
                {template?.downloads?.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="Star" size={12} color="var(--color-warning)" />
                {template?.rating}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              iconName="Eye"
              onClick={() => onPreview(template)}
            >
              Quick View
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularTemplates;