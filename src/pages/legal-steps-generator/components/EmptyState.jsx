import React from 'react';
import Icon from '../../../components/AppIcon';

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 lg:py-16 px-4">
      <div className="flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 bg-primary/10 rounded-full mb-6">
        <Icon name="FileSearch" size={40} color="var(--color-primary)" />
      </div>
      <h3 className="text-xl lg:text-2xl font-heading font-semibold text-foreground mb-3 text-center">
        No Action Plan Generated Yet
      </h3>
      <p className="text-sm lg:text-base text-muted-foreground text-center max-w-md mb-6">
        Describe your legal problem above and select a category to generate a comprehensive step-by-step action plan tailored to your situation.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Icon name="CheckCircle2" size={16} color="var(--color-success)" />
          <span>AI-Powered Analysis</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="CheckCircle2" size={16} color="var(--color-success)" />
          <span>Step-by-Step Guidance</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="CheckCircle2" size={16} color="var(--color-success)" />
          <span>Legal References</span>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;