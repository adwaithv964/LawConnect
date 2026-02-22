import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { useLanguage } from '../../../context/LanguageContext';
import { saveCalendarEvent } from '../../../utils/api';

const EVENT_TYPES = ['hearing', 'renewal', 'deadline', 'other'];

const TYPE_CONFIG = {
    hearing: { icon: 'Scale', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    renewal: { icon: 'RefreshCw', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
    deadline: { icon: 'AlertTriangle', color: 'text-red-600', bg: 'bg-red-50 border-red-200' },
    other: { icon: 'Circle', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
};

const EMPTY_FORM = { title: '', date: '', type: 'hearing', notes: '' };

const EventModal = ({ isOpen, onClose, onSave, eventToEdit }) => {
    const { t } = useLanguage();
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (eventToEdit) setForm({ ...EMPTY_FORM, ...eventToEdit });
        else setForm(EMPTY_FORM);
    }, [eventToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title || !form.date) return;
        onSave({ ...form, id: eventToEdit?.id });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground">
                        {eventToEdit ? t('calendar.edit') : t('calendar.addReminder')}
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        <Icon name="X" size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">{t('calendar.eventTitle')}</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="e.g. District Court Hearing"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">{t('calendar.eventDate')}</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1.5">{t('calendar.eventType')}</label>
                            <select
                                value={form.type}
                                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                                {EVENT_TYPES.map(type => (
                                    <option key={type} value={type}>{t(`calendar.type.${type}`)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">{t('calendar.eventNotes')}</label>
                        <textarea
                            value={form.notes}
                            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                            className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                            rows={2}
                            placeholder="Additional notes..."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                            {t('calendar.cancel')}
                        </button>
                        <button type="submit" className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                            {t('calendar.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export { TYPE_CONFIG, EVENT_TYPES };
export default EventModal;
