import React, { useState, useRef, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import { uploadEvidence } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';

const ACCEPT = 'image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain';

const EvidenceUploadModal = ({ onClose, onUploaded }) => {
    const { currentUser } = useAuth();
    const [files, setFiles] = useState([]);
    const [description, setDescription] = useState('');
    const [caseRef, setCaseRef] = useState('');
    const [tags, setTags] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState([]);  // per-file { name, status }
    const inputRef = useRef();

    const addFiles = (fileList) => {
        const arr = Array.from(fileList);
        setFiles(prev => {
            const existing = prev.map(f => f.name);
            return [...prev, ...arr.filter(f => !existing.includes(f.name))];
        });
    };

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        addFiles(e.dataTransfer.files);
    }, []);

    const handleUpload = async () => {
        if (!files.length || !currentUser) return;
        setUploading(true);
        const results = [];

        for (const file of files) {
            setProgress(p => [...p, { name: file.name, status: 'uploading' }]);
            try {
                const fd = new FormData();
                fd.append('file', file);
                fd.append('firebaseUid', currentUser.uid);
                fd.append('description', description);
                fd.append('caseRef', caseRef);
                fd.append('tags', tags);
                const ev = await uploadEvidence(fd);
                results.push(ev);
                setProgress(p => p.map(x => x.name === file.name ? { ...x, status: 'done' } : x));
            } catch (err) {
                setProgress(p => p.map(x => x.name === file.name ? { ...x, status: 'error', error: err.message } : x));
            }
        }

        setUploading(false);
        if (results.length > 0) onUploaded(results);
    };

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-2xl shadow-elevation-4 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Icon name="ShieldCheck" size={20} color="var(--color-primary)" />
                        </div>
                        <div>
                            <h2 className="font-heading font-bold text-foreground text-base">Upload Evidence</h2>
                            <p className="text-xs text-muted-foreground">Files are AES-256 encrypted + SHA-256 timestamped</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-smooth">
                        <Icon name="X" size={18} color="var(--color-muted-foreground)" />
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-4">
                    {/* Drop zone */}
                    <div
                        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={onDrop}
                        onClick={() => inputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-smooth
                            ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}`}
                    >
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon name="Upload" size={22} color="var(--color-primary)" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-semibold text-foreground">
                                {isDragging ? 'Drop files here' : 'Drag & drop or click to browse'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Photos, Videos, PDFs, Word docs, Text files · max 100 MB each</p>
                        </div>
                        <input ref={inputRef} type="file" multiple accept={ACCEPT} className="hidden"
                            onChange={e => addFiles(e.target.files)} />
                    </div>

                    {/* Selected files list */}
                    {files.length > 0 && (
                        <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                            {files.map((f, i) => {
                                const prog = progress.find(p => p.name === f.name);
                                return (
                                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg text-sm">
                                        <Icon name="File" size={14} color="var(--color-muted-foreground)" />
                                        <span className="flex-1 truncate text-foreground">{f.name}</span>
                                        <span className="text-xs text-muted-foreground flex-shrink-0">
                                            {(f.size / 1024).toFixed(0)} KB
                                        </span>
                                        {prog?.status === 'done' && <Icon name="CheckCircle" size={14} color="var(--color-success)" />}
                                        {prog?.status === 'error' && <Icon name="AlertCircle" size={14} color="var(--color-error)" />}
                                        {prog?.status === 'uploading' && <Icon name="Loader" size={14} color="var(--color-primary)" className="animate-spin" />}
                                        {!prog && (
                                            <button onClick={e => { e.stopPropagation(); setFiles(files.filter((_, j) => j !== i)); }}
                                                className="text-muted-foreground hover:text-error transition-smooth">
                                                <Icon name="X" size={12} color="currentColor" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Metadata fields */}
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="block text-xs font-medium text-foreground mb-1">Description (optional)</label>
                            <textarea
                                value={description} onChange={e => setDescription(e.target.value)} rows={2}
                                placeholder="Brief description of this evidence..."
                                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-foreground mb-1">Case Reference (optional)</label>
                                <input type="text" value={caseRef} onChange={e => setCaseRef(e.target.value)}
                                    placeholder="e.g. Case #2024-001"
                                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-foreground mb-1">Tags (comma separated)</label>
                                <input type="text" value={tags} onChange={e => setTags(e.target.value)}
                                    placeholder="injury, contract, photo"
                                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                            </div>
                        </div>
                    </div>

                    {/* Info banner */}
                    <div className="flex items-start gap-2 p-3 bg-success/10 border border-success/20 rounded-xl">
                        <Icon name="Lock" size={14} color="var(--color-success)" className="mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-success">
                            Each file is encrypted with <strong>AES-256-GCM</strong> and a <strong>SHA-256 tamper-proof timestamp</strong> is recorded at upload.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button onClick={onClose} disabled={uploading}
                            className="flex-1 py-2.5 text-sm font-medium rounded-xl bg-muted hover:bg-muted/70 text-foreground transition-smooth disabled:opacity-50">
                            Cancel
                        </button>
                        <button onClick={handleUpload} disabled={!files.length || uploading}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-smooth disabled:opacity-50">
                            <Icon name={uploading ? 'Loader' : 'ShieldCheck'} size={15} color="currentColor"
                                className={uploading ? 'animate-spin' : ''} />
                            {uploading ? 'Encrypting & Uploading…' : `Upload ${files.length > 1 ? `${files.length} Files` : 'File'}`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EvidenceUploadModal;
