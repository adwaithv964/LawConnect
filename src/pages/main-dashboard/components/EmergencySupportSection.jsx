import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencySupportSection = () => {
  const emergencyContacts = [
    {
      name: 'National Emergency',
      number: '112',
      description: 'All emergency services',
      icon: 'Phone'
    },
    {
      name: 'Women Helpline',
      number: '1091',
      description: '24x7 support for women in distress',
      icon: 'Shield'
    },
    {
      name: 'Cyber Crime',
      number: '1930',
      description: 'Report cyber fraud and crimes',
      icon: 'Laptop'
    },
    {
      name: 'Legal Aid',
      number: '15100',
      description: 'Free legal assistance',
      icon: 'Scale'
    }
  ];

  return (
    <div className="bg-accent/10 border-2 border-accent p-4 md:p-6 lg:p-8 rounded-xl">
      <div className="flex items-start gap-3 mb-6">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-12 h-12 bg-accent text-accent-foreground rounded-lg">
            <Icon name="AlertCircle" size={24} color="currentColor" />
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground mb-2">
            Emergency Support
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-measure">
            In case of immediate legal crisis or emergency, access quick support and helpline numbers
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
        {emergencyContacts?.map((contact, index) => (
          <a
            key={index}
            href={`tel:${contact?.number}`}
            className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border hover:shadow-elevation-2 transition-smooth"
          >
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-lg">
                <Icon name={contact?.icon} size={20} color="var(--color-accent)" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm md:text-base font-semibold text-foreground">
                  {contact?.name}
                </h3>
                <span className="text-lg font-bold text-accent whitespace-nowrap">
                  {contact?.number}
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">
                {contact?.description}
              </p>
            </div>
          </a>
        ))}
      </div>
      <Link to="/victim-support-flow">
        <Button
          variant="default"
          iconName="ArrowRight"
          iconPosition="right"
          fullWidth
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          Access Complete Victim Support Flow
        </Button>
      </Link>
    </div>
  );
};

export default EmergencySupportSection;