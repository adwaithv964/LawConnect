import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReminderSettings = ({ isOpen, onClose, onSave }) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reminderTiming: {
      oneDayBefore: true,
      threeDaysBefore: true,
      oneWeekBefore: false
    },
    dailyDigest: true,
    weeklyReport: false
  });

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev?.[field] }));
  };

  const handleTimingToggle = (timing) => {
    setSettings(prev => ({
      ...prev,
      reminderTiming: {
        ...prev?.reminderTiming,
        [timing]: !prev?.reminderTiming?.[timing]
      }
    }));
  };

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg bg-card rounded-xl shadow-elevation-5 overflow-hidden">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Reminder Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-smooth"
            aria-label="Close settings"
          >
            <Icon name="X" size={20} color="var(--color-foreground)" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          <div>
            <h3 className="text-base font-medium text-foreground mb-3">
              Notification Channels
            </h3>
            <div className="space-y-3">
              <Checkbox
                label="Email Notifications"
                description="Receive deadline reminders via email"
                checked={settings?.emailNotifications}
                onChange={(e) => handleToggle('emailNotifications')}
              />
              <Checkbox
                label="Push Notifications"
                description="Get instant alerts on your device"
                checked={settings?.pushNotifications}
                onChange={(e) => handleToggle('pushNotifications')}
              />
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-base font-medium text-foreground mb-3">
              Reminder Timing
            </h3>
            <div className="space-y-3">
              <Checkbox
                label="1 Day Before Deadline"
                checked={settings?.reminderTiming?.oneDayBefore}
                onChange={() => handleTimingToggle('oneDayBefore')}
              />
              <Checkbox
                label="3 Days Before Deadline"
                checked={settings?.reminderTiming?.threeDaysBefore}
                onChange={() => handleTimingToggle('threeDaysBefore')}
              />
              <Checkbox
                label="1 Week Before Deadline"
                checked={settings?.reminderTiming?.oneWeekBefore}
                onChange={() => handleTimingToggle('oneWeekBefore')}
              />
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-base font-medium text-foreground mb-3">
              Summary Reports
            </h3>
            <div className="space-y-3">
              <Checkbox
                label="Daily Digest"
                description="Get a summary of today's tasks every morning"
                checked={settings?.dailyDigest}
                onChange={(e) => handleToggle('dailyDigest')}
              />
              <Checkbox
                label="Weekly Report"
                description="Receive a comprehensive weekly case update"
                checked={settings?.weeklyReport}
                onChange={(e) => handleToggle('weeklyReport')}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border bg-muted/30">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReminderSettings;