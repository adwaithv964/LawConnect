import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const OfflineStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsSyncing(true);
      setTimeout(() => setIsSyncing(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setIsExpanded(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cachedScreens = [
    { name: 'Dashboard', path: '/main-dashboard', available: true },
    { name: 'Legal Assistant', path: '/legal-steps-generator', available: true },
    { name: 'My Cases', path: '/legal-timeline-tracker', available: true },
    { name: 'Emergency Support', path: '/victim-support-flow', available: true },
    { name: 'Legal Library', path: '/legal-library', available: false }
  ];

  if (isOnline && !isSyncing) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg shadow-elevation-3
          transition-smooth hover:shadow-elevation-4
          ${isOnline 
            ? 'bg-success text-success-foreground' 
            : 'bg-warning text-warning-foreground'
          }
        `}
        aria-label={isOnline ? 'Online status' : 'Offline status'}
      >
        <Icon 
          name={isSyncing ? 'RefreshCw' : isOnline ? 'Wifi' : 'WifiOff'} 
          size={18} 
          color="currentColor"
          className={isSyncing ? 'animate-spin' : ''}
        />
        <span className="text-sm font-medium">
          {isSyncing ? 'Syncing...' : isOnline ? 'Online' : 'Offline Mode'}
        </span>
        {!isOnline && (
          <Icon 
            name={isExpanded ? 'ChevronDown' : 'ChevronUp'} 
            size={16} 
            color="currentColor" 
          />
        )}
      </button>
      {isExpanded && !isOnline && (
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-card border border-border rounded-xl shadow-elevation-4 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Offline Access
            </h3>
            <p className="text-sm text-muted-foreground">
              You can still access cached content while offline
            </p>
          </div>
          <div className="p-2">
            {cachedScreens?.map((screen) => (
              <div
                key={screen?.path}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-smooth"
              >
                <span className="text-sm text-foreground">
                  {screen?.name}
                </span>
                {screen?.available ? (
                  <Icon name="Check" size={16} color="var(--color-success)" />
                ) : (
                  <Icon name="X" size={16} color="var(--color-muted-foreground)" />
                )}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border bg-muted/50">
            <p className="text-xs text-muted-foreground">
              Changes will sync automatically when you're back online
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineStatusIndicator;