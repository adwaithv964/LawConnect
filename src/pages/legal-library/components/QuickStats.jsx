import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats?.map((stat) => (
        <div
          key={stat?.id}
          className="bg-card rounded-xl border border-border p-4 lg:p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
              <Icon name={stat?.icon} size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-foreground">
                {stat?.value}
              </p>
              <p className="text-xs text-muted-foreground">
                {stat?.label}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;