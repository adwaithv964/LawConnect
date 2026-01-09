import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import CaseStatusIndicator from '../../components/ui/CaseStatusIndicator';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import TemplateGrid from './components/TemplateGrid';
import RecentTemplates from './components/RecentTemplates';
import PopularTemplates from './components/PopularTemplates';
import TemplatePreviewModal from './components/TemplatePreviewModal';
import Button from '../../components/ui/Button';

const DocumentTemplates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDocType, setSelectedDocType] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const mockTemplates = [
  {
    id: 1,
    name: 'Consumer Complaint Application',
    category: 'Consumer',
    docType: 'Complaint',
    complexity: 'beginner',
    description: 'File a consumer complaint for defective products or services with detailed guidelines.',
    downloads: 2847,
    rating: 4.8,
    lastUpdated: 'Dec 2025',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_10a605029-1766109339970.png",
    imageAlt: 'Consumer complaint form document with pen on desk',
    formats: ['PDF', 'DOCX'],
    requiredFields: ['Consumer Details', 'Product Information', 'Complaint Description', 'Relief Sought'],
    estimatedTime: '15-20 min',
    isFeatured: true
  },
  {
    id: 2,
    name: 'Property Sale Agreement',
    category: 'Property',
    docType: 'Agreement',
    complexity: 'intermediate',
    description: 'Comprehensive property sale agreement template with all necessary clauses and conditions.',
    downloads: 1923,
    rating: 4.6,
    lastUpdated: 'Nov 2025',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d9977a51-1765719806028.png",
    imageAlt: 'Property sale agreement document with house keys',
    formats: ['PDF', 'DOCX'],
    requiredFields: ['Seller Details', 'Buyer Details', 'Property Description', 'Payment Terms', 'Possession Date'],
    estimatedTime: '30-40 min',
    isFeatured: true
  },
  {
    id: 3,
    name: 'Cyber Crime FIR Application',
    category: 'Cyber',
    docType: 'Application',
    complexity: 'beginner',
    description: 'Template for filing FIR for cyber crimes including online fraud and identity theft.',
    downloads: 3156,
    rating: 4.9,
    lastUpdated: 'Dec 2025',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_10548435c-1766514212633.png",
    imageAlt: 'Cyber crime report form with laptop showing security alert',
    formats: ['PDF'],
    requiredFields: ['Victim Details', 'Incident Description', 'Evidence Details', 'Suspect Information'],
    estimatedTime: '10-15 min',
    isFeatured: false
  },
  {
    id: 4,
    name: 'Legal Notice for Recovery',
    category: 'Consumer',
    docType: 'Notice',
    complexity: 'intermediate',
    description: 'Professional legal notice template for debt recovery and payment demands.',
    downloads: 1654,
    rating: 4.5,
    lastUpdated: 'Oct 2025',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_195aecbf0-1764664891282.png",
    imageAlt: 'Legal notice document with gavel on wooden desk',
    formats: ['PDF', 'DOCX'],
    requiredFields: ['Sender Details', 'Recipient Details', 'Amount Due', 'Demand Statement', 'Timeline'],
    estimatedTime: '20-25 min',
    isFeatured: false
  },
  {
    id: 5,
    name: 'Mutual Divorce Petition',
    category: 'Family',
    docType: 'Application',
    complexity: 'advanced',
    description: 'Complete mutual consent divorce petition with all required affidavits and declarations.',
    downloads: 987,
    rating: 4.7,
    lastUpdated: 'Nov 2025',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b80ffdb4-1766514212992.png",
    imageAlt: 'Divorce petition documents with wedding rings',
    formats: ['PDF', 'DOCX'],
    requiredFields: ['Petitioner Details', 'Respondent Details', 'Marriage Details', 'Grounds for Divorce', 'Settlement Terms'],
    estimatedTime: '45-60 min',
    isFeatured: false
  },
  {
    id: 6,
    name: 'Rent Agreement',
    category: 'Property',
    docType: 'Agreement',
    complexity: 'beginner',
    description: 'Standard residential rent agreement with customizable terms and conditions.',
    downloads: 4231,
    rating: 4.8,
    lastUpdated: 'Dec 2025',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_163f11665-1766056342998.png",
    imageAlt: 'Rental agreement document with apartment keys',
    formats: ['PDF', 'DOCX'],
    requiredFields: ['Landlord Details', 'Tenant Details', 'Property Address', 'Rent Amount', 'Duration'],
    estimatedTime: '15-20 min',
    isFeatured: true
  },
  {
    id: 7,
    name: 'Child Custody Application',
    category: 'Family',
    docType: 'Application',
    complexity: 'advanced',
    description: 'Detailed child custody application for family court proceedings.',
    downloads: 756,
    rating: 4.6,
    lastUpdated: 'Oct 2025',
    image: "https://images.unsplash.com/photo-1722943768916-1eb8d81b72c0",
    imageAlt: 'Child custody application form with family photo',
    formats: ['PDF'],
    requiredFields: ['Parent Details', 'Child Information', 'Custody Arrangement', 'Supporting Evidence'],
    estimatedTime: '40-50 min',
    isFeatured: false
  },
  {
    id: 8,
    name: 'Online Harassment Complaint',
    category: 'Cyber',
    docType: 'Complaint',
    complexity: 'beginner',
    description: 'Template for reporting online harassment and cyberbullying incidents.',
    downloads: 2134,
    rating: 4.7,
    lastUpdated: 'Nov 2025',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_176b9073e-1766514212764.png",
    imageAlt: 'Online harassment complaint form with smartphone',
    formats: ['PDF', 'DOCX'],
    requiredFields: ['Complainant Details', 'Harassment Description', 'Evidence Screenshots', 'Platform Information'],
    estimatedTime: '15-20 min',
    isFeatured: false
  }];


  const filteredTemplates = mockTemplates?.filter((template) => {
    const matchesSearch = template?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    template?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template?.category === selectedCategory;
    const matchesDocType = selectedDocType === 'all' || template?.docType === selectedDocType;
    const matchesComplexity = selectedComplexity === 'all' || template?.complexity === selectedComplexity;

    return matchesSearch && matchesCategory && matchesDocType && matchesComplexity;
  });

  const sortedTemplates = [...filteredTemplates]?.sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b?.downloads - a?.downloads;
      case 'rating':
        return b?.rating - a?.rating;
      case 'recent':
        return new Date(b?.lastUpdated) - new Date(a?.lastUpdated);
      case 'name':
        return a?.name?.localeCompare(b?.name);
      default:
        return 0;
    }
  });

  const handleTemplatePreview = (template) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  const handleDownload = (template, format) => {
    console.log(`Downloading ${template?.name} in ${format} format`);
  };

  return (
    <>
      <Helmet>
        <title>Document Templates - LawConnect</title>
        <meta name="description" content="Access pre-formatted legal document templates for various legal needs" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <EmergencyAlertBanner />
        <CaseStatusIndicator />
        <OfflineStatusIndicator />

        <main className="container mx-auto px-4 py-6 lg:py-8">
          <div className="mb-6 lg:mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Document Templates
                </h1>
                <p className="text-muted-foreground">
                  Pre-formatted legal documents for common legal needs
                </p>
              </div>
              <Button
                variant="outline"
                iconName="Filter"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden">

                Filters
              </Button>
            </div>

            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy} />

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <aside className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <FilterPanel
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedDocType={selectedDocType}
                onDocTypeChange={setSelectedDocType}
                selectedComplexity={selectedComplexity}
                onComplexityChange={setSelectedComplexity} />

              <div className="mt-6">
                <RecentTemplates />
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    {sortedTemplates?.length} Templates Found
                  </h2>
                </div>
              </div>

              <TemplateGrid
                templates={sortedTemplates}
                onPreview={handleTemplatePreview}
                onDownload={handleDownload} />


              <div className="mt-8">
                <PopularTemplates onPreview={handleTemplatePreview} />
              </div>
            </div>
          </div>
        </main>
      </div>

      {showPreviewModal && selectedTemplate &&
      <TemplatePreviewModal
        template={selectedTemplate}
        onClose={() => setShowPreviewModal(false)}
        onDownload={handleDownload} />

      }
    </>);

};

export default DocumentTemplates;