import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const RecentActivityPanel = () => {
  const recentActivities = [
    {
      id: 1,
      type: 'case',
      title: 'Property Dispute Case Updated',
      description: 'New milestone added: Document submission completed',
      timestamp: '2 hours ago',
      icon: 'FolderOpen',
      iconColor: 'var(--color-primary)',
      link: '/legal-timeline-tracker'
    },
    {
      id: 2,
      type: 'chat',
      title: 'AI Legal Consultation',
      description: 'Asked about consumer rights protection laws',
      timestamp: '5 hours ago',
      icon: 'MessageSquare',
      iconColor: 'var(--color-secondary)',
      link: '/legal-steps-generator'
    },
    {
      id: 3,
      type: 'document',
      title: 'Document Uploaded',
      description: 'Rent agreement template downloaded successfully',
      timestamp: '1 day ago',
      icon: 'FileText',
      iconColor: 'var(--color-success)',
      link: '/legal-library'
    },
    {
      id: 4,
      type: 'support',
      title: 'Emergency Support Accessed',
      description: 'Viewed cyber fraud helpline information',
      timestamp: '2 days ago',
      icon: 'AlertCircle',
      iconColor: 'var(--color-accent)',
      link: '/victim-support-flow'
    }
  ];

  return (
    <div className="bg-card p-4 md:p-6 lg:p-8 rounded-xl border border-border shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
          Recent Activity
        </h2>
        <Link
          to="/legal-timeline-tracker"
          className="text-sm font-medium text-primary hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {recentActivities?.map((activity) => (
          <Link
            key={activity?.id}
            to={activity?.link}
            className="block p-4 rounded-lg border border-border hover:bg-muted transition-smooth"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                  <Icon name={activity?.icon} size={20} color={activity?.iconColor} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-medium text-foreground mb-1">
                  {activity?.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                  {activity?.description}
                </p>
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Icon name="Clock" size={12} color="currentColor" />
                  <span>{activity?.timestamp}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityPanel;