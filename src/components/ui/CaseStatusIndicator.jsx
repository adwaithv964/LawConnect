import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';
import { getCases } from '../../utils/api';

const CaseStatusIndicator = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await getCases();
        // Only keep active cases
        const activeOnly = Array.isArray(data) ? data.filter(c => c.status === 'active') : [];
        setCases(activeOnly);
      } catch (err) {
        console.error('Failed to fetch cases for indicator:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
    // Refresh case status every minute
    const interval = setInterval(fetchCases, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || cases.length === 0) {
    return null;
  }

  const activeCasesCount = cases.length;
  const urgentDeadlinesCount = cases.filter(c => c.urgentDeadline).length;

  return (
    <div className="fixed top-32 lg:top-36 right-4 lg:right-6 z-40">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg shadow-elevation-2 hover:shadow-elevation-3 transition-smooth"
        aria-label="View active cases"
      >
        <Icon name="FolderOpen" size={18} color="var(--color-primary)" />
        <span className="text-sm font-medium text-foreground">
          {activeCasesCount} Active {activeCasesCount === 1 ? 'Case' : 'Cases'}
        </span>
        {urgentDeadlinesCount > 0 && (
          <span className="flex items-center justify-center w-5 h-5 bg-warning text-warning-foreground rounded-full text-xs font-semibold">
            {urgentDeadlinesCount}
          </span>
        )}
        <Icon
          name={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          size={16}
          color="var(--color-muted-foreground)"
        />
      </button>
      {isExpanded && (
        <div className="absolute top-full right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-card border border-border rounded-xl shadow-elevation-4 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Active Cases
            </h3>
          </div>
          <div className="max-h-80 overflow-y-auto overscroll-contain">
            {cases.map((caseItem) => {
              const deadlineStr = caseItem.deadlineDate
                ? new Date(caseItem.deadlineDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'No deadline set';

              return (
                <Link
                  key={caseItem._id}
                  to="/legal-timeline-tracker"
                  className="block p-4 border-b border-border hover:bg-muted transition-smooth"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="font-medium text-foreground flex-1 break-words">
                      {caseItem.title}
                    </h4>
                    {caseItem.urgentDeadline && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning rounded-full text-xs font-medium whitespace-nowrap">
                        <Icon name="AlertTriangle" size={12} color="currentColor" />
                        Urgent
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs md:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 capitalize">
                      <Icon name="FileText" size={14} color="currentColor" />
                      {caseItem.status}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} color="currentColor" />
                      {deadlineStr}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link
            to="/legal-timeline-tracker"
            className="block p-4 text-center text-sm font-medium text-primary hover:bg-muted transition-smooth bg-card border-t border-border sticky bottom-0"
          >
            Manage All Cases
          </Link>
        </div>
      )}
    </div>
  );
};

export default CaseStatusIndicator;