import React from 'react';
import Icon from '../../../components/AppIcon';

const CitationCard = ({ citations = [], searchQueries = [], compact = false }) => {
    if (!citations.length) return null;

    // Map known legal sources to labels + colors
    const SOURCE_LABELS = {
        'indiankanoon.org': { label: 'Indian Kanoon', color: 'text-blue-600' },
        'indiacode.nic.in': { label: 'India Code', color: 'text-green-600' },
        'sci.gov.in': { label: 'Supreme Court', color: 'text-red-600' },
        'livelaw.in': { label: 'Live Law', color: 'text-orange-600' },
        'barandbench.com': { label: 'Bar & Bench', color: 'text-purple-600' },
        'lawmin.nic.in': { label: 'Ministry of Law', color: 'text-teal-600' },
        'main.sci.gov.in': { label: 'Supreme Court', color: 'text-red-600' },
    };

    const getSourceInfo = (url) => {
        try {
            const host = new URL(url).hostname.replace('www.', '');
            return SOURCE_LABELS[host] || { label: host, color: 'text-muted-foreground' };
        } catch { return { label: 'Source', color: 'text-muted-foreground' }; }
    };

    return (
        <div className="mt-3 space-y-2">
            {searchQueries.length > 0 && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Icon name="Search" size={11} color="currentColor" />
                    Searched: {searchQueries.join(' · ')}
                </p>
            )}
            <div className="flex items-center gap-1.5">
                <Icon name="Globe" size={13} color="var(--color-primary)" />
                <span className="text-xs font-medium text-primary">Web sources used</span>
            </div>
            <div className={`space-y-1.5 ${compact ? '' : 'max-h-32 overflow-y-auto'}`}>
                {citations.slice(0, compact ? 3 : 8).map((c, i) => {
                    const { label, color } = getSourceInfo(c.url);
                    return (
                        <a
                            key={i}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start gap-2 text-xs text-muted-foreground hover:text-foreground transition-smooth group"
                        >
                            <Icon name="ExternalLink" size={11} color="currentColor" className="mt-0.5 flex-shrink-0 opacity-60 group-hover:opacity-100" />
                            <span className="flex-1 line-clamp-1">{c.title || c.url}</span>
                            <span className={`flex-shrink-0 font-medium ${color}`}>{label}</span>
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

export default CitationCard;
