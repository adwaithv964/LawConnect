

import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import CaseStatusIndicator from '../../components/ui/CaseStatusIndicator';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import DocumentGrid from './components/DocumentGrid';
import StorageStats from './components/StorageStats';
import UploadModal from './components/UploadModal';
import DocumentPreviewModal from './components/DocumentPreviewModal';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const DocumentVault = () => {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiBaseUrl}/documents?firebaseUid=${currentUser.uid}`);

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data);
      setError('');
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const filteredDocuments = documents?.filter((doc) => {
    const matchesSearch = doc?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      doc?.tags?.some((tag) => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc?.category === selectedCategory;
    const matchesFileType = selectedFileType === 'all' || doc?.fileType === selectedFileType;

    return matchesSearch && matchesCategory && matchesFileType;
  });

  const sortedDocuments = [...filteredDocuments]?.sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b?.uploadDate) - new Date(a?.uploadDate);
      case 'name':
        return a?.name?.localeCompare(b?.name);
      case 'size':
        const sizeA = parseFloat(a?.size);
        const sizeB = parseFloat(b?.size);
        return sizeB - sizeA;
      default:
        return 0;
    }
  });

  const handleDocumentClick = (doc) => {
    setSelectedDocument(doc);
    setShowPreviewModal(true);
  };

  const handleDelete = async (docId) => {
    // eslint-disable-next-line no-restricted-globals
    if (!currentUser || !confirm('Are you sure you want to delete this document?')) return;

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiBaseUrl}/documents/${docId}?firebaseUid=${currentUser.uid}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      setDocuments(documents.filter(doc => doc._id !== docId));
    } catch (err) {
      console.error("Error deleting document:", err);
      alert('Failed to delete document');
    }
  };

  return (
    <>
      <Helmet>
        <title>Document Vault - Secure Legal Document Storage | LawConnect</title>
        <meta name="description" content="Securely store, organize, and manage all your legal documents with advanced categorization, sharing, and search capabilities." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <EmergencyAlertBanner />
        <CaseStatusIndicator />
        <OfflineStatusIndicator />

        <main className="mx-4 lg:mx-6 py-6 lg:py-8 mt-12 lg:mt-8">
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Document Vault
                </h1>
                <p className="text-muted-foreground">
                  Securely store and manage all your legal documents
                </p>
              </div>
              <div className="flex items-center gap-4 lg:mr-[220px]"> {/* Increased right margin to fully clear the CaseStatusIndicator */}
                <Button
                  iconName="Upload"
                  onClick={() => setShowUploadModal(true)}
                  size="lg">

                  Upload Document
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <FilterPanel
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedFileType={selectedFileType}
                setSelectedFileType={setSelectedFileType}
                dateRange={dateRange}
                setDateRange={setDateRange}
                sortBy={sortBy}
                setSortBy={setSortBy} />

              <div className="mt-6">
                <StorageStats documents={documents} />
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="mb-6">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                  showFilters={showFilters}
                  setShowFilters={setShowFilters}
                  resultsCount={sortedDocuments?.length} />

              </div>

              {loading ? (
                <div className="text-center py-10">Loading documents...</div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
              ) : (
                <DocumentGrid
                  documents={sortedDocuments}
                  viewMode={viewMode}
                  onDocumentClick={handleDocumentClick}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {showUploadModal &&
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={fetchDocuments}
        />

      }

      {showPreviewModal && selectedDocument &&
        <DocumentPreviewModal
          document={selectedDocument}
          onUpdate={fetchDocuments}
          onClose={() => {
            setShowPreviewModal(false);
            setSelectedDocument(null);
          }} />

      }
    </>);

};

export default DocumentVault;