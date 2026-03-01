import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAppSettings } from '../context/AppSettingsContext';
import MaintenancePage from '../pages/maintenance/MaintenancePage';

export default function PrivateRoute({ children }) {
    const { currentUser } = useAuth();
    const { maintenanceMode, maintenanceMessage, loading } = useAppSettings();

    if (!currentUser) return <Navigate to="/login" />;

    // Show maintenance page to authenticated users too
    if (!loading && maintenanceMode) {
        return <MaintenancePage message={maintenanceMessage} />;
    }

    return children;
}

