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
const FEEDS = {
    all: [
        'https://news.google.com/rss/search?q=when:7d+india+supreme+court+OR+high+court+OR+legal&hl=en-IN&gl=IN&ceid=IN:en',
        'https://www.thehindu.com/news/national/feeder/default.rss',
        'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
    ],
    'supreme-court': [
        'https://news.google.com/rss/search?q=india+supreme+court&hl=en-IN&gl=IN&ceid=IN:en',
    ],
    'high-court': [
        'https://news.google.com/rss/search?q=india+high+court+ruling&hl=en-IN&gl=IN&ceid=IN:en',
    ],
    consumer: [
        'https://news.google.com/rss/search?q=india+consumer+rights+law&hl=en-IN&gl=IN&ceid=IN:en',
    ],
    cyber: [
        'https://news.google.com/rss/search?q=india+cyber+crime+law&hl=en-IN&gl=IN&ceid=IN:en',
    ],
    family: [
        'https://news.google.com/rss/search?q=india+family+law+divorce+custody&hl=en-IN&gl=IN&ceid=IN:en',
    ],
    criminal: [
        'https://news.google.com/rss/search?q=india+criminal+law+IPC+BNS&hl=en-IN&gl=IN&ceid=IN:en',
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
    // Google News encodes source in description HTML: <font color="#6f6f6f">Source Name</font>
    if (item.content || item.description) {
        const m = (item.content || item.description).match(/<font[^>]*>([^<]+)<\/font>/i);
        if (m) return m[1];
    }
    return item.creator || item.author || '';
}

// GET /api/news?category=all&limit=20
router.get('/', async (req, res) => {
    try {
        const { category = 'all', limit = 20 } = req.query;
        const feedUrls = FEEDS[category] || FEEDS.all;

        let allItems = [];

        for (const feedUrl of feedUrls) {
            try {
                const feed = await parser.parseURL(feedUrl);
                allItems = [...allItems, ...feed.items];
            } catch (err) {
                console.error(`News feed failed: ${feedUrl}`, err.message);
            }
        }

        // Deduplicate by title
        const seen = new Set();
        const unique = allItems.filter(item => {
            if (seen.has(item.title)) return false;
            seen.add(item.title);
            return true;
        });

        // Sort by date desc
        unique.sort((a, b) => new Date(b.isoDate || b.pubDate) - new Date(a.isoDate || a.pubDate));

        const items = unique.slice(0, Number(limit)).map(item => ({
            title: item.title,
            link: item.link,
            source: extractSource(item),
            pubDate: item.pubDate || item.isoDate,
            snippet: item.contentSnippet || '',
            image: extractImage(item),
        }));

        res.json({ items, total: items.length });
    } catch (err) {
        console.error('News feed error:', err);
        res.status(500).json({ message: 'Failed to fetch news', error: err.message });
    }
});

module.exports = router;
