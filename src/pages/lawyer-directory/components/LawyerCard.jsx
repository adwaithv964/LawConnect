import React from 'react';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../context/LanguageContext';

const LawyerCard = ({ lawyer }) => {
    const { t } = useLanguage();

    const starRating = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < Math.round(rating) ? 'text-yellow-400' : 'text-muted'}>★</span>
        ));
    };

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

    return (
        <div className="bg-card border border-border rounded-xl p-5 hover:shadow-elevation-2 transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                    {lawyer.name.charAt(5) || lawyer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-semibold text-foreground truncate">{lawyer.name}</h3>
                        {lawyer.verified && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-success/10 text-success text-xs rounded-full font-medium">
                                <Icon name="CheckCircle" size={12} />
                                {t('lawyer.verified')}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Icon name="MapPin" size={13} />
                        <span>{lawyer.location?.city}, {lawyer.location?.state}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                        <div className="text-sm">{starRating(lawyer.rating)}</div>
                        <span className="text-xs text-muted-foreground ml-1">{lawyer.rating.toFixed(1)}</span>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <div className="text-lg font-bold text-primary">{lawyer.experience}</div>
                    <div className="text-xs text-muted-foreground leading-tight">{t('lawyer.experience')}</div>
                </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-muted-foreground line-clamp-2">{lawyer.bio}</p>

            {/* Specializations */}
            <div className="flex flex-wrap gap-1.5">
                {lawyer.specializations.slice(0, 3).map((spec) => (
                    <span
                        key={spec}
                        className={`px-2 py-0.5 text-xs rounded-full font-medium ${typeColors[spec] || 'bg-muted text-muted-foreground'}`}
                    >
                        {spec}
                    </span>
                ))}
                {lawyer.specializations.length > 3 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                        +{lawyer.specializations.length - 3}
                    </span>
                )}
            </div>

            {/* Languages */}
            <div className="flex items-center gap-2">
                <Icon name="Globe" size={14} color="var(--color-muted-foreground)" />
                <span className="text-xs text-muted-foreground">{lawyer.languages.join(' · ')}</span>
            </div>

            {/* Footer */}
            <div className="border-t border-border pt-3 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{lawyer.casesSolved}</span> {t('lawyer.casesSolved')}
                </div>
                <a
                    href={`mailto:${lawyer.contactEmail}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                    <Icon name="Mail" size={13} />
                    {t('lawyer.contactEmail')}
                </a>
            </div>

            {/* Bar Council */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon name="Award" size={13} />
                <span>{t('lawyer.barCouncil')}: </span>
                <span className="font-mono text-foreground">{lawyer.barCouncilId}</span>
            </div>
        </div>
    );
};

export default LawyerCard;
