import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const StepCard = ({ step, stepNumber, isExpanded, onToggleExpand, onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const priorityConfig = {
    high: { color: 'text-accent', bg: 'bg-accent/10', icon: 'AlertCircle' },
    medium: { color: 'text-warning', bg: 'bg-warning/10', icon: 'AlertTriangle' },
    low: { color: 'text-success', bg: 'bg-success/10', icon: 'Info' }
  };

  const config = priorityConfig?.[step?.priority] || priorityConfig?.medium;

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    if (onComplete) {
      onComplete(step?.id, !isCompleted);
    }
  };

  return (
    <div className={`
      bg-card rounded-xl border transition-smooth
      ${isCompleted ? 'border-success/50 bg-success/5' : 'border-border'}
      ${isExpanded ? 'shadow-elevation-3' : 'shadow-elevation-1 hover:shadow-elevation-2'}
    `}>
      <div className="p-4 lg:p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className={`
              flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full font-semibold
              ${isCompleted ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'}
            `}>
              {isCompleted ? (
                <Icon name="Check" size={20} color="currentColor" />
              ) : (
                <span className="text-base lg:text-lg">{stepNumber}</span>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1">
                <h3 className={`
                  text-lg lg:text-xl font-heading font-semibold mb-2
                  ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}
                `}>
                  {step?.title}
                </h3>
                <p className="text-sm lg:text-base text-muted-foreground mb-3">
                  {step?.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                  <span className={`flex items-center gap-1 px-2 py-1 ${config?.bg} ${config?.color} rounded text-xs font-medium`}>
                    <Icon name={config?.icon} size={12} color="currentColor" />
                    {step?.priority?.charAt(0)?.toUpperCase() + step?.priority?.slice(1)} Priority
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Icon name="Clock" size={12} color="currentColor" />
                    {step?.timeLimit}
                  </span>
                  {step?.cost && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon name="IndianRupee" size={12} color="currentColor" />
                      {step?.cost}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={onToggleExpand}
                className="flex-shrink-0 p-2 hover:bg-muted rounded-lg transition-smooth"
                aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
              >
                <Icon 
                  name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
                  size={20} 
                  color="var(--color-muted-foreground)" 
                />
              </button>
            </div>

            {isExpanded && (
              <div className="space-y-4 pt-4 border-t border-border">
                {step?.detailedSteps && step?.detailedSteps?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Icon name="ListChecks" size={16} color="var(--color-primary)" />
                      Detailed Actions
                    </h4>
                    <ul className="space-y-2">
                      {step?.detailedSteps?.map((action, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                          <Icon name="ArrowRight" size={14} color="var(--color-primary)" className="flex-shrink-0 mt-1" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {step?.requiredDocuments && step?.requiredDocuments?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Icon name="FileText" size={16} color="var(--color-primary)" />
                      Required Documents
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {step?.requiredDocuments?.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                          <Icon name="File" size={14} color="var(--color-muted-foreground)" />
                          <span className="text-sm text-foreground">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step?.legalSections && step?.legalSections?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Icon name="Scale" size={16} color="var(--color-primary)" />
                      Relevant Legal Sections
                    </h4>
                    <div className="space-y-2">
                      {step?.legalSections?.map((section, index) => (
                        <div key={index} className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                          <p className="text-sm font-medium text-foreground mb-1">{section?.section}</p>
                          <p className="text-xs text-muted-foreground">{section?.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step?.tips && step?.tips?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Icon name="Lightbulb" size={16} color="var(--color-warning)" />
                      Important Tips
                    </h4>
                    <ul className="space-y-2">
                      {step?.tips?.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Icon name="CheckCircle2" size={14} color="var(--color-success)" className="flex-shrink-0 mt-1" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Download Template
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Bell"
                    iconPosition="left"
                    className="flex-1"
                  >
                    Set Reminder
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border">
              <Checkbox
                label="Mark this step as completed"
                checked={isCompleted}
                onChange={handleComplete}
                size="default"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepCard;