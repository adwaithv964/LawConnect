import React, { useState } from 'react';
import Icon from "../../../components/AppIcon";

const PrivacySettings = () => {
    const [settings, setSettings] = useState({
        profileVisibility: false,
        searchable: true,
        dataSharing: false
    });

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="bg-card rounded-xl border border-border shadow-elevation-1 overflow-hidden">
            <div className="p-6 border-b border-border">
                <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
                    <Icon name="Shield" size={24} color="var(--color-primary)" />
                    Privacy & Security
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage your privacy settings and data sharing preferences
                </p>
            </div>

            <div className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-foreground">Public Profile</h3>
                            <p className="text-sm text-muted-foreground">Allow others to see your profile information</p>
                        </div>
                        <button
                            onClick={() => handleToggle('profileVisibility')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.profileVisibility ? 'bg-primary' : 'bg-muted'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.profileVisibility ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-foreground">Searchable</h3>
                            <p className="text-sm text-muted-foreground">Allow people to find you by email or phone</p>
                        </div>
                        <button
                            onClick={() => handleToggle('searchable')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.searchable ? 'bg-primary' : 'bg-muted'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.searchable ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-foreground">Data Sharing</h3>
                            <p className="text-sm text-muted-foreground">Share anonymous usage data to help us improve</p>
                        </div>
                        <button
                            onClick={() => handleToggle('dataSharing')}
                            className={`w-12 h-6 rounded-full transition-colors relative ${settings.dataSharing ? 'bg-primary' : 'bg-muted'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${settings.dataSharing ? 'left-7' : 'left-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="pt-6 border-t border-border">
                    <div className="bg-muted/30 p-4 rounded-lg border border-border">
                        <div className="flex items-start gap-3">
                            <Icon name="Lock" size={20} color="var(--color-primary)" />
                            <div>
                                <h4 className="text-sm font-medium text-foreground">Change Password</h4>
                                <p className="text-xs text-muted-foreground mb-3">Update your password to keep your account secure.</p>
                                <button className="text-xs font-medium px-3 py-2 border border-border bg-card rounded hover:bg-muted transition-smooth">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacySettings;
