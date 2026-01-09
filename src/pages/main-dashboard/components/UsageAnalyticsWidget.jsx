import React from 'react';
import Icon from '../../../components/AppIcon';

const UsageAnalyticsWidget = () => {
  const analyticsData = [
    {
      label: 'Active Cases',
      value: '3',
      change: '+1 this month',
      icon: 'FolderOpen',
      color: 'var(--color-primary)'
    },
    {
      label: 'AI Consultations',
      value: '12',
      change: '+4 this week',
      icon: 'MessageSquare',
      color: 'var(--color-secondary)'
    },
    {
      label: 'Documents Stored',
      value: '8',
      change: '+2 recently',
      icon: 'FileText',
      color: 'var(--color-success)'
    },
    {
      label: 'Library Articles Read',
      value: '15',
      change: '+5 this month',
      icon: 'BookOpen',
      color: 'var(--color-warning)'
    }
  ];

  return (
    <div className="bg-card p-4 md:p-6 lg:p-8 rounded-xl border border-border shadow-elevation-2">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="BarChart3" size={24} color="var(--color-primary)" />
        <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
          Your Usage Statistics
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {analyticsData?.map((stat, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-muted/50 border border-border hover:shadow-elevation-1 transition-smooth"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-card">
                <Icon name={stat?.icon} size={20} color={stat?.color} />
              </div>
              <span className="text-2xl md:text-3xl font-bold text-foreground">
                {stat?.value}
              </span>
            </div>
            <h3 className="text-sm md:text-base font-medium text-foreground mb-1">
              {stat?.label}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              {stat?.change}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsageAnalyticsWidget;