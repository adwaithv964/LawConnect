import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CaseCard = ({ caseData, onExpand, isExpanded, onUpdateMilestone, onAddNote, onShare, onEdit, onAddMilestone }) => {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState("");

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-primary/10 text-primary border-primary/20',
      'Pending': 'bg-warning/10 text-warning border-warning/20',
      'Completed': 'bg-success/10 text-success border-success/20',
      'On Hold': 'bg-muted text-muted-foreground border-border'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground border-border';
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'High') return { name: 'AlertCircle', color: 'var(--color-accent)' };
    if (priority === 'Medium') return { name: 'AlertTriangle', color: 'var(--color-warning)' };
    return { name: 'Info', color: 'var(--color-muted-foreground)' };
  };

  const handleAddNote = () => {
    if (noteText?.trim()) {
      onAddNote(caseData?.id, noteText);
      setNoteText("");
      setShowNoteForm(false);
    }
  };

  const priorityIcon = getPriorityIcon(caseData?.priority);

  return (
    <div className="bg-card border border-border rounded-xl shadow-elevation-2 overflow-hidden transition-smooth hover:shadow-elevation-3">
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                {caseData?.title}
              </h3>
              <Icon name={priorityIcon?.name} size={18} color={priorityIcon?.color} />
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Icon name="Tag" size={14} color="currentColor" />
                {caseData?.category}
              </span>
              <span className="flex items-center gap-1">
                <Icon name="Calendar" size={14} color="currentColor" />
                {caseData?.startDate && `Started: ${caseData.startDate}`}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Edit"
              onClick={() => onEdit && onEdit(caseData.id)}
              className="h-8 w-8 p-0"
            />
            <span className={`px-3 py-1 rounded-lg text-xs md:text-sm font-medium border ${getStatusColor(caseData?.status)}`}>
              {caseData?.status}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 md:p-4 bg-muted/50 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <Icon name="Clock" size={18} color="var(--color-primary)" />
            <div>
              <p className="text-xs text-muted-foreground">Next Action Due</p>
              <p className="text-sm md:text-base font-medium text-foreground">{caseData?.nextActionDate}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Progress</p>
            <p className="text-lg md:text-xl font-semibold text-primary">{caseData?.completionPercentage}%</p>
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <div
            className="bg-primary h-2 rounded-full transition-smooth"
            style={{ width: `${caseData?.completionPercentage}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            onClick={() => onExpand(caseData?.id)}
          >
            {isExpanded ? 'Hide Timeline' : 'View Timeline'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="FileText"
            iconPosition="left"
            onClick={() => setShowNoteForm(!showNoteForm)}
          >
            Add Note
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Share2"
            iconPosition="left"
            onClick={() => onShare && onShare(caseData?.id)}
          >
            Share
          </Button>
        </div>

        {showNoteForm && (
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e?.target?.value)}
              placeholder="Add a note about this case..."
              className="w-full min-h-[100px] p-3 bg-background border border-border rounded-lg text-sm text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2 mt-3">
              <Button
                variant="default"
                size="sm"
                onClick={handleAddNote}
              >
                Save Note
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowNoteForm(false);
                  setNoteText("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
      {isExpanded && (
        <div className="border-t border-border p-4 md:p-6 bg-muted/20">
          <h4 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4">
            Case Timeline
          </h4>
          <div className="space-y-4">
            {caseData?.milestones?.map((milestone, index) => (
              <div key={milestone?.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => onUpdateMilestone(caseData?.id, milestone?.id, !milestone?.completed)}
                    className={`
                      flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-smooth
                      ${milestone?.completed
                        ? 'bg-success border-success'
                        : milestone?.status === 'current' ? 'bg-primary border-primary' : 'bg-background border-border'
                      }
                    `}
                  >
                    {milestone?.completed && (
                      <Icon name="Check" size={18} color="var(--color-success-foreground)" />
                    )}
                  </button>
                  {index < caseData?.milestones?.length - 1 && (
                    <div className={`w-0.5 h-16 ${milestone?.completed ? 'bg-success' : 'bg-border'}`} />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h5 className="text-sm md:text-base font-medium text-foreground">
                      {milestone?.title}
                    </h5>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {milestone?.dueDate}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {milestone?.description}
                  </p>
                  {milestone?.documents && milestone?.documents?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {milestone?.documents?.map((doc, idx) => (
                        <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-background border border-border rounded text-xs text-foreground">
                          <Icon name="Paperclip" size={12} color="currentColor" />
                          {doc}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Notes Section */}
          {caseData?.notes && caseData.notes.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border/50">
              <h4 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4">
                Case Notes
              </h4>
              <div className="space-y-3">
                {caseData.notes.map((note) => (
                  <div key={note.id} className="p-3 bg-background border border-border rounded-lg">
                    <p className="text-sm text-foreground mb-1">{note.text}</p>
                    <p className="text-xs text-muted-foreground">{note.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-border/50 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              iconName="PlusCircle"
              iconPosition="left"
              onClick={() => onAddMilestone && onAddMilestone(caseData.id)}
              className="w-full md:w-auto dashed border-dashed border-2"
            >
              Add Custom Milestone
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseCard;