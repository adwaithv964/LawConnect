import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { logActivity } from '../../../utils/api';

const QuickActionButtons = () => {
  const navigate = useNavigate();

  const handleAction = async (path, activityData) => {
    // Fire-and-forget activity log — don't block navigation
    logActivity(activityData).catch(() => { });
    navigate(path);
  };

  const quickActions = [
    {
      label: 'Start New Case',
      icon: 'FolderPlus',
      variant: 'default',
      onClick: () => handleAction('/legal-timeline-tracker', {
        type: 'case',
        title: 'Started New Case',
        description: 'Navigated to Timeline Tracker to create a new case',
        link: '/legal-timeline-tracker',
        icon: 'FolderOpen',
        iconColor: 'var(--color-primary)'
      })
    },
    {
      label: 'Ask AI Question',
      icon: 'MessageSquare',
      variant: 'secondary',
      onClick: () => handleAction('/legal-steps-generator', {
        type: 'chat',
        title: 'AI Legal Consultation',
        description: 'Started a new AI legal consultation session',
        link: '/legal-steps-generator',
        icon: 'MessageSquare',
        iconColor: 'var(--color-secondary)'
      })
    },
    {
      label: 'Upload Document',
      icon: 'Upload',
      variant: 'outline',
      onClick: () => handleAction('/document-vault', {
        type: 'document',
        title: 'Document Vault Visited',
        description: 'Navigated to Document Vault to upload a document',
        link: '/document-vault',
        icon: 'FileText',
        iconColor: 'var(--color-success)'
      })
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