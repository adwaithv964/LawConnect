import React from 'react';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../context/LanguageContext';

const LawyerCard = ({ lawyer }) => {
    const { t } = useLanguage();

    // Parse the practice areas dynamically since it's a string like "Property + 3 more"
    const practiceAreasStr = lawyer["Practice Areas"] || '';
    const mainArea = practiceAreasStr.split('+')[0].trim();
    const hasMore = practiceAreasStr.includes('+');
    const moreCount = hasMore ? practiceAreasStr.split('+')[1].trim() : '';

    const typeColors = {
        'Family Law': 'bg-pink-100 text-pink-700',
        'Property Dispute': 'bg-amber-100 text-amber-700',
        'Criminal Law': 'bg-red-100 text-red-700',
        'Consumer Rights': 'bg-blue-100 text-blue-700',
        'Cyber Crime': 'bg-purple-100 text-purple-700',
        'Employment Law': 'bg-green-100 text-green-700',
        'Corporate Law': 'bg-indigo-100 text-indigo-700',
        'Tax Law': 'bg-orange-100 text-orange-700',
        'Environment Law': 'bg-emerald-100 text-emerald-700',
        'Criminal Defense': 'bg-rose-100 text-rose-700',
        'Civil': 'bg-slate-100 text-slate-700',
    };

    const name = lawyer.Name || 'Unknown';
    const initials = name.replace('Advocate ', '').charAt(0) || 'L';

    return (
        <div className="bg-card border border-border rounded-xl p-5 hover:shadow-elevation-2 transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-foreground truncate">{name}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Icon name="MapPin" size={13} />
                        <span className="truncate">{lawyer.Location || 'Unknown Location'}</span>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-primary max-w-[80px] break-words leading-tight text-right">{lawyer.Experience || 'N/A'}</div>
                </div>
            </div>

            {/* Specializations */}
            <div className="flex flex-wrap gap-1.5 mt-2">
                {mainArea && (
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${typeColors[mainArea] || 'bg-muted text-muted-foreground'}`}>
                        {mainArea}
                    </span>
                )}
                {hasMore && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                        +{moreCount}
                    </span>
                )}
            </div>

            <div className="flex-1"></div>

            {/* Footer */}
            <div className="border-t border-border pt-3 flex items-center justify-end mt-2">
                <a
                    href={lawyer["Profile URL"] || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                    <Icon name="ExternalLink" size={13} />
                    View Profile
                </a>
            </div>
        </div>
    );
};

export default LawyerCard;
