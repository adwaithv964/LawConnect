import React, { useEffect, useState, useRef } from 'react';
import { useAdminAuth } from '../AdminAuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const STATUS_CONFIG = {
    pending: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', label: '🚨 PENDING', pulse: true },
    acknowledged: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: '👁️ Acknowledged', pulse: false },
    resolved: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)', label: '✅ Resolved', pulse: false }
};

export default function SOSDashboard() {
    const { adminToken } = useAdminAuth();
    const [alerts, setAlerts] = useState([]);
    const [total, setTotal] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [filter, setFilter] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [toast, setToast] = useState(null);
    const prevPendingRef = useRef(0);
    const audioContextRef = useRef(null);

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [filter]);

    function playAlertSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const gain = ctx.createGain();
            oscillator.connect(gain);
            gain.connect(ctx.destination);
            oscillator.frequency.setValueAtTime(880, ctx.currentTime);
            oscillator.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.4);
        } catch (e) { /* audio not supported */ }
    }

    async function fetchAlerts() {
        try {
            const params = new URLSearchParams({ status: filter, limit: 50 });
            const res = await fetch(`${API}/admin/emergency?${params}`, { headers: { 'x-admin-token': adminToken } });
            const data = await res.json();
            setAlerts(data.alerts || []);
            setTotal(data.total || 0);
            const pc = data.pendingCount || 0;
            if (pc > prevPendingRef.current && prevPendingRef.current >= 0) playAlertSound();
            prevPendingRef.current = pc;
            setPendingCount(pc);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }

    async function updateStatus(id, status) {
        setActionLoading(id);
        try {
            const res = await fetch(`${API}/admin/emergency/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
                body: JSON.stringify({ status })
            });
            if (res.ok) { showToast(`Alert ${status}`, status === 'resolved' ? '#22c55e' : '#f59e0b'); fetchAlerts(); }
        } catch (err) { showToast('Action failed', '#ef4444'); }
        finally { setActionLoading(null); }
    }

    function showToast(msg, color) { setToast({ msg, color }); setTimeout(() => setToast(null), 3000); }

    return (
        <div style={{ padding: '32px 36px' }}>
            <style>{`
                @keyframes sosFlash { 0%,100%{box-shadow:0 0 0 rgba(239,68,68,0)} 50%{box-shadow:0 0 24px rgba(239,68,68,0.6)} }
                @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
                .sos-pending { animation: sosFlash 1.5s ease-in-out infinite; }
                .sos-badge { animation: pulse 1.2s ease-in-out infinite; }
            `}</style>

            {toast && <div style={{ position: 'fixed', top: 24, right: 24, padding: '12px 20px', background: toast.color, borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: '0.85rem', zIndex: 9999 }}>{toast.msg}</div>}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: 0 }}>🚨 SOS Dashboard</h1>
                        {pendingCount > 0 && (
                            <span className="sos-badge" style={{ background: '#ef4444', color: '#fff', padding: '3px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>
                                {pendingCount} PENDING
                            </span>
                        )}
                    </div>
                    <p style={{ color: '#8892b0', margin: '4px 0 0', fontSize: '0.85rem' }}>Real-time emergency alerts · Auto-refreshes every 10 seconds</p>
                </div>
                <button onClick={fetchAlerts} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#8892b0', cursor: 'pointer', fontSize: '0.82rem' }}>
                    🔄 Refresh
                </button>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {['pending', 'acknowledged', 'resolved', 'all'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        style={{ padding: '8px 16px', background: filter === f ? (f === 'pending' ? 'rgba(239,68,68,0.2)' : 'rgba(124,106,247,0.2)') : 'rgba(255,255,255,0.04)', border: `1px solid ${filter === f ? (f === 'pending' ? '#ef4444' : '#7c6af7') : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, color: filter === f ? '#fff' : '#8892b0', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, textTransform: 'capitalize' }}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Alerts grid */}
            {loading ? (
                <div style={{ textAlign: 'center', color: '#4a5568', padding: 48 }}>Loading alerts…</div>
            ) : alerts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 64, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16 }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>✅</div>
                    <div style={{ color: '#22c55e', fontWeight: 600, marginBottom: 4 }}>No {filter === 'all' ? '' : filter} alerts</div>
                    <div style={{ color: '#4a5568', fontSize: '0.85rem' }}>All clear! Will auto-check for new SOS triggers.</div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
                    {alerts.map(alert => {
                        const cfg = STATUS_CONFIG[alert.status] || STATUS_CONFIG.pending;
                        return (
                            <div key={alert._id} className={alert.status === 'pending' ? 'sos-pending' : ''} style={{
                                background: cfg.bg, border: `1px solid ${cfg.color}44`,
                                borderRadius: 14, padding: 20
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}44`, padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{cfg.label}</span>
                                    <span style={{ color: '#4a5568', fontSize: '0.72rem' }}>{new Date(alert.createdAt).toLocaleString('en-IN')}</span>
                                </div>

                                <div style={{ marginBottom: 6 }}>
                                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{alert.userName || 'Unknown User'}</div>
                                    <div style={{ color: '#8892b0', fontSize: '0.78rem' }}>{alert.userEmail || ''}</div>
                                </div>

                                {alert.message && (
                                    <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '8px 12px', color: '#c8d0e8', fontSize: '0.82rem', marginBottom: 10, lineHeight: 1.4 }}>
                                        "{alert.message}"
                                    </div>
                                )}

                                {alert.location && (
                                    <div style={{ color: '#8892b0', fontSize: '0.78rem', marginBottom: 12 }}>📍 {alert.location}</div>
                                )}

                                {alert.acknowledgedBy && (
                                    <div style={{ color: '#f59e0b', fontSize: '0.72rem', marginBottom: 8 }}>👁️ Acknowledged by: {alert.acknowledgedBy}</div>
                                )}
                                {alert.resolvedBy && (
                                    <div style={{ color: '#22c55e', fontSize: '0.72rem', marginBottom: 8 }}>✅ Resolved by: {alert.resolvedBy} at {new Date(alert.resolvedAt).toLocaleString('en-IN')}</div>
                                )}

                                {alert.status !== 'resolved' && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {alert.status === 'pending' && (
                                            <button onClick={() => updateStatus(alert._id, 'acknowledged')} disabled={actionLoading === alert._id}
                                                style={{ flex: 1, padding: '7px', background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 8, color: '#f59e0b', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                                                👁️ Acknowledge
                                            </button>
                                        )}
                                        <button onClick={() => updateStatus(alert._id, 'resolved')} disabled={actionLoading === alert._id}
                                            style={{ flex: 1, padding: '7px', background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 8, color: '#22c55e', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>
                                            ✅ Mark Resolved
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
