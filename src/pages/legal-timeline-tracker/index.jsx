import React, { useState, useEffect, useCallback } from 'react';
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
import {
  getCases, createCase, updateCase, deleteCase,
  toggleMilestone, addMilestoneToCaseApi, addNoteToCase,
  logActivity
} from '../../utils/api';

const LegalTimelineTracker = () => {
  const navigate = useNavigate();

  // ── Core state ──────────────────────────────────────────────────────────────
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── UI state ────────────────────────────────────────────────────────────────
  const [expandedCaseId, setExpandedCaseId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
  const [milestoneCaseId, setMilestoneCaseId] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [caseToShare, setCaseToShare] = useState(null);
  const [caseToEdit, setCaseToEdit] = useState(null);
  const [isReminderSettingsOpen, setIsReminderSettingsOpen] = useState(false);
  const [deletingCaseId, setDeletingCaseId] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    sort: 'recent'
  });

  // ── Fetch cases from MongoDB ─────────────────────────────────────────────────
  const fetchCases = useCallback(async () => {
    try {
      setError(null);
      const data = await getCases();
      setCases(data || []);
    } catch (err) {
      setError('Could not load cases. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
    // Track page visit
    logActivity({
      type: 'case',
      title: 'My Cases Viewed',
      description: 'Visited Legal Timeline Tracker',
      link: '/legal-timeline-tracker',
      icon: 'FolderOpen',
      iconColor: 'var(--color-primary)'
    }).catch(() => { });
  }, [fetchCases]);

  // ── Helpers ──────────────────────────────────────────────────────────────────
  // Format a date (ISO or Date) to "DD Mon YYYY"
  const fmtDate = (d) => {
    if (!d) return 'TBD';
    try {
      return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return 'TBD'; }
  };

  // Convert a raw MongoDB case doc to the shape the components expect
  const normaliseCase = (c) => ({
    ...c,
    id: c._id,
    status: c.status
      ? c.status.charAt(0).toUpperCase() + c.status.slice(1).replace('-', ' ')
      : 'Active',
    startDate: fmtDate(c.startDate),
    nextActionDate: c.nextActionDate ? fmtDate(c.nextActionDate) : 'TBD',
    deadlineDate: c.deadlineDate ? fmtDate(c.deadlineDate) : null,
    milestones: (c.milestones || []).map(m => ({
      ...m,
      id: m._id || m.id,
      dueDate: fmtDate(m.dueDate)
    })),
    notes: (c.notes || []).map(n => ({
      ...n,
      id: n._id || n.id,
      date: fmtDate(n.createdAt || n.date)
    })),
    completionPercentage: c.completionPercentage ?? 0
  });

  const normalisedCases = cases.map(normaliseCase);

  // ── Derived deadline list (from all cases' incomplete milestones) ─────────────
  const deadlines = normalisedCases.flatMap(c =>
    (c.milestones || [])
      .filter(m => !m.completed && m.dueDate && m.dueDate !== 'TBD')
      .map(m => ({
        id: `${c.id}-${m.id}`,
        caseId: c.id,
        caseTitle: c.title,
        title: m.title,
        category: c.category,
        dueDate: m.dueDate
      }))
  );

  // ── Stats ───────────────────────────────────────────────────────────────────
  const activeCasesCount = normalisedCases.filter(c =>
    ['Active', 'Pending'].includes(c.status)).length;

  // Count CASES that have at least one urgent upcoming milestone (≤7 days)
  const urgentDeadlinesCount = new Set(
    deadlines
      .filter(d => {
        const diff = Math.ceil((new Date(d.dueDate) - new Date()) / 86400000);
        return diff <= 7 && diff >= 0;
      })
      .map(d => d.caseId)
  ).size;

  // ── CRUD Handlers ────────────────────────────────────────────────────────────
  const handleCreateCase = async (formData) => {
    try {
      const created = await createCase({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: 'active',
        startDate: formData.startDate,
        isManualProgress: formData.isManualProgress,
        completionPercentage: formData.isManualProgress ? formData.completionPercentage : 0
      });
      setCases(prev => [created, ...prev]);
    } catch (err) {
      console.error('Failed to create case:', err);
    }
  };

  const handleUpdateCase = async (updatedData) => {
    try {
      const updated = await updateCase(updatedData._id || updatedData.id, {
        title: updatedData.title,
        description: updatedData.description,
        category: updatedData.category,
        priority: updatedData.priority,
        status: (updatedData.status || '').toLowerCase().replace(' ', '-'),
        startDate: updatedData.startDate,
        isManualProgress: updatedData.isManualProgress,
        completionPercentage: updatedData.completionPercentage
      });
      setCases(prev => prev.map(c => (c._id === updated._id ? updated : c)));
      setCaseToEdit(null);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to update case:', err);
    }
  };

  const handleDeleteCase = async (caseId) => {
    setDeletingCaseId(caseId);
    try {
      await deleteCase(caseId);
      setCases(prev => prev.filter(c => c._id !== caseId));
    } catch (err) {
      console.error('Failed to delete case:', err);
    } finally {
      setDeletingCaseId(null);
    }
  };

  const handleEditCase = (caseId) => {
    const c = cases.find(x => x._id === caseId);
    if (c) { setCaseToEdit(c); setIsCreateModalOpen(true); }
  };

  // ── Milestone Handlers ───────────────────────────────────────────────────────
  const handleUpdateMilestone = async (caseId, milestoneId, completed) => {
    // Optimistic UI update
    setCases(prev => prev.map(c => {
      if (c._id !== caseId) return c;
      const updatedMilestones = c.milestones.map(m =>
        (m._id === milestoneId || m.id === milestoneId)
          ? { ...m, completed, status: completed ? 'completed' : 'upcoming' }
          : m
      );
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const completionPercentage = c.isManualProgress
        ? c.completionPercentage
        : Math.round((completedCount / updatedMilestones.length) * 100);
      return { ...c, milestones: updatedMilestones, completionPercentage };
    }));

    // Persist to DB
    try {
      const updated = await toggleMilestone(caseId, milestoneId, completed);
      setCases(prev => prev.map(c => (c._id === updated._id ? updated : c)));
    } catch (err) {
      console.error('Failed to toggle milestone:', err);
      fetchCases(); // roll back on failure
    }
  };

  const handleAddMilestone = async (milestoneData) => {
    if (!milestoneCaseId) return;
    try {
      const updated = await addMilestoneToCaseApi(milestoneCaseId, milestoneData);
      setCases(prev => prev.map(c => (c._id === updated._id ? updated : c)));
    } catch (err) {
      console.error('Failed to add milestone:', err);
    } finally {
      setIsAddMilestoneModalOpen(false);
      setMilestoneCaseId(null);
    }
  };

  // ── Note Handler ──────────────────────────────────────────────────────────────
  const handleAddNote = async (caseId, noteText) => {
    // Optimistic UI
    const tempNote = { id: `tmp-${Date.now()}`, text: noteText, date: fmtDate(new Date()) };
    setCases(prev => prev.map(c =>
      c._id === caseId ? { ...c, notes: [tempNote, ...(c.notes || [])] } : c
    ));
    try {
      const updated = await addNoteToCase(caseId, noteText);
      setCases(prev => prev.map(c => (c._id === updated._id ? updated : c)));
    } catch (err) {
      console.error('Failed to add note:', err);
      fetchCases();
    }
  };

  // ── Filter & Sort ─────────────────────────────────────────────────────────────
  const handleFilterChange = (field, value) => setFilters(prev => ({ ...prev, [field]: value }));
  const handleSearch = (searchTerm) => setFilters(prev => ({ ...prev, search: searchTerm }));

  const filteredCases = normalisedCases.filter(c => {
    const q = filters.search.toLowerCase();
    const matchesSearch = !q ||
      c.title?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q);
    const matchesStatus = filters.status === 'all' ||
      c.status?.toLowerCase() === filters.status.toLowerCase();
    const matchesCategory = filters.category === 'all' ||
      c.category === filters.category;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedCases = [...filteredCases].sort((a, b) => {
    switch (filters.sort) {
      case 'oldest': return new Date(a.startDate) - new Date(b.startDate);
      case 'deadline': return new Date(a.nextActionDate) - new Date(b.nextActionDate);
      case 'progress': return b.completionPercentage - a.completionPercentage;
      default: return new Date(b.startDate) - new Date(a.startDate);
    }
  });

  // ── Share / Remind / Deadline navigation ────────────────────────────────────
  const handleShare = (caseId) => {
    const c = normalisedCases.find(x => x.id === caseId);
    if (c) { setCaseToShare(c); setIsShareModalOpen(true); }
  };

  const handleRemind = () => setIsReminderSettingsOpen(true);

  const handleViewCase = (caseId) => {
    setExpandedCaseId(caseId);
    const el = document.getElementById(`case-${caseId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <EmergencyAlertBanner />
        <main className="pt-32 lg:pt-36 pb-12">
          <div className="mx-4 lg:mx-6">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-muted rounded w-64 mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded-xl" />)}
              </div>
              <div className="h-14 bg-muted rounded-xl" />
              {[1, 2].map(i => <div key={i} className="h-48 bg-muted rounded-xl" />)}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <EmergencyAlertBanner />
      <CaseStatusIndicator />
      <OfflineStatusIndicator />

      <main className="pt-32 lg:pt-36 pb-12">
        <div className="mx-4 lg:mx-6">

          {/* Error banner */}
          {error && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-xl flex items-center gap-3">
              <Icon name="AlertCircle" size={20} color="var(--color-accent)" />
              <p className="flex-1 text-sm text-foreground">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchCases}>Retry</Button>
            </div>
          )}

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
                  onClick={() => { setCaseToEdit(null); setIsCreateModalOpen(true); }}
                >
                  New Case
                </Button>
              </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
              {[
                { label: 'Total Cases', value: normalisedCases.length, icon: 'FolderOpen', color: 'var(--color-primary)' },
                { label: 'Active', value: activeCasesCount, icon: 'Activity', color: 'var(--color-success)' },
                { label: 'Urgent (≤7 days)', value: urgentDeadlinesCount, icon: 'AlertTriangle', color: 'var(--color-warning)' },
                {
                  label: 'Completed',
                  value: normalisedCases.filter(c => c.status === 'Completed' || c.status === 'Resolved').length,
                  icon: 'CheckCircle', color: 'var(--color-success)'
                }
              ].map(stat => (
                <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={stat.icon} size={20} color={stat.color} />
                    <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <p className="text-2xl md:text-3xl font-semibold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cases list */}
            <div className="lg:col-span-2 space-y-4">
              {sortedCases.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <Icon name="FolderOpen" size={64} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">No Cases Found</h3>
                  <p className="text-muted-foreground mb-6 max-measure mx-auto">
                    {filters.search || filters.status !== 'all' || filters.category !== 'all'
                      ? 'Try adjusting your filters to see more results'
                      : 'Start tracking your legal cases by creating your first case'}
                  </p>
                  <Button
                    variant="default"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => { setCaseToEdit(null); setIsCreateModalOpen(true); }}
                  >
                    Create First Case
                  </Button>
                </div>
              ) : (
                sortedCases.map(caseItem => (
                  <div key={caseItem.id} id={`case-${caseItem.id}`}>
                    <CaseCard
                      caseData={caseItem}
                      onExpand={(id) => setExpandedCaseId(expandedCaseId === id ? null : id)}
                      isExpanded={expandedCaseId === caseItem.id}
                      onUpdateMilestone={handleUpdateMilestone}
                      onAddNote={handleAddNote}
                      onShare={handleShare}
                      onEdit={handleEditCase}
                      onDelete={handleDeleteCase}
                      onAddMilestone={(id) => { setMilestoneCaseId(id); setIsAddMilestoneModalOpen(true); }}
                      isDeleting={deletingCaseId === caseItem.id}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Deadline panel */}
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

      {/* Modals */}
      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => { setIsCreateModalOpen(false); setCaseToEdit(null); }}
        onCreateCase={handleCreateCase}
        caseToEdit={caseToEdit}
        onUpdateCase={handleUpdateCase}
      />
      <AddMilestoneModal
        isOpen={isAddMilestoneModalOpen}
        onClose={() => { setIsAddMilestoneModalOpen(false); setMilestoneCaseId(null); }}
        onAddMilestone={handleAddMilestone}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => { setIsShareModalOpen(false); setCaseToShare(null); }}
        caseData={caseToShare}
      />
      <ReminderSettings
        isOpen={isReminderSettingsOpen}
        onClose={() => setIsReminderSettingsOpen(false)}
        onSave={(s) => console.log('Reminder settings:', s)}
      />
    </div>
  );
};

export default LegalTimelineTracker;