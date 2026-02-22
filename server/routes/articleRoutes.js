const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Article = require('../models/Article');
const UserArticleInteraction = require('../models/UserArticleInteraction');

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function getUser(firebaseUid, res) {
    if (!firebaseUid) { res.status(401).json({ message: 'Unauthorized' }); return null; }
    const user = await User.findOne({ firebaseUid });
    if (!user) { res.status(404).json({ message: 'User not found' }); return null; }
    return user;
}

// Merge bookmark flags from user interactions into article list
async function attachBookmarks(articles, userId) {
    if (!userId) return articles.map(a => ({ ...a, isBookmarked: false }));
    const ids = articles.map(a => a._id);
    const interactions = await UserArticleInteraction.find({
        userId,
        articleId: { $in: ids },
        isBookmarked: true
    }).lean();
    const bookmarkedSet = new Set(interactions.map(i => i.articleId.toString()));
    return articles.map(a => ({
        ...a,
        isBookmarked: bookmarkedSet.has(a._id.toString())
    }));
}

// ─── POST /api/articles/sync ──────────────────────────────────────────────────
// Manual trigger to pull dynamic RSS legal news
router.post('/sync', async (req, res) => {
    try {
        const { fetchAndProcessLegalNews } = require('../services/articleFetcher');
        const count = await fetchAndProcessLegalNews();
        res.json({ message: 'Sync complete', count });
    } catch (err) {
        console.error('Error syncing articles manually:', err);
        res.status(500).json({ message: 'Server error during sync', error: err.message });
    }
});

// ─── GET /api/articles ────────────────────────────────────────────────────────
// Query: search, category, difficulty, sort, page, limit, firebaseUid
router.get('/', async (req, res) => {
    try {
        const {
            search = '',
            category = 'all',
            difficulty = 'all',
            sort = 'recent',
            page = 1,
            limit = 9,
            firebaseUid
        } = req.query;

        const query = {};

        // Full-text search
        if (search.trim()) {
            query.$text = { $search: search.trim() };
        }

        // Category filter
        if (category !== 'all') {
            const catMap = {
                consumer: 'Consumer Rights',
                property: 'Property Law',
                cyber: 'Cyber Crimes',
                family: 'Family Law',
                constitutional: 'Constitutional Rights',
                employment: 'Employment',
                criminal: 'Criminal Law'
            };
            query.category = catMap[category] || category;
        }

        // Difficulty filter
        if (difficulty !== 'all') {
            query.difficulty = difficulty;
        }

        // Curated filter (Legal Library only shows non-AI-generated articles)
        if (req.query.curated === 'true') {
            query.isAiGenerated = { $ne: true };
        }

        // Sort
        const sortMap = {
            recent: { publishDate: -1 },
            trending: { views: -1 },
            popular: { likes: -1 },
            oldest: { publishDate: 1 }
        };
        const sortObj = sortMap[sort] || { publishDate: -1 };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Article.countDocuments(query);
        const rawArticles = await Article.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        // Attach user bookmark flags
        let userId = null;
        if (firebaseUid) {
            const user = await User.findOne({ firebaseUid }).lean();
            if (user) userId = user._id;
        }
        const articles = await attachBookmarks(rawArticles, userId);

        res.json({
            articles,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            hasMore: skip + articles.length < total
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// ─── GET /api/articles/stats ──────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
    try {
        const total = await Article.countDocuments();
        const categories = await Article.distinct('category');
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const newThisMonth = await Article.countDocuments({ publishDate: { $gte: oneMonthAgo } });
        const viewsSum = await Article.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]);
        const totalViews = viewsSum[0]?.total || 0;

        res.json({
            total,
            categories: categories.length,
            newThisMonth,
            readers: totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}k+` : totalViews
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ─── GET /api/articles/trending ───────────────────────────────────────────────
router.get('/trending', async (req, res) => {
    try {
        const articles = await Article.find()
            .sort({ views: -1 })
            .limit(5)
            .lean();
        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ─── GET /api/articles/recently-viewed ───────────────────────────────────────
router.get('/recently-viewed', async (req, res) => {
    try {
        const user = await getUser(req.query.firebaseUid, res);
        if (!user) return;

        const interactions = await UserArticleInteraction.find({
            userId: user._id,
            viewedAt: { $ne: null }
        })
            .sort({ viewedAt: -1 })
            .limit(5)
            .populate('articleId')
            .lean();

        const articles = interactions
            .filter(i => i.articleId)
            .map(i => ({
                ...i.articleId,
                viewedAt: i.viewedAt
            }));

        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ─── GET /api/articles/recommended ───────────────────────────────────────────
router.get('/recommended', async (req, res) => {
    try {
        const user = req.query.firebaseUid
            ? await User.findOne({ firebaseUid: req.query.firebaseUid }).lean()
            : null;

        let categories = [];
        if (user) {
            // Find categories the user has interacted with
            const interactions = await UserArticleInteraction.find({
                userId: user._id,
                $or: [{ isBookmarked: true }, { viewedAt: { $ne: null } }]
            }).populate('articleId', 'category').lean();

            categories = [...new Set(
                interactions.filter(i => i.articleId).map(i => i.articleId.category)
            )];
        }

        // Fall back to highest-rated articles if no interaction history
        const query = categories.length > 0 ? { category: { $in: categories } } : {};
        const articles = await Article.find(query)
            .sort({ likes: -1 })
            .limit(4)
            .lean();

        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ─── GET /api/articles/bookmarks ─────────────────────────────────────────────
router.get('/bookmarks', async (req, res) => {
    try {
        const user = await getUser(req.query.firebaseUid, res);
        if (!user) return;

        const interactions = await UserArticleInteraction.find({
            userId: user._id,
            isBookmarked: true
        }).populate('articleId').lean();

        const articles = interactions
            .filter(i => i.articleId)
            .map(i => ({ ...i.articleId, isBookmarked: true }));

        res.json(articles);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ─── GET /api/articles/:id ────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).lean();
        if (!article) return res.status(404).json({ message: 'Article not found' });

        let isBookmarked = false;
        if (req.query.firebaseUid) {
            const user = await User.findOne({ firebaseUid: req.query.firebaseUid }).lean();
            if (user) {
                const interaction = await UserArticleInteraction.findOne({
                    userId: user._id,
                    articleId: article._id
                }).lean();
                isBookmarked = interaction?.isBookmarked || false;
            }
        }

        res.json({ ...article, isBookmarked });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ─── POST /api/articles/:id/view ──────────────────────────────────────────────
router.post('/:id/view', async (req, res) => {
    try {
        const { firebaseUid } = req.body;
        // Increment article view counter
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!article) return res.status(404).json({ message: 'Article not found' });

        // Record user interaction if logged in
        if (firebaseUid) {
            const user = await User.findOne({ firebaseUid }).lean();
            if (user) {
                await UserArticleInteraction.findOneAndUpdate(
                    { userId: user._id, articleId: article._id },
                    { $set: { viewedAt: new Date() } },
                    { upsert: true, new: true }
                );
            }
        }

        res.json({ views: article.views });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// ─── POST /api/articles/:id/bookmark ─────────────────────────────────────────
router.post('/:id/bookmark', async (req, res) => {
    try {
        const { firebaseUid } = req.body;
        const user = await getUser(firebaseUid, res);
        if (!user) return;

        const article = await Article.findById(req.params.id).lean();
        if (!article) return res.status(404).json({ message: 'Article not found' });

        const interaction = await UserArticleInteraction.findOneAndUpdate(
            { userId: user._id, articleId: article._id },
            [{ $set: { isBookmarked: { $not: '$isBookmarked' } } }],
            { upsert: true, new: true }
        );

        res.json({ isBookmarked: interaction.isBookmarked });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ─── POST /api/articles/:id/like ─────────────────────────────────────────────
router.post('/:id/like', async (req, res) => {
    try {
        const { firebaseUid } = req.body;
        const article = await Article.findById(req.params.id).lean();
        if (!article) return res.status(404).json({ message: 'Article not found' });

        // Toggle like — track in interaction
        let liked = false;
        if (firebaseUid) {
            const user = await User.findOne({ firebaseUid }).lean();
            if (user) {
                const interaction = await UserArticleInteraction.findOneAndUpdate(
                    { userId: user._id, articleId: article._id },
                    [{
                        $set: {
                            likedAt: {
                                $cond: [{ $eq: ['$likedAt', null] }, new Date(), null]
                            }
                        }
                    }],
                    { upsert: true, new: true }
                );
                liked = !!interaction.likedAt;
                // Adjust article like counter
                await Article.findByIdAndUpdate(
                    req.params.id,
                    { $inc: { likes: liked ? 1 : -1 } }
                );
            }
        }

        const updated = await Article.findById(req.params.id).lean();
        res.json({ likes: updated.likes, liked });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
