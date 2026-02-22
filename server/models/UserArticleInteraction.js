const mongoose = require('mongoose');

const userArticleInteractionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
        index: true
    },
    isBookmarked: { type: Boolean, default: false },
    viewedAt: { type: Date, default: null },
    likedAt: { type: Date, default: null }
}, { timestamps: true });

// Compound unique index — one record per user per article
userArticleInteractionSchema.index({ userId: 1, articleId: 1 }, { unique: true });

module.exports = mongoose.model('UserArticleInteraction', userArticleInteractionSchema);
