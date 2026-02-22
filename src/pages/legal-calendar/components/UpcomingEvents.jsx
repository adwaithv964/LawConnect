import React from 'react';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../context/LanguageContext';
import { TYPE_CONFIG } from './EventModal';

const UpcomingEvents = ({ events, onEdit, onDelete }) => {
    const { t } = useLanguage();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sorted = [...events]
        .filter(e => {
            const d = new Date(e.date);
            d.setHours(0, 0, 0, 0);
            return d >= today;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 10);

    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Icon name="Bell" size={18} color="var(--color-primary)" />
                    {t('calendar.upcoming')}
                </h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    {sorted.length}
                </span>
            </div>

            <div className="divide-y divide-border max-h-[480px] overflow-y-auto">
                {sorted.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center px-5">
                        <Icon name="CalendarX" size={36} color="var(--color-muted-foreground)" />
                        <p className="text-sm text-muted-foreground mt-3">{t('calendar.noEvents')}</p>
                    </div>
                ) : (
                    sorted.map(event => {
                        const d = new Date(event.date);
                        d.setHours(0, 0, 0, 0);
                        const diffDays = Math.round((d - today) / 86400000);
                        const cfg = TYPE_CONFIG[event.type] || TYPE_CONFIG.other;

                        return (
                            <div key={event.id} className="flex items-start gap-3 px-5 py-4 hover:bg-muted/40 transition-colors group">
                                <div className={`flex-shrink-0 w-9 h-9 rounded-lg border flex items-center justify-center ${cfg.bg}`}>
                                    <Icon name={cfg.icon} size={16} className={cfg.color} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                    {event.notes && <p className="text-xs text-muted-foreground mt-0.5 truncate">{event.notes}</p>}
                                </div>
                                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${diffDays === 0 ? 'bg-success/15 text-success' : diffDays <= 3 ? 'bg-destructive/15 text-destructive' : diffDays <= 7 ? 'bg-warning/15 text-warning' : 'bg-muted text-muted-foreground'}`}>
                                        {diffDays === 0 ? t('calendar.today_label') : `${diffDays}d`}
                                    </span>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => onEdit(event)} className="p-1 rounded hover:bg-muted transition-colors">
                                            <Icon name="Pencil" size={12} color="var(--color-muted-foreground)" />
                                        </button>
                                        <button onClick={() => onDelete(event.id)} className="p-1 rounded hover:bg-destructive/10 transition-colors">
                                            <Icon name="Trash2" size={12} color="var(--color-destructive)" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default UpcomingEvents;
