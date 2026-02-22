import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { verifyEvidence, downloadEvidence, deleteEvidence } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTs(dateStr) {
    return new Date(dateStr).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

const MEDIA_ICONS = {
    photo: { icon: 'Image', color: 'var(--color-primary)' },
    video: { icon: 'Video', color: '#8b5cf6' },
    document: { icon: 'FileText', color: 'var(--color-warning)' }
};

// ─── Integrity Badge ──────────────────────────────────────────────────────────
const IntegrityBadge = ({ status }) => {
    if (status === 'verified') return (
        <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-success/15 text-success">
            <Icon name="CheckCircle" size={11} color="currentColor" /> Verified
        </span>
    );
    if (status === 'tampered') return (
        <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-error/15 text-error">
            <Icon name="AlertTriangle" size={11} color="currentColor" /> Tampered!
        </span>
    );
    if (status === 'checking') return (
        <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-muted text-muted-foreground">
            <Icon name="Loader" size={11} color="currentColor" className="animate-spin" /> Checking…
        </span>
    );
    return null;
};

// ─── EvidenceCard ─────────────────────────────────────────────────────────────
const EvidenceCard = ({ item, onDeleted }) => {
    const { currentUser } = useAuth();
    const [integrityStatus, setIntegrityStatus] = useState(null); // null | 'checking' | 'verified' | 'tampered'
    const [isDeleting, setIsDeleting] = useState(false);
    const [showHash, setShowHash] = useState(false);

    const { icon, color } = MEDIA_ICONS[item.mediaType] || MEDIA_ICONS.document;

    const handleVerify = async () => {
        setIntegrityStatus('checking');
        try {
            const result = await verifyEvidence(item._id);
            setIntegrityStatus(result.intact ? 'verified' : 'tampered');
        } catch {
            setIntegrityStatus('tampered');
        }
    };

    const handleDownload = () => {
        const url = downloadEvidence(item._id);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.name;
        a.click();
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
        setIsDeleting(true);
        try {
            await deleteEvidence(item._id);
            onDeleted(item._id);
        } catch (err) {
            alert('Failed to delete evidence: ' + err.message);
            setIsDeleting(false);
        }
    };

    return (
        <div className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-elevation-3 hover:border-primary/30 transition-smooth">
            {/* Thumbnail / Icon area */}
            <div className="relative h-36 flex items-center justify-center bg-gradient-to-br from-muted/60 to-muted flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-elevation-1"
                    style={{ background: `${color}18` }}>
                    <Icon name={icon} size={32} color={color} />
                </div>
                {/* Media type chip */}
                <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-foreground/80 text-background capitalize">
                    {item.mediaType}
                </span>
                {/* Lock icon */}
                <div className="absolute top-2 right-2 p-1 bg-success/20 rounded-full">
                    <Icon name="Lock" size={12} color="var(--color-success)" />
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 p-4 flex-1">
                <h3 className="text-sm font-semibold text-foreground truncate" title={item.name}>
                    {item.name}
                </h3>
                {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                )}
                {item.caseRef && (
                    <span className="text-xs text-primary font-medium">📁 {item.caseRef}</span>
                )}

                {/* Tags */}
                {item.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {item.tags.map(t => (
                            <span key={t} className="px-1.5 py-0.5 text-xs bg-muted rounded-full text-muted-foreground">{t}</span>
                        ))}
                    </div>
                )}

                {/* Meta row */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span>{formatBytes(item.size)}</span>
                    <span>{formatTs(item.timestampedAt)}</span>
                </div>

                {/* SHA-256 hash */}
                <button
                    onClick={() => setShowHash(v => !v)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                    <Icon name="Hash" size={11} color="currentColor" />
                    {showHash
                        ? <span className="font-mono break-all text-left">{item.sha256Hash}</span>
                        : <span className="font-mono">{item.sha256Hash?.slice(0, 16)}…</span>
                    }
                </button>

                {/* Integrity status */}
                {integrityStatus && (
                    <div className="mt-1">
                        <IntegrityBadge status={integrityStatus} />
                    </div>
                )}
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-1 px-3 pb-3 pt-1 border-t border-border mt-auto">
                <button
                    onClick={handleVerify}
                    disabled={integrityStatus === 'checking'}
                    title="Verify Integrity"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl bg-success/10 hover:bg-success/20 text-success transition-smooth disabled:opacity-50"
                >
                    <Icon name="ShieldCheck" size={13} color="currentColor" />
                    Verify
                </button>
                <button
                    onClick={handleDownload}
                    title="Download"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-smooth"
                >
                    <Icon name="Download" size={13} color="currentColor" />
                    Download
                </button>
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    title="Delete"
                    className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-xl transition-smooth disabled:opacity-50"
                >
                    <Icon name={isDeleting ? 'Loader' : 'Trash2'} size={14} color="currentColor"
                        className={isDeleting ? 'animate-spin' : ''} />
                </button>
            </div>
        </div>
    );
};

export default EvidenceCard;
