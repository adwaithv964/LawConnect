import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TemplateCard = ({ template, onPreview, onDownload }) => {
  const getComplexityColor = (level) => {
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

  const getCategoryIcon = (category) => {
    const icons = {
      'Consumer': 'ShoppingCart',
      'Property': 'Home',
      'Cyber': 'Shield',
      'Family': 'Users'
    };
    return icons?.[category] || 'FileText';
  };

  return (
    <article className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-elevation-3 transition-smooth">
      <div className="relative h-40 overflow-hidden">
        <Image
          src={template?.image}
          alt={template?.imageAlt}
          className="w-full h-full object-cover"
        />
        {template?.isFeatured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 bg-accent text-accent-foreground rounded-full text-xs font-semibold">
            <Icon name="Star" size={14} color="currentColor" />
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-1">
          {template?.formats?.map((format) => (
            <span
              key={format}
              className="px-2 py-1 bg-card/90 backdrop-blur-sm rounded text-xs font-medium"
            >
              {format}
            </span>
          ))}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
            <Icon name={getCategoryIcon(template?.category)} size={12} color="currentColor" />
            {template?.category}
          </span>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getComplexityColor(template?.complexity)}`}>
            {template?.complexity}
          </span>
        </div>

        <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2">
          {template?.name}
        </h3>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {template?.description}
        </p>

        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Icon name="Download" size={14} color="currentColor" />
            {template?.downloads?.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="Star" size={14} color="var(--color-warning)" />
            {template?.rating}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="Clock" size={14} color="currentColor" />
            {template?.estimatedTime}
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            iconName="Eye"
            onClick={() => onPreview(template)}
          >
            Preview
          </Button>
          <Button
            variant="default"
            size="sm"
            fullWidth
            iconName="Download"
            onClick={() => onDownload(template, template?.formats?.[0])}
          >
            Download
          </Button>
        </div>
      </div>
    </article>
  );
};

export default TemplateCard;