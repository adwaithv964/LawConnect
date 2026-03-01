import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import AdminRoute from './AdminRoute';

// Lazy-loaded pages
import GlobalDashboard from './dashboard/GlobalDashboard';
import UserDirectory from './users/UserDirectory';
import LawyerVerification from './users/LawyerVerification';
import ArticleManager from './content/ArticleManager';
import SOSDashboard from './emergency/SOSDashboard';
import EmergencyResources from './emergency/EmergencyResources';
import StorageQuotaManager from './privacy/StorageQuotaManager';
import AppSettingsPage from './settings/AppSettings';
import AuditLogs from './audit/AuditLogs';

const ROLE_LABELS = {
    super_admin: 'Super Admin',
    content_manager: 'Content Manager',
    support: 'User Support',
    emergency_dispatcher: 'Emergency Dispatcher',
    compliance_officer: 'Compliance Officer'
};

const ROLE_COLORS = {
    super_admin: '#7c6af7',
    content_manager: '#0ea5e9',
    support: '#22c55e',
    emergency_dispatcher: '#ef4444',
    compliance_officer: '#f59e0b'
};

function NavItem({ to, icon, label, allowed }) {
    if (!allowed) return null;
    return (
        <NavLink
            to={to}
            style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 16px', borderRadius: 10, textDecoration: 'none',
                color: isActive ? '#fff' : '#8892b0', fontSize: '0.88rem', fontWeight: 500,
                background: isActive ? 'rgba(124,106,247,0.18)' : 'transparent',
                borderLeft: isActive ? '3px solid #7c6af7' : '3px solid transparent',
                transition: 'all 0.2s', marginBottom: 2
            })}
        >
            <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>{icon}</span>
            {label}
        </NavLink>
    );
}

export default function AdminLayout() {
    const { adminUser, adminLogout, hasRole } = useAdminAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    function handleLogout() {
        adminLogout();
        navigate('/admin/login');
    }

    const roleColor = ROLE_COLORS[adminUser?.role] || '#7c6af7';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e', fontFamily: "'Inter', sans-serif", color: '#fff' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                .nav-hover:hover { background: rgba(124,106,247,0.1) !important; color: #c8d0e8 !important; }
                .admin-content { flex: 1; overflow-y: auto; }
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: transparent; }
                ::-webkit-scrollbar-thumb { background: rgba(124,106,247,0.3); border-radius: 3px; }
            `}</style>

            {/* Sidebar */}
            <aside style={{
                width: 248, background: 'rgba(255,255,255,0.03)', borderRight: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh',
                backdropFilter: 'blur(12px)', flexShrink: 0
            }}>
                {/* Brand */}
                <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, background: 'linear-gradient(135deg, #7c6af7, #5b4fe0)',
                            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(124,106,247,0.35)'
                        }}>
                            <span style={{ fontSize: 18 }}>⚖️</span>
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>LawConnect</div>
                            <div style={{ fontSize: '0.7rem', color: '#7c6af7', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Admin</div>
                        </div>
                    </div>
                </div>

                {/* Admin info */}
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)`,
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 700, fontSize: '0.85rem', color: '#fff', flexShrink: 0
                        }}>
                            {adminUser?.name?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminUser?.name}</div>
                            <div style={{ fontSize: '0.7rem', color: roleColor, fontWeight: 500 }}>{ROLE_LABELS[adminUser?.role] || adminUser?.role}</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
                    <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>Overview</div>
                    <NavItem to="/admin/dashboard" icon="📊" label="Global Dashboard" allowed={true} />
                    <NavItem to="/admin/audit" icon="📋" label="Audit Logs" allowed={hasRole('compliance_officer', 'super_admin')} />

                    <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '16px 8px 8px' }}>User Management</div>
                    <NavItem to="/admin/users" icon="👥" label="User Directory" allowed={hasRole('support')} />
                    <NavItem to="/admin/lawyers" icon="⚖️" label="Lawyer Verification" allowed={hasRole('support')} />

                    <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '16px 8px 8px' }}>Content</div>
                    <NavItem to="/admin/articles" icon="📝" label="Article Manager" allowed={hasRole('content_manager')} />

                    <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '16px 8px 8px' }}>Emergency</div>
                    <NavItem to="/admin/emergency" icon="🚨" label="SOS Dashboard" allowed={hasRole('emergency_dispatcher')} />
                    <NavItem to="/admin/emergency-resources" icon="📞" label="Emergency Resources" allowed={hasRole('emergency_dispatcher')} />

                    <div style={{ fontSize: '0.65rem', color: '#4a5568', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '16px 8px 8px' }}>Privacy & Settings</div>
                    <NavItem to="/admin/storage" icon="💾" label="Storage Quotas" allowed={hasRole('compliance_officer')} />
                    <NavItem to="/admin/settings" icon="⚙️" label="App Settings" allowed={hasRole('super_admin')} />
                </nav>

                {/* Logout */}
                <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <button
                        onClick={handleLogout}
                        className="nav-hover"
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                            padding: '10px 16px', background: 'transparent', border: 'none',
                            borderRadius: 10, color: '#ef4444', cursor: 'pointer',
                            fontSize: '0.85rem', fontWeight: 500, transition: 'all 0.2s'
                        }}
                    >
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="admin-content">
                <Routes>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<GlobalDashboard />} />
                    <Route path="users" element={<AdminRoute requiredRole="support"><UserDirectory /></AdminRoute>} />
                    <Route path="lawyers" element={<AdminRoute requiredRole="support"><LawyerVerification /></AdminRoute>} />
                    <Route path="articles" element={<AdminRoute requiredRole="content_manager"><ArticleManager /></AdminRoute>} />
                    <Route path="emergency" element={<AdminRoute requiredRole="emergency_dispatcher"><SOSDashboard /></AdminRoute>} />
                    <Route path="emergency-resources" element={<AdminRoute requiredRole="emergency_dispatcher"><EmergencyResources /></AdminRoute>} />
                    <Route path="storage" element={<AdminRoute requiredRole="compliance_officer"><StorageQuotaManager /></AdminRoute>} />
                    <Route path="settings" element={<AdminRoute requiredRole="super_admin"><AppSettingsPage /></AdminRoute>} />
                    <Route path="audit" element={<AdminRoute requiredRole="compliance_officer"><AuditLogs /></AdminRoute>} />
                </Routes>
            </main>
        </div>
    );
}
