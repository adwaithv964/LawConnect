const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// @desc    Log an activity
// @route   POST /api/activities
router.post('/', async (req, res) => {
    try {
        const { firebaseUid, type, title, description, link, icon, iconColor } = req.body;

        if (!firebaseUid) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ firebaseUid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const activity = await ActivityLog.create({
            userId: user._id,
            type,
            title,
            description: description || '',
            link: link || '/',
            icon: icon || 'Activity',
            iconColor: iconColor || 'var(--color-primary)'
        });

        res.status(201).json(activity);
    } catch (error) {
        console.error('Activity Log Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get activities for a user
// @route   GET /api/activities?firebaseUid=...
router.get('/', async (req, res) => {
    try {
        const { firebaseUid, limit = 10 } = req.query;
        if (!firebaseUid) return res.status(401).json({ message: 'Unauthorized' });

        const user = await User.findOne({ firebaseUid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const activities = await ActivityLog.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
