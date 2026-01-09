import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResourceDownloadCard = ({ title, description, resources }) => {
  const handleDownload = (resourceName) => {
    console.log(`Downloading: ${resourceName}`);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-elevation-2">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg">
          <Icon name="Download" size={24} color="var(--color-secondary)" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {resources?.map((resource, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-smooth"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Icon name="FileText" size={20} color="var(--color-primary)" className="flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm md:text-base font-medium text-foreground">
                  {resource?.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {resource?.size} • {resource?.format}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(resource?.name)}
              iconName="Download"
              className="flex-shrink-0"
            />
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground">
            All resources are available in English and Hindi. Documents are regularly updated with latest legal information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourceDownloadCard;