import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSettings } from '../context/AppSettingsContext';

/**
 * Drop-in wrapper — renders children if AI is enabled,
 * otherwise shows a clean "AI features are disabled" banner.
 *
 * Usage:
 *   <AiFeatureGate>
 *     <YourAIPage />
 *   </AiFeatureGate>
 */
export default function AiFeatureGate({ children, fullPage = true }) {
    const { aiEnabled, loading } = useAppSettings();

    if (loading) return null;

    if (!aiEnabled) {
        return (
            <div style={{
                minHeight: fullPage ? '100vh' : '360px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--color-background)', padding: 32
            }}>
                <div style={{
                    textAlign: 'center', maxWidth: 440,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 20, padding: '40px 32px'
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
                    <h2 style={{ color: 'var(--color-foreground)', fontWeight: 700, fontSize: '1.3rem', margin: '0 0 10px' }}>
                        AI Features Disabled
                    </h2>
                    <p style={{ color: 'var(--color-muted-foreground)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 24px' }}>
                        AI-powered features are currently disabled by the administrator.
                        Please check back later or use the other tools available.
                    </p>
                    <Link to="/main-dashboard" style={{
                        display: 'inline-block', padding: '10px 24px',
                        background: 'linear-gradient(135deg, #7c6af7, #5b4fe0)',
                        borderRadius: 10, color: '#fff', textDecoration: 'none',
                        fontWeight: 600, fontSize: '0.9rem'
                    }}>
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return children;
}
