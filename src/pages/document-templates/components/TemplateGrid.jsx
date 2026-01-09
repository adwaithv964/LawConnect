import React from 'react';
import TemplateCard from './TemplateCard';

const TemplateGrid = ({ templates, onPreview, onDownload }) => {
  if (templates?.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-2">No templates found</div>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {templates?.map((template) => (
        <TemplateCard
          key={template?.id}
          template={template}
          onPreview={onPreview}
          onDownload={onDownload}
        />
      ))}
    </div>
  );
};

export default TemplateGrid;