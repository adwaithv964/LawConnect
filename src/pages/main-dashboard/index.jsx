import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import DashboardFeatureCard from '../../components/ui/DashboardFeatureCard';
import CaseStatusIndicator from '../../components/ui/CaseStatusIndicator';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';
import WelcomeBanner from './components/WelcomeBanner';
import QuickActionButtons from './components/QuickActionButtons';
import RecentActivityPanel from './components/RecentActivityPanel';
import EmergencySupportSection from './components/EmergencySupportSection';
import UsageAnalyticsWidget from './components/UsageAnalyticsWidget';
import LegalCategoryTrends from './components/LegalCategoryTrends';

const MainDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'Rajesh Kumar';
    setUserName(storedName);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  const mainFeatures = [
    {
      title: 'AI Legal Chatbot',
      description: 'Get instant answers to your legal questions with our AI-powered assistant. Ask anything about Indian laws, rights, and procedures in simple language.',
      icon: 'MessageSquare',
      path: '/legal-steps-generator',
      stats: '12 conversations',
      recentActivity: 'Last used 5 hours ago',
      variant: 'default'
    },
    {
      title: 'Legal Steps Generator',
      description: 'Convert your legal problem into a clear, step-by-step action plan with required documents, relevant laws, and time limits for resolution.',
      icon: 'ListChecks',
      path: '/legal-steps-generator',
      stats: '8 plans generated',
      recentActivity: 'Last generated 2 days ago',
      variant: 'default'
    },
    {
      title: 'Victim Support Flow',
      description: 'Immediate assistance for crisis situations including cyber fraud, domestic violence, and harassment with emergency contacts and government portal links.',
      icon: 'AlertCircle',
      path: '/victim-support-flow',
      stats: 'Emergency access',
      recentActivity: 'Available 24/7',
      variant: 'emergency'
    },
    {
      title: 'Timeline Tracker',
      description: 'Manage your legal cases with visual timeline tracking, milestone management, and automated reminders for important deadlines and hearings.',
      icon: 'Calendar',
      path: '/legal-timeline-tracker',
      stats: '3 active cases',
      recentActivity: 'Updated 2 hours ago',
      variant: 'default'
    },
    {
      title: 'Document Vault',
      description: 'Securely store and organize all your legal documents with auto-tagging, case linking, and easy retrieval whenever you need them.',
      icon: 'FolderLock',
      path: '/legal-library',
      stats: '8 documents stored',
      recentActivity: 'Last upload 1 day ago',
      variant: 'default'
    },
    {
      title: 'Legal Library',
      description: 'Access comprehensive legal resources, articles, and guides covering various aspects of Indian law in easy-to-understand language.',
      icon: 'BookOpen',
      path: '/legal-library',
      stats: '15 articles read',
      recentActivity: 'Last read 3 days ago',
      variant: 'default'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 lg:pt-24 pb-8">
          <div className="mx-4 lg:mx-6">
            <div className="space-y-6">
              <div className="h-48 bg-muted rounded-xl animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6]?.map((i) => (
                  <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmergencyAlertBanner />
      <CaseStatusIndicator activeCases={3} urgentDeadlines={1} />
      <OfflineStatusIndicator />
      <main className="pt-32 lg:pt-36 pb-8 md:pb-12 lg:pb-16">
        <div className="mx-4 lg:mx-6">
          <div className="space-y-6 md:space-y-8 lg:space-y-10">
            <WelcomeBanner userName={userName} />

            <QuickActionButtons />

            <section>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-heading font-semibold text-foreground mb-4 md:mb-6">
                Platform Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {mainFeatures?.map((feature, index) => (
                  <DashboardFeatureCard
                    key={index}
                    title={feature?.title}
                    description={feature?.description}
                    icon={feature?.icon}
                    path={feature?.path}
                    stats={feature?.stats}
                    recentActivity={feature?.recentActivity}
                    variant={feature?.variant}
                  />
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                <RecentActivityPanel />
                <UsageAnalyticsWidget />
              </div>
              <div className="space-y-6 md:space-y-8">
                <EmergencySupportSection />
                <LegalCategoryTrends />
              </div>
            </div>

            <div className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-elevation-1">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2">
                    Platform Information
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground max-measure mb-4">
                    LawConnect is designed to bridge the gap between Indian citizens and the legal system. All information provided is for educational purposes. For specific legal advice, please consult a qualified legal professional.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
                      PWA Enabled
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      Offline Support
                    </span>
                    <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
                      Secure & Private
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;