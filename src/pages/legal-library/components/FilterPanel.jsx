import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ 
  contentType, 
  difficultyLevel, 
  sortBy,
  onContentTypeChange,
  onDifficultyChange,
  onSortChange,
  onClearFilters,
  hasActiveFilters
}) => {
  const contentTypeOptions = [
    { value: 'all', label: 'All Content Types' },
    { value: 'article', label: 'Articles' },
    { value: 'guide', label: 'Guides' },
    { value: 'faq', label: 'FAQs' },
    { value: 'case-study', label: 'Case Studies' }
  ];

  const difficultyOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'relevant', label: 'Most Relevant' },
    { value: 'alphabetical', label: 'A to Z' }
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <Select
          label="Content Type"
          options={contentTypeOptions}
          value={contentType}
          onChange={onContentTypeChange}
        />

        <Select
          label="Difficulty Level"
          options={difficultyOptions}
          value={difficultyLevel}
          onChange={onDifficultyChange}
        />

        <Select
          label="Sort By"
          options={sortOptions}
          value={sortBy}
          onChange={onSortChange}
        />
      </div>
    </div>
  );
};

export default FilterPanel;