import React, { useState } from 'react';
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

const DocumentVault = () => {
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

  const mockDocuments = [
  {
    id: 1,
    name: 'Consumer Complaint Application.pdf',
    category: 'Legal Documents',
    fileType: 'PDF',
    size: '2.4 MB',
    uploadDate: 'Dec 20, 2025',
    lastModified: '2 days ago',
    tags: ['Consumer Rights', 'Complaint'],
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1f3ff4c9d-1765268300488.png",
    thumbnailAlt: 'Consumer complaint application document preview',
    isPasswordProtected: false,
    sharedWith: [],
    accessCount: 5
  },
  {
    id: 2,
    name: 'Property Sale Agreement.docx',
    category: 'Contracts',
    fileType: 'DOCX',
    size: '1.8 MB',
    uploadDate: 'Dec 18, 2025',
    lastModified: '4 days ago',
    tags: ['Property', 'Agreement'],
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_19ba74bea-1765285276097.png",
    thumbnailAlt: 'Property sale agreement document with house illustration',
    isPasswordProtected: true,
    sharedWith: ['lawyer@example.com'],
    accessCount: 12
  },
  {
    id: 3,
    name: 'Cyber Crime FIR Receipt.pdf',
    category: 'Legal Documents',
    fileType: 'PDF',
    size: '856 KB',
    uploadDate: 'Dec 15, 2025',
    lastModified: '1 week ago',
    tags: ['Cyber Crime', 'FIR'],
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_14b43bfd0-1766127679277.png",
    thumbnailAlt: 'Cyber crime FIR receipt document',
    isPasswordProtected: false,
    sharedWith: [],
    accessCount: 3
  },
  {
    id: 4,
    name: 'Legal Notice Draft.docx',
    category: 'Drafts',
    fileType: 'DOCX',
    size: '1.2 MB',
    uploadDate: 'Dec 12, 2025',
    lastModified: '10 days ago',
    tags: ['Legal Notice', 'Draft'],
    thumbnail: 'https://img.rocket.new/generatedImages/rocket_gen_img_195aecbf0-1764664891282.png',
    thumbnailAlt: 'Legal notice draft document with gavel',
    isPasswordProtected: false,
    sharedWith: [],
    accessCount: 8
  },
  {
    id: 5,
    name: 'Divorce Petition Documents.pdf',
    category: 'Legal Documents',
    fileType: 'PDF',
    size: '3.1 MB',
    uploadDate: 'Dec 10, 2025',
    lastModified: '12 days ago',
    tags: ['Family Law', 'Divorce'],
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_10d1d44fb-1764980023949.png",
    thumbnailAlt: 'Divorce petition documents',
    isPasswordProtected: true,
    sharedWith: ['family.lawyer@example.com'],
    accessCount: 15
  },
  {
    id: 6,
    name: 'Rent Agreement Signed.pdf',
    category: 'Contracts',
    fileType: 'PDF',
    size: '1.5 MB',
    uploadDate: 'Dec 8, 2025',
    lastModified: '2 weeks ago',
    tags: ['Property', 'Rent'],
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1dcb0c9ca-1765792762532.png",
    thumbnailAlt: 'Signed rental agreement document',
    isPasswordProtected: false,
    sharedWith: ['landlord@example.com'],
    accessCount: 6
  },
  {
    id: 7,
    name: 'Evidence Photos.zip',
    category: 'Evidence',
    fileType: 'ZIP',
    size: '12.4 MB',
    uploadDate: 'Dec 5, 2025',
    lastModified: '2 weeks ago',
    tags: ['Evidence', 'Photos'],
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_13672e0c3-1765504680416.png",
    thumbnailAlt: 'Compressed folder containing evidence photos',
    isPasswordProtected: true,
    sharedWith: [],
    accessCount: 2
  },
  {
    id: 8,
    name: 'Online Harassment Report.pdf',
    category: 'Legal Documents',
    fileType: 'PDF',
    size: '2.8 MB',
    uploadDate: 'Dec 3, 2025',
    lastModified: '3 weeks ago',
    tags: ['Cyber Crime', 'Harassment'],
    thumbnail: "https://images.unsplash.com/photo-1590541085261-909cccce28b4",
    thumbnailAlt: 'Online harassment report document',
    isPasswordProtected: false,
    sharedWith: ['cybercrime@police.gov'],
    accessCount: 4
  }];


  const filteredDocuments = mockDocuments?.filter((doc) => {
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

        <main className="mx-4 lg:mx-6 py-6 lg:py-8">
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
              <Button
                iconName="Upload"
                onClick={() => setShowUploadModal(true)}
                size="lg">

                Upload Document
              </Button>
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
                <StorageStats documents={mockDocuments} />
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

              <DocumentGrid
                documents={sortedDocuments}
                viewMode={viewMode}
                onDocumentClick={handleDocumentClick} />

            </div>
          </div>
        </main>
      </div>

      {showUploadModal &&
      <UploadModal
        onClose={() => setShowUploadModal(false)} />

      }

      {showPreviewModal && selectedDocument &&
      <DocumentPreviewModal
        document={selectedDocument}
        onClose={() => {
          setShowPreviewModal(false);
          setSelectedDocument(null);
        }} />

      }
    </>);

};

export default DocumentVault;