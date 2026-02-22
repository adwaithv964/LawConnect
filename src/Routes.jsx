import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LegalTimelineTracker from './pages/legal-timeline-tracker';
import MainDashboard from './pages/main-dashboard';
import VictimSupportFlow from './pages/victim-support-flow';
import LegalLibrary from './pages/legal-library';
import ArticleDetail from './pages/legal-library/ArticleDetail';
import LegalNews from './pages/legal-news';
import CurrentAffairs from './pages/current-affairs';
import EvidenceLocker from './pages/evidence-locker';
import LegalStepsGenerator from './pages/legal-steps-generator';
import DocumentTemplates from './pages/document-templates';
import DocumentVault from './pages/document-vault';
import SettingsPage from './pages/settings';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import PrivateRoute from './components/PrivateRoute';
import LawyerDirectory from './pages/lawyer-directory';
import CaseStatusTracker from './pages/case-status-tracker';
import LegalCalendar from './pages/legal-calendar';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><MainDashboard /></PrivateRoute>} />
          <Route path="/main-dashboard" element={<PrivateRoute><MainDashboard /></PrivateRoute>} />
          <Route path="/legal-timeline-tracker" element={<PrivateRoute><LegalTimelineTracker /></PrivateRoute>} />
          <Route path="/victim-support-flow" element={<PrivateRoute><VictimSupportFlow /></PrivateRoute>} />
          <Route path="/legal-library" element={<PrivateRoute><LegalLibrary /></PrivateRoute>} />
          <Route path="/legal-library/:id" element={<PrivateRoute><ArticleDetail /></PrivateRoute>} />
          <Route path="/legal-news" element={<PrivateRoute><LegalNews /></PrivateRoute>} />
          <Route path="/current-affairs" element={<PrivateRoute><CurrentAffairs /></PrivateRoute>} />
          <Route path="/evidence-locker" element={<PrivateRoute><EvidenceLocker /></PrivateRoute>} />
          <Route path="/legal-steps-generator" element={<PrivateRoute><LegalStepsGenerator /></PrivateRoute>} />
          <Route path="/document-templates" element={<PrivateRoute><DocumentTemplates /></PrivateRoute>} />
          <Route path="/document-vault" element={<PrivateRoute><DocumentVault /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path="/lawyer-directory" element={<PrivateRoute><LawyerDirectory /></PrivateRoute>} />
          <Route path="/case-status-tracker" element={<PrivateRoute><CaseStatusTracker /></PrivateRoute>} />
          <Route path="/legal-calendar" element={<PrivateRoute><LegalCalendar /></PrivateRoute>} />

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
