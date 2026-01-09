import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeadlinePanel = ({ deadlines, onViewCase, onRemind }) => {
  const getDeadlineStatus = (dueDate) => {
    const today = new Date();
    const deadline = new Date(dueDate);
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'overdue', color: 'text-accent', bgColor: 'bg-accent/10', label: 'Overdue' };
    if (diffDays <= 3) return { status: 'urgent', color: 'text-warning', bgColor: 'bg-warning/10', label: 'Urgent' };
    if (diffDays <= 7) return { status: 'upcoming', color: 'text-primary', bgColor: 'bg-primary/10', label: 'Upcoming' };
    return { status: 'normal', color: 'text-muted-foreground', bgColor: 'bg-muted', label: 'Scheduled' };
  };

  const sortedDeadlines = [...deadlines]?.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return dateA - dateB;
  });

  const overdueCount = sortedDeadlines?.filter(d => getDeadlineStatus(d?.dueDate)?.status === 'overdue')?.length;
  const urgentCount = sortedDeadlines?.filter(d => getDeadlineStatus(d?.dueDate)?.status === 'urgent')?.length;

  return (
    <div className="bg-card border border-border rounded-xl shadow-elevation-2 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
            Upcoming Deadlines
          </h3>
          <div className="flex items-center gap-2">
            {overdueCount > 0 && (
              <span className="flex items-center justify-center w-6 h-6 bg-accent text-accent-foreground rounded-full text-xs font-semibold">
                {overdueCount}
              </span>
            )}
            {urgentCount > 0 && (
              <span className="flex items-center justify-center w-6 h-6 bg-warning text-warning-foreground rounded-full text-xs font-semibold">
                {urgentCount}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Track all your case deadlines in one place
        </p>
      </div>
      <div className="max-h-[600px] overflow-y-auto">
        {sortedDeadlines?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Calendar" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming deadlines</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedDeadlines?.map((deadline) => {
              const statusInfo = getDeadlineStatus(deadline?.dueDate);
              return (
                <div key={deadline?.id} className="p-4 hover:bg-muted/30 transition-smooth">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <h4 className="text-sm md:text-base font-medium text-foreground mb-1">
                        {deadline?.title}
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground mb-2">
                        {deadline?.caseTitle}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo?.bgColor} ${statusInfo?.color}`}>
                      {statusInfo?.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} color="currentColor" />
                      {deadline?.dueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Tag" size={14} color="currentColor" />
                      {deadline?.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Eye"
                      iconPosition="left"
                      onClick={() => onViewCase(deadline?.caseId)}
                    >
                      View Case
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Bell"
                      iconPosition="left"
                      onClick={() => onRemind && onRemind(deadline?.caseId)}
                    >
                      Remind
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeadlinePanel;