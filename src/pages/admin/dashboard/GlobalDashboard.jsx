import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../AdminAuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function StatCard({ icon, label, value, color, sub }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}33`,
            borderRadius: 16, padding: '20px 24px', position: 'relative', overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute', top: 0, right: 0, width: 80, height: 80,
                background: `radial-gradient(circle, ${color}22 0%, transparent 70%)`,
                borderRadius: '50%', transform: 'translate(20px, -20px)'
            }} />
            <div style={{ fontSize: '1.6rem', marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{value}</div>
            <div style={{ fontSize: '0.82rem', color: '#8892b0', marginTop: 4 }}>{label}</div>
            {sub && <div style={{ fontSize: '0.75rem', color: color, marginTop: 6, fontWeight: 500 }}>{sub}</div>}
        </div>
    );
}

const ACTION_LABELS = {
    ADMIN_LOGIN: '🔐 Admin Login',
    USER_SUSPENDED: '🚫 User Suspended',
    USER_ACTIVATED: '✅ User Activated',
    USER_BANNED: '⛔ User Banned',
    LAWYER_VERIFIED: '✅ Lawyer Verified',
    LAWYER_REJECTED: '❌ Lawyer Rejected',
    CREATE_ARTICLE: '📝 Article Created',
    UPDATE_ARTICLE: '✏️ Article Updated',
    DELETE_ARTICLE: '🗑️ Article Deleted',
    SOS_ACKNOWLEDGED: '🚨 SOS Acknowledged',
    SOS_RESOLVED: '✅ SOS Resolved',
    UPDATE_SETTINGS: '⚙️ Settings Updated',
    CREATE_ADMIN: '👤 Admin Created',
};

export default function GlobalDashboard() {
    const { adminToken } = useAdminAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    async function fetchStats() {
        try {
            const res = await fetch(`${API}/admin/stats`, {
                headers: { 'x-admin-token': adminToken }
            });
            const data = await res.json();
            setStats(data);
        } catch (err) {
            setError('Failed to load stats');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <PageLoader />;

    return (
        <div style={{ padding: '32px 36px', maxWidth: 1400, minHeight: '100vh' }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .dash-grid { animation: fadeIn 0.4s ease; }
                .log-row:hover { background: rgba(124,106,247,0.08) !important; }
            `}</style>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#fff', margin: 0 }}>Global Dashboard</h1>
                <p style={{ color: '#8892b0', margin: '6px 0 0', fontSize: '0.9rem' }}>Real-time overview of LawConnect platform activity</p>
            </div>

            {error && <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 10, padding: 12, marginBottom: 24, color: '#ff6b6b', fontSize: '0.85rem' }}>⚠️ {error}</div>}

            {/* Stats Grid */}
            <div className="dash-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
                <StatCard icon="👥" label="Total Users" value={stats?.totalUsers?.toLocaleString() || 0} color="#7c6af7" sub={`+${stats?.newUsersThisWeek || 0} this week`} />
                <StatCard icon="📝" label="Articles" value={stats?.totalArticles?.toLocaleString() || 0} color="#0ea5e9" />
                <StatCard icon="⚖️" label="Lawyers" value={stats?.totalLawyers?.toLocaleString() || 0} color="#22c55e" sub={`${stats?.pendingLawyers || 0} pending verification`} />
                <StatCard icon="📁" label="Active Cases" value={stats?.totalCases?.toLocaleString() || 0} color="#f59e0b" />
                <StatCard icon="📄" label="Documents" value={stats?.totalDocuments?.toLocaleString() || 0} color="#8b5cf6" />
                <StatCard icon="🚨" label="Active SOS" value={stats?.activeSOSCount || 0} color="#ef4444" sub={stats?.activeSOSCount > 0 ? '⚡ Needs attention!' : '✅ All clear'} />
            </div>

            {/* Recent Activity */}
            <div style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16, overflow: 'hidden'
            }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#fff' }}>Recent Admin Activity</h2>
                    <span style={{ fontSize: '0.75rem', color: '#4a5568', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 20 }}>Auto-refreshes every 30s</span>
                </div>
                <div>
                    {stats?.recentLogs?.length === 0 && (
                        <div style={{ padding: '32px', textAlign: 'center', color: '#4a5568', fontSize: '0.9rem' }}>No activity yet</div>
                    )}
                    {stats?.recentLogs?.map((log, i) => (
                        <div key={i} className="log-row" style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                            transition: 'background 0.15s'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: '0.85rem', color: '#c8d0e8', fontWeight: 500 }}>
                                    {ACTION_LABELS[log.action] || log.action}
                                </span>
                                {log.target && <span style={{ fontSize: '0.75rem', color: '#4a5568', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 10 }}>{log.target}</span>}
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <div style={{ fontSize: '0.75rem', color: '#7c6af7', fontWeight: 500 }}>{log.adminEmail}</div>
                                <div style={{ fontSize: '0.7rem', color: '#4a5568' }}>{new Date(log.createdAt).toLocaleString('en-IN')}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PageLoader() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#7c6af7' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 40, height: 40, border: '3px solid #7c6af7', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                Loading dashboard…
            </div>
        </div>
    );
}
