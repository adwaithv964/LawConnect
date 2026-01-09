import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import CaseStatusIndicator from '../../components/ui/CaseStatusIndicator';
import OfflineStatusIndicator from '../../components/ui/OfflineStatusIndicator';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CaseCard from './components/CaseCard';
import DeadlinePanel from './components/DeadlinePanel';
import CreateCaseModal from './components/CreateCaseModal';
import AddMilestoneModal from './components/AddMilestoneModal';
import ShareModal from './components/ShareModal';
import FilterBar from './components/FilterBar';
import ReminderSettings from './components/ReminderSettings';

const LegalTimelineTracker = () => {
  const navigate = useNavigate();
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
  const [milestoneCaseId, setMilestoneCaseId] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [caseToShare, setCaseToShare] = useState(null);
  const [caseToEdit, setCaseToEdit] = useState(null);
  const [isReminderSettingsOpen, setIsReminderSettingsOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
    sort: "recent"
  });

  const [cases, setCases] = useState([
    {
      id: 1,
      title: "Property Dispute - Boundary Encroachment",
      category: "Property Dispute",
      status: "Active",
      priority: "High",
      startDate: "15 Nov 2025",
      nextActionDate: "28 Dec 2025",
      completionPercentage: 45,
      milestones: [
        {
          id: 1,
          title: "Initial Consultation",
          description: "Met with legal advisor to discuss case details and gather preliminary documents",
          dueDate: "15 Nov 2025",
          completed: true,
          status: "completed",
          documents: ["Property_Deed.pdf", "Survey_Report.pdf"]
        },
        {
          id: 2,
          title: "Legal Notice Sent",
          description: "Formal legal notice sent to the encroaching party under Section 80 CPC",
          dueDate: "25 Nov 2025",
          completed: true,
          status: "completed",
          documents: ["Legal_Notice.pdf"]
        },
        {
          id: 3,
          title: "Response Period",
          description: "Waiting for response from the other party (30 days from notice date)",
          dueDate: "28 Dec 2025",
          completed: false,
          status: "current",
          documents: []
        },
        {
          id: 4,
          title: "File Civil Suit",
          description: "If no satisfactory response, file civil suit for permanent injunction",
          dueDate: "10 Jan 2026",
          completed: false,
          status: "upcoming",
          documents: []
        }
      ],
      notes: []
    },
    {
      id: 2,
      title: "Consumer Rights Claim - Defective Product",
      category: "Consumer Rights",
      status: "Active",
      priority: "Medium",
      startDate: "01 Dec 2025",
      nextActionDate: "02 Jan 2026",
      completionPercentage: 30,
      milestones: [
        {
          id: 1,
          title: "Complaint Filed",
          description: "Filed complaint with District Consumer Forum under Consumer Protection Act 2019",
          dueDate: "01 Dec 2025",
          completed: true,
          status: "completed",
          documents: ["Purchase_Invoice.pdf", "Product_Photos.pdf"]
        },
        {
          id: 2,
          title: "Evidence Submission",
          description: "Submit all supporting documents including warranty card and communication records",
          dueDate: "20 Dec 2025",
          completed: true,
          status: "completed",
          documents: ["Warranty_Card.pdf", "Email_Records.pdf"]
        },
        {
          id: 3,
          title: "First Hearing",
          description: "Attend first hearing at Consumer Forum with all documents",
          dueDate: "02 Jan 2026",
          completed: false,
          status: "current",
          documents: []
        },
        {
          id: 4,
          title: "Mediation Session",
          description: "Participate in court-ordered mediation with manufacturer representative",
          dueDate: "15 Jan 2026",
          completed: false,
          status: "upcoming",
          documents: []
        }
      ]
    },
    {
      id: 3,
      title: "Employment Dispute - Wrongful Termination",
      category: "Employment",
      status: "Pending",
      priority: "High",
      startDate: "10 Dec 2025",
      nextActionDate: "05 Jan 2026",
      completionPercentage: 20,
      milestones: [
        {
          id: 1,
          title: "Document Collection",
          description: "Gather employment contract, termination letter, and salary records",
          dueDate: "10 Dec 2025",
          completed: true,
          status: "completed",
          documents: ["Employment_Contract.pdf", "Termination_Letter.pdf"]
        },
        {
          id: 2,
          title: "Legal Consultation",
          description: "Consult with labor law specialist to assess case strength",
          dueDate: "18 Dec 2025",
          completed: false,
          status: "current",
          documents: []
        },
        {
          id: 3,
          title: "Conciliation Notice",
          description: "Send conciliation notice to employer as per Industrial Disputes Act",
          dueDate: "05 Jan 2026",
          completed: false,
          status: "upcoming",
          documents: []
        }
      ]
    }
  ]);

  const [deadlines, setDeadlines] = useState([
    {
      id: 1,
      caseId: 1,
      caseTitle: "Property Dispute - Boundary Encroachment",
      title: "Response Period Ends",
      category: "Property Dispute",
      dueDate: "28 Dec 2025"
    },
    {
      id: 2,
      caseId: 2,
      caseTitle: "Consumer Rights Claim - Defective Product",
      title: "First Hearing",
      category: "Consumer Rights",
      dueDate: "02 Jan 2026"
    },
    {
      id: 3,
      caseId: 3,
      caseTitle: "Employment Dispute - Wrongful Termination",
      title: "Send Conciliation Notice",
      category: "Employment",
      dueDate: "05 Jan 2026"
    },
    {
      id: 4,
      caseId: 2,
      caseTitle: "Consumer Rights Claim - Defective Product",
      title: "Mediation Session",
      category: "Consumer Rights",
      dueDate: "15 Jan 2026"
    }
  ]);

  const handleExpandCase = (caseId) => {
    setExpandedCaseId(expandedCaseId === caseId ? null : caseId);
  };

  const handleUpdateMilestone = (caseId, milestoneId, completed) => {
    setCases(prevCases =>
      prevCases?.map(caseItem => {
        if (caseItem?.id === caseId) {
          const updatedMilestones = caseItem?.milestones?.map(milestone =>
            milestone?.id === milestoneId ? { ...milestone, completed } : milestone
          );
          const completedCount = updatedMilestones?.filter(m => m?.completed)?.length;
          const completionPercentage = caseItem.isManualProgress
            ? caseItem.completionPercentage
            : Math.round((completedCount / updatedMilestones?.length) * 100);

          return {
            ...caseItem,
            milestones: updatedMilestones,
            completionPercentage
          };
        }
        return caseItem;
      })
    );
  };

  const handleAddNote = (caseId, noteText) => {
    setCases(prevCases =>
      prevCases.map(caseItem => {
        if (caseItem.id === caseId) {
          const newNote = {
            id: Date.now(),
            text: noteText,
            date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
          };
          return {
            ...caseItem,
            notes: [newNote, ...(caseItem.notes || [])]
          };
        }
        return caseItem;
      })
    );
  };

  const handleShare = (caseId) => {
    const caseItem = cases.find(c => c.id === caseId);
    if (caseItem) {
      setCaseToShare(caseItem);
      setIsShareModalOpen(true);
    }
  };

  const handleRemind = (caseId) => {
    // Open reminder settings or show specific reminder modal
    // For now, let's open the general reminder settings
    setIsReminderSettingsOpen(true);
  };

  const generateDefaultMilestones = (category, startDate) => {
    const start = new Date(startDate);
    const addDays = (date, days) => {
      const result = new Date(date);
      result.setDate(result.getDate() + days);
      return result.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const templates = {
      'Property Dispute': [
        { title: 'Initial Consultation', description: 'Meeting with legal counsel to assess property documents', daysOffset: 0 },
        { title: 'Legal Notice Sent', description: 'Formal notice sent to opposing party', daysOffset: 7 },
        { title: 'Response Period', description: 'Waiting period for counter-party response', daysOffset: 37 },
        { title: 'File Civil Suit', description: 'Filing of suit if no favorable response received', daysOffset: 50 },
      ],
      'Consumer Rights': [
        { title: 'Complaint Filed', description: 'Filing complaint with Consumer Forum', daysOffset: 0 },
        { title: 'Evidence Submission', description: 'Submission of invoices and correspondence', daysOffset: 14 },
        { title: 'First Hearing', description: 'Initial hearing and admission of case', daysOffset: 30 },
        { title: 'Mediation Session', description: 'Court-mandated mediation attempt', daysOffset: 45 },
      ],
      'Employment': [
        { title: 'Document Collection', description: 'Gathering employment contracts and termination letters', daysOffset: 0 },
        { title: 'Legal Consultation', description: 'Review of case merits with labor lawyer', daysOffset: 5 },
        { title: 'Conciliation Notice', description: 'Notice for conciliation proceedings', daysOffset: 14 },
        { title: 'Labor Court Filing', description: 'Filing dispute with Labor Commissioner', daysOffset: 30 },
      ],
      'Family Law': [
        { title: 'Counseling Session', description: 'Mandatory pre-litigation counseling', daysOffset: 0 },
        { title: 'Petition Filing', description: 'Filing of petition in Family Court', daysOffset: 10 },
        { title: 'Appearance of Party', description: 'First appearance of respondent', daysOffset: 30 },
        { title: 'Interim Relief', description: 'Hearing for interim maintenance/custody', daysOffset: 45 },
      ],
      'default': [
        { title: 'Case Review', description: 'Initial review of facts and evidence', daysOffset: 0 },
        { title: 'Strategy Planning', description: 'Formulating legal strategy', daysOffset: 7 },
        { title: 'First Action', description: 'Initiating formal legal action', daysOffset: 14 },
        { title: 'Checkpoint', description: 'Review of progress and next steps', daysOffset: 30 },
      ]
    };

    const template = templates[category] || templates['default'];

    return template.map((item, index) => ({
      id: index + 1,
      title: item.title,
      description: item.description,
      dueDate: addDays(start, item.daysOffset),
      completed: false,
      status: index === 0 ? 'current' : 'upcoming',
      documents: []
    }));
  };

  const handleCreateCase = (formData) => {
    const newCase = {
      id: cases.length + 1,
      title: formData.title,
      category: formData.category,
      status: "Active",
      priority: formData.priority,
      startDate: new Date(formData.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      nextActionDate: "TBD",
      completionPercentage: 0,
      milestones: generateDefaultMilestones(formData.category, formData.startDate),
      notes: []
    };
    setCases(prev => [newCase, ...prev]);
  };

  const handleUpdateCase = (updatedData) => {
    setCases(prevCases => prevCases.map(c => c.id === updatedData.id ? { ...c, ...updatedData } : c));
    setCaseToEdit(null);
    setIsCreateModalOpen(false);
  };

  const handleEditCase = (caseId) => {
    const caseItem = cases.find(c => c.id === caseId);
    if (caseItem) {
      setCaseToEdit(caseItem);
      setIsCreateModalOpen(true);
    }
  };

  const openAddMilestoneModal = (caseId) => {
    setMilestoneCaseId(caseId);
    setIsAddMilestoneModalOpen(true);
  };

  const handleAddMilestone = (milestoneData) => {
    setCases(prevCases => prevCases.map(caseItem => {
      if (caseItem.id === milestoneCaseId) {
        const newMilestone = {
          id: Date.now(),
          title: milestoneData.title,
          description: milestoneData.description,
          dueDate: milestoneData.dueDate,
          completed: false,
          status: 'upcoming',
          documents: []
        };

        // Recalculate progress
        const updatedMilestones = [...(caseItem.milestones || []), newMilestone];
        // Sort by due date optionally? For now just append. 
        // Let's sort simply by date if possible, but string dates are tricky without parsing.
        // Appending is safer for now to avoid order jumping.

        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const completionPercentage = caseItem.isManualProgress
          ? caseItem.completionPercentage
          : Math.round((completedCount / updatedMilestones.length) * 100);

        return {
          ...caseItem,
          milestones: updatedMilestones,
          completionPercentage
        };
      }
      return caseItem;
    }));
    setIsAddMilestoneModalOpen(false);
    setMilestoneCaseId(null);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleViewCase = (caseId) => {
    setExpandedCaseId(caseId);
    const element = document.getElementById(`case-${caseId}`);
    if (element) {
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSaveReminderSettings = (settings) => {
    console.log('Reminder settings saved:', settings);
  };

  const filteredCases = cases?.filter(caseItem => {
    const matchesSearch = caseItem?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      caseItem?.category?.toLowerCase()?.includes(filters?.search?.toLowerCase());
    const matchesStatus = filters?.status === "all" || caseItem?.status === filters?.status;
    const matchesCategory = filters?.category === "all" || caseItem?.category === filters?.category;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedCases = [...filteredCases]?.sort((a, b) => {
    switch (filters?.sort) {
      case 'oldest':
        return new Date(a.startDate) - new Date(b.startDate);
      case 'deadline':
        return new Date(a.nextActionDate) - new Date(b.nextActionDate);
      case 'progress':
        return b?.completionPercentage - a?.completionPercentage;
      default:
        return new Date(b.startDate) - new Date(a.startDate);
    }
  });

  const activeCasesCount = cases?.filter(c => c?.status === 'Active')?.length;
  const urgentDeadlinesCount = deadlines?.filter(d => {
    const today = new Date();
    const deadline = new Date(d.dueDate);
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  })?.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmergencyAlertBanner />
      <CaseStatusIndicator activeCases={activeCasesCount} urgentDeadlines={urgentDeadlinesCount} />
      <OfflineStatusIndicator />
      <main className="pt-32 lg:pt-36 pb-12">
        <div className="mx-4 lg:mx-6">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground mb-2">
                  Legal Timeline Tracker
                </h1>
                <p className="text-sm md:text-base text-muted-foreground max-measure">
                  Manage your legal cases with visual milestone tracking and automated reminders
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  iconName="Settings"
                  iconPosition="left"
                  onClick={() => setIsReminderSettingsOpen(true)}
                >
                  Reminders
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  New Case
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="FolderOpen" size={20} color="var(--color-primary)" />
                  <p className="text-xs md:text-sm text-muted-foreground">Total Cases</p>
                </div>
                <p className="text-2xl md:text-3xl font-semibold text-foreground">{cases?.length}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Activity" size={20} color="var(--color-success)" />
                  <p className="text-xs md:text-sm text-muted-foreground">Active</p>
                </div>
                <p className="text-2xl md:text-3xl font-semibold text-foreground">{activeCasesCount}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
                  <p className="text-xs md:text-sm text-muted-foreground">Urgent</p>
                </div>
                <p className="text-2xl md:text-3xl font-semibold text-foreground">{urgentDeadlinesCount}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                  <p className="text-xs md:text-sm text-muted-foreground">Completed</p>
                </div>
                <p className="text-2xl md:text-3xl font-semibold text-foreground">
                  {cases?.filter(c => c?.status === 'Completed')?.length}
                </p>
              </div>
            </div>

            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {sortedCases?.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <Icon name="FolderOpen" size={64} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                    No Cases Found
                  </h3>
                  <p className="text-muted-foreground mb-6 max-measure mx-auto">
                    {filters?.search || filters?.status !== "all" || filters?.category !== "all" ? "Try adjusting your filters to see more results" : "Start tracking your legal cases by creating your first case"}
                  </p>
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Create First Case
                  </Button>
                </div>
              ) : (
                sortedCases?.map(caseItem => (
                  <div key={caseItem?.id} id={`case-${caseItem?.id}`}>
                    <CaseCard
                      caseData={caseItem}
                      onExpand={handleExpandCase}
                      isExpanded={expandedCaseId === caseItem?.id}
                      onUpdateMilestone={handleUpdateMilestone}
                      onAddNote={handleAddNote}
                      onShare={handleShare}
                      onEdit={handleEditCase}
                      onAddMilestone={openAddMilestoneModal}
                    />
                  </div>
                ))
              )}
            </div>

            <div className="lg:col-span-1">
              <DeadlinePanel
                deadlines={deadlines}
                onViewCase={handleViewCase}
                onRemind={handleRemind}
              />
            </div>
          </div>
        </div>
      </main>
      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setCaseToEdit(null);
        }}
        onCreateCase={handleCreateCase}
        caseToEdit={caseToEdit}
        onUpdateCase={handleUpdateCase}
      />
      <AddMilestoneModal
        isOpen={isAddMilestoneModalOpen}
        onClose={() => {
          setIsAddMilestoneModalOpen(false);
          setMilestoneCaseId(null);
        }}
        onAddMilestone={handleAddMilestone}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setCaseToShare(null);
        }}
        caseData={caseToShare}
      />
      <ReminderSettings
        isOpen={isReminderSettingsOpen}
        onClose={() => setIsReminderSettingsOpen(false)}
        onSave={handleSaveReminderSettings}
      />
    </div>
  );
};

export default LegalTimelineTracker;