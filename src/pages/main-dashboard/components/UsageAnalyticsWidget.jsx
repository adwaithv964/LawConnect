import React from 'react';
import Icon from '../../../components/AppIcon';

const StatCard = ({ label, value, change, changePositive, icon, color }) => (
  <div className="p-4 rounded-lg bg-muted/50 border border-border hover:shadow-elevation-1 transition-smooth">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-card">
        <Icon name={icon} size={20} color={color} />
      </div>
      <span className="text-2xl md:text-3xl font-bold text-foreground">{value}</span>
    </div>
    <h3 className="text-sm md:text-base font-medium text-foreground mb-1">{label}</h3>
    <p className={`text-xs md:text-sm ${changePositive ? 'text-success' : 'text-muted-foreground'}`}>
      {change}
    </p>
  </div>
);

const UsageAnalyticsWidget = ({ stats = {} }) => {
  const {
    activeCases = 0,
    chatConsultations = 0,
    totalDocuments = 0,
    libraryReads = 0,
    casesThisMonth = 0,
    documentsThisMonth = 0,
  } = stats;

  const analyticsData = [
    {
      label: 'Active Cases',
      value: activeCases,
      change: casesThisMonth > 0 ? `+${casesThisMonth} this month` : 'No new cases this month',
      changePositive: casesThisMonth > 0,
      icon: 'FolderOpen',
      color: 'var(--color-primary)'
    },
    {
      label: 'AI Consultations',
      value: chatConsultations,
      change: chatConsultations > 0 ? `${chatConsultations} total sessions` : 'No sessions yet',
      changePositive: chatConsultations > 0,
      icon: 'MessageSquare',
      color: 'var(--color-secondary)'
    },
    {
      label: 'Documents Stored',
      value: totalDocuments,
      change: documentsThisMonth > 0 ? `+${documentsThisMonth} this month` : 'No uploads this month',
      changePositive: documentsThisMonth > 0,
      icon: 'FileText',
      color: 'var(--color-success)'
    },
    {
      label: 'Library Articles',
      value: libraryReads,
      change: libraryReads > 0 ? `${libraryReads} articles accessed` : 'Not visited yet',
      changePositive: libraryReads > 0,
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
        {analyticsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default UsageAnalyticsWidget;