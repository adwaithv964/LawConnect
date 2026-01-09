import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import CaseStatusIndicator from '../../components/ui/CaseStatusIndicator';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import EmergencyContactCard from './components/EmergencyContactCard';
import CrisisAssessmentCard from './components/CrisisAssessmentCard';
import NearbyResourceCard from './components/NearbyResourceCard';
import SafetyFeaturePanel from './components/SafetyFeaturePanel';
import ResourceDownloadCard from './components/ResourceDownloadCard';
import ReportingGuideCard from './components/ReportingGuideCard';

const VictimSupportFlow = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [locationFilter, setLocationFilter] = useState('nearest');
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentCategory, setAssessmentCategory] = useState(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === 'Escape') {
        window.location.href = 'https://www.google.com';
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const emergencyContacts = [
  {
    id: 1,
    title: "Cyber Crime Helpline",
    description: "Report online fraud, hacking, identity theft, and cyber harassment",
    phoneNumber: "1930",
    availability: "24/7 Available",
    icon: "Shield",
    variant: "critical",
    portalLink: "https://cybercrime.gov.in",
    portalName: "National Cyber Crime Portal"
  },
  {
    id: 2,
    title: "Women Helpline",
    description: "Support for domestic violence, harassment, and women's safety issues",
    phoneNumber: "1091",
    availability: "24/7 Available",
    icon: "Heart",
    variant: "critical",
    portalLink: "https://wcd.nic.in",
    portalName: "Women & Child Development"
  },
  {
    id: 3,
    title: "Police Emergency",
    description: "Immediate police assistance for any emergency situation",
    phoneNumber: "100",
    availability: "24/7 Available",
    icon: "AlertCircle",
    variant: "critical",
    portalLink: null,
    portalName: null
  },
  {
    id: 4,
    title: "Legal Aid Services",
    description: "Free legal consultation and assistance for eligible citizens",
    phoneNumber: "15100",
    availability: "Mon-Sat, 9 AM - 6 PM",
    icon: "Scale",
    variant: "default",
    portalLink: "https://nalsa.gov.in",
    portalName: "National Legal Services Authority"
  },
  {
    id: 5,
    title: "Child Helpline",
    description: "Support for child abuse, trafficking, and child rights violations",
    phoneNumber: "1098",
    availability: "24/7 Available",
    icon: "Baby",
    variant: "urgent",
    portalLink: "https://www.childlineindia.org",
    portalName: "Childline India"
  },
  {
    id: 6,
    title: "Senior Citizens Helpline",
    description: "Assistance for elderly abuse, neglect, and senior citizen rights",
    phoneNumber: "14567",
    availability: "24/7 Available",
    icon: "Users",
    variant: "default",
    portalLink: null,
    portalName: null
  }];


  const assessmentData = {
    cyber: {
      category: "Cyber Crime",
      questions: [
      "Have you lost money due to online fraud or scam?",
      "Do you have screenshots or evidence of the fraudulent activity?",
      "Have you blocked the fraudster\'s contact information?",
      "Do you know the transaction details (UPI ID, account number, etc.)?"],

      resources: [
      "File FIR at National Cyber Crime Portal immediately",
      "Contact your bank to freeze the transaction",
      "Save all communication evidence (screenshots, emails, messages)",
      "Report to local cyber cell within 24 hours for better recovery chances"]

    },
    domestic: {
      category: "Domestic Violence",
      questions: [
      "Are you currently in immediate physical danger?",
      "Do you have a safe place to go if needed?",
      "Have you documented injuries with photographs or medical records?",
      "Are there children involved who may also be at risk?"],

      resources: [
      "Call Women Helpline 1091 for immediate assistance",
      "Visit nearest police station to file FIR under Domestic Violence Act",
      "Contact local NGO for shelter and legal support",
      "Apply for Protection Order under Section 18 of DV Act"]

    },
    harassment: {
      category: "Harassment",
      questions: [
      "Is the harassment happening online or offline?",
      "Have you saved evidence of the harassment (messages, emails, recordings)?",
      "Do you know the identity of the harasser?",
      "Has the harassment escalated to threats or stalking?"],

      resources: [
      "File complaint at nearest police station under IPC Section 354A",
      "Block and report harasser on all platforms",
      "Document all incidents with dates, times, and evidence",
      "Consider filing for restraining order if harassment continues"]

    }
  };

  const nearbyResources = [
  {
    id: 1,
    name: "Connaught Place Police Station",
    type: "police",
    address: "Parliament Street, Connaught Place, New Delhi, Delhi 110001",
    distance: "2.3 km away",
    phone: "+91-11-23412345",
    availability: "24/7 Open",
    latitude: 28.6289,
    longitude: 77.2065
  },
  {
    id: 2,
    name: "Delhi State Legal Services Authority",
    type: "legal",
    address: "High Court of Delhi, Sher Shah Road, New Delhi, Delhi 110003",
    distance: "3.8 km away",
    phone: "+91-11-23385214",
    availability: "Mon-Fri, 9 AM - 5 PM",
    latitude: 28.6253,
    longitude: 77.2420
  },
  {
    id: 3,
    name: "Shakti Shalini NGO",
    type: "ngo",
    address: "C-59, South Extension Part II, New Delhi, Delhi 110049",
    distance: "5.1 km away",
    phone: "+91-11-26265965",
    availability: "Mon-Sat, 10 AM - 6 PM",
    latitude: 28.5677,
    longitude: 77.2197
  },
  {
    id: 4,
    name: "AIIMS Trauma Center",
    type: "hospital",
    address: "Ansari Nagar, New Delhi, Delhi 110029",
    distance: "4.5 km away",
    phone: "+91-11-26588500",
    availability: "24/7 Emergency",
    latitude: 28.5672,
    longitude: 77.2100
  }];


  const downloadableResources = [
  {
    name: "Safety Checklist for Domestic Violence",
    size: "245 KB",
    format: "PDF"
  },
  {
    name: "Your Legal Rights - Quick Reference Guide",
    size: "512 KB",
    format: "PDF"
  },
  {
    name: "Evidence Collection Guidelines",
    size: "328 KB",
    format: "PDF"
  },
  {
    name: "Emergency Contact Directory",
    size: "156 KB",
    format: "PDF"
  }];


  const reportingSteps = [
  {
    title: "Visit the Portal",
    description: "Open the National Cyber Crime Portal and click on \'Report Cyber Crime'",
    screenshot: "https://img.rocket.new/generatedImages/rocket_gen_img_18436375f-1764907168549.png",
    tips: "Keep your Aadhaar card ready for identity verification"
  },
  {
    title: "Select Crime Category",
    description: "Choose the appropriate category that matches your complaint (Financial Fraud, Hacking, etc.)",
    screenshot: "https://img.rocket.new/generatedImages/rocket_gen_img_16aa80814-1764777332422.png",
    tips: "Read category descriptions carefully to select the most accurate option"
  },
  {
    title: "Fill Complaint Details",
    description: "Provide incident date, time, location, and detailed description of what happened",
    screenshot: "https://img.rocket.new/generatedImages/rocket_gen_img_1ad77b4ef-1766474570181.png",
    tips: "Be as specific as possible with dates, amounts, and transaction IDs"
  },
  {
    title: "Upload Evidence",
    description: "Attach screenshots, transaction receipts, chat logs, and any other supporting documents",
    screenshot: "https://img.rocket.new/generatedImages/rocket_gen_img_104ca10a8-1765783472129.png",
    tips: "Ensure all documents are clear and readable before uploading"
  },
  {
    title: "Submit & Track",
    description: "Review all information, submit your complaint, and note down the complaint number for tracking",
    screenshot: "https://img.rocket.new/generatedImages/rocket_gen_img_113040ad1-1765212516186.png",
    tips: "Save the complaint number and check status regularly on the portal"
  }];


  const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'cyber', label: 'Cyber Crime' },
  { value: 'domestic', label: 'Domestic Violence' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'child', label: 'Child Safety' },
  { value: 'senior', label: 'Senior Citizens' }];


  const locationOptions = [
  { value: 'nearest', label: 'Nearest to Me' },
  { value: 'delhi', label: 'Delhi NCR' },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'chennai', label: 'Chennai' }];


  const filteredContacts = selectedCategory === 'all' ?
  emergencyContacts :
  emergencyContacts?.filter((contact) => {
    const categoryMap = {
      cyber: [1],
      domestic: [2],
      harassment: [2, 3],
      child: [5],
      senior: [6]
    };
    return categoryMap?.[selectedCategory]?.includes(contact?.id);
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmergencyAlertBanner />
      <CaseStatusIndicator activeCases={2} urgentDeadlines={1} />
      <OfflineStatusIndicator />
      <div className="pt-32 lg:pt-36 pb-8 lg:pb-12">
        <div className="mx-4 lg:mx-6">
          <div className="mb-6 lg:mb-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-accent rounded-xl">
                <Icon name="AlertCircle" size={32} color="var(--color-accent-foreground)" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground mb-2">
                  Emergency Support Center
                </h1>
                <p className="text-base md:text-lg text-muted-foreground max-measure">
                  Immediate assistance for urgent legal situations. Available 24/7 with multilingual support.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 p-4 bg-accent/10 border border-accent/20 rounded-xl">
              <Icon name="Info" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm md:text-base text-foreground mb-2">
                  <span className="font-semibold">Your safety is our priority.</span> All information shared here is confidential. Press ESC anytime to quickly exit this page.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/legal-steps-generator"
                    className="inline-flex items-center gap-1 text-sm text-accent hover:underline">

                    <Icon name="MessageSquare" size={14} color="currentColor" />
                    <span>Talk to AI Assistant</span>
                  </Link>
                  <Link
                    to="/legal-timeline-tracker"
                    className="inline-flex items-center gap-1 text-sm text-accent hover:underline">

                    <Icon name="FolderPlus" size={14} color="currentColor" />
                    <span>Create New Case</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Select
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="Filter by category" />

              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAssessment(true);
                  setAssessmentCategory('cyber');
                }}
                iconName="HelpCircle"
                iconPosition="left">

                Need Help Choosing?
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              <div>
                <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-4">
                  Emergency Contacts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredContacts?.map((contact) =>
                  <EmergencyContactCard key={contact?.id} {...contact} />
                  )}
                </div>
              </div>

              {showAssessment && assessmentCategory &&
              <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
                      Quick Assessment
                    </h2>
                    <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAssessment(false)}
                    iconName="X" />

                  </div>
                  <CrisisAssessmentCard {...assessmentData?.[assessmentCategory]} />
                </div>
              }

              <div>
                <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-4">
                  How to Report Online
                </h2>
                <ReportingGuideCard
                  title="Cyber Crime Reporting Guide"
                  steps={reportingSteps}
                  portalUrl="https://cybercrime.gov.in"
                  portalName="National Cyber Crime Portal" />

              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
                    Nearby Resources
                  </h2>
                  <Select
                    options={locationOptions}
                    value={locationFilter}
                    onChange={setLocationFilter}
                    className="w-48" />

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nearbyResources?.map((resource) =>
                  <NearbyResourceCard key={resource?.id} {...resource} />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 lg:space-y-6">
              <SafetyFeaturePanel />
              
              <ResourceDownloadCard
                title="Downloadable Resources"
                description="Essential guides and checklists for your safety"
                resources={downloadableResources} />


              <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-2">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                    <Icon name="Headphones" size={24} color="var(--color-primary)" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
                      Need to Talk?
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Connect with trained counselors and legal experts
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Link
                    to="/legal-steps-generator"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth">

                    <Icon name="MessageSquare" size={18} color="currentColor" />
                    <span>Chat with AI Assistant</span>
                  </Link>
                  <a
                    href="tel:15100"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-border rounded-lg font-medium text-foreground hover:bg-muted transition-smooth">

                    <Icon name="Phone" size={18} color="currentColor" />
                    <span>Call Legal Aid: 15100</span>
                  </a>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-2">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg">
                    <Icon name="BookOpen" size={24} color="var(--color-success)" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
                      Know Your Rights
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Learn about legal protections available to you
                    </p>
                  </div>
                </div>
                <Link
                  to="/legal-library"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-success text-success-foreground rounded-lg font-medium hover:bg-success/90 transition-smooth">

                  <Icon name="ArrowRight" size={18} color="currentColor" />
                  <span>Visit Legal Library</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

};

export default VictimSupportFlow;