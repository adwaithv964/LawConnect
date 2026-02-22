const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Document = require('../models/Document');
const Case = require('../models/Case');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get aggregated dashboard summary for a user
// @route   GET /api/dashboard/summary?firebaseUid=...
// @access  Private
router.get('/summary', async (req, res) => {
    try {
        const { firebaseUid } = req.query;
        if (!firebaseUid) {
            return res.status(401).json({ message: 'Unauthorized: No user ID provided' });
        }

        const user = await User.findOne({ firebaseUid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userId = user._id;

        // Parallel fetches for all data
        const [
            activeCases,
            urgentDeadlines,
            totalDocuments,
            recentActivities,
            documents,
            chatActivities,
            supportActivities,
            libraryActivities,
            casesThisMonth,
            documentsThisMonth,
            recentCases
        ] = await Promise.all([
            Case.countDocuments({ userId, status: 'active' }),
            Case.countDocuments({ userId, status: 'active', urgentDeadline: true }),
            Document.countDocuments({ userId }),
            ActivityLog.find({ userId }).sort({ createdAt: -1 }).limit(5),
            Document.find({ userId }).select('category createdAt').sort({ createdAt: -1 }),
            ActivityLog.countDocuments({ userId, type: 'chat' }),
            ActivityLog.countDocuments({ userId, type: 'support' }),
            ActivityLog.countDocuments({ userId, type: 'library' }),
            Case.countDocuments({ userId, createdAt: { $gte: new Date(new Date().setDate(1)) } }),
            Document.countDocuments({ userId, createdAt: { $gte: new Date(new Date().setDate(1)) } }),
            Case.find({ userId, status: 'active' }).select('title category status createdAt deadlineDate urgentDeadline').limit(3).sort({ createdAt: -1 })
        ]);

        // Category breakdown for trending legal categories
        const categoryCounts = {};
        documents.forEach(doc => {
            const cat = doc.category || 'Uncategorized';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        // Case category breakdown
        const allCases = await Case.find({ userId }).select('category');
        allCases.forEach(c => {
            const cat = c.category || 'Other';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        // Last used times per feature
        const [lastCase, lastDocument, lastChat, lastLibrary] = await Promise.all([
            ActivityLog.findOne({ userId, type: 'case' }).sort({ createdAt: -1 }).select('createdAt'),
            ActivityLog.findOne({ userId, type: 'document' }).sort({ createdAt: -1 }).select('createdAt'),
            ActivityLog.findOne({ userId, type: 'chat' }).sort({ createdAt: -1 }).select('createdAt'),
            ActivityLog.findOne({ userId, type: 'library' }).sort({ createdAt: -1 }).select('createdAt'),
        ]);

        res.json({
            user: {
                displayName: user.displayName || 'User',
                email: user.email,
                memberSince: user.createdAt
            },
            stats: {
                activeCases,
                urgentDeadlines,
                totalDocuments,
                chatConsultations: chatActivities,
                supportAccesses: supportActivities,
                libraryReads: libraryActivities,
                casesThisMonth,
                documentsThisMonth
            },
            recentActivities: recentActivities.map(a => ({
                _id: a._id,
                type: a.type,
                title: a.title,
                description: a.description,
                link: a.link,
                icon: a.icon,
                iconColor: a.iconColor,
                timestamp: a.createdAt
            })),
            categoryBreakdown: categoryCounts,
            activeCasesList: recentCases,
            featureStats: {
                aiChatbot: {
                    count: chatActivities,
                    lastUsed: lastChat?.createdAt || null
                },
                legalSteps: {
                    count: chatActivities,
                    lastUsed: lastChat?.createdAt || null
                },
                timeline: {
                    count: activeCases,
                    lastUsed: lastCase?.createdAt || null
                },
                documents: {
                    count: totalDocuments,
                    lastUsed: lastDocument?.createdAt || null
                },
                library: {
                    count: libraryActivities,
                    lastUsed: lastLibrary?.createdAt || null
                }
            }
        });
    } catch (error) {
        console.error('Dashboard Summary Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
