import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../AdminAuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function LawyerVerification() {
    const { adminToken } = useAdminAuth();
    const [lawyers, setLawyers] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [toast, setToast] = useState(null);
    const [rejectModal, setRejectModal] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => { fetchLawyers(); }, [page, search, filter]);

    async function fetchLawyers() {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 20, search });
            if (filter !== 'all') params.set('verified', filter === 'verified' ? 'true' : 'false');
            const res = await fetch(`${API}/admin/lawyers?${params}`, { headers: { 'x-admin-token': adminToken } });
            const data = await res.json();
            setLawyers(data.lawyers || []);
            setTotal(data.total || 0);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }

    async function updateVerification(lawyerId, verified, reason) {
        setActionLoading(lawyerId);
        try {
            const res = await fetch(`${API}/admin/lawyers/${lawyerId}/verify`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
                body: JSON.stringify({ verified, rejectionReason: reason })
            });
            if (res.ok) {
                showToast(verified ? '✅ Lawyer verified!' : '❌ Lawyer rejected', verified ? '#22c55e' : '#ef4444');
                fetchLawyers();
                setRejectModal(null);
                setRejectReason('');
            }
        } catch (err) { showToast('Action failed', '#ef4444'); }
        finally { setActionLoading(null); }
    }

    function showToast(msg, color) { setToast({ msg, color }); setTimeout(() => setToast(null), 3000); }

    const totalPages = Math.ceil(total / 20);

    return (
        <div style={{ padding: '32px 36px' }}>
            <style>{`.lv-row:hover { background: rgba(124,106,247,0.05) !important; } .search-inp:focus { border-color: #7c6af7 !important; outline: none; box-shadow: 0 0 0 3px rgba(124,106,247,0.15); }`}</style>

            {toast && (
                <div style={{ position: 'fixed', top: 24, right: 24, padding: '12px 20px', background: toast.color, borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: '0.85rem', zIndex: 9999 }}>{toast.msg}</div>
            )}

            {/* Reject Modal */}
            {rejectModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998 }}>
                    <div style={{ background: '#141b2d', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 28, width: 400 }}>
                        <h3 style={{ color: '#fff', margin: '0 0 16px', fontSize: '1rem' }}>Rejection Reason</h3>
                        <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Explain why this lawyer profile is being rejected…"
                            style={{ width: '100%', padding: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', fontSize: '0.85rem', resize: 'vertical', minHeight: 80, boxSizing: 'border-box' }} />
                        <div style={{ display: 'flex', gap: 10, marginTop: 16, justifyContent: 'flex-end' }}>
                            <button onClick={() => { setRejectModal(null); setRejectReason(''); }} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#8892b0', cursor: 'pointer', fontSize: '0.82rem' }}>Cancel</button>
                            <button onClick={() => updateVerification(rejectModal, false, rejectReason)} style={{ padding: '8px 16px', background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Confirm Reject</button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: 0 }}>Lawyer Verification</h1>
                <p style={{ color: '#8892b0', margin: '4px 0 0', fontSize: '0.85rem' }}>{total.toLocaleString()} lawyers in directory</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <input className="search-inp" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="🔍  Search lawyer name, location, or practice area…"
                    style={{ flex: 1, padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: '0.88rem', transition: 'all 0.2s' }} />
                {['all', 'verified', 'unverified'].map(f => (
                    <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                        style={{ padding: '10px 16px', background: filter === f ? 'rgba(124,106,247,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${filter === f ? '#7c6af7' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, color: filter === f ? '#7c6af7' : '#8892b0', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, textTransform: 'capitalize' }}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            {['Name', 'Location', 'Practice Areas', 'Experience', 'Status', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#4a5568', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#4a5568' }}>Loading lawyers…</td></tr>
                            : lawyers.map(lawyer => (
                                <tr key={lawyer._id} className="lv-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}>
                                    <td style={{ padding: '12px 20px', color: '#c8d0e8', fontWeight: 500 }}>{lawyer.Name}</td>
                                    <td style={{ padding: '12px 20px', color: '#8892b0', fontSize: '0.8rem' }}>{lawyer.Location || '—'}</td>
                                    <td style={{ padding: '12px 20px', color: '#8892b0', fontSize: '0.8rem', maxWidth: 180 }}>
                                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lawyer['Practice Areas'] || '—'}</div>
                                    </td>
                                    <td style={{ padding: '12px 20px', color: '#8892b0', fontSize: '0.8rem' }}>{lawyer.Experience || '—'}</td>
                                    <td style={{ padding: '12px 20px' }}>
                                        <span style={{ background: lawyer.verified ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)', color: lawyer.verified ? '#22c55e' : '#f59e0b', padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>
                                            {lawyer.verified ? '✅ Verified' : '⏳ Pending'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 20px' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {!lawyer.verified && (
                                                <button onClick={() => updateVerification(lawyer._id, true, '')} disabled={actionLoading === lawyer._id}
                                                    style={{ padding: '4px 10px', background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>
                                                    Verify
                                                </button>
                                            )}
                                            <button onClick={() => setRejectModal(lawyer._id)} disabled={actionLoading === lawyer._id}
                                                style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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
