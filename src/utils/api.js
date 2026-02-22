const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Centralised API helper for LawConnect backend.
 * Automatically attaches firebaseUid from localStorage when needed.
 */

function getUid() {
    return localStorage.getItem('firebaseUid') || null;
}

export function setUid(uid) {
    if (uid) localStorage.setItem('firebaseUid', uid);
}

// ─── Time Utility ────────────────────────────────────────────────────────────
export function timeAgo(date) {
    if (!date) return 'Never';
    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now - then) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return then.toLocaleDateString('en-IN');
}

async function request(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Network error' }));
        throw new Error(err.message || 'Request failed');
    }
    return res.json();
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const getDashboardSummary = (uid = getUid()) =>
    request(`/dashboard/summary?firebaseUid=${uid}`);

// ─── Activities ───────────────────────────────────────────────────────────────
export const logActivity = (data) =>
    request('/activities', {
        method: 'POST',
        body: JSON.stringify({ firebaseUid: getUid(), ...data }),
    });

export const getActivities = (limit = 10, uid = getUid()) =>
    request(`/activities?firebaseUid=${uid}&limit=${limit}`);

// ─── Cases ────────────────────────────────────────────────────────────────────
export const getCases = (uid = getUid()) =>
    request(`/cases?firebaseUid=${uid}`);

export const createCase = (data) =>
    request('/cases', {
        method: 'POST',
        body: JSON.stringify({ firebaseUid: getUid(), ...data }),
    });

export const updateCase = (id, data) =>
    request(`/cases/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ firebaseUid: getUid(), ...data }),
    });

export const deleteCase = (id) =>
    request(`/cases/${id}?firebaseUid=${getUid()}`, { method: 'DELETE' });

// Toggle one milestone completed state
export const toggleMilestone = (caseId, milestoneId, completed) =>
    request(`/cases/${caseId}/milestones`, {
        method: 'PUT',
        body: JSON.stringify({ firebaseUid: getUid(), milestoneId, completed }),
    });

// Add a custom milestone to a case
export const addMilestoneToCaseApi = (caseId, data) =>
    request(`/cases/${caseId}/milestones`, {
        method: 'POST',
        body: JSON.stringify({ firebaseUid: getUid(), ...data }),
    });

// Add a note to a case
export const addNoteToCase = (caseId, text) =>
    request(`/cases/${caseId}/notes`, {
        method: 'POST',
        body: JSON.stringify({ firebaseUid: getUid(), text }),
    });

// ─── Documents ────────────────────────────────────────────────────────────────
export const getDocuments = (uid = getUid()) =>
    request(`/documents?firebaseUid=${uid}`);

// ─── Articles ─────────────────────────────────────────────────────────────────
export const syncArticles = () =>
    request('/articles/sync', {
        method: 'POST',
        body: JSON.stringify({ firebaseUid: getUid() }),
    });

export const getArticles = ({ search = '', category = 'all', difficulty = 'all', sort = 'recent', page = 1, limit = 9, curated = false } = {}, uid = getUid()) =>
    request(`/articles?search=${encodeURIComponent(search)}&category=${category}&difficulty=${difficulty}&sort=${sort}&page=${page}&limit=${limit}&firebaseUid=${uid || ''}${curated ? '&curated=true' : ''}`);

export const getArticleStats = () =>
    request('/articles/stats');

export const getTrendingArticles = () =>
    request('/articles/trending');

export const getRecentlyViewed = (uid = getUid()) =>
    request(`/articles/recently-viewed?firebaseUid=${uid}`);

export const getRecommendedArticles = (uid = getUid()) =>
    request(`/articles/recommended?firebaseUid=${uid}`);

export const getBookmarkedArticles = (uid = getUid()) =>
    request(`/articles/bookmarks?firebaseUid=${uid}`);

export const viewArticle = (articleId) =>
    request(`/articles/${articleId}/view`, {
        method: 'POST',
        body: JSON.stringify({ firebaseUid: getUid() }),
    });

export const toggleArticleBookmark = (articleId) =>
    request(`/articles/${articleId}/bookmark`, {
        method: 'POST',
        body: JSON.stringify({ firebaseUid: getUid() }),
    });

// ─── Legal News ────────────────────────────────────────────────────────────────
export const getNewsItems = (category = 'all', limit = 20) =>
    request(`/news?category=${category}&limit=${limit}`);

export const likeArticle = (articleId) =>
    request(`/articles/${articleId}/like`, {
        method: 'POST',
        body: JSON.stringify({ firebaseUid: getUid() }),
    });

// ─── AI ──────────────────────────────────────────────────────────────────
export const askLegalQuestion = (question, articles = []) =>
    request('/ai/legal-qa', {
        method: 'POST',
        body: JSON.stringify({ question, articles }),
    });

export const smartSearch = (query) =>
    request('/ai/smart-search', {
        method: 'POST',
        body: JSON.stringify({ query }),
    });

export const summariseArticle = (article) =>
    request('/ai/summarise', {
        method: 'POST',
        body: JSON.stringify({
            articleId: article._id || article.id,
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
        }),
    });

export const suggestQuestions = (query, category = 'all') =>
    request('/ai/suggest-questions', {
        method: 'POST',
        body: JSON.stringify({ query, category }),
    });

export const lawLookup = (law, section, query) =>
    request('/ai/law-lookup', {
        method: 'POST',
        body: JSON.stringify({ law, section, query }),
    });

export const legalResearch = (topic, depth = 'quick') =>
    request('/ai/research', {
        method: 'POST',
        body: JSON.stringify({ topic, depth }),
    });

export const generateArticle = (topic, category, difficulty = 'beginner', save = false) =>
    request('/ai/generate-article', {
        method: 'POST',
        body: JSON.stringify({ topic, category, difficulty, save }),
    });

export const generateActionPlan = (problemDescription, category) =>
    request('/ai/generate-action-plan', {
        method: 'POST',
        body: JSON.stringify({ problemDescription, category }),
    });
