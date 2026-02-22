import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import CitationCard from './CitationCard';
import LawBrowser from './LawBrowser';
import { askLegalQuestion, legalResearch, generateArticle } from '../../../utils/api';

const STARTER_QUESTIONS = [
    'What is the BNS equivalent of IPC Section 302?',
    'How do I file a Zero FIR under BNSS 2023?',
    'What are my fundamental rights under Article 21?',
    'How to file consumer complaint against Amazon/Flipkart?',
    'Can police arrest without warrant under BNSS?',
    'What is Section 111 BNS (organised crime)?',
];

const RESEARCH_TOPICS = [
    'Cyber fraud and online scam remedies in India',
    'Property registration process and stamp duty',
    'Hindu Succession Act and women\'s inheritance rights',
    'Section 498A IPC — dowry harassment law',
    'RTI Act — Right to Information filing guide',
    'Domestic Violence Act 2005 — protection orders',
];

const GENERATE_CATEGORIES = [
    { id: 'constitutional', name: 'Constitutional Rights' },
    { id: 'criminal', name: 'Criminal Law (BNS/IPC)' },
    { id: 'consumer', name: 'Consumer Rights' },
    { id: 'cyber', name: 'Cyber Crimes' },
    { id: 'property', name: 'Property Law' },
    { id: 'family', name: 'Family Law' },
];

// Helper to render basic markdown (bold and bullets)
const renderFormattedText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
        const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
        const content = isBullet ? line.replace(/^[\*-]\s/, '') : line;

        const parts = content.split(/(\*\*.*?\*\*)/g);
        const renderedLine = parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
            }
            return <React.Fragment key={j}>{part}</React.Fragment>;
        });

        if (isBullet) {
            return (
                <div key={i} className="flex gap-2 mt-1">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="flex-1">{renderedLine}</span>
                </div>
            );
        }

        return <div key={i} className={i > 0 && line.trim() ? "mt-2" : ""}>{renderedLine}</div>;
    });
};

// ─── Tab: Ask AI ──────────────────────────────────────────────────────────────
const AskAITab = ({ articles }) => {
    const [question, setQuestion] = useState('');
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history, isLoading]);
    useEffect(() => { inputRef.current?.focus(); }, []);

    const handleAsk = async (q = question) => {
        const trimmed = q.trim();
        if (!trimmed || isLoading) return;
        setHistory(prev => [...prev, { role: 'user', text: trimmed }]);
        setQuestion('');
        setIsLoading(true);
        setError(null);
        try {
            const result = await askLegalQuestion(trimmed, articles);
            setHistory(prev => [...prev, {
                role: 'ai',
                text: result.answer,
                refs: result.referencedArticles || [],
                citations: result.citations || [],
                queries: result.searchQueries || [],
            }]);
        } catch (err) {
            setError('AI service unavailable. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {history.length === 0 && (
                    <div className="space-y-3">
                        <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-xs text-muted-foreground">
                            <span className="text-primary font-medium">Grounded in live Indian law databases</span>
                            {' '}— answers cite IndiaKanoon, India Code, Supreme Court, LiveLaw
                        </div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick questions</p>
                        <div className="space-y-1.5">
                            {STARTER_QUESTIONS.map((q, i) => (
                                <button key={i} onClick={() => handleAsk(q)}
                                    className="w-full text-left px-3 py-2 text-xs rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 text-foreground transition-smooth">
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {history.map((msg, i) => (
                    <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                            {msg.role === 'user' ? 'U' : <Icon name="Sparkles" size={13} color="currentColor" />}
                        </div>
                        <div className={`flex-1 max-w-[90%] ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                            <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-tr-sm whitespace-pre-wrap'
                                : 'bg-muted text-foreground/90 rounded-tl-sm'}`}>
                                {msg.role === 'ai' ? renderFormattedText(msg.text) : msg.text}
                            </div>
                            {msg.role === 'ai' && msg.refs?.length > 0 && (
                                <div className="mt-1.5 space-y-1">
                                    {msg.refs.map(a => (
                                        <a key={a._id} href={`/legal-library/${a._id}`}
                                            className="flex items-center gap-1 text-xs text-primary hover:underline">
                                            <Icon name="FileText" size={11} color="currentColor" />{a.title}
                                        </a>
                                    ))}
                                </div>
                            )}
                            {msg.role === 'ai' && <CitationCard citations={msg.citations} searchQueries={msg.queries} compact />}
                            {msg.role === 'ai' && (
                                <p className="mt-1 text-xs text-muted-foreground/60 italic px-1">General info — not legal advice</p>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon name="Sparkles" size={13} color="var(--color-primary)" />
                        </div>
                        <div className="px-3 py-2.5 bg-muted rounded-xl rounded-tl-sm">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t border-border">
                {error && <p className="text-xs text-error mb-2">{error}</p>}
                <div className="flex gap-2">
                    <textarea ref={inputRef} value={question} onChange={e => setQuestion(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); } }}
                        placeholder="Ask any Indian legal question…" rows={2}
                        className="flex-1 resize-none px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                    <button onClick={() => handleAsk()} disabled={!question.trim() || isLoading}
                        className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-smooth">
                        <Icon name={isLoading ? 'Loader' : 'Send'} size={16} color="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Tab: Deep Research ───────────────────────────────────────────────────────
const ResearchTab = () => {
    const [topic, setTopic] = useState('');
    const [depth, setDepth] = useState('quick');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const SECTION_LABELS = {
        OVERVIEW: { label: 'Overview', icon: 'Info' },
        GOVERNING_LAWS: { label: 'Governing Laws', icon: 'BookOpen' },
        RIGHTS_AND_REMEDIES: { label: 'Rights & Remedies', icon: 'Scale' },
        PROCEDURE: { label: 'Legal Procedure', icon: 'ListOrdered' },
        RECENT_JUDGMENTS: { label: 'Court Judgments', icon: 'Gavel' },
        KEY_POINTS: { label: 'Key Points', icon: 'CheckSquare' },
        PRACTICAL_ADVICE: { label: 'Practical Advice', icon: 'Lightbulb' },
    };

    const handleResearch = async (t = topic) => {
        if (!t.trim() || isLoading) return;
        setIsLoading(true); setError(null); setResult(null);
        try {
            const data = await legalResearch(t, depth);
            setResult(data);
        } catch (err) {
            setError('Research failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4 overflow-y-auto h-full">
            <div className="space-y-3">
                <input value={topic} onChange={e => setTopic(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleResearch()}
                    placeholder="Research topic (e.g. 'maintenance under Section 125 CrPC')"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        {['quick', 'deep'].map(d => (
                            <button key={d} onClick={() => setDepth(d)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth capitalize ${depth === d ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}>
                                {d === 'deep' ? '🔬 Deep' : '⚡ Quick'}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => handleResearch()} disabled={!topic.trim() || isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-40 text-sm font-medium hover:bg-primary/90 transition-smooth">
                        <Icon name={isLoading ? 'Loader' : 'Search'} size={15} color="currentColor" />
                        {isLoading ? 'Researching…' : 'Research'}
                    </button>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">Quick research topics</p>
                    <div className="flex flex-wrap gap-1.5">
                        {RESEARCH_TOPICS.map((t, i) => (
                            <button key={i} onClick={() => { setTopic(t); handleResearch(t); }}
                                className="px-2.5 py-1 text-xs rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/30 transition-smooth">
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Loading skeleton */}
            {isLoading && (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="p-3 bg-muted rounded-xl space-y-2 animate-pulse">
                            <div className="h-4 bg-border w-1/3 rounded" />
                            <div className="h-3 bg-border rounded" />
                            <div className="h-3 bg-border rounded w-4/5" />
                        </div>
                    ))}
                </div>
            )}

            {error && <p className="text-xs text-error p-3 bg-error/10 rounded-lg">{error}</p>}

            {/* Results */}
            {result && (
                <div className="space-y-3">
                    <h4 className="text-sm font-heading font-semibold text-foreground flex items-center gap-2">
                        <Icon name="FileSearch" size={16} color="var(--color-primary)" />
                        Research: {result.topic}
                    </h4>
                    {Object.entries(result.sections || {}).map(([key, content]) => {
                        const meta = SECTION_LABELS[key];
                        if (!meta || !content) return null;
                        return (
                            <div key={key} className="p-3 bg-muted/50 border border-border rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon name={meta.icon} size={14} color="var(--color-primary)" />
                                    <span className="text-xs font-semibold text-foreground">{meta.label}</span>
                                </div>
                                <div className="text-xs text-foreground leading-relaxed">
                                    {renderFormattedText(content)}
                                </div>
                            </div>
                        );
                    })}
                    {result.citations?.length > 0 && (
                        <CitationCard citations={result.citations} searchQueries={result.searchQueries} />
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Tab: Generate Article ────────────────────────────────────────────────────
const GenerateTab = ({ onArticleGenerated }) => {
    const [topic, setTopic] = useState('');
    const [category, setCategory] = useState('consumer');
    const [difficulty, setDifficulty] = useState('beginner');
    const [saveToDb, setSaveToDb] = useState(true);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (!topic.trim() || isLoading) return;
        setIsLoading(true); setError(null); setResult(null);
        try {
            const data = await generateArticle(topic, category, difficulty, saveToDb);
            setResult(data);
            if (data.savedId) onArticleGenerated?.();
        } catch (err) {
            setError('Article generation failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4 overflow-y-auto h-full">
            <div className="space-y-3">
                <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Article topic</label>
                    <input value={topic} onChange={e => setTopic(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                        placeholder="e.g. 'How to file consumer complaint for defective product'"
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                            {GENERATE_CATEGORIES.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Difficulty</label>
                        <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40">
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={saveToDb} onChange={e => setSaveToDb(e.target.checked)} className="w-4 h-4 accent-primary" />
                    <span className="text-xs text-foreground">Save to Legal Library (visible to all users)</span>
                </label>
                <button onClick={handleGenerate} disabled={!topic.trim() || isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-medium text-sm hover:opacity-90 disabled:opacity-40 transition-smooth">
                    <Icon name={isLoading ? 'Loader' : 'Sparkles'} size={16} color="currentColor" />
                    {isLoading ? 'AI is writing article…' : 'Generate Article with AI'}
                </button>
            </div>

            {isLoading && (
                <div className="space-y-3 animate-pulse">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-3 bg-muted rounded" />)}
                    </div>
                </div>
            )}
            {error && <p className="text-xs text-error p-3 bg-error/10 rounded-lg border border-error/20">{error}</p>}
            {result?.article && (
                <div className="space-y-3">
                    {result.savedId && (
                        <div className="flex items-center gap-2 p-2 bg-success/10 border border-success/20 rounded-lg text-success text-xs font-medium">
                            <Icon name="CheckCircle" size={14} color="currentColor" />
                            Article saved to Legal Library!
                        </div>
                    )}
                    <div className="p-4 bg-card border border-border rounded-xl space-y-3">
                        <h4 className="text-base font-heading font-semibold text-foreground">{result.article.title}</h4>
                        <p className="text-xs text-muted-foreground italic">{result.article.excerpt}</p>
                        <div className="max-h-48 overflow-y-auto">
                            <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{result.article.content}</p>
                        </div>
                        {result.article.keyTakeaways && (
                            <div className="pt-2 border-t border-border">
                                <p className="text-xs font-semibold text-foreground mb-1">Key Takeaways</p>
                                <p className="text-xs text-muted-foreground whitespace-pre-wrap">{result.article.keyTakeaways}</p>
                            </div>
                        )}
                    </div>
                    {result.citations?.length > 0 && (
                        <CitationCard citations={result.citations} />
                    )}
                </div>
            )}
        </div>
    );
};

// ─── Main Panel ───────────────────────────────────────────────────────────────
const LegalResearchPanel = ({ articles = [], isOpen, onClose, onArticleGenerated }) => {
    const [activeTab, setActiveTab] = useState('ask');

    const TABS = [
        { id: 'ask', label: 'Ask AI', icon: 'MessageCircle' },
        { id: 'browse', label: 'Indian Laws', icon: 'BookOpen' },
        { id: 'research', label: 'Research', icon: 'FileSearch' },
        { id: 'generate', label: 'Generate', icon: 'Sparkles' },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-lg bg-card border-l border-border shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="Scale" size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                        <h3 className="text-base font-heading font-semibold text-foreground">Indian Legal AI</h3>
                        <p className="text-xs text-muted-foreground">Live web • IPC/BNS • CrPC/BNSS • Constitution</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-smooth">
                    <Icon name="X" size={20} color="var(--color-muted-foreground)" />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border bg-card">
                {TABS.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium border-b-2 transition-smooth ${activeTab === tab.id
                            ? 'border-primary text-primary bg-primary/5'
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                        <Icon name={tab.icon} size={15} color="currentColor" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {activeTab === 'ask' && <AskAITab articles={articles} />}
                {activeTab === 'browse' && <div className="flex-1 overflow-y-auto p-4"><LawBrowser /></div>}
                {activeTab === 'research' && <ResearchTab />}
                {activeTab === 'generate' && <GenerateTab onArticleGenerated={onArticleGenerated} />}
            </div>
        </div>
    );
};

export default LegalResearchPanel;
