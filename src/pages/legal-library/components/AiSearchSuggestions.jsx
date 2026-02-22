import React from 'react';
import Icon from '../../../components/AppIcon';

const AiSearchSuggestions = ({ suggestions = [], onSelectQuestion, isLoading }) => {
    if (isLoading) {
        return (
            <div className="mt-3 flex gap-2 flex-wrap">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-7 w-40 bg-muted rounded-full animate-pulse" />
                ))}
            </div>
        );
    }

    if (!suggestions.length) return null;

    return (
        <div className="mt-3">
            <div className="flex items-center gap-2 mb-2">
                <Icon name="Sparkles" size={14} color="var(--color-primary)" />
                <span className="text-xs font-medium text-muted-foreground">AI suggested questions</span>
            </div>
            <div className="flex gap-2 flex-wrap">
                {suggestions.map((q, i) => (
                    <button
                        key={i}
                        onClick={() => onSelectQuestion(q)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/40 transition-smooth font-medium"
                    >
                        <Icon name="ArrowRight" size={10} color="currentColor" />
                        {q}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AiSearchSuggestions;
