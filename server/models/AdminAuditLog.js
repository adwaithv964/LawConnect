const mongoose = require('mongoose');

const adminAuditLogSchema = new mongoose.Schema({
    adminEmail: { type: String, required: true },
    adminName: { type: String, default: '' },
    role: { type: String, default: '' },
    action: { type: String, required: true },   // e.g. 'SUSPEND_USER', 'DELETE_ARTICLE'
    target: { type: String, default: '' },       // e.g. user id or article id
    targetType: { type: String, default: '' },   // e.g. 'user', 'article', 'lawyer'
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    ip: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('AdminAuditLog', adminAuditLogSchema);
