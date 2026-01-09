import React from 'react';
import Icon from "../../../components/AppIcon";

const HelpSupportSettings = () => {
    return (
        <div className="bg-card rounded-xl border border-border shadow-elevation-1 overflow-hidden">
            <div className="p-6 border-b border-border">
                <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
                    <Icon name="HelpCircle" size={24} color="var(--color-primary)" />
                    Help & Support
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Get help with the application and find answers to common questions
                </p>
            </div>

            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-smooth">
                                <Icon name="BookOpen" size={20} color="var(--color-primary)" />
                            </div>
                            <h3 className="font-medium text-foreground">FAQs</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Find answers to frequently asked questions about LawConnect.</p>
                    </div>

                    <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-smooth">
                                <Icon name="MessageCircle" size={20} color="var(--color-success)" />
                            </div>
                            <h3 className="font-medium text-foreground">Contact Support</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Chat with our support team for personalized assistance.</p>
                    </div>

                    <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-smooth">
                                <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
                            </div>
                            <h3 className="font-medium text-foreground">Report a Bug</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Found an issue? Let us know so we can fix it.</p>
                    </div>

                    <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth cursor-pointer group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-secondary/10 rounded-lg group-hover:bg-secondary/20 transition-smooth">
                                <Icon name="FileText" size={20} color="var(--color-secondary)" />
                            </div>
                            <h3 className="font-medium text-foreground">Terms & Privacy</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Read our terms of service and privacy policy.</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-border text-center">
                    <p className="text-xs text-muted-foreground">LawConnect Version 1.0.0</p>
                    <p className="text-xs text-muted-foreground">© 2026 LawConnect Inc. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default HelpSupportSettings;
