import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TemplatePreviewModal = ({ template, onClose, onDownload }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      'Consumer': 'ShoppingCart',
      'Property': 'Home',
      'Cyber': 'Shield',
      'Family': 'Users'
    };
    return icons?.[category] || 'FileText';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-xl border border-border max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name={getCategoryIcon(template?.category)} size={24} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{template?.name}</h2>
              <p className="text-sm text-muted-foreground">{template?.category} - {template?.docType}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} color="var(--color-muted-foreground)" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{template?.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Download" size={16} color="var(--color-primary)" />
                  <span className="text-xs text-muted-foreground">Downloads</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{template?.downloads?.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Star" size={16} color="var(--color-warning)" />
                  <span className="text-xs text-muted-foreground">Rating</span>
                </div>
                <p className="text-lg font-semibold text-foreground">{template?.rating}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Clock" size={16} color="var(--color-primary)" />
                  <span className="text-xs text-muted-foreground">Time</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{template?.estimatedTime}</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="Calendar" size={16} color="var(--color-primary)" />
                  <span className="text-xs text-muted-foreground">Updated</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{template?.lastUpdated}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Required Information</h3>
              <div className="space-y-2">
                {template?.requiredFields?.map((field, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Icon name="CheckCircle" size={16} color="var(--color-success)" className="mt-0.5" />
                    <span className="text-sm text-muted-foreground">{field}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Available Formats</h3>
              <div className="flex gap-2">
                {template?.formats?.map((format) => (
                  <span
                    key={format}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium"
                  >
                    {format}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex gap-2">
                <Icon name="AlertCircle" size={20} color="var(--color-warning)" className="flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Customization Guide</h4>
                  <p className="text-sm text-muted-foreground">
                    This template includes highlighted sections that require your specific information. 
                    Please review all fields carefully and consult a legal professional if needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            fullWidth
            onClick={onClose}
          >
            Close
          </Button>
          {template?.formats?.map((format) => (
            <Button
              key={format}
              variant="default"
              fullWidth
              iconName="Download"
              onClick={() => {
                onDownload(template, format);
                onClose();
              }}
            >
              Download {format}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;