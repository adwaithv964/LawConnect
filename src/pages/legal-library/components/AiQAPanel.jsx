import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { askLegalQuestion } from '../../../utils/api';

// Common legal starter questions
const STARTER_QUESTIONS = [
    'What are my rights if my landlord refuses to return the security deposit?',
    'How do I file an online FIR for cyber fraud?',
    'What documents do I need for property registration?',
    'Can I file a consumer complaint online?',
    'What are the grounds for divorce in India?',
];

const AiQAPanel = ({ articles = [], isOpen, onClose }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(null);
    const [refs, setRefs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [history, setHistory] = useState([]);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, isLoading]);

    const handleAsk = async (q = question) => {
        const trimmed = q.trim();
        if (!trimmed || isLoading) return;

        // Push user message to history
        setHistory(prev => [...prev, { role: 'user', text: trimmed }]);
        setQuestion('');
        setIsLoading(true);
        setError(null);

        try {
            const result = await askLegalQuestion(trimmed, articles);
            setHistory(prev => [...prev, {
                role: 'ai',
                text: result.answer,
                refs: result.referencedArticles || []
            }]);
        } catch (err) {
            setError(err.message?.includes('AI_NOT_CONFIGURED')
                ? 'AI not configured — set GEMINI_API_KEY in .env'
                : 'AI service unavailable. Please try again.');
            setHistory(prev => [...prev, { role: 'error', text: error || 'Error getting answer.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAsk(); }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-y-0 right-0 z-50 flex flex-col w-full max-w-md bg-card border-l border-border shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon name="Sparkles" size={20} color="var(--color-primary)" />
                    </div>
                    <div>
                        <h3 className="text-base font-heading font-semibold text-foreground">Legal AI Assistant</h3>
                        <p className="text-xs text-muted-foreground">Powered by Gemini 1.5 Flash</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-smooth">
                    <Icon name="X" size={20} color="var(--color-muted-foreground)" />
                </button>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Welcome / empty state */}
                {history.length === 0 && (
                    <div className="space-y-4">
                        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <div className="flex gap-3">
                                <Icon name="Sparkles" size={18} color="var(--color-primary)" />
                                <div>
                                    <p className="text-sm text-foreground font-medium mb-1">Ask me anything about Indian law</p>
                                    <p className="text-xs text-muted-foreground">I'll answer based on the articles in this library and my legal knowledge.</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-1">Suggested questions</p>
                        <div className="space-y-2">
                            {STARTER_QUESTIONS.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAsk(q)}
                                    className="w-full text-left px-3 py-2.5 text-sm rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-smooth text-foreground"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                {history.map((msg, i) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${msg.role === 'user' ? 'bg-primary text-primary-foreground' :
                                msg.role === 'error' ? 'bg-error/10 text-error' :
                                    'bg-primary/10 text-primary'
                            }`}>
                            {msg.role === 'user' ? 'U' : <Icon name="Sparkles" size={14} color="currentColor" />}
                        </div>

                        <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'items-end flex flex-col' : ''}`}>
                            <div className={`px-3 py-2.5 rounded-xl text-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                                    : msg.role === 'error'
                                        ? 'bg-error/10 text-error border border-error/20 rounded-tl-sm'
                                        : 'bg-muted text-foreground rounded-tl-sm'
                                }`}>
                                {msg.text}
                            </div>

                            {/* Referenced articles */}
                            {msg.role === 'ai' && msg.refs?.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    <p className="text-xs text-muted-foreground font-medium">Referenced articles:</p>
                                    {msg.refs.map(a => (
                                        <a
                                            key={a._id}
                                            href={`/legal-library/${a._id}`}
                                            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                                        >
                                            <Icon name="FileText" size={12} color="currentColor" />
                                            {a.title}
                                        </a>
                                    ))}
                                </div>
                            )}

                            {/* Disclaimer */}
                            {msg.role === 'ai' && (
                                <p className="mt-1.5 text-xs text-muted-foreground/70 italic px-1">
                                    General information — not legal advice
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon name="Sparkles" size={14} color="var(--color-primary)" />
                        </div>
                        <div className="px-3 py-3 bg-muted rounded-xl rounded-tl-sm">
                            <div className="flex gap-1 items-center">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0ms]" />
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:150ms]" />
                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:300ms]" />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
                {error && (
                    <p className="text-xs text-error mb-2 px-1">{error}</p>
                )}
                <div className="flex gap-2">
                    <textarea
                        ref={inputRef}
                        value={question}
                        onChange={e => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a legal question…"
                        rows={2}
                        className="flex-1 resize-none px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-smooth"
                    />
                    <button
                        onClick={() => handleAsk()}
                        disabled={!question.trim() || isLoading}
                        className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-smooth"
                    >
                        <Icon name={isLoading ? 'Loader' : 'Send'} size={18} color="currentColor" />
                    </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">Press Enter to send · Shift+Enter for new line</p>
            </div>
        </div>
    );
};

export default AiQAPanel;
