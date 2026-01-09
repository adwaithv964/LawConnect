import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import ProfileSettings from './components/ProfileSettings';
import NotificationSettings from './components/NotificationSettings';
import PrivacySettings from './components/PrivacySettings';
import HelpSupportSettings from './components/HelpSupportSettings';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../../components/AppIcon';

const SettingsPage = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const menuItems = [
        { id: 'profile', label: 'Profile', icon: 'User' },
        { id: 'notifications', label: 'Notifications', icon: 'Bell' },
        { id: 'privacy', label: 'Privacy', icon: 'Shield' },
        { id: 'help', label: 'Help & Support', icon: 'HelpCircle' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings />;
            case 'notifications':
                return <NotificationSettings />;
            case 'privacy':
                return <PrivacySettings />;
            case 'help':
                return <HelpSupportSettings />;
            default:
                return <ProfileSettings />;
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <EmergencyAlertBanner />

            <main className="pt-24 lg:pt-28 pb-12 px-4 lg:px-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                        Settings & Preferences
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your account settings, profile information, and app preferences.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar / Navigation for Settings */}
                    <div className="hidden lg:block space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 font-medium rounded-lg transition-smooth ${activeTab === item.id
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-foreground hover:bg-muted'
                                    }`}
                            >
                                <Icon name={item.icon} size={20} />
                                {item.label}
                            </button>
                        ))}

                        <div className="pt-4 mt-4 border-t border-border">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-smooth"
                            >
                                <Icon name="LogOut" size={20} />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Mobile Tabs */}
                    <div className="lg:hidden space-y-4">
                        <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-smooth ${activeTab === item.id
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-card text-muted-foreground border-border'
                                        }`}
                                >
                                    <Icon name={item.icon} size={16} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-destructive font-medium border border-destructive/20 rounded-lg hover:bg-destructive/10 transition-smooth"
                        >
                            <Icon name="LogOut" size={18} />
                            Sign Out
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-6">
                        {renderContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
