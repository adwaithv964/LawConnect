import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import Icon from '../../../components/AppIcon';

const LanguageSettings = () => {
    const { lang, setLang, languages, t } = useLanguage();

    return (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
                <h2 className="text-xl font-heading font-semibold text-foreground mb-1">{t('settings.language')}</h2>
                <p className="text-sm text-muted-foreground">{t('settings.languageDesc')}</p>
            </div>

            <div className="space-y-3">
                {languages.map(l => (
                    <button
                        key={l.code}
                        onClick={() => setLang(l.code)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${lang === l.code
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/40 hover:bg-muted/50'
                            }`}
                    >
                        <span className="text-3xl">{l.flag}</span>
                        <div className="flex-1">
                            <p className={`font-semibold ${lang === l.code ? 'text-primary' : 'text-foreground'}`}>
                                {l.nativeLabel}
                            </p>
                            <p className="text-sm text-muted-foreground">{l.label}</p>
                        </div>
                        {lang === l.code && (
                            <div className="flex-shrink-0">
                                <Icon name="CheckCircle" size={22} color="var(--color-primary)" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex items-start gap-2 p-3 bg-muted/60 rounded-lg text-xs text-muted-foreground">
                <Icon name="Info" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Your language preference is saved locally and will be remembered on your next visit.</span>
            </div>
        </div>
    );
};

export default LanguageSettings;
