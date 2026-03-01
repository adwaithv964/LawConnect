import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../AdminAuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function StorageQuotaManager() {
    const { adminToken } = useAdminAuth();
    const [storageData, setStorageData] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchStorage(); }, [page]);

    async function fetchStorage() {
        setLoading(true);
        try {
            const res = await fetch(`${API}/admin/storage?page=${page}&limit=20`, { headers: { 'x-admin-token': adminToken } });
            const data = await res.json();
            setStorageData(data.storageData || []);
            setTotal(data.total || 0);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }

    const totalPages = Math.ceil(total / 20);
    const maxFiles = Math.max(...(storageData.map(u => u.totalFileCount || 0)), 1);

    return (
        <div style={{ padding: '32px 36px' }}>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: 0 }}>Storage Quota Manager</h1>
                <p style={{ color: '#8892b0', margin: '4px 0 0', fontSize: '0.85rem' }}>{total} users · File counts only — file names and content are never accessible</p>
            </div>

            {/* Privacy notice */}
            <div style={{ background: 'rgba(124,106,247,0.08)', border: '1px solid rgba(124,106,247,0.2)', borderRadius: 12, padding: '12px 18px', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🔒</span>
                <div>
                    <div style={{ color: '#7c6af7', fontWeight: 600, fontSize: '0.85rem', marginBottom: 3 }}>Privacy-Protected View</div>
                    <div style={{ color: '#8892b0', fontSize: '0.78rem' }}>
                        In compliance with attorney-client privilege, admins can only see document/evidence <strong>counts</strong> per user — never file names, content, or metadata.
                        Any access override requires explicit user consent and is logged.
                    </div>
                </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            {['User', 'Email', 'Documents', 'Evidence Files', 'Cases', 'Total Files', 'Usage'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#4a5568', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#4a5568' }}>Loading storage data…</td></tr>
                            : storageData.map(user => {
                                const pct = Math.round((user.totalFileCount / maxFiles) * 100);
                                const barColor = pct > 80 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#22c55e';
                                return (
                                    <tr key={user.userId} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                        <td style={{ padding: '12px 20px' }}>
                                            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #7c6af7, #5b4fe0)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.78rem', fontWeight: 700 }}>
                                                {(user.displayName || user.email || 'U')[0].toUpperCase()}
                                            </div>
                                        </td>
                                        <td style={{ padding: '12px 20px', color: '#8892b0', fontSize: '0.8rem' }}>{user.email}</td>
                                        <td style={{ padding: '12px 20px', color: '#c8d0e8', textAlign: 'center', fontWeight: 600 }}>{user.documentCount}</td>
                                        <td style={{ padding: '12px 20px', color: '#c8d0e8', textAlign: 'center', fontWeight: 600 }}>{user.evidenceCount}</td>
                                        <td style={{ padding: '12px 20px', color: '#c8d0e8', textAlign: 'center', fontWeight: 600 }}>{user.caseCount}</td>
                                        <td style={{ padding: '12px 20px', color: '#fff', textAlign: 'center', fontWeight: 700 }}>{user.totalFileCount}</td>
                                        <td style={{ padding: '12px 20px', minWidth: 100 }}>
                                            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
                                                <div style={{ width: `${pct}%`, height: '100%', background: barColor, borderRadius: 4, transition: 'width 0.3s' }} />
                                            </div>
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
