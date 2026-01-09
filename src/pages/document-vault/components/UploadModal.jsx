import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { useAuth } from '../../../context/AuthContext';

const UploadModal = ({ onClose, onUploadSuccess }) => {
  const { currentUser } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      // Limit to 1 file for now as backend handles single file upload per request primarily, 
      // or we loop through them. The current UI supports multiple, so let's pick the first one 
      // or handle multiple requests. Backend expects 'file' field.
      // Let's simplified to array but only upload first one or loop.
      // For this iteration, let's just handle the first one or all serially.
      setSelectedFiles(Array.from(e?.dataTransfer?.files));
    }
  };

  const handleFileSelect = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      setSelectedFiles(Array.from(e?.target?.files));
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    if (!currentUser) {
      setError("You must be logged in to upload.");
      return;
    }

    setUploading(true);
    setError('');

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    try {
      // Upload files sequentially
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('firebaseUid', currentUser.uid);
        formData.append('category', category || 'Uncategorized');
        formData.append('tags', tags);
        formData.append('isPasswordProtected', passwordProtect.toString());
        if (passwordProtect && password) {
          formData.append('password', password);
        }

        const response = await fetch(`${apiBaseUrl}/documents/upload`, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Upload failed');
        }
      }

      if (onUploadSuccess) onUploadSuccess();
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to upload document(s).");
    } finally {
      setUploading(false);
    }
  };

  const categoryOptions = [
    { value: 'Legal Documents', label: 'Legal Documents' },
    { value: 'Contracts', label: 'Contracts' },
    { value: 'Drafts', label: 'Drafts' },
    { value: 'Evidence', label: 'Evidence' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between z-10 relative">
          <h2 className="text-2xl font-heading font-bold text-foreground">Upload Documents</h2>
          <Button variant="ghost" size="icon" iconName="X" onClick={onClose} />
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-smooth ${dragActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-foreground font-medium mb-1">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, DOCX, ZIP, JPG, PNG (Max 16MB per file)
                </p>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" iconName="Upload" asChild>
                  <span>Browse Files</span>
                </Button>
              </label>
            </div>
          </div>

          {selectedFiles?.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Selected Files</h3>
              <div className="space-y-2">
                {selectedFiles?.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-foreground">{file?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file?.size / 1024 / 1024)?.toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      iconName="X"
                      onClick={() => setSelectedFiles(selectedFiles?.filter((_, i) => i !== index))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Select
              label="Category"
              options={categoryOptions}
              value={category}
              onChange={setCategory}
              placeholder="Select category"
              required
            />
          </div>

          <div>
            <Input
              label="Tags"
              type="text"
              placeholder="Enter tags separated by commas"
              value={tags}
              onChange={(e) => setTags(e?.target?.value)}
              description="e.g., Contract, Property, Legal Notice"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="password-protect"
                checked={passwordProtect}
                onChange={(e) => setPasswordProtect(e?.target?.checked)}
                className="h-4 w-4 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
              />
              <label htmlFor="password-protect" className="text-sm font-medium text-foreground cursor-pointer">
                Password protect this document
              </label>
            </div>

            {passwordProtect && (
              <Input
                type="password"
                placeholder="Enter document password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="animate-in fade-in slide-in-from-top-2 duration-300"
              />
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-6 flex items-center justify-end gap-3 z-10 relative">
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button
            iconName="Upload"
            disabled={selectedFiles?.length === 0 || uploading}
            onClick={handleUpload}
          >
            {uploading ? 'Uploading...' : `Upload ${selectedFiles?.length > 0 ? `(${selectedFiles?.length})` : ''}`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;