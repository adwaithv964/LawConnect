import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilterPanel = ({
  selectedCategory,
  onCategoryChange,
  selectedDocType,
  onDocTypeChange,
  selectedComplexity,
  onComplexityChange
}) => {
  const categories = [
    { id: 'all', name: 'All Categories', icon: 'LayoutGrid', count: 8 },
    { id: 'Consumer', name: 'Consumer', icon: 'ShoppingCart', count: 2 },
    { id: 'Property', name: 'Property', icon: 'Home', count: 2 },
    { id: 'Cyber', name: 'Cyber', icon: 'Shield', count: 2 },
    { id: 'Family', name: 'Family', icon: 'Users', count: 2 }
  ];

  const docTypes = [
    { id: 'all', name: 'All Types', icon: 'FileText' },
    { id: 'Complaint', name: 'Complaint', icon: 'AlertCircle' },
    { id: 'Notice', name: 'Notice', icon: 'Bell' },
    { id: 'Application', name: 'Application', icon: 'FileCheck' },
    { id: 'Agreement', name: 'Agreement', icon: 'FileSignature' }
  ];

  const complexityLevels = [
    { id: 'all', name: 'All Levels', color: 'text-muted-foreground' },
    { id: 'beginner', name: 'Beginner', color: 'text-success' },
    { id: 'intermediate', name: 'Intermediate', color: 'text-warning' },
    { id: 'advanced', name: 'Advanced', color: 'text-error' }
  ];

  const handleClearFilters = () => {
    onCategoryChange('all');
    onDocTypeChange('all');
    onComplexityChange('all');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedDocType !== 'all' || selectedComplexity !== 'all';

  return (
    <div className="bg-card rounded-xl border border-border p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-primary"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Legal Category</h4>
          <div className="space-y-2">
            {categories?.map((category) => (
              <button
                key={category?.id}
                onClick={() => onCategoryChange(category?.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-smooth ${
                  selectedCategory === category?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 hover:bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon name={category?.icon} size={16} color="currentColor" />
                  <span className="text-sm font-medium">{category?.name}</span>
                </div>
                <span className="text-xs">{category?.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Document Type</h4>
          <div className="space-y-2">
            {docTypes?.map((type) => (
              <button
                key={type?.id}
                onClick={() => onDocTypeChange(type?.id)}
                className={`w-full flex items-center gap-2 p-3 rounded-lg transition-smooth ${
                  selectedDocType === type?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 hover:bg-muted text-foreground'
                }`}
              >
                <Icon name={type?.icon} size={16} color="currentColor" />
                <span className="text-sm font-medium">{type?.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Complexity Level</h4>
          <div className="space-y-2">
            {complexityLevels?.map((level) => (
              <button
                key={level?.id}
                onClick={() => onComplexityChange(level?.id)}
                className={`w-full flex items-center gap-2 p-3 rounded-lg transition-smooth ${
                  selectedComplexity === level?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 hover:bg-muted text-foreground'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${level?.color === 'text-muted-foreground' ? 'bg-muted-foreground' : level?.color === 'text-success' ? 'bg-success' : level?.color === 'text-warning' ? 'bg-warning' : 'bg-error'}`} />
                <span className="text-sm font-medium">{level?.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;