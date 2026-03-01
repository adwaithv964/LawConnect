import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../AdminAuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ROLES = ['super_admin', 'content_manager', 'support', 'emergency_dispatcher', 'compliance_officer'];
const ROLE_LABELS = { super_admin: 'Super Admin', content_manager: 'Content Manager', support: 'User Support', emergency_dispatcher: 'Emergency Dispatcher', compliance_officer: 'Compliance Officer' };

function Toggle({ checked, onChange }) {
    return (
        <div onClick={onChange} style={{ width: 44, height: 24, background: checked ? '#7c6af7' : 'rgba(255,255,255,0.12)', borderRadius: 12, cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 3, left: checked ? 22 : 3, width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
        </div>
    );
}

export default function AppSettingsPage() {
    const { adminToken } = useAdminAuth();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [admins, setAdmins] = useState([]);
    const [toast, setToast] = useState(null);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'support' });
    const [addingAdmin, setAddingAdmin] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => { fetchSettings(); fetchAdmins(); }, []);

    async function fetchSettings() {
        try {
            const res = await fetch(`${API}/admin/settings`, { headers: { 'x-admin-token': adminToken } });
            setSettings(await res.json());
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }

    async function fetchAdmins() {
        try {
            const res = await fetch(`${API}/admin/admins`, { headers: { 'x-admin-token': adminToken } });
            if (res.ok) setAdmins(await res.json());
        } catch (err) { console.error(err); }
    }

    async function saveSetting(field, value) {
        setSaving(true);
        try {
            const res = await fetch(`${API}/admin/settings`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
                body: JSON.stringify({ [field]: value })
            });
            if (res.ok) { setSettings(s => ({ ...s, [field]: value })); showToast('✅ Saved!', '#22c55e'); }
        } catch (err) { showToast('Save failed', '#ef4444'); }
        finally { setSaving(false); }
    }

    async function createAdmin() {
        if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;
        setAddingAdmin(true);
        try {
            const res = await fetch(`${API}/admin/admins`, {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
                body: JSON.stringify(newAdmin)
            });
            if (res.ok) { showToast('✅ Admin created!', '#22c55e'); fetchAdmins(); setShowForm(false); setNewAdmin({ name: '', email: '', password: '', role: 'support' }); }
            else { const d = await res.json(); showToast(d.message || 'Failed', '#ef4444'); }
        } catch (err) { showToast('Failed', '#ef4444'); }
        finally { setAddingAdmin(false); }
    }

    async function toggleAdminStatus(id, isActive) {
        try {
            const res = await fetch(`${API}/admin/admins/${id}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken },
                body: JSON.stringify({ isActive })
            });
            if (res.ok) { showToast(isActive ? '✅ Admin activated' : '🚫 Admin deactivated', '#7c6af7'); fetchAdmins(); }
        } catch (err) { showToast('Failed', '#ef4444'); }
    }

    function showToast(msg, color) { setToast({ msg, color }); setTimeout(() => setToast(null), 3000); }

    if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#4a5568' }}>Loading settings…</div>;

    const inputStyle = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' };

    return (
        <div style={{ padding: '32px 36px', maxWidth: 900 }}>
            <style>{`input:focus,select:focus{border-color:#7c6af7!important;outline:none;box-shadow:0 0 0 3px rgba(124,106,247,0.15);}`}</style>
            {toast && <div style={{ position: 'fixed', top: 24, right: 24, padding: '12px 20px', background: toast.color, borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: '0.85rem', zIndex: 9999 }}>{toast.msg}</div>}

            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: '0 0 28px' }}>App Settings</h1>

            {/* System Toggles */}
            <section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <h2 style={{ color: '#fff', margin: '0 0 20px', fontSize: '1rem', fontWeight: 600 }}>⚙️ System Toggles</h2>
                {[
                    { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Block all user access and show maintenance message', warn: true },
                    { key: 'registrationEnabled', label: 'User Registration', desc: 'Allow new users to sign up' },
                    { key: 'aiEnabled', label: 'AI Features', desc: 'Enable Legal Assistant AI chatbot and AI-powered tools' },
                ].map(({ key, label, desc, warn }) => (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div>
                            <div style={{ color: warn && settings?.[key] ? '#ef4444' : '#c8d0e8', fontWeight: 600, fontSize: '0.9rem' }}>{label}</div>
                            <div style={{ color: '#4a5568', fontSize: '0.78rem', marginTop: 2 }}>{desc}</div>
                        </div>
                        <Toggle checked={!!settings?.[key]} onChange={() => saveSetting(key, !settings?.[key])} />
                    </div>
                ))}
                {settings?.maintenanceMode && (
                    <div style={{ marginTop: 16 }}>
                        <label style={{ display: 'block', color: '#8892b0', fontSize: '0.72rem', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>Maintenance Message</label>
                        <input style={inputStyle} value={settings.maintenanceMessage || ''} onChange={e => setSettings(s => ({ ...s, maintenanceMessage: e.target.value }))}
                            onBlur={e => saveSetting('maintenanceMessage', e.target.value)} placeholder="Message shown to users during maintenance…" />
                    </div>
                )}
            </section>

            {/* Admin User Management */}
            <section style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h2 style={{ color: '#fff', margin: 0, fontSize: '1rem', fontWeight: 600 }}>👤 Admin Accounts</h2>
                    <button onClick={() => setShowForm(f => !f)} style={{ padding: '7px 14px', background: 'rgba(124,106,247,0.15)', border: '1px solid rgba(124,106,247,0.3)', borderRadius: 8, color: '#7c6af7', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500 }}>
                        {showForm ? 'Cancel' : '+ Add Admin'}
                    </button>
                </div>

                {showForm && (
                    <div style={{ background: 'rgba(124,106,247,0.06)', borderRadius: 12, padding: 18, marginBottom: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {[['name', 'Full Name', 'text'], ['email', 'Email', 'email'], ['password', 'Password', 'password']].map(([k, lbl, t]) => (
                            <div key={k}>
                                <label style={{ display: 'block', color: '#8892b0', fontSize: '0.7rem', fontWeight: 600, marginBottom: 5, textTransform: 'uppercase' }}>{lbl}</label>
                                <input type={t} value={newAdmin[k]} onChange={e => setNewAdmin(a => ({ ...a, [k]: e.target.value }))} style={inputStyle} />
                            </div>
                        ))}
                        <div>
                            <label style={{ display: 'block', color: '#8892b0', fontSize: '0.7rem', fontWeight: 600, marginBottom: 5, textTransform: 'uppercase' }}>Role</label>
                            <select value={newAdmin.role} onChange={e => setNewAdmin(a => ({ ...a, role: e.target.value }))} style={{ ...inputStyle }}>
                                {ROLES.filter(r => r !== 'super_admin').map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                            </select>
                        </div>
                        <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={createAdmin} disabled={addingAdmin} style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #7c6af7, #5b4fe0)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                                {addingAdmin ? 'Creating…' : 'Create Admin'}
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {admins.map(admin => (
                        <div key={admin._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #7c6af7, #5b4fe0)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>{admin.name?.[0]?.toUpperCase() || 'A'}</div>
                                <div>
                                    <div style={{ color: '#c8d0e8', fontWeight: 600, fontSize: '0.85rem' }}>{admin.name}</div>
                                    <div style={{ color: '#4a5568', fontSize: '0.75rem' }}>{admin.email} · {ROLE_LABELS[admin.role]}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ fontSize: '0.72rem', color: admin.isActive ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{admin.isActive ? '● Active' : '● Inactive'}</span>
                                {admin.role !== 'super_admin' && (
                                    <Toggle checked={admin.isActive} onChange={() => toggleAdminStatus(admin._id, !admin.isActive)} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
