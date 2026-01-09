import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ searchQuery, onSearchChange, sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'recent', label: 'Recently Updated' },
    { value: 'name', label: 'Name (A-Z)' }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon name="Search" size={18} color="var(--color-muted-foreground)" />
        </div>
        <Input
          type="text"
          placeholder="Search templates by name or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="pl-10"
        />
      </div>
      <div className="w-full lg:w-64">
        <Select
          value={sortBy}
          onChange={onSortChange}
          options={sortOptions}
          placeholder="Sort by"
        />
      </div>
    </div>
  );
};

export default SearchBar;