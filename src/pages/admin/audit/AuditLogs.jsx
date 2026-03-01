import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../AdminAuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ACTION_LABELS = {
    ADMIN_LOGIN: '🔐 Login',
    USER_SUSPENDED: '🚫 Suspend User',
    USER_ACTIVATED: '✅ Activate User',
    USER_BANNED: '⛔ Ban User',
    LAWYER_VERIFIED: '✅ Verify Lawyer',
    LAWYER_REJECTED: '❌ Reject Lawyer',
    CREATE_ARTICLE: '📝 Create Article',
    UPDATE_ARTICLE: '✏️ Update Article',
    DELETE_ARTICLE: '🗑️ Delete Article',
    SOS_ACKNOWLEDGED: '🚨 SOS Ack.',
    SOS_RESOLVED: '✅ SOS Resolved',
    UPDATE_SETTINGS: '⚙️ Update Settings',
    CREATE_ADMIN: '👤 Create Admin',
    UPDATE_ADMIN: '✏️ Update Admin',
};

const ACTION_COLORS = {
    ADMIN_LOGIN: '#7c6af7',
    USER_SUSPENDED: '#f59e0b',
    USER_ACTIVATED: '#22c55e',
    USER_BANNED: '#ef4444',
    LAWYER_VERIFIED: '#22c55e',
    LAWYER_REJECTED: '#ef4444',
    CREATE_ARTICLE: '#0ea5e9',
    UPDATE_ARTICLE: '#0ea5e9',
    DELETE_ARTICLE: '#ef4444',
    SOS_ACKNOWLEDGED: '#f59e0b',
    SOS_RESOLVED: '#22c55e',
    UPDATE_SETTINGS: '#8b5cf6',
    CREATE_ADMIN: '#7c6af7',
};

export default function AuditLogs() {
    const { adminToken } = useAdminAuth();
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchLogs(); }, [page, search, actionFilter]);

    async function fetchLogs() {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 50 });
            if (search) params.set('adminEmail', search);
            if (actionFilter) params.set('action', actionFilter);
            const res = await fetch(`${API}/admin/audit?${params}`, { headers: { 'x-admin-token': adminToken } });
            const data = await res.json();
            setLogs(data.logs || []);
            setTotal(data.total || 0);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }

    const totalPages = Math.ceil(total / 50);

    return (
        <div style={{ padding: '32px 36px' }}>
            <style>{`.log-row:hover{background:rgba(124,106,247,0.06)!important}.search-inp:focus{border-color:#7c6af7!important;outline:none;}`}</style>

            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: 0 }}>Audit Logs</h1>
                <p style={{ color: '#8892b0', margin: '4px 0 0', fontSize: '0.85rem' }}>{total.toLocaleString()} total audit entries · All admin actions are permanently recorded</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input className="search-inp" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="🔍  Filter by admin email…"
                    style={{ flex: 1, padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: '0.88rem', transition: 'all 0.2s' }} />
                <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1); }}
                    style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#c8d0e8', fontSize: '0.85rem' }}>
                    <option value="">All Actions</option>
                    {Object.entries(ACTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
            </div>

            {/* Logs table */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            {['Timestamp', 'Admin', 'Role', 'Action', 'Target', 'Details'].map(h => (
                                <th key={h} style={{ padding: '13px 18px', textAlign: 'left', color: '#4a5568', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#4a5568' }}>Loading audit logs…</td></tr>
                            : logs.length === 0 ? <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#4a5568' }}>No logs found</td></tr>
                                : logs.map(log => {
                                    const color = ACTION_COLORS[log.action] || '#8892b0';
                                    return (
                                        <tr key={log._id} className="log-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}>
                                            <td style={{ padding: '10px 18px', color: '#4a5568', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>{new Date(log.createdAt).toLocaleString('en-IN')}</td>
                                            <td style={{ padding: '10px 18px', color: '#c8d0e8', fontSize: '0.82rem' }}>{log.adminEmail}</td>
                                            <td style={{ padding: '10px 18px' }}>
                                                <span style={{ background: 'rgba(255,255,255,0.05)', color: '#8892b0', padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', textTransform: 'capitalize' }}>
                                                    {log.role?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 18px' }}>
                                                <span style={{ background: `${color}18`, color, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                                                    {ACTION_LABELS[log.action] || log.action}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 18px', color: '#8892b0', fontSize: '0.78rem', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.target || '—'}</td>
                                            <td style={{ padding: '10px 18px', color: '#4a5568', fontSize: '0.75rem', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {log.details ? JSON.stringify(log.details).substring(0, 50) : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#c8d0e8', cursor: 'pointer', fontSize: '0.82rem' }}>← Prev</button>
                    <span style={{ padding: '6px 14px', color: '#8892b0', fontSize: '0.82rem' }}>Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#c8d0e8', cursor: 'pointer', fontSize: '0.82rem' }}>Next →</button>
                </div>
            )}
        </div>
    );
}
