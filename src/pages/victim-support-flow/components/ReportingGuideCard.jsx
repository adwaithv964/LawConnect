import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ReportingGuideCard = ({ title, steps, portalUrl, portalName }) => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-2">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
          <Icon name="FileCheck" size={24} color="var(--color-primary)" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            Step-by-step guide to file your complaint online
          </p>
        </div>
      </div>
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          {steps?.map((_, index) => (
            <div
              key={index}
              className={`
                flex-1 h-2 rounded-full transition-smooth
                ${index <= currentStep ? 'bg-primary' : 'bg-muted'}
              `}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Step {currentStep + 1} of {steps?.length}
        </p>
      </div>
      <div className="mb-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
              {currentStep + 1}
            </div>
            <div className="flex-1">
              <h4 className="text-base md:text-lg font-medium text-foreground mb-2">
                {steps?.[currentStep]?.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {steps?.[currentStep]?.description}
              </p>
            </div>
          </div>

          {steps?.[currentStep]?.screenshot && (
            <div className="mt-3 rounded-lg overflow-hidden border border-border">
              <Image
                src={steps?.[currentStep]?.screenshot}
                alt={`Screenshot showing ${steps?.[currentStep]?.title} interface with form fields and navigation elements`}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {steps?.[currentStep]?.tips && (
            <div className="mt-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Icon name="Lightbulb" size={16} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                <p className="text-xs text-foreground">
                  <span className="font-medium">Tip:</span> {steps?.[currentStep]?.tips}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          iconName="ChevronLeft"
          iconPosition="left"
          fullWidth
        >
          Previous
        </Button>
        <Button
          variant="default"
          onClick={() => setCurrentStep(Math.min(steps?.length - 1, currentStep + 1))}
          disabled={currentStep === steps?.length - 1}
          iconName="ChevronRight"
          iconPosition="right"
          fullWidth
        >
          Next
        </Button>
      </div>
      <a
        href={portalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-smooth"
      >
        <Icon name="ExternalLink" size={18} color="currentColor" />
        <span>Open {portalName}</span>
      </a>
    </div>
  );
};

export default ReportingGuideCard;