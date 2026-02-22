const Parser = require('rss-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Article = require('../models/Article');

const parser = new Parser({
    customFields: {
        item: [
            ['enclosure', 'enclosure'],
            ['media:content', 'mediaContent']
        ]
    }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Reliable RSS feeds that include images and real legal news
const RSS_FEEDS = [
    'https://www.thehindu.com/news/national/feeder/default.rss',      // The Hindu - National (includes legal/SC news)
    'https://www.thehindu.com/topic/supreme-court/feeder/default.rss', // The Hindu - Supreme Court
    'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms',      // TOI - Legal/Law section
];

// Helper to extract image URL from an RSS item
function extractImage(item) {
    // Try enclosure (most common)
    if (item.enclosure && item.enclosure.url) {
        return item.enclosure.url;
    }
    // Try media:content
    if (item.mediaContent && item.mediaContent.$ && item.mediaContent.$.url) {
        return item.mediaContent.$.url;
    }
    // Try extracting <img> from HTML content
    if (item.content) {
        const m = item.content.match(/<img[^>]*src=['"]([^'"]+)['"]/i);
        if (m) return m[1];
    }
    return null;
}

// Helper to clean up any markdown JSON blocks Gemini might return
const cleanJsonString = (str) => {
    let cleaned = str.trim();
    if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '');
    if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '');
    if (cleaned.endsWith('```')) cleaned = cleaned.replace(/```$/, '');
    return cleaned.trim();
};

async function fetchAndProcessLegalNews() {
    console.log('🔄 Starting dynamic fetch of legal news...');
    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ GEMINI_API_KEY is not configured. Cannot process news.');
        return 0;
    }

    try {
        let allItems = [];
        for (const feedUrl of RSS_FEEDS) {
            try {
                const feed = await parser.parseURL(feedUrl);
                // Filter to only items that have an image
                const withImages = feed.items.filter(item => extractImage(item));
                allItems = [...allItems, ...withImages];
            } catch (err) {
                console.error(`Failed to fetch RSS feed ${feedUrl}:`, err.message);
            }
        }

        if (allItems.length === 0) {
            console.log('No news items with images found in feeds.');
            return 0;
        }

        // Shuffle and pick top 3
        const shuffled = allItems.sort(() => 0.5 - Math.random());
        const selectedItems = shuffled.slice(0, 3);

        console.log(`Processing ${selectedItems.length} news items via Gemini...`);

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        let addedCount = 0;

        for (const item of selectedItems) {
            // Check for duplicates using the original source link
            const existing = await Article.findOne({ 'citations.url': item.link });
            if (existing) {
                console.log(`Skipping already processed article: ${item.title}`);
                continue;
            }

            // Extract real image from feed
            const realImage = extractImage(item);

            const prompt = `
You are an expert Indian legal editor for "LawConnect", a platform for ordinary citizens.
Take this recent news snippet and turn it into a comprehensive, easy-to-understand educational legal article about the relevant Indian legal concepts.

Original News Title: ${item.title}
Original Snippet: ${item.contentSnippet || item.content || ''}

Write a well-structured article that explains the legal concept behind this news.
Format the 'content' field with markdown (paragraphs, bullet points with *, bold text with **).

Output ONLY a valid JSON object with no markdown fences:
{
    "title": "A clear, engaging title for the article",
    "excerpt": "A 2-sentence summary of the article",
    "content": "The full article content properly formatted (around 250-350 words).",
    "category": "Choose exactly one: Consumer Rights, Property Law, Cyber Crimes, Family Law, Constitutional Rights, Employment, Criminal Law, Other",
    "categoryIcon": "Choose one: ShoppingCart (Consumer), Home (Property), Shield (Cyber), Users (Family), Scale (Constitutional), Briefcase (Employment), Gavel (Criminal), FileText (Other)",
    "difficulty": "Choose exactly one: beginner, intermediate, advanced",
    "readTime": 6,
    "tags": ["tag1", "tag2", "tag3", "tag4"]
}`;

            try {
                const result = await model.generateContent(prompt);
                const responseText = result.response.text();
                const jsonStr = cleanJsonString(responseText);
                const articleData = JSON.parse(jsonStr);

                // Use the REAL extracted image from RSS
                articleData.image = realImage;
                articleData.imageAlt = articleData.title;

                articleData.citations = [{
                    title: item.title,
                    url: item.link || '',
                    source: item.creator || 'News RSS'
                }];

                articleData.isAiGenerated = true;
                articleData.views = Math.floor(Math.random() * 80);
                articleData.likes = Math.floor(Math.random() * 20);
                articleData.publishDate = new Date();

                const newArticle = new Article(articleData);
                await newArticle.save();
                addedCount++;
                console.log(`✅ Added new dynamic article with real image: ${articleData.title}`);
                console.log(`   Image: ${realImage}`);

            } catch (aiErr) {
                console.error(`Failed to process item with Gemini: ${item.title}`, aiErr.message);
            }
        }

        console.log(`🎉 Finished syncing. Added ${addedCount} new articles to the library.`);
        return addedCount;

    } catch (err) {
        console.error('Error in fetchAndProcessLegalNews:', err);
        throw err;
    }
}

module.exports = {
    fetchAndProcessLegalNews
};
