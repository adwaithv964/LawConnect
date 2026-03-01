const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Article = require('../models/Article');
const Lawyer = require('../models/Lawyer');
const Case = require('../models/Case');
const Document = require('../models/Document');
const Evidence = require('../models/Evidence');
const AdminUser = require('../models/AdminUser');
const AdminAuditLog = require('../models/AdminAuditLog');
const EmergencySOS = require('../models/EmergencySOS');
const AppSettings = require('../models/AppSettings');

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'LawConnect_Admin_JWT_Super_Secret_2024!';

// ─── JWT Middleware ───────────────────────────────────────────────────────────
function adminAuth(req, res, next) {
    const token = req.headers['x-admin-token'];
    if (!token) return res.status(401).json({ message: 'Admin token required' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired admin token' });
    }
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.admin.role) && req.admin.role !== 'super_admin') {
            return res.status(403).json({ message: 'Insufficient permissions for this action' });
        }
        next();
    };
}

async function auditLog(req, action, target, targetType, details = {}) {
    try {
        await AdminAuditLog.create({
            adminEmail: req.admin.email,
            adminName: req.admin.name,
            role: req.admin.role,
            action,
            target,
            targetType,
            details,
            ip: req.ip || ''
        });
    } catch (e) { /* non-blocking */ }
}

// ─── STATS ───────────────────────────────────────────────────────────────────
// GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
    try {
        const [
            totalUsers,
            totalArticles,
            totalLawyers,
            totalCases,
            totalDocuments,
            activeSOSCount,
            pendingLawyers
        ] = await Promise.all([
            User.countDocuments(),
            Article.countDocuments(),
            Lawyer.countDocuments(),
            Case.countDocuments(),
            Document.countDocuments(),
            EmergencySOS.countDocuments({ status: 'pending' }),
            Lawyer.countDocuments({ verified: false })
        ]);

        // User registrations last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

        // Recent audit logs
        const recentLogs = await AdminAuditLog.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        res.json({
            totalUsers,
            totalArticles,
            totalLawyers,
            totalCases,
            totalDocuments,
            activeSOSCount,
            pendingLawyers,
            newUsersThisWeek,
            recentLogs
        });
    } catch (err) {
        console.error('Admin stats error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── USERS ───────────────────────────────────────────────────────────────────
// GET /api/admin/users
router.get('/users', adminAuth, requireRole('support', 'super_admin'), async (req, res) => {
    try {
        const { search = '', page = 1, limit = 20, status } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { displayName: { $regex: search, $options: 'i' } }
            ];
        }
        if (status) query.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await User.countDocuments(query);
        const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();

        res.json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/users/:id/status
router.put('/users/:id/status', adminAuth, requireRole('support'), async (req, res) => {
    try {
        const { status } = req.body; // 'active' | 'suspended' | 'banned'
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        await auditLog(req, `USER_${status.toUpperCase()}`, user.email, 'user', { userId: user._id });
        res.json({ message: `User ${status} successfully`, user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── LAWYERS ─────────────────────────────────────────────────────────────────
// GET /api/admin/lawyers
router.get('/lawyers', adminAuth, requireRole('support'), async (req, res) => {
    try {
        const { search = '', page = 1, limit = 20, verified } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { Name: { $regex: search, $options: 'i' } },
                { Location: { $regex: search, $options: 'i' } },
                { "Practice Areas": { $regex: search, $options: 'i' } }
            ];
        }
        if (verified !== undefined) query.verified = verified === 'true';
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Lawyer.countDocuments(query);
        const lawyers = await Lawyer.find(query).skip(skip).limit(parseInt(limit)).lean();
        res.json({ lawyers, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/lawyers/:id/verify
router.put('/lawyers/:id/verify', adminAuth, requireRole('support'), async (req, res) => {
    try {
        const { verified, rejectionReason } = req.body;
        const update = { verified, verifiedAt: verified ? new Date() : null };
        if (!verified && rejectionReason) update.rejectionReason = rejectionReason;
        const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
        await auditLog(req, verified ? 'LAWYER_VERIFIED' : 'LAWYER_REJECTED', lawyer.Name, 'lawyer', { lawyerId: lawyer._id, rejectionReason });
        res.json({ message: `Lawyer ${verified ? 'verified' : 'rejected'}`, lawyer });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── ARTICLES ────────────────────────────────────────────────────────────────
// GET /api/admin/articles
router.get('/articles', adminAuth, requireRole('content_manager'), async (req, res) => {
    try {
        const { search = '', category = 'all', page = 1, limit = 20 } = req.query;
        const query = {};
        if (search) query.$or = [{ title: { $regex: search, $options: 'i' } }, { excerpt: { $regex: search, $options: 'i' } }];
        if (category !== 'all') query.category = category;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Article.countDocuments(query);
        const articles = await Article.find(query).sort({ publishDate: -1 }).skip(skip).limit(parseInt(limit)).lean();
        res.json({ articles, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/admin/articles
router.post('/articles', adminAuth, requireRole('content_manager'), async (req, res) => {
    try {
        const article = await Article.create(req.body);
        await auditLog(req, 'CREATE_ARTICLE', article._id.toString(), 'article', { title: article.title });
        res.status(201).json(article);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /api/admin/articles/:id
router.put('/articles/:id', adminAuth, requireRole('content_manager'), async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!article) return res.status(404).json({ message: 'Article not found' });
        await auditLog(req, 'UPDATE_ARTICLE', article._id.toString(), 'article', { title: article.title });
        res.json(article);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/admin/articles/:id
router.delete('/articles/:id', adminAuth, requireRole('content_manager'), async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) return res.status(404).json({ message: 'Article not found' });
        await auditLog(req, 'DELETE_ARTICLE', req.params.id, 'article', { title: article.title });
        res.json({ message: 'Article deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── STORAGE QUOTA ───────────────────────────────────────────────────────────
// GET /api/admin/storage — counts only, no file content
router.get('/storage', adminAuth, requireRole('compliance_officer'), async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const users = await User.find().skip(skip).limit(parseInt(limit)).lean();
        const total = await User.countDocuments();

        const storageData = await Promise.all(users.map(async (user) => {
            const [docCount, evidenceCount, caseCount] = await Promise.all([
                Document.countDocuments({ userId: user._id }),
                Evidence.countDocuments({ userId: user._id }),
                Case.countDocuments({ userId: user._id })
            ]);
            return {
                userId: user._id,
                email: user.email,
                displayName: user.displayName,
                documentCount: docCount,
                evidenceCount: evidenceCount,
                caseCount: caseCount,
                totalFileCount: docCount + evidenceCount
            };
        }));

        res.json({ storageData, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── EMERGENCY SOS ───────────────────────────────────────────────────────────
// GET /api/admin/emergency
router.get('/emergency', adminAuth, requireRole('emergency_dispatcher'), async (req, res) => {
    try {
        const { status = 'all', page = 1, limit = 50 } = req.query;
        const query = status !== 'all' ? { status } : {};
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await EmergencySOS.countDocuments(query);
        const alerts = await EmergencySOS.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();
        res.json({ alerts, total, pendingCount: await EmergencySOS.countDocuments({ status: 'pending' }) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/admin/emergency — create SOS (called from user-facing victim support)
router.post('/emergency', async (req, res) => {
    try {
        const { firebaseUid, userName, userEmail, message, location } = req.body;
        const sos = await EmergencySOS.create({ firebaseUid, userName, userEmail, message, location });
        res.status(201).json(sos);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/emergency/:id
router.put('/emergency/:id', adminAuth, requireRole('emergency_dispatcher'), async (req, res) => {
    try {
        const { status } = req.body;
        const update = { status };
        if (status === 'acknowledged') update.acknowledgedBy = req.admin.email;
        if (status === 'resolved') { update.resolvedBy = req.admin.email; update.resolvedAt = new Date(); }
        const alert = await EmergencySOS.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!alert) return res.status(404).json({ message: 'SOS alert not found' });
        await auditLog(req, `SOS_${status.toUpperCase()}`, alert._id.toString(), 'sos', { userName: alert.userName });
        res.json(alert);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── PUBLIC HOTLINES — no auth required ───────────────────────────────────────
// GET /api/admin/hotlines — called by user-facing victim support page
router.get('/hotlines', async (req, res) => {
    try {
        const settings = await AppSettings.findOne().lean();
        res.json({ hotlines: settings?.emergencyHotlines || [] });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/admin/public-settings — returns only safe public flags, no auth
router.get('/public-settings', async (req, res) => {
    try {
        const settings = await AppSettings.findOne().lean();
        res.json({
            maintenanceMode: settings?.maintenanceMode || false,
            maintenanceMessage: settings?.maintenanceMessage || 'The system is under maintenance. Please try again later.',
            registrationEnabled: settings?.registrationEnabled !== false, // default true
            aiEnabled: settings?.aiEnabled !== false                       // default true
        });
    } catch (err) {
        // Fail open — don't block the app if DB is down
        res.json({ maintenanceMode: false, registrationEnabled: true, aiEnabled: true });
    }
});

// ─── APP SETTINGS ─────────────────────────────────────────────────────────────
// GET /api/admin/settings
router.get('/settings', adminAuth, async (req, res) => {
    try {
        let settings = await AppSettings.findOne();
        if (!settings) settings = await AppSettings.create({});
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/admin/settings
router.put('/settings', adminAuth, requireRole('super_admin'), async (req, res) => {
    try {
        let settings = await AppSettings.findOne();
        if (!settings) settings = new AppSettings();
        Object.assign(settings, req.body);
        await settings.save();
        await auditLog(req, 'UPDATE_SETTINGS', 'appsettings', 'settings', req.body);
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── ADMIN USERS MANAGEMENT ───────────────────────────────────────────────────
// GET /api/admin/admins
router.get('/admins', adminAuth, requireRole('super_admin'), async (req, res) => {
    try {
        const admins = await AdminUser.find().select('-passwordHash').lean();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/admin/admins
const bcrypt = require('bcryptjs');
router.post('/admins', adminAuth, requireRole('super_admin'), async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const passwordHash = await bcrypt.hash(password, 12);
        const admin = await AdminUser.create({ email, passwordHash, name, role });
        await auditLog(req, 'CREATE_ADMIN', email, 'admin', { name, role });
        res.status(201).json({ id: admin._id, email: admin.email, name: admin.name, role: admin.role });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /api/admin/admins/:id
router.put('/admins/:id', adminAuth, requireRole('super_admin'), async (req, res) => {
    try {
        const { name, role, isActive } = req.body;
        const admin = await AdminUser.findByIdAndUpdate(req.params.id, { name, role, isActive }, { new: true }).select('-passwordHash');
        if (!admin) return res.status(404).json({ message: 'Admin not found' });
        await auditLog(req, 'UPDATE_ADMIN', admin.email, 'admin', { name, role, isActive });
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
// GET /api/admin/audit
router.get('/audit', adminAuth, requireRole('compliance_officer'), async (req, res) => {
    try {
        const { page = 1, limit = 50, action, adminEmail } = req.query;
        const query = {};
        if (action) query.action = { $regex: action, $options: 'i' };
        if (adminEmail) query.adminEmail = { $regex: adminEmail, $options: 'i' };
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await AdminAuditLog.countDocuments(query);
        const logs = await AdminAuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();
        res.json({ logs, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
