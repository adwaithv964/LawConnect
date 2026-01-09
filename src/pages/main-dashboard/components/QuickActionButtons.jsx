import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActionButtons = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      label: 'Start New Case',
      icon: 'FolderPlus',
      variant: 'default',
      onClick: () => navigate('/legal-timeline-tracker')
    },
    {
      label: 'Ask AI Question',
      icon: 'MessageSquare',
      variant: 'secondary',
      onClick: () => navigate('/legal-steps-generator')
    },
    {
      label: 'Upload Document',
      icon: 'Upload',
      variant: 'outline',
      onClick: () => navigate('/legal-library')
    }
  ];

  return (
    <div className="bg-card p-4 md:p-6 rounded-xl border border-border shadow-elevation-1">
      <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quickActions?.map((action, index) => (
          <Button
            key={index}
            variant={action?.variant}
            iconName={action?.icon}
            iconPosition="left"
            onClick={action?.onClick}
            fullWidth
            className="justify-center"
          >
            {action?.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionButtons;