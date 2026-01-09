import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { useAuth } from '../../../context/AuthContext';
import Icon from '../../../components/AppIcon';
import ShareModal from '../../../components/ui/ShareModal';

const DocumentPreviewModal = ({ document, onClose, onUpdate }) => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(document?.name || '');
  const [category, setCategory] = useState(document?.category || '');
  const [tags, setTags] = useState(document?.tags?.join(', ') || '');
  const [saving, setSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (document) {
      setName(document.name || '');
      setCategory(document.category || '');
      setTags(document.tags?.join(', ') || '');
      setIsUnlocked(!document.isPasswordProtected);
      setUnlockPassword('');
    }
  }, [document]);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

  const getFileUrl = () => {
    if (!document?._id || !currentUser) return '';
    let url = `${apiBaseUrl}/documents/${document._id}?firebaseUid=${currentUser.uid}`;
    if (document.isPasswordProtected && isUnlocked && unlockPassword) {
      url += `&password=${encodeURIComponent(unlockPassword)}`;
    }
    return url;
  };

  const shareUrl = getFileUrl();

  const handleDownload = () => {
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleShare = () => {
    if (document?._id && currentUser) {
      setShowShareModal(true);
    }
  };

  const handleUnlock = () => {
    if (unlockPassword) {
      setIsUnlocked(true);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;
    setSaving(true);
    try {
      const response = await fetch(`${apiBaseUrl}/documents/${document._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firebaseUid: currentUser.uid,
          name,
          category,
          tags
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update document');
      }

      const updatedDoc = await response.json();
      if (onUpdate) onUpdate();
      setIsEditing(false);
      alert('Document updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update document');
    } finally {
      setSaving(false);
    }
  };

  const categoryOptions = [
    { value: 'Legal Documents', label: 'Legal Documents' },
    { value: 'Contracts', label: 'Contracts' },
    { value: 'Drafts', label: 'Drafts' },
    { value: 'Evidence', label: 'Evidence' },
    { value: 'Uncategorized', label: 'Uncategorized' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="z-10 relative bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-1"
                placeholder="Document Name"
              />
            ) : (
              <h2 className="text-2xl font-heading font-bold text-foreground truncate mb-1">
                {document?.name}
              </h2>
            )}

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{isEditing ? category : document?.category}</span>
              <span>•</span>
              <span>{document?.size}</span>
              <span>•</span>
              <span>Modified {document?.lastModified}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" iconName="X" onClick={onClose} />
        </div>

        <div className="flex-1 overflow-y-auto p-6 relative">
          <div className="h-64 bg-muted rounded-lg overflow-hidden mb-6 flex items-center justify-center relative">
            {(() => {
              if (!document?._id || !currentUser) return null;

              if (!isUnlocked) {
                return (
                  <div className="flex flex-col items-center gap-4 p-6 text-center">
                    <Icon name="Lock" size={48} className="text-muted-foreground" />
                    <div>
                      <p className="font-semibold text-foreground">This document is password protected</p>
                      <p className="text-sm text-muted-foreground">Please enter the password to view it</p>
                    </div>
                    <div className="flex items-center gap-2 max-w-[250px] w-full">
                      <Input
                        type="password"
                        placeholder="Password"
                        value={unlockPassword}
                        onChange={(e) => setUnlockPassword(e.target.value)}
                        className="h-9"
                      />
                      <Button size="sm" onClick={handleUnlock}>Unlock</Button>
                    </div>
                  </div>
                );
              }

              const isPdf = document.fileType === 'PDF';
              const isImage = ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP'].includes(document.fileType);

              if (isPdf) {
                return (
                  <iframe
                    src={`${shareUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                    className="w-full h-full border-0"
                    title={document.name}
                  />
                );
              }

              if (isImage) {
                return (
                  <img
                    src={shareUrl}
                    alt={document.name}
                    className="h-full w-auto object-contain"
                    onError={(e) => {
                      // If 403 (wrong password) or other error, fallback
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/600x800/e2e8f0/1e293b?text=Preview%20Error`;
                    }}
                  />
                );
              }

              return (
                <img
                  src={`https://placehold.co/600x800/e2e8f0/1e293b?text=${document.fileType || 'FILE'}`}
                  alt={document.name}
                  className="h-full w-auto object-contain opacity-90"
                />
              );
            })()}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Tags</h3>
              {isEditing ? (
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Tags (comma separated)"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {document?.tags?.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-muted text-sm rounded-md text-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {isEditing && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Category</h3>
                <Select
                  options={categoryOptions}
                  value={category}
                  onChange={setCategory}
                />
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Document Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">File Type</span>
                  <span className="font-medium text-foreground">{document?.fileType}</span>
                </div>
                {/* ... other details ... */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Upload Date</span>
                  <span className="font-medium text-foreground">{new Date(document?.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="z-10 relative bg-card border-t border-border p-6 flex items-center justify-end gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
              <Button variant="outline" iconName="Share2" onClick={handleShare}>
                Share
              </Button>
              <Button variant="outline" iconName="Edit" onClick={() => setIsEditing(true)}>
                Edit Details
              </Button>
              <Button iconName="Download" onClick={handleDownload}>
                Download
              </Button>
            </>
          )}
        </div>

        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={document?.name}
          shareText={`Check out this document: ${document?.name}\nCategory: ${document?.category}\nType: ${document?.fileType}\n\nDownload link: ${shareUrl}`}
          shareUrl={shareUrl}
        />
      </div>
    </div>
  );
};

export default DocumentPreviewModal;