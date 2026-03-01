const mongoose = require('mongoose');

const emergencySOSSchema = new mongoose.Schema({
    firebaseUid: { type: String, required: true },
    userName: { type: String, default: 'Unknown User' },
    userEmail: { type: String, default: '' },
    message: { type: String, default: '' },
    location: { type: String, default: '' },
    status: {
        type: String,
        enum: ['pending', 'acknowledged', 'resolved'],
        default: 'pending'
    },
    acknowledgedBy: { type: String, default: null },  // admin email
    resolvedBy: { type: String, default: null },
    resolvedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('EmergencySOS', emergencySOSSchema);
