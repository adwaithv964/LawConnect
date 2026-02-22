const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    // 'photo' | 'video' | 'document'
    mediaType: {
        type: String,
        enum: ['photo', 'video', 'document'],
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    tags: [{ type: String }],
    // Optional link to a case
    caseRef: {
        type: String,
        default: ''
    },
    // AES-256-GCM encrypted file content
    encryptedData: {
        type: Buffer,
        required: true
    },
    // AES-GCM initialisation vector (16 bytes, hex-encoded)
    iv: {
        type: String,
        required: true
    },
    // AES-GCM authentication tag (16 bytes, hex-encoded)
    authTag: {
        type: String,
        required: true
    },
    // SHA-256 hash of the ORIGINAL (pre-encryption) file bytes
    sha256Hash: {
        type: String,
        required: true
    },
    // Server timestamp when this hash was recorded
    timestampedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Evidence', evidenceSchema);
