const mongoose = require('mongoose');

// Switch to the 'lawconnect' database specifically for lawyers since the other models use 'test'
const lawyerDb = mongoose.connection.useDb('lawconnect');

const lawyerSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Experience: { type: String, default: '' },
    "Practice Areas": { type: String, default: '' },
    Location: { type: String, default: '' },
    "Profile URL": { type: String, default: '' }
}, { timestamps: true, strict: false });

// Text index for search
lawyerSchema.index({ Name: 'text', "Practice Areas": 'text', Location: 'text' });

module.exports = lawyerDb.model('lawyers', lawyerSchema, 'lawyers');
