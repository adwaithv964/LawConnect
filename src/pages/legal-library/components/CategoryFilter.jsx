import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 lg:p-6">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
        Categories
      </h3>
      <div className="space-y-2">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => onCategoryChange(category?.id)}
            className={`
              w-full flex items-center justify-between p-3 rounded-lg
              transition-smooth text-left
              ${selectedCategory === category?.id
                ? 'bg-primary text-primary-foreground shadow-elevation-1'
                : 'hover:bg-muted text-foreground'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <Icon 
                name={category?.icon} 
                size={20} 
                color={selectedCategory === category?.id ? 'currentColor' : 'var(--color-primary)'} 
              />
              <span className="font-medium text-sm">{category?.name}</span>
            </div>
            <span className={`
              text-xs font-semibold px-2 py-1 rounded-full
              ${selectedCategory === category?.id
                ? 'bg-primary-foreground/20 text-primary-foreground'
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {category?.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;