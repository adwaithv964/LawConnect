import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '../AdminAuthContext';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const CATEGORIES = ['Consumer Rights', 'Property Law', 'Cyber Crimes', 'Family Law', 'Constitutional Rights', 'Employment', 'Criminal Law', 'Other'];
const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const EMPTY_ARTICLE = { title: '', excerpt: '', content: '', category: 'Consumer Rights', difficulty: 'beginner', readTime: 5, isFeatured: false, tags: '' };

export default function ArticleManager() {
    const { adminToken } = useAdminAuth();
    const [articles, setArticles] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(null); // 'create' | 'edit' | null
    const [form, setForm] = useState(EMPTY_ARTICLE);
    const [editId, setEditId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => { fetchArticles(); }, [page, search, category]);

    async function fetchArticles() {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit: 15, search });
            if (category !== 'all') params.set('category', category);
            const res = await fetch(`${API}/admin/articles?${params}`, { headers: { 'x-admin-token': adminToken } });
            const data = await res.json();
            setArticles(data.articles || []);
            setTotal(data.total || 0);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }

    function openCreate() { setForm(EMPTY_ARTICLE); setEditId(null); setModal('create'); }
    function openEdit(article) {
        setForm({ ...article, tags: (article.tags || []).join(', ') });
        setEditId(article._id);
        setModal('edit');
    }

    async function saveArticle() {
        setSaving(true);
        const body = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [], readTime: parseInt(form.readTime) || 5 };
        try {
            const url = editId ? `${API}/admin/articles/${editId}` : `${API}/admin/articles`;
            const method = editId ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'x-admin-token': adminToken }, body: JSON.stringify(body) });
            if (res.ok) {
                showToast(editId ? '✏️ Article updated!' : '📝 Article created!', '#22c55e');
                setModal(null);
                fetchArticles();
            } else {
                const d = await res.json();
                showToast(d.message || 'Save failed', '#ef4444');
            }
        } catch (err) { showToast('Save failed', '#ef4444'); }
        finally { setSaving(false); }
    }

    async function deleteArticle(id) {
        try {
            const res = await fetch(`${API}/admin/articles/${id}`, { method: 'DELETE', headers: { 'x-admin-token': adminToken } });
            if (res.ok) { showToast('🗑️ Article deleted', '#ef4444'); fetchArticles(); }
        } catch (err) { showToast('Delete failed', '#ef4444'); }
        finally { setDeleteConfirm(null); }
    }

    function showToast(msg, color) { setToast({ msg, color }); setTimeout(() => setToast(null), 3000); }

    const totalPages = Math.ceil(total / 15);
    const inputStyle = { width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box', marginBottom: 12 };
    const labelStyle = { display: 'block', color: '#8892b0', fontSize: '0.75rem', fontWeight: 500, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.07em' };

    return (
        <div style={{ padding: '32px 36px' }}>
            <style>{`.art-row:hover{background:rgba(124,106,247,0.05)!important}.search-inp:focus{border-color:#7c6af7!important;outline:none;box-shadow:0 0 0 3px rgba(124,106,247,0.15)} input:focus,select:focus,textarea:focus{border-color:#7c6af7!important;outline:none;}`}</style>

            {toast && <div style={{ position: 'fixed', top: 24, right: 24, padding: '12px 20px', background: toast.color, borderRadius: 10, color: '#fff', fontWeight: 600, fontSize: '0.85rem', zIndex: 9999 }}>{toast.msg}</div>}

            {/* Delete confirm */}
            {deleteConfirm && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9998 }}>
                    <div style={{ background: '#141b2d', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: 28, width: 360 }}>
                        <h3 style={{ color: '#fff', margin: '0 0 10px', fontSize: '1rem' }}>🗑️ Delete Article?</h3>
                        <p style={{ color: '#8892b0', margin: '0 0 20px', fontSize: '0.85rem' }}>This action cannot be undone.</p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button onClick={() => setDeleteConfirm(null)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#8892b0', cursor: 'pointer', fontSize: '0.82rem' }}>Cancel</button>
                            <button onClick={() => deleteArticle(deleteConfirm)} style={{ padding: '8px 16px', background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Article Form Modal */}
            {modal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9997, padding: 20 }}>
                    <div style={{ background: '#141b2d', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 32, width: '100%', maxWidth: 680, maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3 style={{ color: '#fff', margin: '0 0 24px', fontSize: '1.1rem', fontWeight: 700 }}>{modal === 'create' ? '📝 Create New Article' : '✏️ Edit Article'}</h3>

                        <label style={labelStyle}>Title *</label>
                        <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Article title…" />

                        <label style={labelStyle}>Excerpt / Summary *</label>
                        <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Brief description…" />

                        <label style={labelStyle}>Full Content</label>
                        <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Full article content (Markdown supported)…" />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                            <div>
                                <label style={labelStyle}>Category *</label>
                                <select style={{ ...inputStyle, marginBottom: 0 }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Difficulty</label>
                                <select style={{ ...inputStyle, marginBottom: 0 }} value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))}>
                                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={labelStyle}>Read Time (min)</label>
                                <input type="number" style={{ ...inputStyle, marginBottom: 0 }} value={form.readTime} onChange={e => setForm(f => ({ ...f, readTime: e.target.value }))} min={1} max={60} />
                            </div>
                        </div>

                        <label style={labelStyle}>Tags (comma-separated)</label>
                        <input style={inputStyle} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. consumer, property, rights" />

                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8892b0', fontSize: '0.85rem', cursor: 'pointer', marginBottom: 20 }}>
                            <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                            ⭐ Feature this article on the library homepage
                        </label>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                            <button onClick={() => setModal(null)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, color: '#8892b0', cursor: 'pointer', fontSize: '0.88rem' }}>Cancel</button>
                            <button onClick={saveArticle} disabled={saving || !form.title || !form.excerpt}
                                style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #7c6af7, #5b4fe0)', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
                                {saving ? 'Saving…' : modal === 'create' ? '📝 Create Article' : '✏️ Update Article'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff', margin: 0 }}>Article Manager</h1>
                    <p style={{ color: '#8892b0', margin: '4px 0 0', fontSize: '0.85rem' }}>{total.toLocaleString()} articles in Legal Library</p>
                </div>
                <button onClick={openCreate} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #7c6af7, #5b4fe0)', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, boxShadow: '0 4px 12px rgba(124,106,247,0.3)' }}>+ New Article</button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
                <input className="search-inp" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="🔍  Search title or excerpt…"
                    style={{ flex: '1 1 220px', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, color: '#fff', fontSize: '0.88rem', transition: 'all 0.2s' }} />
                <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
                    style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: '#c8d0e8', fontSize: '0.85rem' }}>
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Article list */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            {['Title', 'Category', 'Difficulty', 'Views', 'Published', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', color: '#4a5568', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#4a5568' }}>Loading articles…</td></tr>
                            : articles.map(art => (
                                <tr key={art._id} className="art-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}>
                                    <td style={{ padding: '12px 20px', maxWidth: 280 }}>
                                        <div style={{ color: '#c8d0e8', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {art.isFeatured && <span style={{ fontSize: '0.7rem', color: '#f59e0b', marginRight: 6 }}>⭐</span>}
                                            {art.title}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 20px' }}>
                                        <span style={{ background: 'rgba(124,106,247,0.15)', color: '#7c6af7', padding: '3px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 500 }}>{art.category}</span>
                                    </td>
                                    <td style={{ padding: '12px 20px', color: '#8892b0', fontSize: '0.8rem', textTransform: 'capitalize' }}>{art.difficulty}</td>
                                    <td style={{ padding: '12px 20px', color: '#8892b0', fontSize: '0.8rem' }}>{(art.views || 0).toLocaleString()}</td>
                                    <td style={{ padding: '12px 20px', color: '#8892b0', fontSize: '0.8rem' }}>{new Date(art.publishDate || art.createdAt).toLocaleDateString('en-IN')}</td>
                                    <td style={{ padding: '12px 20px' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            <button onClick={() => openEdit(art)} style={{ padding: '4px 10px', background: 'rgba(14,165,233,0.15)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>Edit</button>
                                            <button onClick={() => setDeleteConfirm(art._id)} style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500 }}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#c8d0e8', cursor: 'pointer', fontSize: '0.82rem' }}>← Prev</button>
                    <span style={{ padding: '6px 14px', color: '#8892b0', fontSize: '0.82rem' }}>Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#c8d0e8', cursor: 'pointer', fontSize: '0.82rem' }}>Next →</button>
                </div>
            )}
        </div>
    );
}
