import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../AdminAuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const CATEGORY_ICONS = {
    emergency: '🆘', police: '👮', women: '👩', child: '👶',
    legal: '⚖️', domestic: '🏠', cyber: '💻', ngo: '🤝'
};

export default function EmergencyResources() {
    const { adminToken } = useAdminAuth();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hotlines, setHotlines] = useState([]);
    const [toast, setToast] = useState(null);
    const [newHotline, setNewHotline] = useState({ name: '', number: '', category: 'emergency' });
    const [editIdx, setEditIdx] = useState(null);

    useEffect(() => { fetchSettings(); }, []);

    async function fetchSettings() {
        try {
            const res = await fetch(`${API}/admin/settings`, { headers: { 'x-admin-token': adminToken } });
            const data = await res.json();
            setSettings(data);
            setHotlines(data.emergencyHotlines || []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }

    async function saveHotlines(updated) {
        setSaving(true);
        try {
            const res = await fetch(`${API}/admin/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
                body: JSON.stringify({ emergencyHotlines: updated })
            });
            if (res.ok) { showToast('✅ Hotlines saved!', '#22c55e'); setHotlines(updated); }
        } catch (err) { showToast('Save failed', '#ef4444'); }
        finally { setSaving(false); }
    }

    function addHotline() {
        if (!newHotline.name || !newHotline.number) return;
        const updated = [...hotlines, { ...newHotline }];
        saveHotlines(updated);
        setNewHotline({ name: '', number: '', category: 'emergency' });
    }

    function removeHotline(idx) {
        const updated = hotlines.filter((_, i) => i !== idx);
        saveHotlines(updated);
    }

    function showToast(msg, color) { setToast({ msg, color }); setTimeout(() => setToast(null), 3000); }

    if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#4a5568' }}>Loading…</div>;

    return (
        <div style={{ padding: '32px 36px' }}>
            <style>{`input:focus,select:focus{border-color:#7c6af7!important;outline:none;box-shadow:0 0 0 3px rgba(124,106,247,0.15);}`}</style>
            {toast && <div style={{ position: 'fixed', top: 24, right: 24, padding: '12px 20px', background: toast.color, borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: '0.85rem', zIndex: 9999 }}>{toast.msg}</div>}

            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: 0 }}>Emergency Resources</h1>
                <p style={{ color: '#8892b0', margin: '4px 0 0', fontSize: '0.85rem' }}>Manage hotlines and emergency contacts shown to users in distress</p>
            </div>

            {/* Add new hotline */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h3 style={{ color: '#fff', margin: '0 0 18px', fontSize: '0.95rem', fontWeight: 600 }}>➕ Add New Hotline</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
                    <div>
                        <label style={{ display: 'block', color: '#8892b0', fontSize: '0.72rem', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Name</label>
                        <input value={newHotline.name} onChange={e => setNewHotline(h => ({ ...h, name: e.target.value }))} placeholder="e.g. Women Helpline"
                            style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box', transition: 'all 0.2s' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#8892b0', fontSize: '0.72rem', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Number</label>
                        <input value={newHotline.number} onChange={e => setNewHotline(h => ({ ...h, number: e.target.value }))} placeholder="e.g. 1091"
                            style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box', transition: 'all 0.2s' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#8892b0', fontSize: '0.72rem', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Category</label>
                        <select value={newHotline.category} onChange={e => setNewHotline(h => ({ ...h, category: e.target.value }))}
                            style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', fontSize: '0.85rem', boxSizing: 'border-box' }}>
                            {Object.keys(CATEGORY_ICONS).map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
                        </select>
                    </div>
                    <button onClick={addHotline} disabled={saving || !newHotline.name || !newHotline.number}
                        style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #7c6af7, #5b4fe0)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                        {saving ? '…' : 'Add'}
                    </button>
                </div>
            </div>

            {/* Hotlines list */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                {hotlines.map((h, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontSize: '1.1rem' }}>{CATEGORY_ICONS[h.category] || '📞'}</span>
                                <span style={{ color: '#c8d0e8', fontWeight: 600, fontSize: '0.88rem' }}>{h.name}</span>
                            </div>
                            <div style={{ color: '#7c6af7', fontWeight: 700, fontSize: '1rem', fontFamily: 'monospace' }}>{h.number}</div>
                            <div style={{ color: '#4a5568', fontSize: '0.72rem', textTransform: 'capitalize', marginTop: 2 }}>{h.category}</div>
                        </div>
                        <button onClick={() => removeHotline(i)} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}>✕ Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
