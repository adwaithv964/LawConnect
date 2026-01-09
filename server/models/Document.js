const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: 'Uncategorized'
    },
    fileType: {
        type: String
    },
    size: {
        type: Number
    },
    data: {
        type: Buffer,
        required: true
    },
    tags: [{
        type: String
    }],
    uploadDate: {
        type: Date,
        default: Date.now
    },
    isPasswordProtected: {
        type: Boolean,
        default: false
    },
    password: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
