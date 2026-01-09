import React from 'react';
import Icon from '../../../components/AppIcon';

const NearbyResourceCard = ({ 
  name, 
  type, 
  address, 
  distance, 
  phone, 
  availability,
  latitude,
  longitude 
}) => {
  const typeIcons = {
    police: 'Shield',
    legal: 'Scale',
    ngo: 'Heart',
    hospital: 'Hospital'
  };

  const typeColors = {
    police: 'text-primary',
    legal: 'text-secondary',
    ngo: 'text-accent',
    hospital: 'text-success'
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5 shadow-elevation-1 hover:shadow-elevation-2 transition-smooth">
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-muted rounded-lg">
          <Icon 
            name={typeIcons?.[type]} 
            size={20} 
            color={`var(--color-${type === 'police' ? 'primary' : type === 'legal' ? 'secondary' : type === 'ngo' ? 'accent' : 'success'})`} 
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-base md:text-lg font-heading font-semibold text-foreground mb-1">
            {name}
          </h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="MapPin" size={14} color="currentColor" />
            <span>{distance}</span>
          </div>
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <p className="text-sm text-muted-foreground flex items-start gap-2">
          <Icon name="Navigation" size={14} color="currentColor" className="flex-shrink-0 mt-0.5" />
          <span>{address}</span>
        </p>
        {availability && (
          <p className="text-sm text-success flex items-center gap-2">
            <Icon name="Clock" size={14} color="currentColor" />
            <span>{availability}</span>
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <a
          href={`tel:${phone}`}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-smooth"
        >
          <Icon name="Phone" size={16} color="currentColor" />
          <span>Call</span>
        </a>
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-smooth"
        >
          <Icon name="Navigation" size={16} color="currentColor" />
          <span>Directions</span>
        </a>
      </div>
    </div>
  );
};

export default NearbyResourceCard;