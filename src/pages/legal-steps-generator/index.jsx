import React, { useState, useEffect } from 'react';
import { logActivity, generateActionPlan, createCase } from '../../utils/api';
import { Link, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
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
  const navigate = useNavigate();

  // Track page visit as AI Consultation activity
  useEffect(() => {
    logActivity({
      type: 'chat',
      title: 'AI Legal Consultation',
      description: 'Visited Legal Steps Generator for AI-powered legal guidance',
      link: '/legal-steps-generator',
      icon: 'MessageSquare',
      iconColor: 'var(--color-secondary)'
    }).catch(() => { });
  }, []);

  const [problemDescription, setProblemDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [generatedSteps, setGeneratedSteps] = useState(null);
  const [expandedSteps, setExpandedSteps] = useState({});

  const handleGenerate = async () => {
    if (!problemDescription || problemDescription?.length < 50 || !selectedCategory) {
      return;
    }

    setIsGenerating(true);
    setGeneratedSteps(null);

    try {
      const response = await generateActionPlan(problemDescription, selectedCategory);
      if (response && response.plan) {
        setGeneratedSteps(response.plan);
        if (response.plan.steps && response.plan.steps.length > 0) {
          setExpandedSteps({ [response.plan.steps[0].id]: true });
        }
      }
    } catch (error) {
      console.error('Failed to generate action plan:', error);
      alert('Failed to generate action plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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

  const handleExportPDF = async () => {
    setIsExporting(true);
    const element = document.getElementById('action-plan-content');

    // Quick expand all steps for the PDF payload so details aren't hidden
    const allExpanded = {};
    generatedSteps?.steps?.forEach(s => allExpanded[s.id] = true);
    setExpandedSteps(allExpanded);

    // Give state a moment to update the DOM before capturing PDF
    setTimeout(() => {
      const opt = {
        margin: 10,
        filename: `Legal_Action_Plan_${new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().from(element).set(opt).save().then(() => {
        setIsExporting(false);
      }).catch(err => {
        console.error("PDF Export Error: ", err);
        setIsExporting(false);
        alert('Failed to generate PDF');
      });
    }, 500);
  };

  const handleCreateCase = async () => {
    setIsCreating(true);
    try {
      const milestones = generatedSteps?.steps?.map((step) => ({
        id: step.id,
        title: step.title,
        description: step.description,
        date: new Date().toISOString(), // Initial creation date
        completed: false
      })) || [];

      // Calculate an estimated deadline by parsing the "3-6 months" string loosely, or defaulting to +30 days
      const daysEstimate = 30; // fallback
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + daysEstimate);

      const caseData = {
        title: problemDescription.substring(0, 50) + (problemDescription.length > 50 ? '...' : ''),
        status: 'active',
        category: selectedCategory,
        deadlineDate: deadlineDate.toISOString(),
        milestones: milestones
      };

      await createCase(caseData);

      logActivity({
        type: 'case',
        title: 'New Case Timeline Created',
        description: `Generated AI timeline tracker for: ${selectedCategory}`,
        link: '/legal-timeline-tracker',
        icon: 'Calendar',
        iconColor: 'var(--color-primary)'
      }).catch(() => { });

      // Navigate to the timeline tracker to view the newly created tracker
      navigate('/legal-timeline-tracker');

    } catch (err) {
      console.error("Failed to create timeline case: ", err);
      alert('Failed to save Timeline Case. Ensure you are logged in.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmergencyAlertBanner />
      <CaseStatusIndicator />
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
                  <div id="action-plan-content" className="bg-card rounded-xl border border-border shadow-elevation-2 p-6 lg:p-8">
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
                        data-html2canvas-ignore="true"
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

                  <DisclaimerSection data-html2canvas-ignore="true" />
                </>
              )}
            </div>

            <div className="lg:col-span-1" data-html2canvas-ignore="true">
              {generatedSteps && !isGenerating && (
                <TimelineOverview
                  totalSteps={generatedSteps?.totalSteps}
                  estimatedDuration={generatedSteps?.estimatedDuration}
                  complexity={generatedSteps?.complexity}
                  consultationPoints={generatedSteps?.consultationPoints}
                  onExportPDF={handleExportPDF}
                  onCreateCase={handleCreateCase}
                  isExporting={isExporting}
                  isCreating={isCreating}
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