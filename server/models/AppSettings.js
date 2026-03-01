const mongoose = require('mongoose');

// Singleton settings document
const appSettingsSchema = new mongoose.Schema({
    maintenanceMode: { type: Boolean, default: false },
    maintenanceMessage: { type: String, default: 'The system is under maintenance. Please try again later.' },
    registrationEnabled: { type: Boolean, default: true },
    maxStoragePerUserMB: { type: Number, default: 500 },
    aiEnabled: { type: Boolean, default: true },
    emergencyHotlines: [{
        name: { type: String },
        number: { type: String },
        category: { type: String }
    }]
}, { timestamps: true });

module.exports = mongoose.model('AppSettings', appSettingsSchema);
