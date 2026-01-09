import React from 'react';
import DocumentCard from './DocumentCard';

const DocumentGrid = ({ documents, viewMode, onDocumentClick, onDelete }) => {
  if (documents?.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-elevation-1 p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No documents found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or upload a new document</p>
          </div>
        </div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-card rounded-lg shadow-elevation-1 overflow-hidden">
        <div className="divide-y divide-border">
          {documents?.map((doc) => (
            <DocumentCard
              key={doc?.id}
              document={doc}
              viewMode="list"
              onClick={() => onDocumentClick(doc)}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {documents?.map((doc) => (
        <DocumentCard
          key={doc?.id}
          document={doc}
          viewMode="grid"
          onClick={() => onDocumentClick(doc)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DocumentGrid;