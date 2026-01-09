import React from 'react';
import Select from '../../../components/ui/Select';

const FilterPanel = ({
  selectedCategory,
  setSelectedCategory,
  selectedFileType,
  setSelectedFileType,
  dateRange,
  setDateRange,
  sortBy,
  setSortBy
}) => {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'Legal Documents', label: 'Legal Documents' },
    { value: 'Contracts', label: 'Contracts' },
    { value: 'Drafts', label: 'Drafts' },
    { value: 'Evidence', label: 'Evidence' }
  ];

  const fileTypeOptions = [
    { value: 'all', label: 'All File Types' },
    { value: 'PDF', label: 'PDF' },
    { value: 'DOCX', label: 'DOCX' },
    { value: 'ZIP', label: 'ZIP' },
    { value: 'JPG', label: 'Images' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'size', label: 'File Size' }
  ];

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Filters</h3>
      </div>

      <div>
        <Select
          label="Category"
          options={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      <div>
        <Select
          label="File Type"
          options={fileTypeOptions}
          value={selectedFileType}
          onChange={setSelectedFileType}
        />
      </div>

      <div>
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={dateRange}
          onChange={setDateRange}
        />
      </div>

      <div>
        <Select
          label="Sort By"
          options={sortOptions}
          value={sortBy}
          onChange={setSortBy}
        />
      </div>
    </div>
  );
};

export default FilterPanel;