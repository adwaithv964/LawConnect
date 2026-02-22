import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { lawLookup } from '../../../utils/api';
import CitationCard from './CitationCard';

// ─── Indian Legal Code Catalogue ──────────────────────────────────────────────
const LAWS = [
    {
        id: 'bns', name: 'BNS 2023', fullName: 'Bharatiya Nyaya Sanhita', icon: 'Scale', color: 'text-red-500',
        chapters: [
            { name: 'General Provisions', query: 'BNS 2023 Chapter 1 general provisions and definitions' },
            { name: 'Offences Against Body (Murder)', query: 'BNS Section 101 murder Section 103 culpable homicide' },
            { name: 'Assault & Grievous Hurt', query: 'BNS Section 114 115 grievous hurt assault' },
            { name: 'Sexual Offences (S.63-69)', query: 'BNS 2023 Section 63 rape Section 64 punishment for rape Section 69' },
            { name: 'Theft & Robbery (S.303-309)', query: 'BNS Section 303 theft Section 309 dacoity robbery' },
            { name: 'Cheating & Fraud (S.316-318)', query: 'BNS Section 316 cheating Section 318 fraud' },
            { name: 'Cyber Crimes (S.316)', query: 'BNS 2023 cyber crime identity theft computer offences' },
            { name: 'Organised Crime (S.111)', query: 'BNS Section 111 organised crime terrorist act' },
        ]
    },
    {
        id: 'ipc', name: 'IPC 1860', fullName: 'Indian Penal Code', icon: 'BookOpen', color: 'text-orange-500',
        chapters: [
            { name: 'Homicide — S.299 & 302', query: 'IPC Section 302 murder Section 299 culpable homicide not murder' },
            { name: 'Hurt — S.319-326', query: 'IPC Section 319 hurt Section 320 grievous hurt Section 326 acid attack' },
            { name: 'Rape — S.375-376D', query: 'IPC Section 375 rape definition Section 376 punishment' },
            { name: 'Theft — S.378-381', query: 'IPC Section 378 theft Section 379 punishment for theft' },
            { name: 'Cheating — S.415-420', query: 'IPC Section 420 cheating and dishonestly inducing delivery' },
            { name: 'Defamation — S.499-500', query: 'IPC Section 499 defamation Section 500 punishment' },
        ]
    },
    {
        id: 'bnss', name: 'BNSS 2023', fullName: 'Bharatiya Nagarik Suraksha Sanhita', icon: 'Shield', color: 'text-blue-500',
        chapters: [
            { name: 'FIR & Zero FIR (S.173)', query: 'BNSS Section 173 FIR Zero FIR registration procedure' },
            { name: 'Bail Provisions (S.478-491)', query: 'BNSS Section 478 bail bailable non-bailable offence' },
            { name: 'Arrest Without Warrant (S.35)', query: 'BNSS Section 35 police arrest without warrant rights' },
            { name: 'Anticipatory Bail (S.482)', query: 'BNSS Section 482 anticipatory bail application procedure' },
            { name: 'Trial & Chargesheet (S.193)', query: 'BNSS Section 193 chargesheet filing procedure timeline' },
        ]
    },
    {
        id: 'constitution', name: 'Constitution', fullName: 'Constitution of India 1950', icon: 'Globe', color: 'text-green-600',
        chapters: [
            { name: 'Fundamental Rights (Art.12-35)', query: 'Constitution of India Part III Fundamental Rights Article 12 to 35' },
            { name: 'Right to Equality (Art.14-18)', query: 'Article 14 equality before law Article 15 16 17 18 Constitution' },
            { name: 'Right to Freedom (Art.19-22)', query: 'Article 19 freedom of speech Article 21 life liberty Article 22 Constitution' },
            { name: 'Right Against Exploitation (Art.23-24)', query: 'Article 23 trafficking forced labour Article 24 child labour Constitution' },
            { name: 'Right to Education (Art.21A)', query: 'Article 21A right to education Constitution India RTE Act' },
            { name: 'DPSP (Art.36-51)', query: 'Constitution Directive Principles of State Policy Part IV Article 36 to 51' },
            { name: 'Emergency Provisions (Art.352-360)', query: 'Article 352 national emergency Article 356 President Rule Article 360 Constitution' },
        ]
    },
    {
        id: 'consumer', name: 'Consumer', fullName: 'Consumer Protection Act 2019', icon: 'ShoppingCart', color: 'text-yellow-600',
        chapters: [
            { name: 'Consumer Definition & Rights', query: 'Consumer Protection Act 2019 definition consumer rights Section 2' },
            { name: 'District/State/National Forum', query: 'Consumer Protection Act 2019 District Commission State Commission National Commission pecuniary jurisdiction' },
            { name: 'Product Liability (S.82-87)', query: 'Consumer Protection Act 2019 Section 82 product liability manufacturer seller' },
            { name: 'E-commerce Rules', query: 'Consumer Protection E-Commerce Rules 2020 online shopping rights refund' },
            { name: 'Filing Complaint Procedure', query: 'How to file consumer complaint India District Forum procedure 2024' },
        ]
    },
    {
        id: 'it', name: 'IT Act', fullName: 'IT Act 2000 & Cyber Laws', icon: 'Monitor', color: 'text-purple-500',
        chapters: [
            { name: 'Cyber Fraud & Hacking (S.66)', query: 'IT Act Section 66 hacking computer fraud Section 66C identity theft' },
            { name: 'Online Defamation (S.67)', query: 'IT Act Section 67 obscene content Section 66A online speech laws India' },
            { name: 'Data Privacy & Protection', query: 'Digital Personal Data Protection Act 2023 India DPDP rights duties' },
            { name: 'Cyber Stalking & Harassment', query: 'cyber stalking harassment India IT Act BNS legal remedies FIR' },
            { name: 'UPI Fraud & Online Banking Fraud', query: 'UPI fraud online banking fraud India legal remedy RBI guidelines FIR' },
        ]
    },
    {
        id: 'property', name: 'Property', fullName: 'Property & Land Laws', icon: 'Home', color: 'text-teal-500',
        chapters: [
            { name: 'Transfer of Property Act 1882', query: 'Transfer of Property Act 1882 Section 54 sale immovable property' },
            { name: 'Registration Act 1908', query: 'Registration Act 1908 compulsory registration property documents stamp duty' },
            { name: 'RERA 2016', query: 'RERA Real Estate Regulation Act 2016 Section 18 compensation builder delay' },
            { name: 'Land Acquisition Act 2013', query: 'Land Acquisition Act 2013 compensation rehabilitation Section 26 procedure' },
            { name: 'Rent Control Laws', query: 'Rent Control India tenant landlord rights eviction security deposit legal' },
        ]
    },
];

// ─── Component ────────────────────────────────────────────────────────────────
const LawBrowser = () => {
    const [selectedLaw, setSelectedLaw] = useState(LAWS[0]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChapterClick = async (chapter) => {
        if (selectedChapter?.name === chapter.name && result) {
            setSelectedChapter(null); setResult(null); return;
        }
        setSelectedChapter(chapter);
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await lawLookup(null, null, chapter.query);
            setResult(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch legal information');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border bg-primary/5">
                <div className="flex items-center gap-2">
                    <Icon name="BookOpen" size={18} color="var(--color-primary)" />
                    <h3 className="text-sm font-heading font-semibold text-foreground">Indian Laws Browser</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Click any provision for AI-powered explanation with live web sources</p>
            </div>

            {/* Law tabs (scrollable horizontal) */}
            <div className="flex overflow-x-auto border-b border-border scrollbar-hide">
                {LAWS.map(law => (
                    <button
                        key={law.id}
                        onClick={() => { setSelectedLaw(law); setSelectedChapter(null); setResult(null); }}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-smooth whitespace-nowrap ${selectedLaw.id === law.id
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                    >
                        <Icon name={law.icon} size={13} color="currentColor" />
                        {law.name}
                    </button>
                ))}
            </div>

            {/* Chapter list */}
            <div className="p-3 space-y-1">
                <p className="text-xs text-muted-foreground px-1 mb-2 font-medium">{selectedLaw.fullName}</p>
                {selectedLaw.chapters.map((ch, i) => (
                    <div key={i}>
                        <button
                            onClick={() => handleChapterClick(ch)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-smooth flex items-center justify-between gap-2 ${selectedChapter?.name === ch.name
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-foreground hover:bg-muted'
                                }`}
                        >
                            <span className="flex items-center gap-2">
                                <Icon name="ChevronRight" size={12} color="currentColor" className={selectedChapter?.name === ch.name ? 'rotate-90' : ''} />
                                {ch.name}
                            </span>
                            {isLoading && selectedChapter?.name === ch.name && (
                                <Icon name="Loader" size={12} color="currentColor" className="animate-spin flex-shrink-0" />
                            )}
                        </button>

                        {/* Inline result for selected chapter */}
                        {selectedChapter?.name === ch.name && (
                            <div className="mt-1 mx-1 p-3 rounded-lg bg-muted/60 text-xs text-foreground border border-border">
                                {isLoading ? (
                                    <div className="space-y-2">
                                        <div className="h-3 bg-border rounded animate-pulse w-3/4" />
                                        <div className="h-3 bg-border rounded animate-pulse" />
                                        <div className="h-3 bg-border rounded animate-pulse w-5/6" />
                                    </div>
                                ) : error ? (
                                    <p className="text-error">{error}</p>
                                ) : result ? (
                                    <>
                                        <div className="whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                                            {result.content}
                                        </div>
                                        {result.citations?.length > 0 && (
                                            <CitationCard citations={result.citations} searchQueries={result.searchQueries} compact />
                                        )}
                                    </>
                                ) : null}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LawBrowser;
