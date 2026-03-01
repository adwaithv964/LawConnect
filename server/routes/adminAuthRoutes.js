const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const AdminAuditLog = require('../models/AdminAuditLog');

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'LawConnect_Admin_JWT_Super_Secret_2024!';

// POST /api/admin/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const admin = await AdminUser.findOne({ email: email.toLowerCase(), isActive: true });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        admin.lastLogin = new Date();
        await admin.save();

        const token = jwt.sign(
            { id: admin._id, email: admin.email, role: admin.role, name: admin.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Log the login action
        await AdminAuditLog.create({
            adminEmail: admin.email,
            adminName: admin.name,
            role: admin.role,
            action: 'ADMIN_LOGIN',
            target: admin.email,
            targetType: 'admin',
            details: { timestamp: new Date() }
        });

        res.json({
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            }
        });
    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/admin/auth/verify
router.get('/verify', async (req, res) => {
    const token = req.headers['x-admin-token'];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await AdminUser.findById(decoded.id).select('-passwordHash');
        if (!admin || !admin.isActive) {
            return res.status(401).json({ message: 'Admin account inactive or not found' });
        }
        res.json({ admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role } });
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

module.exports = { router, JWT_SECRET };
