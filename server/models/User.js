const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'banned'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);

