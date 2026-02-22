import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import Icon from '../../components/AppIcon';
import { lookupCaseStatus, getCaseTrackerPortals } from '../../utils/api';
import { useLanguage } from '../../context/LanguageContext';

const STATUS_COLORS = {
    'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Disposed': 'bg-green-100 text-green-800 border-green-200',
    'Adjourned': 'bg-orange-100 text-orange-800 border-orange-200',
    'Reserved for Judgment': 'bg-blue-100 text-blue-800 border-blue-200',
};

const COURTS = [
    { id: 'ecourts', label: 'eCourts (District / High Court)' },
    { id: 'scdrc', label: 'SCDRC (State Consumer Disputes)' },
    { id: 'ncdrc', label: 'NCDRC (National Consumer Disputes)' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i);

const CaseStatusTracker = () => {
    const { t } = useLanguage();
    const [form, setForm] = useState({ caseNumber: '', court: 'ecourts', year: CURRENT_YEAR });
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [portals, setPortals] = useState([]);

    useEffect(() => {
        getCaseTrackerPortals().then(setPortals).catch(() => { });
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!form.caseNumber.trim()) return;
        try {
            setIsLoading(true);
            setError(null);
            setResult(null);
            const data = await lookupCaseStatus(form);
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <EmergencyAlertBanner />

            <main className="pt-32 lg:pt-36 pb-12 px-4 lg:px-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                            <Icon name="Search" size={22} color="var(--color-primary)" />
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold text-foreground">
                            {t('caseStatus.title')}
                        </h1>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mt-1">
                        {t('caseStatus.subtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Search Form */}
                    <div className="lg:col-span-3 space-y-5">
                        <div className="bg-card border border-border rounded-xl p-6">
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-1.5">
                                        {t('caseStatus.court')}
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        value={form.court}
                                        onChange={e => setForm(f => ({ ...f, court: e.target.value }))}
                                    >
                                        {COURTS.map(c => (
                                            <option key={c.id} value={c.id}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-foreground mb-1.5">
                                            {t('caseStatus.caseNumber')}
                                        </label>
                                        <input
                                            type="text"
                                            placeholder={t('caseStatus.caseNumberPlaceholder')}
                                            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            value={form.caseNumber}
                                            onChange={e => setForm(f => ({ ...f, caseNumber: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-1.5">
                                            {t('caseStatus.year')}
                                        </label>
                                        <select
                                            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            value={form.year}
                                            onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                                        >
                                            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !form.caseNumber.trim()}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                            {t('caseStatus.searching')}
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="Search" size={18} />
                                            {t('caseStatus.search')}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                                <Icon name="AlertCircle" size={20} color="var(--color-destructive)" />
                                <p className="text-sm text-foreground">{error}</p>
                            </div>
                        )}

                        {/* Result Card */}
                        {result && (
                            <div className="bg-card border border-border rounded-xl overflow-hidden">
                                {/* Status header */}
                                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border px-6 py-4 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Case No.</p>
                                        <p className="text-lg font-bold text-foreground font-mono">{result.caseNumber} / {result.year}</p>
                                    </div>
                                    <span className={`px-3 py-1.5 text-sm font-semibold rounded-full border ${STATUS_COLORS[result.status] || 'bg-muted text-foreground border-border'}`}>
                                        {result.status}
                                    </span>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">{t('caseStatus.stage')}</p>
                                            <p className="text-sm font-medium text-foreground">{result.stage}</p>
                                        </div>
                                        {result.nextDate && (
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">{t('caseStatus.nextDate')}</p>
                                                <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                                    <Icon name="Calendar" size={13} color="var(--color-primary)" />
                                                    {result.nextDate}
                                                </p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Filed On</p>
                                            <p className="text-sm font-medium text-foreground">{result.filingDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground mb-1">Before</p>
                                            <p className="text-sm font-medium text-foreground">{result.judge}</p>
                                        </div>
                                    </div>

                                    <a
                                        href={result.portalLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        <Icon name="ExternalLink" size={16} />
                                        {t('caseStatus.visitPortal')}
                                    </a>

                                    {/* Disclaimer */}
                                    <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                                        <Icon name="AlertTriangle" size={16} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-semibold text-warning mb-0.5">{t('caseStatus.disclaimer')}</p>
                                            <p className="text-xs text-muted-foreground">{t('caseStatus.simulatedNote')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Empty state */}
                        {!result && !isLoading && !error && (
                            <div className="text-center py-16 text-muted-foreground">
                                <Icon name="FileSearch" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
                                <p className="text-sm">{t('caseStatus.enterDetails')}</p>
                            </div>
                        )}
                    </div>

                    {/* Portals sidebar */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-base font-semibold text-foreground">{t('caseStatus.portals')}</h2>
                        {portals.map(portal => (
                            <a
                                key={portal.id}
                                href={portal.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-elevation-1 transition-all group"
                            >
                                <div className="flex-shrink-0 w-9 h-9 bg-primary/10 group-hover:bg-primary/15 rounded-lg flex items-center justify-center transition-colors">
                                    <Icon name="Scale" size={18} color="var(--color-primary)" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{portal.name}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{portal.description}</p>
                                    <div className="flex items-center gap-1 mt-1.5 text-xs text-primary">
                                        <span>Visit portal</span>
                                        <Icon name="ExternalLink" size={11} />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CaseStatusTracker;
