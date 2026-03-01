import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

export default function AdminRoute({ children, requiredRole }) {
    const { adminUser, loading } = useAdminAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100vh', background: '#0a0f1e', color: '#7c6af7',
                fontFamily: 'Inter, sans-serif', fontSize: '1.1rem'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 48, height: 48, border: '3px solid #7c6af7',
                        borderTopColor: 'transparent', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    Verifying admin session…
                </div>
            </div>
        );
    }

    if (!adminUser) return <Navigate to="/admin/login" replace />;

    if (requiredRole && adminUser.role !== 'super_admin' && adminUser.role !== requiredRole) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100vh', background: '#0a0f1e', color: '#ff6b6b',
                fontFamily: 'Inter, sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>🚫</div>
                    <h2>Access Denied</h2>
                    <p style={{ color: '#888' }}>You don't have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return children;
}
