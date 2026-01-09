import React from 'react';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';

const DocumentCard = ({ document, viewMode, onClick, onDelete }) => {
  const { currentUser } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (document?._id && currentUser) {
      window.open(`${apiBaseUrl}/documents/${document._id}?firebaseUid=${currentUser.uid}`, '_blank');
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete && document?._id) {
      onDelete(document._id);
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'PDF': return 'FileText';
      case 'DOCX': return 'FileText';
      case 'ZIP': return 'Archive';
      case 'JPG': return 'Image';
      case 'PNG': return 'Image';
      default: return 'File';
    }
  };

  const getThumbnailSrc = () => {
    const isImage = ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP'].includes(document?.fileType?.toUpperCase());
    if (isImage && document?._id && currentUser) {
      return `${apiBaseUrl}/documents/${document._id}?firebaseUid=${currentUser.uid}`;
    }
    return document?.thumbnail || `https://placehold.co/600x400/e2e8f0/1e293b?text=${document?.fileType || 'DOC'}`;
  };

  const thumbnailSrc = getThumbnailSrc();

  if (viewMode === 'list') {
    return (
      <div className="p-4 hover:bg-muted transition-smooth cursor-pointer" onClick={onClick}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            {/* Use Icon component if available or svg */}
            <span className="font-bold text-primary">{document?.fileType?.slice(0, 3)}</span>
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
              <span>{formatFileSize(document?.size)}</span>
              <span>•</span>
              <span>{formatDate(document?.uploadDate)}</span>
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
            <Button variant="ghost" size="icon" iconName="Download" onClick={handleDownload} />
            <Button variant="ghost" size="icon" iconName="Share2" />
            <Button variant="ghost" size="icon" iconName="Trash2" onClick={handleDelete} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-elevation-1 overflow-hidden hover:shadow-elevation-2 transition-smooth cursor-pointer" onClick={onClick}>
      <div className="aspect-video bg-muted relative overflow-hidden flex items-center justify-center">
        <img
          src={thumbnailSrc}
          alt={document?.name}
          className="w-full h-full object-cover opacity-80"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x400/e2e8f0/1e293b?text=${document?.fileType || 'FILE'}`
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          {document?.isPasswordProtected && (
            <div className="bg-warning text-warning-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
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
          <span>{formatFileSize(document?.size)}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {document?.tags?.slice(0, 2)?.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-muted text-xs rounded-md text-foreground">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>Uploaded {formatDate(document?.uploadDate)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconName="Download" fullWidth onClick={handleDownload}>
            Download
          </Button>
          <Button variant="ghost" size="icon" iconName="Share2" />
          <Button variant="ghost" size="icon" iconName="Trash2" onClick={handleDelete} />
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;