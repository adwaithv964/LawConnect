import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const DashboardFeatureCard = ({ 
  title, 
  description, 
  icon, 
  path, 
  stats, 
  recentActivity,
  variant = 'default'
}) => {
  const variantStyles = {
    default: 'bg-card hover:shadow-elevation-3',
    emergency: 'bg-accent text-accent-foreground hover:shadow-elevation-4',
    primary: 'bg-primary text-primary-foreground hover:shadow-elevation-3'
  };

  const iconColor = variant === 'default' ?'var(--color-primary)' :'currentColor';

  return (
    <Link
      to={path}
      className={`
        block p-6 lg:p-8 rounded-xl border border-border
        transition-smooth hover-lift press-scale
        ${variantStyles?.[variant]}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`
            flex items-center justify-center w-12 h-12 rounded-lg
            ${variant === 'default' ? 'bg-primary/10' : 'bg-white/20'}
          `}>
            <Icon name={icon} size={24} color={iconColor} />
          </div>
          <div>
            <h3 className="text-xl font-heading font-semibold mb-1">
              {title}
            </h3>
            {stats && (
              <p className="text-sm opacity-80">
                {stats}
              </p>
            )}
          </div>
        </div>
        <Icon 
          name="ArrowRight" 
          size={20} 
          color={variant === 'default' ? 'var(--color-muted-foreground)' : 'currentColor'} 
        />
      </div>
      <p className={`
        text-sm mb-4 max-measure
        ${variant === 'default' ? 'text-muted-foreground' : 'opacity-90'}
      `}>
        {description}
      </p>
      {recentActivity && (
        <div className={`
          pt-4 border-t
          ${variant === 'default' ? 'border-border' : 'border-white/20'}
        `}>
          <div className="flex items-center gap-2 text-sm">
            <Icon 
              name="Clock" 
              size={16} 
              color={variant === 'default' ? 'var(--color-muted-foreground)' : 'currentColor'} 
            />
            <span className={variant === 'default' ? 'text-muted-foreground' : 'opacity-80'}>
              {recentActivity}
            </span>
          </div>
        </div>
      )}
    </Link>
  );
};

export default DashboardFeatureCard;