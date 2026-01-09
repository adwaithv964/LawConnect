import React from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const SearchBar = ({ searchQuery, onSearchChange, onSearchSubmit }) => {
  const handleSubmit = (e) => {
    e?.preventDefault();
    onSearchSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search legal articles, guides, and resources..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
          className="pr-12"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-primary/80 transition-smooth"
          aria-label="Search"
        >
          <Icon name="Search" size={20} color="currentColor" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;