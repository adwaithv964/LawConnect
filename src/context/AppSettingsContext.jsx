import React, { createContext, useContext, useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AppSettingsContext = createContext({
    maintenanceMode: false,
    maintenanceMessage: 'The system is under maintenance. Please try again later.',
    registrationEnabled: true,
    aiEnabled: true,
    loading: true,
    refresh: () => { }
});

export function AppSettingsProvider({ children }) {
    const [settings, setSettings] = useState({
        maintenanceMode: false,
        maintenanceMessage: 'The system is under maintenance. Please try again later.',
        registrationEnabled: true,
        aiEnabled: true,
    });
    const [loading, setLoading] = useState(true);

    async function fetchSettings() {
        try {
            const res = await fetch(`${API}/admin/public-settings`);
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch {
            // Fail open — default settings stay 
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSettings();
        // Re-check every 60 seconds in case admin changes settings live
        const interval = setInterval(fetchSettings, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <AppSettingsContext.Provider value={{ ...settings, loading, refresh: fetchSettings }}>
            {children}
        </AppSettingsContext.Provider>
    );
}

export function useAppSettings() {
    return useContext(AppSettingsContext);
}
