import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const FilterBar = ({ filters, onFilterChange, onSearch }) => {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "Active", label: "Active" },
    { value: "Pending", label: "Pending" },
    { value: "Completed", label: "Completed" },
    { value: "On Hold", label: "On Hold" }
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "Property Dispute", label: "Property Dispute" },
    { value: "Consumer Rights", label: "Consumer Rights" },
    { value: "Family Law", label: "Family Law" },
    { value: "Employment", label: "Employment" },
    { value: "Criminal", label: "Criminal" },
    { value: "Civil", label: "Civil" }
  ];

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest First" },
    { value: "deadline", label: "Nearest Deadline" },
    { value: "progress", label: "Progress %" }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search cases..."
            value={filters?.search}
            onChange={(e) => onSearch(e?.target?.value)}
          />
          <Icon 
            name="Search" 
            size={18} 
            color="var(--color-muted-foreground)" 
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
        </div>

        <Select
          placeholder="Filter by status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
        />

        <Select
          placeholder="Filter by category"
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => onFilterChange('category', value)}
        />

        <Select
          placeholder="Sort by"
          options={sortOptions}
          value={filters?.sort}
          onChange={(value) => onFilterChange('sort', value)}
        />
      </div>
    </div>
  );
};

export default FilterBar;