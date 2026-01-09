import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Copy, Mail, MessageCircle, Send, Check } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, caseData }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !caseData) return null;

    const shareUrl = window.location.href; // In a real app, this might be a deep link to the specific case
    const shareText = `Check out the timeline for *${caseData.title}*.\nCategory: ${caseData.category}\nStatus: ${caseData.status}\nProgress: ${caseData.completionPercentage}%\n\nView details here: ${shareUrl}`;

    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    const shareOptions = [
        {
            name: "WhatsApp",
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382C17.119 14.992 16.591 15.347 15.659 15.602C14.735 15.856 13.91 15.82 13.22 15.549C12.331 15.201 11.025 14.502 9.537 12.986C8.049 11.47 7.399 10.198 7.086 9.351C6.84 8.685 6.846 7.848 7.132 6.941C7.305 6.393 7.636 5.865 8.243 5.487C8.423 5.378 8.631 5.32 8.847 5.32C8.989 5.32 9.13 5.352 9.259 5.412C9.407 5.485 9.528 5.608 9.601 5.759C9.845 6.273 10.457 7.671 10.537 7.87C10.635 8.118 10.59 8.398 10.418 8.601L9.664 9.42C9.559 9.525 9.516 9.68 9.585 9.814C9.722 10.088 10.148 10.871 10.957 11.666C11.905 12.597 12.868 12.95 13.167 13.045C13.31 13.088 13.468 13.033 13.564 12.915L14.288 12.062C14.469 11.838 14.767 11.758 15.034 11.861C15.253 11.947 16.634 12.564 17.126 12.805C17.266 12.873 17.382 12.977 17.447 13.111C17.512 13.245 17.525 13.399 17.472 14.382Z" fill="white" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.403 5.633C16.827 4.057 14.732 3.189 12.5 3.189C7.947 3.19 4.242 6.895 4.242 11.448C4.242 12.903 4.622 14.321 5.342 15.568L4.172 19.839L8.542 18.693C9.743 19.347 11.106 19.692 12.499 19.692H12.503C17.054 19.692 20.758 15.986 20.758 11.449C20.758 9.243 19.899 7.168 18.403 5.633ZM12.502 18.297H12.498C11.267 18.297 10.059 17.967 9.006 17.342L8.756 17.194L6.152 17.877L6.847 15.337L6.586 14.922C5.86 13.768 5.476 12.427 5.477 11.448C5.477 7.576 8.628 4.424 12.503 4.424C14.38 4.424 16.143 5.155 17.469 6.483C18.796 7.81 19.526 9.573 19.526 11.45C19.526 15.322 16.375 18.474 12.502 18.474V18.297 Z" fill="#25D366" />
                    <path d="M12.503 21C7.234 21 2.95 16.716 2.95 11.448C2.95 6.18 7.234 1.896 12.503 1.896C17.771 1.896 22.056 6.18 22.056 11.448C22.056 16.716 17.771 21 12.503 21Z" fill="#25D366" />
                    <path d="M17.472 14.382C17.119 14.992 16.591 15.347 15.659 15.602C14.735 15.856 13.91 15.82 13.22 15.549C12.331 15.201 11.025 14.502 9.537 12.986C8.049 11.47 7.399 10.198 7.086 9.351C6.84 8.685 6.846 7.848 7.132 6.941C7.305 6.393 7.636 5.865 8.243 5.487C8.423 5.378 8.631 5.32 8.847 5.32C8.989 5.32 9.13 5.352 9.259 5.412C9.407 5.485 9.528 5.608 9.601 5.759C9.845 6.273 10.457 7.671 10.537 7.87C10.635 8.118 10.59 8.398 10.418 8.601L9.664 9.42C9.559 9.525 9.516 9.68 9.585 9.814C9.722 10.088 10.148 10.871 10.957 11.666C11.905 12.597 12.868 12.95 13.167 13.045C13.31 13.088 13.468 13.033 13.564 12.915L14.288 12.062C14.469 11.838 14.767 11.758 15.034 11.861C15.253 11.947 16.634 12.564 17.126 12.805C17.266 12.873 17.382 12.977 17.447 13.111C17.512 13.245 17.525 13.399 17.472 14.382Z" fill="white" />
                </svg>
            ),
            color: "hover:bg-[#25D366]/10",
            action: () => window.open(`https://wa.me/?text=${encodedText}`, '_blank')
        },
        {
            name: "Telegram",
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#229ED9" />
                    <path d="M5.225 12.325L10.025 15.425L13.525 11.425L9.625 15.825L9.125 19.325L12.325 16.525L15.925 19.325L19.025 5.525L5.225 10.825L5.225 12.325Z" fill="white" />
                    <path d="M5.4 12L10.2 15.3L17.8 8.1L9.5 15.7L9 19.4L12.4 16.5L16.2 19L19.4 5.3L5.4 10.7V12Z" fill="white" />
                </svg>
            ),
            color: "hover:bg-[#229ED9]/10",
            action: () => window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`Check out this case: ${caseData.title}`)}`, '_blank')
        },
        {
            name: "Gmail",
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.58 19.1068L3.89 11.0311C2.55 10.12 1.5 11.3 1.5 12.5V26.5C1.5 28.1569 2.84315 29.5 4.5 29.5H8.5V17.5L16.58 22.5L24.66 17.5V29.5H28.5C30.1569 29.5 31.5 28.1569 31.5 26.5V12.5C31.5 11.3 30.45 10.12 29.11 11.0311L16.58 19.1068Z" fill="#EA4335" />
                    <path d="M1.5 12.5L16.58 22.5L31.5 12.5V8.5C31.5 6.84315 30.1569 5.5 28.5 5.5H24.5V17.5L16.58 22.5L8.5 17.5V5.5H4.5C2.84315 5.5 1.5 6.84315 1.5 8.5V12.5Z" fill="#EA4335" fillOpacity="0.1" />
                    <path d="M28.5 5.5H31.5V12.5L24.5 17.5V5.5H28.5Z" fill="#34A853" />
                    <path d="M4.5 5.5H1.5V12.5L8.5 17.5V5.5H4.5Z" fill="#4285F4" />
                    <path d="M16.58 19.1068L8.5 13.9189V5.5H4.5C2.84315 5.5 1.5 6.84315 1.5 8.5V12.5L16.58 22.5L31.5 12.5V8.5C31.5 6.84315 30.1569 5.5 28.5 5.5H24.5V13.9189L16.58 19.1068Z" fill="#EA4335" />
                    <path d="M1.5 12.5V8.5C1.5 7.6 1.8 6.8 2.3 6.2L8.5 10.8V17.5L1.5 12.5Z" fill="#C5221F" />
                    <path d="M31.5 12.5V8.5C31.5 7.6 31.2 6.8 30.7 6.2L24.5 10.8V17.5L31.5 12.5Z" fill="#188038" />
                    <path d="M1.5 8.5V12.5L8.5 17.5V5.5H4.5C2.84315 5.5 1.5 6.84315 1.5 8.5Z" fill="#4285F4" />
                    <path d="M28.5 5.5H24.5V17.5L31.5 12.5V8.5C31.5 6.84315 30.1569 5.5 28.5 5.5Z" fill="#34A853" />
                    <path d="M24.5 5.5H28.5C29.2 5.5 29.8 5.6 30.3 5.9L24.5 10V5.5Z" fill="#FBBC04" />
                </svg>
            ),
            color: "hover:bg-[#EA4335]/10",
            action: () => window.open(`mailto:?subject=${encodeURIComponent(`Case Timeline: ${caseData.title}`)}&body=${encodedText}`, '_blank')
        }
    ];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy using clipboard API', err);
            // Fallback or alert could go here
        }
    };

    return (
        <div className="fixed inset-0 z-300 flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-sm bg-card rounded-xl shadow-elevation-5 overflow-hidden slide-in-bottom">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-heading font-semibold text-foreground">
                        Share Link
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-smooth"
                        aria-label="Close modal"
                    >
                        <Icon name="X" size={20} color="var(--color-foreground)" />
                    </button>
                </div>

                <div className="p-6">
                    <h3 className="text-sm font-medium text-foreground mb-4">
                        Share this case via
                    </h3>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {shareOptions.map((option) => (
                            <button
                                key={option.name}
                                onClick={option.action}
                                className={`
                            flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-transform hover:scale-105 border border-border bg-background
                            ${option.color}
                        `}
                            >
                                {option.icon}
                                <span className="text-xs font-medium text-foreground">{option.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Icon name="Link" size={16} color="var(--color-muted-foreground)" />
                        </div>
                        <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="w-full h-10 pl-9 pr-24 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none"
                        />
                        <button
                            onClick={handleCopy}
                            className="absolute inset-y-1 right-1 px-3 flex items-center gap-1.5 bg-background border border-border rounded-md text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-sm"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-3.5 h-3.5 text-success" />
                                    <span className="text-success">Copied</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
