import React, { useState, useEffect, useCallback } from 'react';
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
import { getDashboardSummary, timeAgo } from '../../utils/api';

const MainDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      const data = await getDashboardSummary();
      setDashboardData(data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    // Poll every 60 seconds for live updates
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  // Derived values from live data (fall back gracefully if offline)
  const stats = dashboardData?.stats || {};
  const featureStats = dashboardData?.featureStats || {};
  const rawDisplayName = dashboardData?.user?.displayName;
  const userName = (rawDisplayName && rawDisplayName !== 'User')
    ? rawDisplayName
    : dashboardData?.user?.email?.split('@')[0]
    || localStorage.getItem('userName')
    || 'User';
  const activeCases = stats.activeCases ?? 0;
  const urgentDeadlines = stats.urgentDeadlines ?? 0;
  const totalDocuments = stats.totalDocuments ?? 0;
  const chatCount = stats.chatConsultations ?? 0;
  const libraryCount = stats.libraryReads ?? 0;

  const mainFeatures = [
    {
      title: 'AI Legal Chatbot',
      description: 'Get instant answers to your legal questions with our AI-powered assistant. Ask anything about Indian laws, rights, and procedures in simple language.',
      icon: 'MessageSquare',
      path: '/legal-steps-generator',
      stats: chatCount > 0 ? `${chatCount} consultations` : 'Start a session',
      recentActivity: featureStats.aiChatbot?.lastUsed
        ? `Last used ${timeAgo(featureStats.aiChatbot.lastUsed)}`
        : 'Not used yet',
      variant: 'default'
    },
    {
      title: 'Legal Steps Generator',
      description: 'Convert your legal problem into a clear, step-by-step action plan with required documents, relevant laws, and time limits for resolution.',
      icon: 'ListChecks',
      path: '/legal-steps-generator',
      stats: chatCount > 0 ? `${chatCount} plans generated` : 'Generate your first plan',
      recentActivity: featureStats.legalSteps?.lastUsed
        ? `Last generated ${timeAgo(featureStats.legalSteps.lastUsed)}`
        : 'Not used yet',
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
      stats: activeCases > 0 ? `${activeCases} active case${activeCases > 1 ? 's' : ''}` : 'No active cases',
      recentActivity: featureStats.timeline?.lastUsed
        ? `Updated ${timeAgo(featureStats.timeline.lastUsed)}`
        : 'No activity yet',
      variant: 'default'
    },
    {
      title: 'Document Vault',
      description: 'Securely store and organize all your legal documents with auto-tagging, case linking, and easy retrieval whenever you need them.',
      icon: 'FolderLock',
      path: '/document-vault',
      stats: totalDocuments > 0 ? `${totalDocuments} document${totalDocuments > 1 ? 's' : ''} stored` : 'No documents yet',
      recentActivity: featureStats.documents?.lastUsed
        ? `Last upload ${timeAgo(featureStats.documents.lastUsed)}`
        : 'No uploads yet',
      variant: 'default'
    },
    {
      title: 'Legal Library',
      description: 'Access comprehensive legal resources, articles, and guides covering various aspects of Indian law in easy-to-understand language.',
      icon: 'BookOpen',
      path: '/legal-library',
      stats: libraryCount > 0 ? `${libraryCount} articles read` : 'Start reading',
      recentActivity: featureStats.library?.lastUsed
        ? `Last read ${timeAgo(featureStats.library.lastUsed)}`
        : 'Not visited yet',
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
              <div className="h-20 bg-muted rounded-xl animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6]?.map((i) => (
                  <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-64 bg-muted rounded-xl animate-pulse" />
                  <div className="h-48 bg-muted rounded-xl animate-pulse" />
                </div>
                <div className="space-y-6">
                  <div className="h-72 bg-muted rounded-xl animate-pulse" />
                  <div className="h-64 bg-muted rounded-xl animate-pulse" />
                </div>
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
      <CaseStatusIndicator />
      <OfflineStatusIndicator />
      <main className="pt-32 lg:pt-36 pb-8 md:pb-12 lg:pb-16">
        <div className="mx-4 lg:mx-6">
          <div className="space-y-6 md:space-y-8 lg:space-y-10">
            <WelcomeBanner userName={userName} />

            <QuickActionButtons />

            {/* Error banner (non-blocking — still shows page with cached data) */}
            {error && (
              <div className="flex items-center gap-3 px-4 py-3 bg-warning/10 border border-warning/30 rounded-lg text-warning text-sm">
                <span>⚠️ Could not reach the server. Showing last known data. Make sure the backend is running on port 5000.</span>
                <button onClick={fetchDashboard} className="ml-auto underline font-medium">Retry</button>
              </div>
            )}

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
                <RecentActivityPanel activities={dashboardData?.recentActivities || []} onRefresh={fetchDashboard} />
                <UsageAnalyticsWidget stats={stats} />
              </div>
              <div className="space-y-6 md:space-y-8">
                <EmergencySupportSection />
                <LegalCategoryTrends categoryBreakdown={dashboardData?.categoryBreakdown || {}} />
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
                    {dashboardData?.user?.memberSince && (
                      <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium">
                        Member since {new Date(dashboardData.user.memberSince).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                      </span>
                    )}
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