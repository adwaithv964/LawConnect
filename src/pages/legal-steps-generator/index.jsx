import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import CaseStatusIndicator from '../../components/ui/CaseStatusIndicator';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';
import Icon from '../../components/AppIcon';
import ProblemInputSection from './components/ProblemInputSection';
import StepCard from './components/StepCard';
import TimelineOverview from './components/TimelineOverview';
import DisclaimerSection from './components/DisclaimerSection';
import EmptyState from './components/EmptyState';

const LegalStepsGenerator = () => {
  const [problemDescription, setProblemDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSteps, setGeneratedSteps] = useState(null);
  const [expandedSteps, setExpandedSteps] = useState({});

  const mockGeneratedPlan = {
    category: 'consumer',
    totalSteps: 6,
    estimatedDuration: '45-60 days',
    complexity: 'medium',
    consultationPoints: [
      'If the seller refuses to respond after legal notice',
      'Before filing a consumer court case',
      'If the claim amount exceeds ₹10 lakhs'
    ],
    steps: [
      {
        id: 1,
        title: 'Document Collection and Evidence Gathering',
        description: 'Collect all relevant documents and evidence to support your consumer complaint.',
        priority: 'high',
        timeLimit: '1-2 days',
        cost: 'Free',
        detailedSteps: [
          'Gather original purchase invoice/receipt showing transaction details',
          'Collect warranty card and product packaging if available',
          'Take clear photographs/videos of the defective product',
          'Save all email correspondence with the seller',
          'Document any verbal communication (dates, names, conversation summary)',
          'Collect bank statements showing payment transaction'
        ],
        requiredDocuments: [
          'Purchase Invoice/Receipt',
          'Warranty Card',
          'Product Photos/Videos',
          'Email Correspondence',
          'Bank Statement',
          'Identity Proof (Aadhaar/PAN)'
        ],
        legalSections: [
          {
            section: 'Consumer Protection Act, 2019 - Section 2(7)',
            description: 'Defines consumer rights and defective goods'
          },
          {
            section: 'Consumer Protection Act, 2019 - Section 35',
            description: 'Right to file complaint for defective goods'
          }
        ],
        tips: [
          'Keep original documents safe and make multiple copies',
          'Organize documents chronologically for easy reference',
          'Create a timeline of events with dates and details'
        ]
      },
      {
        id: 2,
        title: 'Send Formal Complaint to Seller',
        description: 'Draft and send a formal written complaint to the seller requesting replacement or refund.',
        priority: 'high',
        timeLimit: '3-5 days',
        cost: 'Free (₹50-100 for courier)',
        detailedSteps: [
          'Draft a formal complaint letter stating the issue clearly',
          'Include purchase details, defect description, and your demand (replacement/refund)',
          'Attach copies of supporting documents',
          'Send via registered post/speed post for proof of delivery',
          'Keep acknowledgment receipt and tracking number',
          'Send a copy via email for faster communication'
        ],
        requiredDocuments: [
          'Complaint Letter',
          'Copy of Invoice',
          'Product Defect Photos',
          'Postal Receipt'
        ],
        legalSections: [
          {
            section: 'Consumer Protection Act, 2019 - Section 18',
            description: 'Consumer rights against defective goods'
          }
        ],
        tips: [
          'Be polite but firm in your complaint letter',
          'Clearly state your expected resolution',
          'Give a reasonable deadline (7-15 days) for response',
          'Keep copies of all sent documents'
        ]
      },
      {
        id: 3,
        title: 'Wait for Seller Response',
        description: 'Allow reasonable time for the seller to respond and resolve the issue.',
        priority: 'medium',
        timeLimit: '7-15 days',
        cost: 'Free',
        detailedSteps: [
          'Monitor email and phone for seller communication',
          'Track registered post delivery status online',
          'Document any response received from seller',
          'If seller offers resolution, verify terms before accepting',
          'If no response, prepare for next legal step'
        ],
        requiredDocuments: [
          'Delivery Confirmation',
          'Any Response from Seller'
        ],
        legalSections: [],
        tips: [
          'Be patient but keep track of deadlines',
          'Save all communication for future reference',
          'Do not accept partial solutions if not satisfactory'
        ]
      },
      {
        id: 4,
        title: 'Send Legal Notice',
        description: 'If seller does not respond or refuses to resolve, send a legal notice through a lawyer.',
        priority: 'high',
        timeLimit: '5-7 days',
        cost: '₹2,000-5,000 (lawyer fees)',
        detailedSteps: [
          'Consult a consumer rights lawyer',
          'Provide all documents and case details to lawyer',
          'Lawyer will draft legal notice citing Consumer Protection Act',
          'Notice will demand replacement/refund within 15 days',
          'Send notice via registered post and email',
          'Keep copy of notice and postal receipt'
        ],
        requiredDocuments: [
          'All Previous Documents',
          'Lawyer Consultation Notes',
          'Legal Notice Copy',
          'Postal Receipt'
        ],
        legalSections: [
          {
            section: 'Consumer Protection Act, 2019 - Section 35',
            description: 'Right to file complaint and seek redressal'
          },
          {
            section: 'Consumer Protection Act, 2019 - Section 84',
            description: 'Penalties for non-compliance'
          }
        ],
        tips: [
          'Choose a lawyer experienced in consumer cases',
          'Legal notice often prompts quick resolution',
          'Keep all communication professional and documented'
        ]
      },
      {
        id: 5,
        title: 'File Consumer Court Complaint',
        description: 'If legal notice fails, file a formal complaint in the appropriate consumer court.',
        priority: 'high',
        timeLimit: '10-15 days',
        cost: '₹200-500 (court fees)',
        detailedSteps: [
          'Determine correct consumer forum based on claim amount:\n- District Forum: Up to ₹1 crore\n- State Commission: ₹1-10 crore\n- National Commission: Above ₹10 crore',
          'Draft consumer complaint with all details',
          'Attach all supporting documents and affidavit',
          'Pay prescribed court fees',
          'Submit complaint at consumer forum office',
          'Obtain acknowledgment and case number'
        ],
        requiredDocuments: [
          'Consumer Complaint Form',
          'All Supporting Documents',
          'Affidavit',
          'Court Fee Receipt',
          'Identity Proof',
          'Address Proof'
        ],
        legalSections: [
          {
            section: 'Consumer Protection Act, 2019 - Section 34',
            description: 'Jurisdiction of District Consumer Disputes Redressal Commission'
          },
          {
            section: 'Consumer Protection Act, 2019 - Section 47',
            description: 'Procedure for filing complaints'
          }
        ],
        tips: [
          'File complaint within 2 years of cause of action',
          'Ensure all documents are properly attested',
          'Consider hiring a lawyer for court representation'
        ]
      },
      {
        id: 6,
        title: 'Attend Court Hearings and Follow-up',
        description: 'Attend scheduled court hearings and follow court procedures until resolution.',
        priority: 'medium',
        timeLimit: '3-6 months',
        cost: 'Variable (lawyer fees if hired)',
        detailedSteps: [
          'Receive court hearing notice via post/SMS',
          'Attend all scheduled hearings on time',
          'Present your case and evidence to the court',
          'Respond to any queries from the court',
          'If seller does not appear, request ex-parte proceedings',
          'Follow court orders and submit any additional documents requested',
          'Await final judgment and order'
        ],
        requiredDocuments: [
          'Court Notices',
          'Additional Evidence (if requested)',
          'Hearing Attendance Records'
        ],
        legalSections: [
          {
            section: 'Consumer Protection Act, 2019 - Section 58',
            description: 'Procedure for hearing complaints'
          },
          {
            section: 'Consumer Protection Act, 2019 - Section 69',
            description: 'Enforcement of orders'
          }
        ],
        tips: [
          'Never miss court hearings - it can weaken your case',
          'Dress formally and speak respectfully in court',
          'Keep copies of all court documents',
          'If you win, ensure timely execution of court order'
        ]
      }
    ]
  };

  const handleGenerate = () => {
    if (!problemDescription || problemDescription?.length < 50 || !selectedCategory) {
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      setGeneratedSteps(mockGeneratedPlan);
      setIsGenerating(false);
      setExpandedSteps({ 1: true });
    }, 2000);
  };

  const toggleStepExpansion = (stepId) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev?.[stepId]
    }));
  };

  const handleStepComplete = (stepId, isCompleted) => {
    console.log(`Step ${stepId} completion status:`, isCompleted);
  };

  const handleReset = () => {
    setProblemDescription('');
    setSelectedCategory('');
    setGeneratedSteps(null);
    setExpandedSteps({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmergencyAlertBanner />
      <CaseStatusIndicator activeCases={2} urgentDeadlines={1} />
      <OfflineStatusIndicator />
      <main className="pt-16 lg:pt-20">
        <div className="mx-4 lg:mx-6 py-6 lg:py-8">
          <div className="mb-6 lg:mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Link to="/main-dashboard" className="hover:text-primary transition-smooth">
                Dashboard
              </Link>
              <Icon name="ChevronRight" size={14} color="currentColor" />
              <span className="text-foreground font-medium">Legal Steps Generator</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-foreground mb-3">
              AI-Powered Legal Action Plan
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground max-measure">
              Get a comprehensive step-by-step action plan for your legal situation with document requirements, timelines, and relevant legal sections.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <ProblemInputSection
                problemDescription={problemDescription}
                setProblemDescription={setProblemDescription}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />

              {!generatedSteps && !isGenerating && (
                <div className="bg-card rounded-xl border border-border shadow-elevation-2">
                  <EmptyState />
                </div>
              )}

              {isGenerating && (
                <div className="bg-card rounded-xl border border-border shadow-elevation-2 p-8 lg:p-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                      Analyzing Your Legal Problem
                    </h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Our AI is processing your case details and generating a comprehensive action plan with relevant legal references...
                    </p>
                  </div>
                </div>
              )}

              {generatedSteps && !isGenerating && (
                <>
                  <div className="bg-card rounded-xl border border-border shadow-elevation-2 p-6 lg:p-8">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <h2 className="text-2xl lg:text-3xl font-heading font-semibold text-foreground mb-2">
                          Your Legal Action Plan
                        </h2>
                        <p className="text-sm lg:text-base text-muted-foreground">
                          Follow these steps in sequence for the best outcome. Each step includes detailed guidance and required documents.
                        </p>
                      </div>
                      <button
                        onClick={handleReset}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-smooth"
                      >
                        <Icon name="RotateCcw" size={16} color="currentColor" />
                        <span className="hidden sm:inline text-sm font-medium">New Plan</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {generatedSteps?.steps?.map((step, index) => (
                        <StepCard
                          key={step?.id}
                          step={step}
                          stepNumber={index + 1}
                          isExpanded={expandedSteps?.[step?.id]}
                          onToggleExpand={() => toggleStepExpansion(step?.id)}
                          onComplete={handleStepComplete}
                        />
                      ))}
                    </div>
                  </div>

                  <DisclaimerSection />
                </>
              )}
            </div>

            <div className="lg:col-span-1">
              {generatedSteps && !isGenerating && (
                <TimelineOverview
                  totalSteps={generatedSteps?.totalSteps}
                  estimatedDuration={generatedSteps?.estimatedDuration}
                  complexity={generatedSteps?.complexity}
                  consultationPoints={generatedSteps?.consultationPoints}
                />
              )}
            </div>
          </div>

          <div className="mt-8 lg:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <Link
              to="/legal-timeline-tracker"
              className="flex items-center gap-4 p-6 bg-card border border-border rounded-xl hover:shadow-elevation-3 transition-smooth"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
                <Icon name="Calendar" size={24} color="var(--color-primary)" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
                  Track Your Case
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create timeline and manage milestones
                </p>
              </div>
              <Icon name="ArrowRight" size={20} color="var(--color-muted-foreground)" />
            </Link>

            <Link
              to="/legal-library"
              className="flex items-center gap-4 p-6 bg-card border border-border rounded-xl hover:shadow-elevation-3 transition-smooth"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
                <Icon name="BookOpen" size={24} color="var(--color-primary)" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
                  Legal Library
                </h3>
                <p className="text-sm text-muted-foreground">
                  Browse articles and resources
                </p>
              </div>
              <Icon name="ArrowRight" size={20} color="var(--color-muted-foreground)" />
            </Link>

            <Link
              to="/victim-support-flow"
              className="flex items-center gap-4 p-6 bg-accent text-accent-foreground rounded-xl hover:shadow-elevation-3 transition-smooth"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg flex-shrink-0">
                <Icon name="AlertCircle" size={24} color="currentColor" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-heading font-semibold mb-1">
                  Emergency Support
                </h3>
                <p className="text-sm opacity-90">
                  Get immediate crisis assistance
                </p>
              </div>
              <Icon name="ArrowRight" size={20} color="currentColor" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LegalStepsGenerator;