import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import Icon from '../../components/AppIcon';
import LawyerCard from './components/LawyerCard';
import LawyerFilterBar from './components/LawyerFilterBar';
import { getLawyers, getLawyerFilters } from '../../utils/api';
import { useLanguage } from '../../context/LanguageContext';

const LawyerDirectory = () => {
    const { t } = useLanguage();
    const [lawyers, setLawyers] = useState([]);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterOptions, setFilterOptions] = useState({ specializations: [], languages: [], cities: [] });

    const [filters, setFilters] = useState({
        search: '',
        specialization: 'all',
        language: 'all',
        location: 'all'
    });

    // Load filter options once
    useEffect(() => {
        getLawyerFilters()
            .then(setFilterOptions)
            .catch(() => { });
    }, []);

    const fetchLawyers = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getLawyers({ ...filters, page, limit: 12 });
            setLawyers(data.lawyers || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [filters, page]);

    useEffect(() => {
        fetchLawyers();
    }, [fetchLawyers]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [filters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <EmergencyAlertBanner />

            <main className="pt-32 lg:pt-36 pb-12 px-4 lg:px-6">
                {/* Page Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                            <Icon name="Users" size={22} color="var(--color-primary)" />
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground">
                            {t('lawyer.title')}
                        </h1>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground max-w-3xl ml-0 mt-1">
                        {t('lawyer.subtitle')}
                    </p>

                    {/* Ethics notice */}
                    <div className="mt-4 flex items-start gap-2 px-4 py-3 bg-success/10 border border-success/30 rounded-lg text-success text-sm max-w-3xl">
                        <Icon name="ShieldCheck" size={16} className="flex-shrink-0 mt-0.5" />
                        <span>{t('lawyer.ethics')}</span>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="mb-6">
                    <LawyerFilterBar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        filterOptions={filterOptions}
                    />
                </div>

                {/* Results Count */}
                {!isLoading && !error && (
                    <p className="text-sm text-muted-foreground mb-4">
                        {total} verified lawyer{total !== 1 ? 's' : ''} found
                    </p>
                )}

                {/* Error */}
                {error && (
                    <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl mb-6">
                        <Icon name="AlertCircle" size={20} color="var(--color-destructive)" />
                        <p className="flex-1 text-sm text-foreground">{t('common.error')}</p>
                        <button onClick={fetchLawyers} className="text-sm underline text-primary">{t('common.retry')}</button>
                    </div>
                )}

                {/* Loading */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-muted rounded-xl animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Lawyers Grid */}
                {!isLoading && !error && (
                    <>
                        {lawyers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <Icon name="Users" size={56} color="var(--color-muted-foreground)" />
                                <h3 className="text-lg font-semibold text-foreground mt-4 mb-2">{t('lawyer.noResults')}</h3>
                                <button
                                    onClick={() => setFilters({ search: '', specialization: 'all', language: 'all', location: 'all' })}
                                    className="text-primary underline text-sm"
                                >
                                    {t('lawyer.clearFilters')}
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                                {lawyers.map(lawyer => (
                                    <LawyerCard key={lawyer._id} lawyer={lawyer} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="px-3 py-2 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted transition-colors"
                                >
                                    <Icon name="ChevronLeft" size={16} />
                                </button>
                                {[...Array(pages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    disabled={page >= pages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-3 py-2 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted transition-colors"
                                >
                                    <Icon name="ChevronRight" size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default LawyerDirectory;
