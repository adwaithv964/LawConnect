import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import CaseStatusIndicator from '../../components/ui/CaseStatusIndicator';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import FilterPanel from './components/FilterPanel';
import ArticleGrid from './components/ArticleGrid';
import TrendingArticles from './components/TrendingArticles';
import RecentlyViewed from './components/RecentlyViewed';
import RecommendedArticles from './components/RecommendedArticles';
import QuickStats from './components/QuickStats';
import Button from '../../components/ui/Button';


const LegalLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contentType, setContentType] = useState('all');
  const [difficultyLevel, setDifficultyLevel] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
  { id: 'all', name: 'All Categories', icon: 'LayoutGrid', count: 156 },
  { id: 'consumer', name: 'Consumer Rights', icon: 'ShoppingCart', count: 42 },
  { id: 'property', name: 'Property Law', icon: 'Home', count: 38 },
  { id: 'cyber', name: 'Cyber Crimes', icon: 'Shield', count: 29 },
  { id: 'family', name: 'Family Law', icon: 'Users', count: 25 },
  { id: 'constitutional', name: 'Constitutional Rights', icon: 'Scale', count: 22 }];


  const mockArticles = [
  {
    id: 1,
    title: "Understanding Consumer Protection Act 2019: Your Complete Guide",
    excerpt: "Learn about your rights as a consumer under the new Consumer Protection Act 2019. This comprehensive guide covers complaint procedures, compensation claims, and e-commerce regulations.",
    category: "Consumer Rights",
    categoryIcon: "ShoppingCart",
    difficulty: "beginner",
    readTime: 8,
    views: "2.4k",
    likes: 156,
    publishDate: "Dec 15, 2025",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_15b10e24c-1764649836727.png",
    imageAlt: "Professional lawyer reviewing consumer protection documents at modern office desk with laptop and legal books",
    isFeatured: true,
    isBookmarked: false
  },
  {
    id: 2,
    title: "Property Registration Process in India: Step-by-Step Documentation",
    excerpt: "Complete walkthrough of property registration requirements, stamp duty calculations, and documentation needed for hassle-free property transfer in India.",
    category: "Property Law",
    categoryIcon: "Home",
    difficulty: "intermediate",
    readTime: 12,
    views: "1.8k",
    likes: 98,
    publishDate: "Dec 10, 2025",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d59c13d7-1766513857440.png",
    imageAlt: "Modern residential property exterior with sold sign and keys on wooden table representing successful property registration",
    isFeatured: false,
    isBookmarked: true
  },
  {
    id: 3,
    title: "Cyber Crime Reporting: How to File FIR for Online Fraud",
    excerpt: "Essential guide to reporting cyber crimes including online fraud, identity theft, and digital harassment. Learn about cybercrime cells and evidence preservation.",
    category: "Cyber Crimes",
    categoryIcon: "Shield",
    difficulty: "beginner",
    readTime: 6,
    views: "3.1k",
    likes: 203,
    publishDate: "Dec 18, 2025",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1997ee4ca-1764672412138.png",
    imageAlt: "Digital security concept showing laptop with lock icon and cybersecurity shield protecting against online fraud",
    isFeatured: true,
    isBookmarked: false
  },
  {
    id: 4,
    title: "Divorce Proceedings in India: Legal Process and Documentation",
    excerpt: "Comprehensive overview of divorce laws in India covering mutual consent divorce, contested divorce, alimony, and child custody arrangements under various personal laws.",
    category: "Family Law",
    categoryIcon: "Users",
    difficulty: "advanced",
    readTime: 15,
    views: "1.5k",
    likes: 87,
    publishDate: "Dec 5, 2025",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_108e74940-1765883810330.png",
    imageAlt: "Family law consultation showing lawyer discussing divorce documents with client in professional office setting",
    isFeatured: false,
    isBookmarked: false
  },
  {
    id: 5,
    title: "Right to Information Act: Filing RTI Applications Effectively",
    excerpt: "Master the RTI process with this detailed guide covering application format, fee structure, appeal procedures, and common mistakes to avoid when seeking government information.",
    category: "Constitutional Rights",
    categoryIcon: "Scale",
    difficulty: "intermediate",
    readTime: 10,
    views: "2.2k",
    likes: 134,
    publishDate: "Dec 12, 2025",
    image: "https://images.unsplash.com/photo-1672419596694-185c04f15c6e",
    imageAlt: "Indian constitution book with gavel and scales of justice representing right to information and constitutional rights",
    isFeatured: false,
    isBookmarked: true
  },
  {
    id: 6,
    title: "Tenant Rights and Landlord Obligations Under Rent Control Act",
    excerpt: "Know your rights as a tenant including rent control provisions, eviction protection, maintenance responsibilities, and dispute resolution mechanisms.",
    category: "Property Law",
    categoryIcon: "Home",
    difficulty: "beginner",
    readTime: 7,
    views: "1.9k",
    likes: 112,
    publishDate: "Dec 8, 2025",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c1faee94-1766513859689.png",
    imageAlt: "Rental property agreement signing with keys and contract documents on table between landlord and tenant",
    isFeatured: false,
    isBookmarked: false
  }];


  const trendingArticles = [
  {
    id: 7,
    title: "New E-Commerce Rules 2025: What Consumers Need to Know",
    category: "Consumer Rights",
    readTime: 5,
    views: "4.2k",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1eb7c1cb3-1764655134961.png",
    imageAlt: "Online shopping on laptop showing e-commerce website with shopping cart and payment options"
  },
  {
    id: 8,
    title: "Digital Arrest Scams: How to Identify and Report",
    category: "Cyber Crimes",
    readTime: 4,
    views: "3.8k",
    image: "https://images.unsplash.com/photo-1610602517380-cce49794d0a8",
    imageAlt: "Warning sign on smartphone screen showing cyber scam alert with red exclamation mark"
  },
  {
    id: 9,
    title: "Property Inheritance Laws: Understanding Succession Rights",
    category: "Property Law",
    readTime: 11,
    views: "2.9k",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_16356c14c-1766335415684.png",
    imageAlt: "Legal documents for property inheritance with family photos and will papers on wooden desk"
  }];


  const recentlyViewedArticles = [
  {
    id: 10,
    title: "Filing Consumer Complaints Online: Complete Process",
    category: "Consumer Rights",
    categoryIcon: "ShoppingCart",
    viewedAt: "2 hours ago"
  },
  {
    id: 11,
    title: "Domestic Violence Act: Protection and Legal Remedies",
    category: "Family Law",
    categoryIcon: "Users",
    viewedAt: "Yesterday"
  }];


  const recommendedArticles = [
  {
    id: 12,
    title: "Product Warranty Claims: Your Legal Rights",
    category: "Consumer Rights",
    readTime: 6,
    rating: "4.8",
    basedOn: "Consumer Rights",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_162952322-1766513858532.png",
    imageAlt: "Product warranty certificate with seal and guarantee documents on retail counter"
  },
  {
    id: 13,
    title: "Online Banking Fraud: Prevention and Recovery",
    category: "Cyber Crimes",
    readTime: 8,
    rating: "4.9",
    basedOn: "Cyber Crimes",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_18f2ffab0-1766014959260.png",
    imageAlt: "Secure online banking on mobile phone showing encrypted transaction with lock icon"
  }];


  const quickStats = [
  { id: 1, icon: 'FileText', value: '156', label: 'Total Articles' },
  { id: 2, icon: 'Users', value: '12k+', label: 'Readers' },
  { id: 3, icon: 'BookOpen', value: '6', label: 'Categories' },
  { id: 4, icon: 'TrendingUp', value: '24', label: 'New This Month' }];


  const hasActiveFilters = contentType !== 'all' || difficultyLevel !== 'all' || sortBy !== 'recent';

  const handleSearchSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleClearFilters = () => {
    setContentType('all');
    setDifficultyLevel('all');
    setSortBy('recent');
  };

  const handleBookmark = (articleId) => {
    console.log('Bookmark toggled for article:', articleId);
  };

  const handleShare = (article) => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location?.href
      });
    } else {
      console.log('Share article:', article?.title);
    }
  };

  const filteredArticles = mockArticles?.filter((article) => {
    const matchesCategory = selectedCategory === 'all' || article?.category?.toLowerCase()?.includes(selectedCategory);
    const matchesSearch = searchQuery === '' ||
    article?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    article?.excerpt?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Legal Library - LawConnect</title>
        <meta name="description" content="Access comprehensive legal articles, guides, and educational resources. Search and filter content across consumer rights, property law, cyber crimes, and more." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <EmergencyAlertBanner />
        <CaseStatusIndicator activeCases={2} urgentDeadlines={1} />
        <OfflineStatusIndicator />

        <main className="pt-32 lg:pt-36 pb-12 lg:pb-16">
          <div className="mx-4 lg:mx-6">
            <div className="mb-6 lg:mb-8">
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Legal Library
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground max-measure">
                Explore our comprehensive collection of legal articles, guides, and resources to understand your rights and legal procedures.
              </p>
            </div>

            <QuickStats stats={quickStats} />

            <div className="mt-6 lg:mt-8 mb-6 lg:mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onSearchSubmit={handleSearchSubmit} />

                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  iconName="SlidersHorizontal"
                  iconPosition="left"
                  className="lg:hidden">

                  Filters
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <aside className={`lg:col-span-3 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory} />

                <FilterPanel
                  contentType={contentType}
                  difficultyLevel={difficultyLevel}
                  sortBy={sortBy}
                  onContentTypeChange={setContentType}
                  onDifficultyChange={setDifficultyLevel}
                  onSortChange={setSortBy}
                  onClearFilters={handleClearFilters}
                  hasActiveFilters={hasActiveFilters} />

              </aside>

              <div className="lg:col-span-6">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredArticles?.length} {filteredArticles?.length === 1 ? 'article' : 'articles'}
                  </p>
                  {searchQuery &&
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    iconName="X"
                    iconPosition="left"
                    iconSize={16}>

                      Clear search
                    </Button>
                  }
                </div>

                <ArticleGrid
                  articles={filteredArticles}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                  isLoading={isLoading} />


                {!isLoading && filteredArticles?.length > 0 &&
                <div className="mt-8 text-center">
                    <Button
                    variant="outline"
                    iconName="RefreshCw"
                    iconPosition="left">

                      Load More Articles
                    </Button>
                  </div>
                }
              </div>

              <aside className="lg:col-span-3 space-y-6">
                <TrendingArticles articles={trendingArticles} />
                <RecentlyViewed articles={recentlyViewedArticles} />
                <RecommendedArticles articles={recommendedArticles} />
              </aside>
            </div>
          </div>
        </main>
      </div>
    </>);

};

export default LegalLibrary;