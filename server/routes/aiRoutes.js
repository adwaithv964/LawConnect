const express = require('express');
const router = express.Router();
const Article = require('../models/Article');

// ─── Indian Law System Prompt ─────────────────────────────────────────────────
const INDIAN_LAW_SYSTEM = `You are LegalAI, an expert Indian legal research assistant integrated into LawConnect.

You have comprehensive knowledge of:
- Indian Penal Code (IPC) 1860 and its replacement Bharatiya Nyaya Sanhita (BNS) 2023
- Code of Civil Procedure (CPC) 1908
- Code of Criminal Procedure (CrPC) 1973 and its replacement Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023
- Indian Evidence Act 1872 and its replacement Bharatiya Sakshya Adhiniyam (BSA) 2023
- Constitution of India 1950 (all Articles and Schedules)
- Consumer Protection Act 2019
- Transfer of Property Act 1882
- Registration Act 1908
- Information Technology Act 2000 & IT (Amendment) Act 2008
- Cyber crime provisions under BNS 2023
- Supreme Court and High Court landmark judgments
- Legal aid, RTI, RERA, and other modern Indian statutes

Always cite specific section numbers when referencing laws.
When IPC sections have BNS equivalents, mention both.
Provide answers that are accurate, comprehensive, and actionable.
Use plain English but include proper legal terminology.`;

// ─── Gemini client factory ────────────────────────────────────────────────────
let genAI = null;
function getClient() {
    if (!genAI) {
        const key = process.env.GEMINI_API_KEY;
        if (!key || key === 'your-gemini-api-key-here') {
            throw new Error('GEMINI_API_KEY is not set in .env');
        }
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        genAI = new GoogleGenerativeAI(key);
    }
    return genAI;
}

// Standard model (no grounding)
function getModel() {
    return getClient().getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: INDIAN_LAW_SYSTEM,
    });
}

// Model with Google Search grounding — searches the live web
function getGroundedModel() {
    return getClient().getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction: INDIAN_LAW_SYSTEM,
        tools: [{ google_search: {} }],
    });
}

// Extract web citations from grounding metadata
function extractCitations(response) {
    try {
        const meta = response.candidates?.[0]?.groundingMetadata;
        if (!meta) return [];

        const chunks = meta.groundingChunks || [];
        const queries = meta.webSearchQueries || [];
        const supports = meta.groundingSupports || [];

        const citations = chunks
            .filter(c => c.web?.uri)
            .map(c => ({
                title: c.web.title || '',
                url: c.web.uri,
                source: new URL(c.web.uri).hostname.replace('www.', ''),
            }));

        return { citations, queries };
    } catch (_) {
        return { citations: [], queries: [] };
    }
}

function aiNotConfigured(res) {
    return res.status(503).json({
        message: 'AI features require GEMINI_API_KEY in .env',
        code: 'AI_NOT_CONFIGURED'
    });
}

function stripFences(text) {
    return text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
}

// ─── POST /api/ai/legal-qa (UPGRADED — Google Search grounding) ───────────────
router.post('/legal-qa', async (req, res) => {
    try {
        const model = getGroundedModel();
        const { question, articles = [] } = req.body;
        if (!question?.trim()) return res.status(400).json({ message: 'Question is required' });

        const articleContext = articles.slice(0, 8).map((a, i) =>
            `[Article ${i + 1}] "${a.title}" (${a.category}): ${a.excerpt}`
        ).join('\n\n');

        const prompt = `Answer this Indian legal question accurately. Search the web for current information.

${articleContext ? `Available library articles for reference:\n${articleContext}\n\n` : ''}
User question: ${question}

Provide:
1. Direct, clear answer with relevant law sections (e.g. "Under Section 302 IPC / Section 101 BNS...")
2. Key bullet points on rights, remedies, and procedures
3. Relevant court judgments if applicable
4. Practical next steps the person can take
5. Brief disclaimer: general information, not legal advice

Do not use markdown headers. Use plain paragraphs and bullet points.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const { citations, queries } = extractCitations(result.response);

        const referencedArticles = articles.filter((_, i) => text.includes(`[Article ${i + 1}]`));
        res.json({ answer: text, referencedArticles, citations, searchQueries: queries });
    } catch (err) {
        if (err.message?.includes('GEMINI_API_KEY')) return aiNotConfigured(res);
        console.error('AI Q&A error:', err.message);
        res.status(500).json({ message: 'AI service error', error: err.message });
    }
});

// ─── POST /api/ai/smart-search (UPGRADED — grounded) ─────────────────────────
router.post('/smart-search', async (req, res) => {
    try {
        const model = getModel();   // No grounding needed — pure analysis
        const { query } = req.body;
        if (!query?.trim()) return res.status(400).json({ message: 'Query is required' });

        const prompt = `Analyse this Indian legal search query and extract structured information.

Query: "${query}"

Respond ONLY with valid JSON (no markdown) in this exact format:
{
  "searchTerms": "key Indian legal terms comma separated",
  "suggestedCategory": "one of: consumer, property, cyber, family, constitutional, all",
  "intent": "what the user wants to know in one short sentence",
  "relatedLaws": ["specific law or section name 1", "law 2", "law 3"],
  "suggestions": ["follow-up question 1", "follow-up question 2", "follow-up question 3", "follow-up question 4"]
}`;

        const result = await model.generateContent(prompt);
        const parsed = JSON.parse(stripFences(result.response.text()));
        res.json(parsed);
    } catch (err) {
        if (err.message?.includes('GEMINI_API_KEY')) return aiNotConfigured(res);
        res.json({ searchTerms: req.body.query, suggestedCategory: 'all', intent: '', relatedLaws: [], suggestions: [] });
    }
});

// ─── POST /api/ai/summarise ───────────────────────────────────────────────────
router.post('/summarise', async (req, res) => {
    try {
        const model = getGroundedModel();
        const { title, excerpt, content } = req.body;
        if (!title) return res.status(400).json({ message: 'Article title is required' });

        const prompt = `Summarise this Indian legal article in exactly 3 concise sentences. Plain English, no jargon.

Article title: "${title}"
Content: ${(content || excerpt || '').substring(0, 3000)}

Write only the 3-sentence summary. No intro, no headers.`;

        const result = await model.generateContent(prompt);
        const summary = result.response.text().trim();
        const { citations } = extractCitations(result.response);
        res.json({ summary, citations });
    } catch (err) {
        if (err.message?.includes('GEMINI_API_KEY')) return aiNotConfigured(res);
        res.status(500).json({ message: 'AI service error', error: err.message });
    }
});

// ─── POST /api/ai/suggest-questions ──────────────────────────────────────────
router.post('/suggest-questions', async (req, res) => {
    try {
        const model = getModel();
        const { query, category = '' } = req.body;

        const prompt = `A user searched Indian legal resources for: "${query}"${category && category !== 'all' ? ` in ${category}` : ''}

Generate exactly 4 practical follow-up questions about Indian law they might want answered next.
ONLY return a JSON array of 4 strings. Example: ["How do I file RTI?", "RTI timeline?", "RTI rejection?", "RTI appeal?"]`;

        const result = await model.generateContent(prompt);
        const questions = JSON.parse(stripFences(result.response.text()));
        res.json({ questions: Array.isArray(questions) ? questions : [] });
    } catch (err) {
        if (err.message?.includes('GEMINI_API_KEY')) return aiNotConfigured(res);
        res.json({ questions: [] });
    }
});

// ─── POST /api/ai/law-lookup (NEW) ───────────────────────────────────────────
// Looks up a specific section or provision in any major Indian law
// Body: { law: 'IPC', section: '302', query?: string }
router.post('/law-lookup', async (req, res) => {
    try {
        const model = getGroundedModel();
        const { law, section, query } = req.body;
        if (!law && !query) return res.status(400).json({ message: 'law or query required' });

        const lookupTarget = query || `${law} Section ${section}`;

        const prompt = `Look up this Indian legal provision and provide comprehensive information.

Provision: ${lookupTarget}

Provide:
1. EXACT TEXT: The verbatim text of the section/provision (if it's a specific section)
2. PLAIN ENGLISH: What this law/section means in simple terms (2-3 sentences)
3. KEY ELEMENTS: Bullet points of essential elements or conditions
4. PUNISHMENT/REMEDY: Specific punishment, penalty, or remedy provided
5. IPC-BNS MAPPING: If this is IPC, state the equivalent BNS section and vice versa. Same for CrPC/BNSS and Evidence Act/BSA.
6. LANDMARK CASES: 2-3 key Supreme Court or High Court judgments interpreting this provision
7. PRACTICAL APPLICATION: When and how a common person would encounter this law

Use web search to verify the current, accurate text of this provision.`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const { citations, queries } = extractCitations(result.response);

        res.json({ content: text, citations, searchQueries: queries, lookupTarget });
    } catch (err) {
        if (err.message?.includes('GEMINI_API_KEY')) return aiNotConfigured(res);
        console.error('Law lookup error:', err.message);
        res.status(500).json({ message: 'AI service error', error: err.message });
    }
});

// ─── POST /api/ai/research (NEW) ─────────────────────────────────────────────
// Deep legal research on any Indian legal topic — returns structured report
// Body: { topic: string, depth?: 'quick' | 'deep' }
router.post('/research', async (req, res) => {
    try {
        const model = getGroundedModel();
        const { topic, depth = 'quick' } = req.body;
        if (!topic?.trim()) return res.status(400).json({ message: 'Topic is required' });

        const isDeep = depth === 'deep';

        const prompt = `Conduct a ${isDeep ? 'comprehensive' : 'focused'} Indian legal research report on: "${topic}"

Search current Indian legal databases, court websites, and authoritative sources.

Structure your report as follows (use these exact labels on each line):

OVERVIEW:
[2-3 sentence overview of this legal topic in Indian law]

GOVERNING_LAWS:
[List the specific Acts, sections, and provisions that govern this topic]

RIGHTS_AND_REMEDIES:
[What rights does a person have? What legal remedies are available?]

PROCEDURE:
[Step-by-step process to exercise rights or seek remedy]

RECENT_JUDGMENTS:
[2-4 key Supreme Court/High Court judgments with citations]

KEY_POINTS:
[5-7 bullet points of the most important things to know]

PRACTICAL_ADVICE:
[2-3 sentences of practical, actionable advice]

Be specific. Cite exact section numbers. Reference actual judgments by case name and year.`;

        const result = await model.generateContent(prompt);
        const raw = result.response.text();
        const { citations, queries } = extractCitations(result.response);

        // Parse structured sections
        const sections = {};
        const sectionKeys = ['OVERVIEW', 'GOVERNING_LAWS', 'RIGHTS_AND_REMEDIES', 'PROCEDURE', 'RECENT_JUDGMENTS', 'KEY_POINTS', 'PRACTICAL_ADVICE'];
        const regex = new RegExp(`(${sectionKeys.join('|')}):([\\s\\S]*?)(?=${sectionKeys.join(':|')}:|$)`, 'g');
        let match;
        while ((match = regex.exec(raw)) !== null) {
            sections[match[1]] = match[2].trim();
        }

        res.json({ topic, raw, sections, citations, searchQueries: queries });
    } catch (err) {
        if (err.message?.includes('GEMINI_API_KEY')) return aiNotConfigured(res);
        console.error('Research error:', err.message);
        res.status(500).json({ message: 'AI service error', error: err.message });
    }
});

// ─── POST /api/ai/generate-article (NEW) ─────────────────────────────────────
// Generates a full legal article and optionally saves to MongoDB
// Body: { topic: string, category: string, difficulty?: string, save?: boolean }
router.post('/generate-article', async (req, res) => {
    try {
        const model = getGroundedModel();
        const { topic, category = 'constitutional', difficulty = 'beginner', save = false } = req.body;
        if (!topic?.trim()) return res.status(400).json({ message: 'Topic is required' });

        const prompt = `Write a comprehensive legal article for Indian citizens on: "${topic}"

Category: ${category}
Difficulty level: ${difficulty}

Write a complete article with:

TITLE: [A clear, specific article title]

EXCERPT: [2 sentences that summarise the article — will show in search results]

CONTENT: [Full article body — 600-900 words, covering: what the law says, your rights, how to exercise them, real examples, practical tips. Use paragraphs, not bullet points for main content.]

KEY_TAKEAWAYS: [5 bullet points of the most important facts]

TAGS: [5 comma-separated tags]

The article should cite specific Indian laws with section numbers, be factually accurate based on current Indian law, and be written for a layperson who knows little about law but needs practical guidance.`;

        const result = await model.generateContent(prompt);
        const raw = result.response.text();
        const { citations } = extractCitations(result.response);

        // Parse article sections
        const extract = (key, text) => {
            const match = text.match(new RegExp(`${key}:\\s*([\\s\\S]*?)(?=\\n[A-Z_]+:|$)`));
            return match ? match[1].trim() : '';
        };

        const article = {
            title: extract('TITLE', raw).replace(/^\*+|\*+$/g, '').trim(),
            excerpt: extract('EXCERPT', raw),
            content: extract('CONTENT', raw),
            keyTakeaways: extract('KEY_TAKEAWAYS', raw),
            tags: extract('TAGS', raw).split(',').map(t => t.trim()).filter(Boolean),
            category: category.toLowerCase(),
            difficulty: difficulty.toLowerCase(),
            citations,
            isAiGenerated: true,
        };

        // Save to MongoDB if requested
        let saved = null;
        if (save && article.title && article.excerpt) {
            saved = await Article.create({
                title: article.title,
                excerpt: article.excerpt,
                content: article.content,
                category: article.category,
                difficulty: article.difficulty,
                tags: article.tags,
                citations: citations,
                isAiGenerated: true,
                readTime: Math.ceil((article.content || '').split(/\s+/).length / 200),
                publishDate: new Date(),
            });
        }

        res.json({ article, savedId: saved?._id || null, citations });
    } catch (err) {
        if (err.message?.includes('GEMINI_API_KEY')) return aiNotConfigured(res);
        console.error('Generate article error:', err.message);
        res.status(500).json({ message: 'AI service error', error: err.message });
    }
});

// ─── POST /api/ai/generate-action-plan (NEW) ──────────────────────────────────
// Generates a structured legal action plan based on user problem
// Body: { problemDescription: string, category: string }
router.post('/generate-action-plan', async (req, res) => {
    try {
        const model = getGroundedModel();
        const { problemDescription, category } = req.body;

        if (!problemDescription || problemDescription.length < 50) {
            return res.status(400).json({ message: 'Problem description must be at least 50 characters.' });
        }
        if (!category) {
            return res.status(400).json({ message: 'Category is required.' });
        }

        const prompt = `Analyze this legal problem from an Indian citizen and generate a comprehensive, step-by-step legal action plan.

Problem Description: "${problemDescription}"
Legal Category: ${category}

Respond ONLY with valid JSON (no markdown fences, no extra text) in this exact structure:
{
  "totalSteps": <number of steps (usually 4 to 8)>,
  "estimatedDuration": "<realistic time estimate, e.g., '45-60 days' or '3-6 months'>",
  "complexity": "<'low', 'medium', or 'high'>",
  "consultationPoints": [
    "<when/why they should consult a lawyer - point 1>",
    "<when/why they should consult a lawyer - point 2>"
  ],
  "steps": [
    {
      "id": 1,
      "title": "<Clear step title>",
      "description": "<Brief description of what to do in this step>",
      "priority": "<'high', 'medium', or 'low'>",
      "timeLimit": "<e.g., '1-2 days'>",
      "cost": "<e.g., 'Free', or '₹500-1000'>",
      "detailedSteps": [
        "<action bullet 1>",
        "<action bullet 2>"
      ],
      "requiredDocuments": [
        "<doc name 1>",
        "<doc name 2>"
      ],
      "legalSections": [
        {
          "section": "<e.g., 'Consumer Protection Act - Section 35'>",
          "description": "<Brief what this section does>"
        }
      ],
      "tips": [
        "<practical tip 1>",
        "<practical tip 2>"
      ]
    }
  ]
}

Ensure the steps are logical, sequential, practical for an Indian context, and legally sound. Always suggest starting with amicable resolution or formal notices before jumping straight to court, unless the problem warrants immediate police/court action.`;

        const result = await model.generateContent(prompt);
        const rawText = stripFences(result.response.text());

        let plan;
        try {
            plan = JSON.parse(rawText);
        } catch (parseError) {
            console.error('Failed to parse AI action plan JSON:', parseError);
            console.error('Raw output:', rawText);
            return res.status(500).json({ message: 'Failed to generate a valid action plan format.' });
        }

        res.json({ plan });
    } catch (err) {
        if (err.message?.includes('GEMINI_API_KEY')) return aiNotConfigured(res);
        console.error('Action plan generation error:', err.message);
        res.status(500).json({ message: 'AI service error', error: err.message });
    }
});

module.exports = router;
