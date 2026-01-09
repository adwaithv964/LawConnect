import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const CaseStatusIndicator = ({ activeCases = 0, urgentDeadlines = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const mockCases = [
    {
      id: 1,
      title: 'Property Dispute Case',
      status: 'In Progress',
      nextDeadline: 'Jan 15, 2026',
      urgent: true
    },
    {
      id: 2,
      title: 'Consumer Rights Claim',
      status: 'Document Review',
      nextDeadline: 'Feb 02, 2026',
      urgent: false
    }
  ];

  if (activeCases === 0) {
    return null;
  }

  return (
    <div className="fixed top-32 lg:top-36 right-4 lg:right-6 z-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg shadow-elevation-2 hover:shadow-elevation-3 transition-smooth"
        aria-label="View active cases"
      >
        <Icon name="FolderOpen" size={18} color="var(--color-primary)" />
        <span className="text-sm font-medium text-foreground">
          {activeCases} Active {activeCases === 1 ? 'Case' : 'Cases'}
        </span>
        {urgentDeadlines > 0 && (
          <span className="flex items-center justify-center w-5 h-5 bg-warning text-warning-foreground rounded-full text-xs font-semibold">
            {urgentDeadlines}
          </span>
        )}
        <Icon
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          size={16}
          color="var(--color-muted-foreground)"
        />
      </button>
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-elevation-4 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Active Cases
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {mockCases?.map((caseItem) => (
              <Link
                key={caseItem?.id}
                to="/legal-timeline-tracker"
                className="block p-4 border-b border-border hover:bg-muted transition-smooth"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-medium text-foreground flex-1">
                    {caseItem?.title}
                  </h4>
                  {caseItem?.urgent && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning rounded text-xs font-medium">
                      <Icon name="AlertTriangle" size={12} color="currentColor" />
                      Urgent
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="FileText" size={14} color="currentColor" />
                    {caseItem?.status}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={14} color="currentColor" />
                    {caseItem?.nextDeadline}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Link
            to="/legal-timeline-tracker"
            className="block p-4 text-center text-sm font-medium text-primary hover:bg-muted transition-smooth"
          >
            View All Cases
          </Link>
        </div>
      )}
    </div>
  );
};

export default CaseStatusIndicator;