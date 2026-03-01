const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminUserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: {
        type: String,
        enum: ['super_admin', 'content_manager', 'support', 'emergency_dispatcher', 'compliance_officer'],
        default: 'support'
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null }
}, { timestamps: true });

adminUserSchema.methods.comparePassword = async function (plain) {
    return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('AdminUser', adminUserSchema);
