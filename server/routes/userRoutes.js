const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @desc    Register or Update User
// @route   POST /api/users
// @access  Public (protected by client-side auth mainly, but we sync here)
router.post('/', async (req, res) => {
    const { firebaseUid, email, displayName } = req.body;

    if (!firebaseUid || !email) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        let user = await User.findOne({ firebaseUid });

        if (user) {
            // Update existing user
            user.email = email;
            user.displayName = displayName || user.displayName;
            await user.save();
            return res.status(200).json(user);
        } else {
            // Create new user
            user = await User.create({
                firebaseUid,
                email,
                displayName
            });
            return res.status(201).json(user);
        }
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
