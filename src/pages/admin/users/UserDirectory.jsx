import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../AdminAuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const STATUS_STYLES = {
    active: { bg: '#22c55e22', color: '#22c55e', label: 'Active' },
    suspended: { bg: '#f59e0b22', color: '#f59e0b', label: 'Suspended' },
    banned: { bg: '#ef444422', color: '#ef4444', label: 'Banned' }
};

export default function UserDirectory() {
    const { adminToken } = useAdminAuth();
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => { fetchUsers(); }, [page, search]);

    async function fetchUsers() {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 20, search });
            const res = await fetch(`${API}/admin/users?${params}`, { headers: { 'x-admin-token': adminToken } });
            const data = await res.json();
            setUsers(data.users || []);
            setTotal(data.total || 0);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }

    async function updateStatus(userId, status) {
        setActionLoading(userId);
        try {
            const res = await fetch(`${API}/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                showToast(`User ${status} successfully`, '#22c55e');
                fetchUsers();
            }
        } catch (err) { showToast('Action failed', '#ef4444'); }
        finally { setActionLoading(null); }
    }

    function showToast(msg, color) {
        setToast({ msg, color });
        setTimeout(() => setToast(null), 3000);
    }

    const totalPages = Math.ceil(total / 20);

    return (
        <div style={{ padding: '32px 36px' }}>
            <style>{`
                .user-row:hover { background: rgba(124,106,247,0.06) !important; }
                .action-btn:hover { opacity: 0.8; transform: scale(0.97); }
                .search-inp:focus { border-color: #7c6af7 !important; outline: none; box-shadow: 0 0 0 3px rgba(124,106,247,0.15); }
            `}</style>

            {toast && (
                <div style={{
                    position: 'fixed', top: 24, right: 24, padding: '12px 20px',
                    background: toast.color, borderRadius: 10, color: '#fff',
                    fontWeight: 600, fontSize: '0.85rem', zIndex: 9999,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)', animation: 'fadeIn 0.3s ease'
                }}>{toast.msg}</div>
            )}

            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: 0 }}>User Directory</h1>
                <p style={{ color: '#8892b0', margin: '4px 0 0', fontSize: '0.85rem' }}>{total.toLocaleString()} total registered users</p>
            </div>

            {/* Search */}
            <div style={{ marginBottom: 20, display: 'flex', gap: 12 }}>
                <input
                    className="search-inp"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="🔍  Search by name or email…"
                    style={{
                        flex: 1, padding: '10px 16px', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
                        color: '#fff', fontSize: '0.88rem', transition: 'all 0.2s'
                    }}
                />
            </div>

            {/* Table */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            {['User', 'Email', 'Joined', 'Status', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#4a5568', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#4a5568' }}>Loading users…</td></tr>
                        ) : users.map(user => {
                            const st = STATUS_STYLES[user.status || 'active'];
                            return (
                                <tr key={user._id} className="user-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}>
                                    <td style={{ padding: '12px 20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #7c6af7, #5b4fe0)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>
                                                {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                            </div>
                                            <span style={{ color: '#c8d0e8', fontWeight: 500 }}>{user.displayName || 'No name'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 20px', color: '#8892b0' }}>{user.email}</td>
                                    <td style={{ padding: '12px 20px', color: '#8892b0' }}>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                                    <td style={{ padding: '12px 20px' }}>
                                        <span style={{ background: st.bg, color: st.color, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>{st.label}</span>
                                    </td>
                                    <td style={{ padding: '12px 20px' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {(user.status || 'active') !== 'suspended' && (
                                                <button className="action-btn" onClick={() => updateStatus(user._id, 'suspended')} disabled={actionLoading === user._id}
                                                    style={{ padding: '4px 10px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, transition: 'all 0.15s' }}>
                                                    Suspend
                                                </button>
                                            )}
                                            {(user.status || 'active') === 'suspended' && (
                                                <button className="action-btn" onClick={() => updateStatus(user._id, 'active')} disabled={actionLoading === user._id}
                                                    style={{ padding: '4px 10px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, transition: 'all 0.15s' }}>
                                                    Activate
                                                </button>
                                            )}
                                            {(user.status || 'active') !== 'banned' && (
                                                <button className="action-btn" onClick={() => updateStatus(user._id, 'banned')} disabled={actionLoading === user._id}
                                                    style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, transition: 'all 0.15s' }}>
                                                    Ban
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#c8d0e8', cursor: 'pointer', fontSize: '0.82rem' }}>← Prev</button>
                    <span style={{ padding: '6px 14px', color: '#8892b0', fontSize: '0.82rem' }}>Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#c8d0e8', cursor: 'pointer', fontSize: '0.82rem' }}>Next →</button>
                </div>
            )}
        </div>
    );
}
