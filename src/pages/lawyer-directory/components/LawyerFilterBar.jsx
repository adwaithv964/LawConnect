import React from 'react';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../context/LanguageContext';

const LawyerFilterBar = ({ filters, onFilterChange, filterOptions }) => {
    const { t } = useLanguage();

    return (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
                <Icon name="Search" size={18} color="var(--color-muted-foreground)" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                    type="text"
                    placeholder={t('lawyer.search')}
                    className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    value={filters.search}
                    onChange={(e) => onFilterChange('search', e.target.value)}
                />
            </div>

            {/* Specialization */}
            <select
                className="px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                value={filters.specialization}
                onChange={(e) => onFilterChange('specialization', e.target.value)}
            >
                <option value="all">{t('lawyer.allSpecializations')}</option>
                {filterOptions.specializations?.map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>

            {/* Language */}
            <select
                className="px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                value={filters.language}
                onChange={(e) => onFilterChange('language', e.target.value)}
            >
                <option value="all">{t('lawyer.allLanguages')}</option>
                {filterOptions.languages?.map(l => (
                    <option key={l} value={l}>{l}</option>
                ))}
            </select>

            {/* Location */}
            <select
                className="px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                value={filters.location}
                onChange={(e) => onFilterChange('location', e.target.value)}
            >
                <option value="all">{t('lawyer.allLocations')}</option>
                {filterOptions.cities?.map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>

            {/* Clear */}
            {(filters.search || filters.specialization !== 'all' || filters.language !== 'all' || filters.location !== 'all') && (
                <button
                    onClick={() => {
                        onFilterChange('search', '');
                        onFilterChange('specialization', 'all');
                        onFilterChange('language', 'all');
                        onFilterChange('location', 'all');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                    <Icon name="X" size={14} />
                    {t('lawyer.clearFilters')}
                </button>
            )}
        </div>
    );
};

export default LawyerFilterBar;
