import React from 'react';

export default function MaintenancePage({ message }) {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0d1117 0%, #161b2e 50%, #0d1117 100%)',
            padding: '24px', fontFamily: '"Inter", sans-serif'
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
            `}</style>

            <div style={{ textAlign: 'center', maxWidth: 480 }}>
                {/* Animated icon */}
                <div style={{
                    width: 100, height: 100, borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(124,106,247,0.2), rgba(14,165,233,0.2))',
                    border: '2px solid rgba(124,106,247,0.4)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 28px', animation: 'float 3s ease-in-out infinite'
                }}>
                    <span style={{ fontSize: '2.6rem' }}>🔧</span>
                </div>

                <h1 style={{
                    fontSize: '2rem', fontWeight: 700, color: '#fff', margin: '0 0 12px',
                    background: 'linear-gradient(135deg, #7c6af7, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                }}>
                    Under Maintenance
                </h1>

                <p style={{
                    color: '#8892b0', fontSize: '1rem', lineHeight: 1.6, margin: '0 0 32px',
                    background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '16px 20px',
                    border: '1px solid rgba(255,255,255,0.08)'
                }}>
                    {message || 'The system is under maintenance. Please try again later.'}
                </p>

                {/* Live indicator */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', animation: 'pulse 1.5s ease-in-out infinite' }} />
                    <span style={{ color: '#f59e0b', fontSize: '0.82rem', fontWeight: 500 }}>We'll be back shortly</span>
                </div>

                <p style={{ color: '#4a5568', fontSize: '0.75rem', marginTop: 24 }}>
                    LawConnect · Scheduled Maintenance
                </p>
            </div>
        </div>
    );
}
