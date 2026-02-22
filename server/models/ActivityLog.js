const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['case', 'document', 'chat', 'support', 'library'],
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    link: { type: String, default: '/' },
    icon: { type: String, default: 'Activity' },
    iconColor: { type: String, default: 'var(--color-primary)' }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
