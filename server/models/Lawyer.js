const mongoose = require('mongoose');

const lawyerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specializations: [{ type: String }],
    experience: { type: Number, default: 0 }, // years
    languages: [{ type: String }],
    location: {
        city: { type: String, default: '' },
        state: { type: String, default: '' }
    },
    barCouncilId: { type: String, default: '' },
    verified: { type: Boolean, default: true },
    bio: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    phone: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    casesSolved: { type: Number, default: 0 }
}, { timestamps: true });

// Text index for search
lawyerSchema.index({ name: 'text', specializations: 'text', 'location.city': 'text', bio: 'text' });

module.exports = mongoose.model('Lawyer', lawyerSchema);
