import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  showFilters,
  setShowFilters,
  resultsCount
}) => {
  return (
    <div className="bg-card rounded-lg shadow-elevation-1 p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search documents by name, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="pl-10"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="default"
            iconName="LayoutGrid"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-muted' : ''}
          />
          <Button
            variant="outline"
            size="default"
            iconName="List"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-muted' : ''}
          />
          <Button
            variant="outline"
            size="default"
            iconName="Filter"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            Filters
          </Button>
        </div>
      </div>

      <div className="mt-3 text-sm text-muted-foreground">
        {resultsCount} {resultsCount === 1 ? 'document' : 'documents'} found
      </div>
    </div>
  );
};

export default SearchBar;