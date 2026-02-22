import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import { timeAgo } from '../../../utils/api';

const iconMap = {
  case: { icon: 'FolderOpen', color: 'var(--color-primary)' },
  document: { icon: 'FileText', color: 'var(--color-success)' },
  chat: { icon: 'MessageSquare', color: 'var(--color-secondary)' },
  support: { icon: 'AlertCircle', color: 'var(--color-accent)' },
  library: { icon: 'BookOpen', color: 'var(--color-warning)' },
};

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-10 text-center">
    <div className="flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
      <Icon name="Activity" size={28} color="var(--color-muted-foreground)" />
    </div>
    <h3 className="text-base font-medium text-foreground mb-1">No activity yet</h3>
    <p className="text-sm text-muted-foreground">
      Start using the platform — your actions will show up here.
    </p>
  </div>
);

const RecentActivityPanel = ({ activities = [], onRefresh }) => {
  return (
    <div className="bg-card p-4 md:p-6 lg:p-8 rounded-xl border border-border shadow-elevation-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
          Recent Activity
        </h2>
        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="text-sm text-muted-foreground hover:text-foreground transition-smooth"
              title="Refresh"
            >
              <Icon name="RefreshCw" size={16} color="currentColor" />
            </button>
          )}
          <Link
            to="/legal-timeline-tracker"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </div>
      </div>

      {activities.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const meta = iconMap[activity.type] || iconMap.case;
            return (
              <Link
                key={activity._id}
                to={activity.link || '/'}
                className="block p-4 rounded-lg border border-border hover:bg-muted transition-smooth"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
                      <Icon
                        name={activity.icon || meta.icon}
                        size={20}
                        color={activity.iconColor || meta.color}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-medium text-foreground mb-1">
                      {activity.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Icon name="Clock" size={12} color="currentColor" />
                      <span>{timeAgo(activity.timestamp || activity.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivityPanel;