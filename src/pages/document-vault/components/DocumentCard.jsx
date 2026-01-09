import React from 'react';
import Button from '../../../components/ui/Button';

const DocumentCard = ({ document, viewMode, onClick }) => {
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'PDF':
        return 'FileText';
      case 'DOCX':
        return 'FileText';
      case 'ZIP':
        return 'Archive';
      case 'JPG':
        return 'Image';
      default:
        return 'File';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="p-4 hover:bg-muted transition-smooth cursor-pointer" onClick={onClick}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{document?.name}</h3>
              {document?.isPasswordProtected && (
                <svg className="w-4 h-4 text-warning flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{document?.category}</span>
              <span>•</span>
              <span>{document?.size}</span>
              <span>•</span>
              <span>{document?.lastModified}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {document?.tags?.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-muted text-xs rounded-md text-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="icon" iconName="Download" />
            <Button variant="ghost" size="icon" iconName="Share2" />
            <Button variant="ghost" size="icon" iconName="Trash2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 overflow-hidden hover:shadow-elevation-2 transition-smooth cursor-pointer" onClick={onClick}>
      <div className="aspect-video bg-muted relative overflow-hidden">
        <img
          src={document?.thumbnail}
          alt={document?.thumbnailAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {document?.isPasswordProtected && (
            <div className="bg-warning text-warning-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Protected
            </div>
          )}
          <div className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
            {document?.fileType}
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 truncate">{document?.name}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span>{document?.category}</span>
          <span>•</span>
          <span>{document?.size}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {document?.tags?.slice(0, 2)?.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-muted text-xs rounded-md text-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>Modified {document?.lastModified}</span>
          <span>{document?.accessCount} views</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconName="Download" fullWidth>
            Download
          </Button>
          <Button variant="ghost" size="icon" iconName="Share2" />
          <Button variant="ghost" size="icon" iconName="Trash2" />
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;