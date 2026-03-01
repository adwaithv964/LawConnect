import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { adminLogin } = useAdminAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await adminLogin(email, password);
            navigate('/admin/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            minHeight: '100vh', background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1829 50%, #0f1f35 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif"
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                .admin-login-card { animation: fadeUp 0.5s ease; }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
                .admin-input { transition: all 0.2s; }
                .admin-input:focus { border-color: #7c6af7 !important; box-shadow: 0 0 0 3px rgba(124,106,247,0.15) !important; outline: none; }
                .admin-btn { transition: all 0.2s; }
                .admin-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(124,106,247,0.4) !important; }
                .admin-btn:disabled { opacity: 0.6; cursor: not-allowed; }
            `}</style>

            <div className="admin-login-card" style={{
                background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
                border: '1px solid rgba(124,106,247,0.2)', borderRadius: 24,
                padding: '48px 40px', width: '100%', maxWidth: 440,
                boxShadow: '0 32px 80px rgba(0,0,0,0.6)'
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 36 }}>
                    <div style={{
                        width: 64, height: 64, background: 'linear-gradient(135deg, #7c6af7, #5b4fe0)',
                        borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(124,106,247,0.3)'
                    }}>
                        <span style={{ fontSize: 28 }}>⚖️</span>
                    </div>
                    <h1 style={{ color: '#fff', margin: 0, fontSize: '1.6rem', fontWeight: 700 }}>LawConnect</h1>
                    <p style={{ color: '#7c6af7', margin: '4px 0 0', fontSize: '0.85rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>Admin Panel</p>
                </div>


                {error && (
                    <div style={{
                        background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.3)',
                        borderRadius: 10, padding: '10px 14px', marginBottom: 20, color: '#ff6b6b', fontSize: '0.85rem'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ display: 'block', color: '#8892b0', fontSize: '0.8rem', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email Address</label>
                        <input
                            className="admin-input"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@lawconnect.com"
                            required
                            style={{
                                width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
                                color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: 28 }}>
                        <label style={{ display: 'block', color: '#8892b0', fontSize: '0.8rem', fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
                        <input
                            className="admin-input"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••••"
                            required
                            style={{
                                width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.06)',
                                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
                                color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="admin-btn"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '13px', background: 'linear-gradient(135deg, #7c6af7, #5b4fe0)',
                            border: 'none', borderRadius: 10, color: '#fff', fontSize: '0.95rem',
                            fontWeight: 600, cursor: 'pointer', letterSpacing: '0.03em',
                            boxShadow: '0 4px 16px rgba(124,106,247,0.3)'
                        }}
                    >
                        {loading ? 'Authenticating…' : '🔐 Sign in to Admin Panel'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, color: '#4a5568', fontSize: '0.78rem' }}>
                    Not an admin? <a href="/login" style={{ color: '#7c6af7', textDecoration: 'none' }}>Return to app →</a>
                </p>
            </div>
        </div>
    );
}
