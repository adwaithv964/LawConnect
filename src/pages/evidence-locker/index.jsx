import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import Icon from '../../components/AppIcon';
import EvidenceCard from './components/EvidenceCard';
import EvidenceUploadModal from './components/EvidenceUploadModal';
import { getEvidenceList } from '../../utils/api';

const TABS = [
    { id: 'all', label: 'All', icon: 'LayoutGrid' },
    { id: 'photo', label: 'Photos', icon: 'Image' },
    { id: 'video', label: 'Videos', icon: 'Video' },
    { id: 'document', label: 'Documents', icon: 'FileText' },
];

const EvidenceLocker = () => {
    const [items, setItems] = useState([]);
    const [tab, setTab] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showUpload, setShowUpload] = useState(false);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getEvidenceList();
            setItems(data || []);
        } catch (err) {
            setError('Failed to load evidence: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    const handleUploaded = (newItems) => {
        setItems(prev => [...newItems, ...prev]);
        setShowUpload(false);
    };

    const handleDeleted = (id) => setItems(prev => prev.filter(i => i._id !== id));

    const filtered = items.filter(item => {
        const matchTab = tab === 'all' || item.mediaType === tab;
        const matchSearch = !search ||
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.description?.toLowerCase().includes(search.toLowerCase()) ||
            item.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
            item.caseRef?.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
    });

    const counts = {
        all: items.length,
        photo: items.filter(i => i.mediaType === 'photo').length,
        video: items.filter(i => i.mediaType === 'video').length,
        document: items.filter(i => i.mediaType === 'document').length,
    };

    // ── Storage used summary ──────────────────────────────────────────────────
    const totalBytes = items.reduce((s, i) => s + (i.size || 0), 0);
    const storageMB = (totalBytes / (1024 * 1024)).toFixed(1);

    return (
        <div className="min-h-screen bg-background">
            <Helmet>
                <title>Evidence Locker – LawConnect</title>
                <meta name="description" content="Securely store photos, videos, and documents as encrypted digital evidence with tamper-proof SHA-256 timestamping." />
            </Helmet>

            <Header />
            <EmergencyAlertBanner />

            <main className="mx-4 lg:mx-6 py-6 lg:py-8">

                {/* ── Page Header ─────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center">
                                <Icon name="ShieldCheck" size={22} color="var(--color-success)" />
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground leading-tight">
                                    Digital Evidence Locker
                                </h1>
                                <p className="text-sm text-muted-foreground">AES-256 encrypted · SHA-256 timestamped · Tamper-evident</p>
                            </div>
                        </div>

                        {/* Security pills */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {[
                                { icon: 'Lock', label: 'AES-256-GCM Encryption' },
                                { icon: 'Hash', label: 'SHA-256 Content Hash' },
                                { icon: 'Clock', label: 'Server Timestamp' },
                                { icon: 'ShieldCheck', label: 'Tamper Detection' },
                            ].map(({ icon, label }) => (
                                <span key={label} className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-success/10 text-success border border-success/20">
                                    <Icon name={icon} size={11} color="currentColor" />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                        {/* Stats */}
                        <div className="text-right hidden sm:block">
                            <p className="text-lg font-bold text-foreground">{items.length}</p>
                            <p className="text-xs text-muted-foreground">{storageMB} MB stored</p>
                        </div>
                        <button
                            onClick={() => setShowUpload(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-smooth shadow-elevation-2"
                        >
                            <Icon name="Upload" size={16} color="currentColor" />
                            Add Evidence
                        </button>
                    </div>
                </div>

                {/* ── Tabs + Search ─────────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                    <div className="flex gap-1.5 p-1 bg-muted rounded-xl">
                        {TABS.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth
                                    ${tab === t.id ? 'bg-card shadow-elevation-1 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <Icon name={t.icon} size={13} color="currentColor" />
                                {t.label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                                    ${tab === t.id ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground'}`}>
                                    {counts[t.id]}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-72">
                        <Icon name="Search" size={15} color="var(--color-muted-foreground)"
                            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by name, tag, case…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>
                </div>

                {/* ── Error ─────────────────────────────────────────────────── */}
                {error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error mb-6">
                        <Icon name="AlertCircle" size={18} color="currentColor" />
                        <span className="text-sm">{error}</span>
                        <button onClick={fetchItems} className="ml-auto text-sm font-medium underline">Retry</button>
                    </div>
                )}

                {/* ── Loading ───────────────────────────────────────────────── */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-36 bg-muted" />
                                <div className="p-4 space-y-2">
                                    <div className="h-3 bg-muted rounded w-3/4" />
                                    <div className="h-3 bg-muted rounded w-1/2" />
                                    <div className="h-3 bg-muted rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Grid ─────────────────────────────────────────────────── */}
                {!loading && filtered.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(item => (
                            <EvidenceCard key={item._id} item={item} onDeleted={handleDeleted} />
                        ))}
                    </div>
                )}

                {/* ── Empty state ───────────────────────────────────────────── */}
                {!loading && filtered.length === 0 && !error && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-success/10 flex items-center justify-center mb-5">
                            <Icon name="ShieldCheck" size={36} color="var(--color-success)" />
                        </div>
                        <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                            {search || tab !== 'all' ? 'No results found' : 'Evidence Locker is Empty'}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                            {search || tab !== 'all'
                                ? 'Try a different search term or category.'
                                : 'Upload photos, videos, or documents. Each file is encrypted and timestamped for legal authenticity.'}
                        </p>
                        {!search && tab === 'all' && (
                            <button
                                onClick={() => setShowUpload(true)}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-smooth">
                                <Icon name="Upload" size={16} color="currentColor" />
                                Upload First Evidence
                            </button>
                        )}
                    </div>
                )}
            </main>

            {showUpload && (
                <EvidenceUploadModal
                    onClose={() => setShowUpload(false)}
                    onUploaded={handleUploaded}
                />
            )}
        </div>
    );
};

export default EvidenceLocker;
