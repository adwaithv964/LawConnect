const express = require('express');
const router = express.Router();
const Parser = require('rss-parser');

const parser = new Parser({
    customFields: {
        item: [
            ['enclosure', 'enclosure'],
            ['media:content', 'mediaContent']
        ]
    }
});

// RSS feeds indexed by category filter
// ─── LEGAL NEWS (strict legal topics only) ─────────────────────────────────
const LEGAL_FEEDS = {
    all: [
        // Google News: strict Indian legal / court queries
        'https://news.google.com/rss/search?q=india+supreme+court+verdict+OR+judgment&hl=en-IN&gl=IN&ceid=IN:en',
        'https://news.google.com/rss/search?q=india+high+court+ruling+OR+order&hl=en-IN&gl=IN&ceid=IN:en',
        'https://news.google.com/rss/search?q=india+law+amendment+OR+legal+reform+OR+court+order&hl=en-IN&gl=IN&ceid=IN:en',
        // LiveLaw — India's leading legal news outlet
        'https://www.livelaw.in/feeds/',
    ],
    'supreme-court': [
        'https://news.google.com/rss/search?q=india+supreme+court+judgment+OR+verdict&hl=en-IN&gl=IN&ceid=IN:en',
    ],
    'high-court': [
        'https://news.google.com/rss/search?q=india+high+court+ruling+OR+order+2025&hl=en-IN&gl=IN&ceid=IN:en',
    ],
    consumer: [
        'https://news.google.com/rss/search?q=india+consumer+court+OR+consumer+rights+law&hl=en-IN&gl=IN&ceid=IN:en',
    ],
    cyber: [
        'https://news.google.com/rss/search?q=india+cyber+crime+law+OR+IT+Act+court&hl=en-IN&gl=IN&ceid=IN:en',
    ],
    family: [
        'https://news.google.com/rss/search?q=india+family+law+divorce+OR+custody+court&hl=en-IN&gl=IN&ceid=IN:en',
    ],
    criminal: [
        'https://news.google.com/rss/search?q=india+criminal+law+BNS+OR+IPC+court+verdict&hl=en-IN&gl=IN&ceid=IN:en',
    ],
};

// ─── CURRENT AFFAIRS (general Indian & world news) ─────────────────────────
const CURRENT_AFFAIRS_FEEDS = {
    all: [
        'https://www.thehindu.com/news/national/feeder/default.rss',
        'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
        'https://feeds.feedburner.com/ndtvnews-india-news',
        'https://indianexpress.com/feed/',
    ],
    india: [
        'https://news.google.com/rss/search?q=india+news+today&hl=en-IN&gl=IN&ceid=IN:en',
        'https://www.thehindu.com/news/national/feeder/default.rss',
    ],
    politics: [
        'https://news.google.com/rss/search?q=india+politics+parliament+government&hl=en-IN&gl=IN&ceid=IN:en',
    ],
    economy: [
        'https://news.google.com/rss/search?q=india+economy+budget+RBI+finance&hl=en-IN&gl=IN&ceid=IN:en',
    ],
    world: [
        'https://news.google.com/rss/search?q=world+news+today&hl=en-IN&gl=IN&ceid=IN:en',
        'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
    ],
    science: [
        'https://news.google.com/rss/search?q=india+science+technology+space+ISRO&hl=en-IN&gl=IN&ceid=IN:en',
    ],
};

function extractImage(item) {
    if (item.enclosure && item.enclosure.url) return item.enclosure.url;
    if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) return item.mediaContent.$.url;
    if (item.content) {
        const m = item.content.match(/<img[^>]*src=['"]([^'"]+)['"]/i);
        if (m) return m[1];
    }
    return null;
}

function extractSource(item) {
    if (item.content || item.description) {
        const m = (item.content || item.description).match(/<font[^>]*>([^<]+)<\/font>/i);
        if (m) return m[1];
    }
    return item.creator || item.author || '';
}

// ─── Shared feed fetcher ──────────────────────────────────────────────────────
async function fetchFromFeeds(feedMap, category, limit) {
    const feedUrls = feedMap[category] || feedMap.all;
    let allItems = [];

    for (const feedUrl of feedUrls) {
        try {
            const feed = await parser.parseURL(feedUrl);
            allItems = [...allItems, ...feed.items];
        } catch (err) {
            console.error(`Feed failed: ${feedUrl}`, err.message);
        }
    }

    // Deduplicate by title
    const seen = new Set();
    const unique = allItems.filter(item => {
        if (seen.has(item.title)) return false;
        seen.add(item.title);
        return true;
    });

    // Sort newest first
    unique.sort((a, b) => new Date(b.isoDate || b.pubDate) - new Date(a.isoDate || a.pubDate));

    return unique.slice(0, Number(limit)).map(item => ({
        title: item.title,
        link: item.link,
        source: extractSource(item),
        pubDate: item.pubDate || item.isoDate,
        snippet: item.contentSnippet || '',
        image: extractImage(item),
    }));
}

// GET /api/news?category=all&limit=24  — LEGAL topics only
router.get('/', async (req, res) => {
    try {
        const { category = 'all', limit = 24 } = req.query;
        const items = await fetchFromFeeds(LEGAL_FEEDS, category, limit);
        res.json({ items, total: items.length });
    } catch (err) {
        console.error('Legal news feed error:', err);
        res.status(500).json({ message: 'Failed to fetch legal news', error: err.message });
    }
});

// GET /api/current-affairs?category=all&limit=24  — General current affairs
router.get('/current-affairs', async (req, res) => {
    try {
        const { category = 'all', limit = 24 } = req.query;
        const items = await fetchFromFeeds(CURRENT_AFFAIRS_FEEDS, category, limit);
        res.json({ items, total: items.length });
    } catch (err) {
        console.error('Current affairs feed error:', err);
        res.status(500).json({ message: 'Failed to fetch current affairs', error: err.message });
    }
});

module.exports = router;

