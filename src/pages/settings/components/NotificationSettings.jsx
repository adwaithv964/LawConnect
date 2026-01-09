import React, { useState } from 'react';
import Icon from "../../../components/AppIcon";

const NotificationSettings = () => {
    const [settings, setSettings] = useState({
        emailUpdates: true,
        pushNotifications: true,
        smsAlerts: false,
        caseUpdates: true,
        legalTips: false
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="bg-card rounded-xl border border-border shadow-elevation-1 overflow-hidden">
            <div className="p-6 border-b border-border">
                <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
                    <Icon name="Bell" size={24} color="var(--color-primary)" />
                    Notification Preferences
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Choose how you want to be notified about important updates
                </p>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-foreground">Email Updates</h3>
                            <p className="text-sm text-muted-foreground">Receive case updates and legal news via email</p>
                        </div>
                        <button
                            onClick={() => handleToggle('emailUpdates')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.emailUpdates ? 'bg-primary' : 'bg-muted'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.emailUpdates ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-foreground">Push Notifications</h3>
                            <p className="text-sm text-muted-foreground">Receive instant alerts on your device</p>
                        </div>
                        <button
                            onClick={() => handleToggle('pushNotifications')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.pushNotifications ? 'bg-primary' : 'bg-muted'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.pushNotifications ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-foreground">SMS Alerts</h3>
                            <p className="text-sm text-muted-foreground">Get urgent updates via SMS</p>
                        </div>
                        <button
                            onClick={() => handleToggle('smsAlerts')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.smsAlerts ? 'bg-primary' : 'bg-muted'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.smsAlerts ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="pt-6 border-t border-border space-y-4">
                    <h3 className="font-heading font-semibold text-foreground">Notification Types</h3>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-foreground">Case Updates</h3>
                            <p className="text-sm text-muted-foreground">Notify when there is activity on my cases</p>
                        </div>
                        <button
                            onClick={() => handleToggle('caseUpdates')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.caseUpdates ? 'bg-primary' : 'bg-muted'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.caseUpdates ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-foreground">Legal Tips & News</h3>
                            <p className="text-sm text-muted-foreground">Weekly newsletters and legal insights</p>
                        </div>
                        <button
                            onClick={() => handleToggle('legalTips')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.legalTips ? 'bg-primary' : 'bg-muted'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.legalTips ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;
