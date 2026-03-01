import React, { useContext, useState, useEffect } from 'react';

const AdminAuthContext = React.createContext();

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function AdminAuthProvider({ children }) {
    const [adminUser, setAdminUser] = useState(null);
    const [adminToken, setAdminToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            verifyToken(token);
        } else {
            setLoading(false);
        }
    }, []);

    async function verifyToken(token) {
        try {
            const res = await fetch(`${API}/admin/auth/verify`, {
                headers: { 'x-admin-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setAdminUser(data.admin);
                setAdminToken(token);
            } else {
                localStorage.removeItem('adminToken');
            }
        } catch (err) {
            localStorage.removeItem('adminToken');
        } finally {
            setLoading(false);
        }
    }

    async function adminLogin(email, password) {
        const res = await fetch(`${API}/admin/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        localStorage.setItem('adminToken', data.token);
        setAdminToken(data.token);
        setAdminUser(data.admin);
        return data;
    }

    function adminLogout() {
        localStorage.removeItem('adminToken');
        setAdminToken(null);
        setAdminUser(null);
    }

    function hasRole(...roles) {
        if (!adminUser) return false;
        if (adminUser.role === 'super_admin') return true;
        return roles.includes(adminUser.role);
    }

    const value = { adminUser, adminToken, loading, adminLogin, adminLogout, hasRole };

    return (
        <AdminAuthContext.Provider value={value}>
            {!loading && children}
        </AdminAuthContext.Provider>
    );
}
