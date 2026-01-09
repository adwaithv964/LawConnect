import React from 'react';
import Icon from '../../../components/AppIcon';

const TimelineOverview = ({ totalSteps, estimatedDuration, complexity, consultationPoints }) => {
  const complexityConfig = {
    low: { color: 'text-success', bg: 'bg-success/10', label: 'Low Complexity' },
    medium: { color: 'text-warning', bg: 'bg-warning/10', label: 'Medium Complexity' },
    high: { color: 'text-accent', bg: 'bg-accent/10', label: 'High Complexity' }
  };

  const config = complexityConfig?.[complexity] || complexityConfig?.medium;

  return (
    <div className="bg-card rounded-xl border border-border shadow-elevation-2 p-6 lg:p-8 sticky top-24 lg:top-28">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
          <Icon name="BarChart3" size={24} color="var(--color-primary)" />
        </div>
        <h3 className="text-xl lg:text-2xl font-heading font-semibold text-foreground">
          Action Plan Overview
        </h3>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Steps</span>
            <span className="text-2xl font-semibold text-foreground">{totalSteps}</span>
          </div>
          <div className="w-full h-2 bg-background rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '0%' }} />
          </div>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Clock" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm text-muted-foreground">Estimated Duration</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{estimatedDuration}</p>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={16} color="var(--color-muted-foreground)" />
            <span className="text-sm text-muted-foreground">Case Complexity</span>
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1 ${config?.bg} ${config?.color} rounded-full text-sm font-medium`}>
            {config?.label}
          </span>
        </div>

        {consultationPoints && consultationPoints?.length > 0 && (
          <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="UserCheck" size={16} color="var(--color-warning)" />
              <span className="text-sm font-semibold text-foreground">Professional Consultation Recommended</span>
            </div>
            <ul className="space-y-2">
              {consultationPoints?.map((point, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Icon name="ArrowRight" size={14} color="var(--color-warning)" className="flex-shrink-0 mt-1" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t border-border space-y-3">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-smooth">
            <Icon name="Download" size={18} color="currentColor" />
            <span>Export as PDF</span>
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-smooth">
            <Icon name="Calendar" size={18} color="currentColor" />
            <span>Create Timeline Case</span>
          </button>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Icon name="Info" size={16} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            This is an AI-generated action plan. For complex legal matters, consult a qualified lawyer for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelineOverview;