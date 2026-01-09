import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const EmergencyAlertBanner = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (isCollapsed) {
    return (
      <div className="fixed top-16 lg:top-20 left-0 right-0 z-200 bg-accent shadow-elevation-3">
        <div className="mx-4 lg:mx-6">
          <div className="flex items-center justify-between py-2">
            <button
              onClick={() => setIsCollapsed(false)}
              className="flex items-center gap-2 text-accent-foreground hover:opacity-80 transition-smooth"
              aria-label="Expand emergency banner"
            >
              <Icon name="AlertCircle" size={20} color="currentColor" />
              <span className="text-sm font-medium">Emergency Support Available</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-16 lg:top-20 left-0 right-0 z-200 bg-accent shadow-elevation-3">
      <div className="mx-4 lg:mx-6">
        <div className="py-4 lg:py-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="flex-shrink-0 mt-1">
                <Icon name="AlertCircle" size={24} color="var(--color-accent-foreground)" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-heading font-semibold text-accent-foreground mb-2">
                  Need Immediate Legal Help?
                </h3>
                <p className="text-sm text-accent-foreground/90 mb-4 max-w-2xl">
                  If you're facing a legal emergency or crisis situation, our dedicated support team is here to help you 24/7. Access immediate guidance, emergency contacts, and crisis resources.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/victim-support-flow"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent-foreground text-accent rounded-lg font-medium hover:opacity-90 transition-smooth shadow-elevation-2"
                  >
                    <Icon name="Phone" size={18} color="currentColor" />
                    <span>Access Emergency Support</span>
                  </Link>
                  <a
                    href="tel:1800-123-4567"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-accent-foreground text-accent-foreground rounded-lg font-medium hover:bg-accent-foreground/10 transition-smooth"
                  >
                    <Icon name="PhoneCall" size={18} color="currentColor" />
                    <span>Call: 1800-123-4567</span>
                  </a>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="flex-shrink-0 p-2 text-accent-foreground hover:bg-accent-foreground/10 rounded-lg transition-smooth"
              aria-label="Collapse emergency banner"
            >
              <Icon name="ChevronUp" size={20} color="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlertBanner;