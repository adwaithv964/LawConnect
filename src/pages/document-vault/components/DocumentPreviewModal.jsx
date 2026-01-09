import React from 'react';
import Button from '../../../components/ui/Button';

const DocumentPreviewModal = ({ document, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-heading font-bold text-foreground truncate mb-1">
              {document?.name}
            </h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{document?.category}</span>
              <span>•</span>
              <span>{document?.size}</span>
              <span>•</span>
              <span>Modified {document?.lastModified}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" iconName="X" onClick={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-6">
            <img
              src={document?.thumbnail}
              alt={document?.thumbnailAlt}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {document?.tags?.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-muted text-sm rounded-md text-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Document Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">File Type</span>
                  <span className="font-medium text-foreground">{document?.fileType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">File Size</span>
                  <span className="font-medium text-foreground">{document?.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Upload Date</span>
                  <span className="font-medium text-foreground">{document?.uploadDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Modified</span>
                  <span className="font-medium text-foreground">{document?.lastModified}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Access Count</span>
                  <span className="font-medium text-foreground">{document?.accessCount} views</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Password Protected</span>
                  <span className="font-medium text-foreground">
                    {document?.isPasswordProtected ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {document?.sharedWith?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Shared With</h3>
                <div className="space-y-2">
                  {document?.sharedWith?.map((email, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-foreground">{email}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-6 flex items-center justify-end gap-3">
          <Button variant="outline" iconName="Share2">
            Share
          </Button>
          <Button variant="outline" iconName="Edit">
            Edit Details
          </Button>
          <Button iconName="Download">
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;