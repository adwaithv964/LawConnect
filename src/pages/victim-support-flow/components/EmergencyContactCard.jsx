import React from 'react';
import Icon from '../../../components/AppIcon';

const EmergencyContactCard = ({ 
  title, 
  description, 
  phoneNumber, 
  availability, 
  icon, 
  variant = 'default',
  portalLink,
  portalName 
}) => {
  const variantStyles = {
    default: 'bg-card border-border',
    critical: 'bg-accent border-accent',
    urgent: 'bg-warning border-warning'
  };

  const textColor = variant === 'default' ? 'text-foreground' : 'text-white';
  const iconColor = variant === 'default' ? 'var(--color-accent)' : 'white';

  return (
    <div className={`
      p-4 md:p-6 rounded-xl border-2 shadow-elevation-2
      transition-smooth hover:shadow-elevation-3
      ${variantStyles?.[variant]}
    `}>
      <div className="flex items-start gap-3 md:gap-4 mb-4">
        <div className={`
          flex-shrink-0 flex items-center justify-center 
          w-12 h-12 md:w-14 md:h-14 rounded-lg
          ${variant === 'default' ? 'bg-accent/10' : 'bg-white/20'}
        `}>
          <Icon name={icon} size={24} color={iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg md:text-xl font-heading font-semibold mb-1 ${textColor}`}>
            {title}
          </h3>
          <p className={`text-sm md:text-base ${variant === 'default' ? 'text-muted-foreground' : 'text-white/90'}`}>
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <a
          href={`tel:${phoneNumber}`}
          className={`
            flex items-center justify-center gap-2 w-full
            px-4 py-3 md:py-4 rounded-lg font-medium
            transition-smooth press-scale
            ${variant === 'default' ?'bg-accent text-accent-foreground hover:bg-accent/90' :'bg-white text-accent hover:bg-white/90'
            }
          `}
        >
          <Icon name="Phone" size={20} color="currentColor" />
          <span className="text-base md:text-lg">{phoneNumber}</span>
        </a>

        <div className={`
          flex items-center justify-center gap-2 text-sm
          ${variant === 'default' ? 'text-success' : 'text-white'}
        `}>
          <Icon name="Clock" size={16} color="currentColor" />
          <span className="font-medium">{availability}</span>
        </div>

        {portalLink && (
          <a
            href={portalLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center justify-center gap-2 w-full
              px-4 py-2 md:py-3 rounded-lg border-2 font-medium
              transition-smooth hover:bg-white/10
              ${variant === 'default' ?'border-border text-foreground hover:bg-muted' :'border-white text-white'
              }
            `}
          >
            <Icon name="ExternalLink" size={18} color="currentColor" />
            <span className="text-sm md:text-base">{portalName}</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default EmergencyContactCard;