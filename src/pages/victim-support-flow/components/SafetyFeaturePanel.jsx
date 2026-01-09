import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SafetyFeaturePanel = () => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleQuickExit = () => {
    window.location.href = 'https://www.google.com';
  };

  const safetyTips = [
    {
      icon: 'Eye',
      title: 'Private Browsing',
      description: 'Use incognito/private mode to avoid leaving browsing history'
    },
    {
      icon: 'Camera',
      title: 'Preserve Evidence',
      description: 'Take screenshots and save all relevant communications safely'
    },
    {
      icon: 'Lock',
      title: 'Secure Storage',
      description: 'Store sensitive documents in password-protected folders'
    },
    {
      icon: 'UserX',
      title: 'Block & Report',
      description: 'Block harassers and report to relevant authorities immediately'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-2">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-warning/10 rounded-lg">
          <Icon name="ShieldAlert" size={24} color="var(--color-warning)" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            Safety Features
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            Tools to help protect your privacy and safety
          </p>
        </div>
      </div>
      <div className="mb-4">
        {showExitConfirm ? (
          <div className="p-4 bg-warning/10 border border-warning rounded-lg">
            <p className="text-sm text-foreground mb-3">
              This will immediately redirect you to Google. Are you sure?
            </p>
            <div className="flex gap-2">
              <Button
                variant="warning"
                onClick={handleQuickExit}
                size="sm"
                fullWidth
              >
                Yes, Exit Now
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowExitConfirm(false)}
                size="sm"
                fullWidth
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="warning"
            onClick={() => setShowExitConfirm(true)}
            iconName="LogOut"
            iconPosition="left"
            fullWidth
          >
            Quick Exit (ESC)
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {safetyTips?.map((tip, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <Icon name={tip?.icon} size={18} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground mb-1">
                {tip?.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {tip?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground">
            Press ESC key anytime to quickly exit this page. Your safety is our priority.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyFeaturePanel;