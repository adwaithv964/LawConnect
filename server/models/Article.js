const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, default: '' },
    category: {
        type: String,
        enum: ['Consumer Rights', 'Property Law', 'Cyber Crimes', 'Family Law', 'Constitutional Rights', 'Employment', 'Criminal Law', 'Other'],
        required: true
    },
    categoryIcon: { type: String, default: 'FileText' },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    readTime: { type: Number, default: 5 },
    image: { type: String, default: '' },
    imageAlt: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isAiGenerated: { type: Boolean, default: false },
    citations: [{ title: String, url: String, source: String }],
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    publishDate: { type: Date, default: Date.now }
}, { timestamps: true });


// Text search index
articleSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });
// Category + difficulty index
articleSchema.index({ category: 1, difficulty: 1 });
// Trending index
articleSchema.index({ views: -1 });

module.exports = mongoose.model('Article', articleSchema);
