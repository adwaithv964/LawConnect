import React, { useState, useEffect } from 'react';
import Icon from "../../../components/AppIcon";

const ProfileSettings = () => {
    const [formData, setFormData] = useState({
        userName: '',
        userPhone: '',
        userEmail: '',
        userLocation: ''
    });
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        // Load data from localStorage
        const savedName = localStorage.getItem('userName') || 'Rajesh Kumar';
        const savedPhone = localStorage.getItem('userPhone') || '+91 98765 43210';
        const savedEmail = localStorage.getItem('userEmail') || 'rajesh.kumar@example.com';
        const savedLocation = localStorage.getItem('userLocation') || 'Bangalore, Karnataka';

        setFormData({
            userName: savedName,
            userPhone: savedPhone,
            userEmail: savedEmail,
            userLocation: savedLocation
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setIsSaved(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save to localStorage
        localStorage.setItem('userName', formData.userName);
        localStorage.setItem('userPhone', formData.userPhone);
        localStorage.setItem('userEmail', formData.userEmail);
        localStorage.setItem('userLocation', formData.userLocation);

        setIsSaved(true);

        // Optional: Dispatch a custom event if other components listen for it
        window.dispatchEvent(new Event('user-profile-updated'));

        setTimeout(() => {
            setIsSaved(false);
        }, 3000);
    };

    return (
        <div className="bg-card rounded-xl border border-border shadow-elevation-1 overflow-hidden">
            <div className="p-6 border-b border-border">
                <h2 className="text-xl font-heading font-semibold text-foreground flex items-center gap-2">
                    <Icon name="User" size={24} color="var(--color-primary)" />
                    Profile Information
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Update your personal details and contact information
                </p>
            </div>

            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="userName" className="text-sm font-medium text-foreground">
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 pl-10 bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                                    placeholder="Enter your full name"
                                />
                                <div className="absolute left-3 top-2.5 text-muted-foreground">
                                    <Icon name="User" size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="userPhone" className="text-sm font-medium text-foreground">
                                Phone Number
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    id="userPhone"
                                    name="userPhone"
                                    value={formData.userPhone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 pl-10 bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                                    placeholder="Enter your phone number"
                                />
                                <div className="absolute left-3 top-2.5 text-muted-foreground">
                                    <Icon name="Phone" size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="userEmail" className="text-sm font-medium text-foreground">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="userEmail"
                                    name="userEmail"
                                    value={formData.userEmail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 pl-10 bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                                    placeholder="Enter your email"
                                />
                                <div className="absolute left-3 top-2.5 text-muted-foreground">
                                    <Icon name="Mail" size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="userLocation" className="text-sm font-medium text-foreground">
                                Location
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="userLocation"
                                    name="userLocation"
                                    value={formData.userLocation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 pl-10 bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                                    placeholder="City, State"
                                />
                                <div className="absolute left-3 top-2.5 text-muted-foreground">
                                    <Icon name="MapPin" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end pt-4 border-t border-border">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-smooth shadow-elevation-1 flex items-center gap-2"
                        >
                            {isSaved ? (
                                <>
                                    <Icon name="Check" size={18} />
                                    Saved
                                </>
                            ) : (
                                <>
                                    <Icon name="Save" size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
