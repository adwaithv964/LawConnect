import React from 'react';

const StorageStats = ({ documents }) => {
  const totalSize = documents?.reduce((acc, doc) => {
    const size = parseFloat(doc?.size);
    return acc + (isNaN(size) ? 0 : size);
  }, 0);

  const storageLimit = 100;
  const usedPercentage = (totalSize / storageLimit) * 100;

  const recentUploads = documents?.slice(0, 3);

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 p-4 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Storage Usage</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Used</span>
            <span className="font-semibold text-foreground">{totalSize?.toFixed(1)} MB / {storageLimit} MB</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${Math.min(usedPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {(storageLimit - totalSize)?.toFixed(1)} MB remaining
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Recent Uploads</h3>
        <div className="space-y-3">
          {recentUploads?.map((doc) => (
            <div key={doc?.id} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{doc?.name}</p>
                <p className="text-xs text-muted-foreground">{doc?.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Quick Stats</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Documents</span>
            <span className="font-semibold text-foreground">{documents?.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Protected</span>
            <span className="font-semibold text-foreground">
              {documents?.filter(d => d?.isPasswordProtected)?.length}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shared</span>
            <span className="font-semibold text-foreground">
              {documents?.filter(d => d?.sharedWith?.length > 0)?.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageStats;