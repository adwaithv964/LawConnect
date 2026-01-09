import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentTemplates = () => {
  const recentTemplates = [
    { id: 1, name: 'Rent Agreement', icon: 'FileText', date: '2 days ago' },
    { id: 2, name: 'Consumer Complaint', icon: 'FileText', date: '5 days ago' },
    { id: 3, name: 'Legal Notice', icon: 'FileText', date: '1 week ago' }
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Icon name="Clock" size={16} color="currentColor" />
        Recently Used
      </h3>
      <div className="space-y-2">
        {recentTemplates?.map((template) => (
          <button
            key={template?.id}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-smooth text-left"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name={template?.icon} size={16} color="var(--color-primary)" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{template?.name}</p>
              <p className="text-xs text-muted-foreground">{template?.date}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentTemplates;