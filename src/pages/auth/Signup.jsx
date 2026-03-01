import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppSettings } from '../../context/AppSettingsContext';
import Icon from '../../components/AppIcon';
import MaintenancePage from '../maintenance/MaintenancePage';

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup, googleSignIn } = useAuth();
    const { maintenanceMode, maintenanceMessage, registrationEnabled, loading: settingsLoading } = useAppSettings();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Maintenance mode — hard block
    if (!settingsLoading && maintenanceMode) {
        return <MaintenancePage message={maintenanceMessage} />;
    }

    // Registration disabled — show friendly message
    if (!settingsLoading && !registrationEnabled) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <div className="w-full max-w-md bg-card p-8 rounded-xl border border-border shadow-elevation-2 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
                        <Icon name="UserX" size={32} color="var(--color-primary)" />
                    </div>
                    <h2 className="text-xl font-heading font-bold text-foreground mb-3">Registrations Closed</h2>
                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                        New account registration is currently disabled by the administrator.
                        Please check back later or contact support if you need access.
                    </p>
                    <Link to="/login"
                        className="inline-block px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-smooth text-sm">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    async function syncUserWithBackend(user) {
        try {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            await fetch(`${apiBaseUrl}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firebaseUid: user.uid,
                    email: user.email,
                    displayName: user.displayName || 'User'
                }),
            });
        } catch (err) {
            console.error('Failed to sync user with backend:', err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match');
        }
        try {
            setError('');
            setLoading(true);
            const userCredential = await signup(emailRef.current.value, passwordRef.current.value);
            await syncUserWithBackend(userCredential.user);
            navigate('/');
        } catch (err) {
            setError('Failed to create an account');
            console.error(err);
        }
        setLoading(false);
    }

    async function handleGoogleSignIn() {
        try {
            setError('');
            setLoading(true);
            const userCredential = await googleSignIn();
            await syncUserWithBackend(userCredential.user);
            navigate('/');
        } catch (err) {
            setError('Failed to sign in with Google');
            console.error(err);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-card p-8 rounded-xl border border-border shadow-elevation-2">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                        <Icon name="UserPlus" size={24} color="var(--color-primary)" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">Create Account</h2>
                    <p className="text-muted-foreground mt-2">Sign up to get started</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6 flex items-center gap-2">
                        <Icon name="AlertTriangle" size={16} />
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-2.5 px-4 mb-4 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 hover:shadow-sm transition-all flex items-center justify-center gap-3"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign up with Google
                </button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <input type="email" ref={emailRef} required
                            className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                            placeholder="name@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Password</label>
                        <input type="password" ref={passwordRef} required
                            className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                            placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Confirm Password</label>
                        <input type="password" ref={passwordConfirmRef} required
                            className="w-full px-4 py-2 bg-muted/50 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-smooth"
                            placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-smooth disabled:opacity-50 shadow-elevation-1">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">Log In</Link>
                </div>
            </div>
        </div>
    );
}
