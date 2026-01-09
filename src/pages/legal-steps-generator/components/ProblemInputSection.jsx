import React from 'react';
import Icon from '../../../components/AppIcon';

import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const ProblemInputSection = ({ 
  problemDescription, 
  setProblemDescription,
  selectedCategory,
  setSelectedCategory,
  onGenerate,
  isGenerating 
}) => {
  const categoryOptions = [
    { value: 'consumer', label: 'Consumer Rights', description: 'Product defects, service issues, refunds' },
    { value: 'property', label: 'Property Disputes', description: 'Land, rent, ownership issues' },
    { value: 'cyber', label: 'Cyber Crime', description: 'Online fraud, hacking, identity theft' },
    { value: 'family', label: 'Family Law', description: 'Marriage, divorce, custody matters' },
    { value: 'employment', label: 'Employment', description: 'Workplace rights, termination, salary' },
    { value: 'criminal', label: 'Criminal Matters', description: 'FIR, bail, legal defense' }
  ];

  const exampleScenarios = [
    {
      category: 'consumer',
      text: "I purchased a mobile phone online 2 months ago. It stopped working after 45 days. The seller is refusing to replace or refund despite valid warranty."
    },
    {
      category: 'property',
      text: "My landlord is not returning my security deposit of ₹50,000 even after 3 months of vacating the property. He claims false damages."
    },
    {
      category: 'cyber',
      text: "Someone hacked my bank account and transferred ₹1,20,000. The bank is not responding to my complaint filed 10 days ago."
    }
  ];

  const handleExampleClick = (example) => {
    setProblemDescription(example?.text);
    setSelectedCategory(example?.category);
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-elevation-2 p-6 lg:p-8">
      <div className="flex items-start gap-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg flex-shrink-0">
          <Icon name="FileText" size={24} color="var(--color-primary)" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl lg:text-3xl font-heading font-semibold text-foreground mb-2">
            Describe Your Legal Problem
          </h2>
          <p className="text-sm lg:text-base text-muted-foreground max-measure">
            Provide details about your situation. Include dates, amounts, and parties involved for better guidance.
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Problem Description <span className="text-accent">*</span>
          </label>
          <textarea
            value={problemDescription}
            onChange={(e) => setProblemDescription(e?.target?.value)}
            placeholder="Example: I purchased a defective product online. The seller refuses to provide refund despite multiple complaints..."
            className="w-full min-h-[160px] lg:min-h-[200px] px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y transition-smooth"
            required
          />
          <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
            <Icon name="Info" size={14} color="currentColor" />
            Minimum 50 characters required for accurate analysis
          </p>
        </div>

        <Select
          label="Legal Category"
          description="Select the category that best matches your issue"
          options={categoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="Choose a category..."
          searchable
          required
        />

        <div className="pt-4 border-t border-border">
          <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Icon name="Lightbulb" size={16} color="var(--color-primary)" />
            Example Scenarios
          </p>
          <div className="grid grid-cols-1 gap-3">
            {exampleScenarios?.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="text-left p-4 bg-muted/50 hover:bg-muted rounded-lg border border-border transition-smooth"
              >
                <div className="flex items-start gap-3">
                  <Icon name="ArrowRight" size={16} color="var(--color-primary)" className="flex-shrink-0 mt-1" />
                  <p className="text-sm text-foreground line-clamp-2">
                    {example?.text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="default"
          size="lg"
          fullWidth
          iconName="Sparkles"
          iconPosition="left"
          onClick={onGenerate}
          loading={isGenerating}
          disabled={!problemDescription || problemDescription?.length < 50 || !selectedCategory}
        >
          {isGenerating ? 'Generating Legal Steps...' : 'Generate Action Plan'}
        </Button>
      </div>
    </div>
  );
};

export default ProblemInputSection;