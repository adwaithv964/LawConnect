import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import EmergencyAlertBanner from '../../components/ui/EmergencyAlertBanner';
import Icon from '../../components/AppIcon';
import EventModal from './components/EventModal';
import UpcomingEvents from './components/UpcomingEvents';
import { getCalendarEvents, saveCalendarEvent, deleteCalendarEvent } from '../../utils/api';
import { useLanguage } from '../../context/LanguageContext';
import { TYPE_CONFIG } from './components/EventModal';

// Pre-defined important Indian legal dates (recurring annually)
const LEGAL_DATES = [
    { title: 'National Law Day', month: 11, day: 26, type: 'other', notes: 'Also Constitution Day' },
    { title: 'Consumer Rights Day', month: 3, day: 15, type: 'other', notes: 'World Consumer Rights Day' },
    { title: 'National Legal Services Day', month: 11, day: 9, type: 'other', notes: 'NALSA Day' },
    { title: 'Law Day (India)', month: 4, day: 14, type: 'other', notes: 'Dr. Ambedkar Jayanti' },
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

const LegalCalendar = () => {
    const { t } = useLanguage();
    const [events, setEvents] = useState([]);
    const [viewDate, setViewDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const loadEvents = useCallback(() => {
        setEvents(getCalendarEvents());
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const handleSave = (event) => {
        const updated = saveCalendarEvent(event);
        setEvents(updated);
    };

    const handleDelete = (id) => {
        const updated = deleteCalendarEvent(id);
        setEvents(updated);
    };

    const handleEdit = (event) => {
        setEventToEdit(event);
        setIsModalOpen(true);
    };

    const handleDayClick = (dateStr) => {
        setSelectedDate(dateStr);
        setEventToEdit({ date: dateStr });
        setIsModalOpen(true);
    };

    // Calendar grid logic
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const todayStr = new Date().toISOString().split('T')[0];

    // Map events & legal dates to date strings
    const eventsByDate = {};
    events.forEach(e => {
        const d = e.date;
        if (!eventsByDate[d]) eventsByDate[d] = [];
        eventsByDate[d].push(e);
    });

    // Add recurring legal dates for current year
    LEGAL_DATES.forEach(ld => {
        const d = `${year}-${String(ld.month).padStart(2, '0')}-${String(ld.day).padStart(2, '0')}`;
        if (!eventsByDate[d]) eventsByDate[d] = [];
        eventsByDate[d].push({ ...ld, id: `legal-${d}`, isLegal: true });
    });

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <EmergencyAlertBanner />

            <main className="pt-32 lg:pt-36 pb-12 px-4 lg:px-6">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                                <Icon name="CalendarDays" size={22} color="var(--color-primary)" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-heading font-semibold text-foreground">
                                {t('calendar.title')}
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground ml-0 mt-1">{t('calendar.subtitle')}</p>
                    </div>
                    <button
                        onClick={() => { setEventToEdit(null); setIsModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        <Icon name="Plus" size={18} />
                        {t('calendar.addReminder')}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
                        {/* Month Nav */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                                <Icon name="ChevronLeft" size={20} />
                            </button>
                            <h2 className="text-base font-semibold text-foreground">
                                {MONTHS[month]} {year}
                            </h2>
                            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                                <Icon name="ChevronRight" size={20} />
                            </button>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 border-b border-border">
                            {DAYS.map(d => (
                                <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-7">
                            {/* Empty cells before first day */}
                            {[...Array(firstDay)].map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[72px] border-r border-b border-border last:border-r-0 bg-muted/20" />
                            ))}

                            {/* Day cells */}
                            {[...Array(daysInMonth)].map((_, i) => {
                                const day = i + 1;
                                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                const dayEvents = eventsByDate[dateStr] || [];
                                const isToday = dateStr === todayStr;
                                const colIndex = (firstDay + i) % 7;

                                return (
                                    <div
                                        key={day}
                                        onClick={() => handleDayClick(dateStr)}
                                        className={`min-h-[72px] border-b border-border p-1.5 cursor-pointer hover:bg-primary/5 transition-colors ${colIndex === 6 ? '' : 'border-r'} ${isToday ? 'bg-primary/5' : ''}`}
                                    >
                                        <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mb-1 ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                                            {day}
                                        </div>
                                        <div className="space-y-0.5">
                                            {dayEvents.slice(0, 2).map((evt, ei) => {
                                                const cfg = TYPE_CONFIG[evt.type] || TYPE_CONFIG.other;
                                                return (
                                                    <div
                                                        key={ei}
                                                        className={`text-[10px] leading-tight px-1 py-0.5 rounded truncate font-medium border ${evt.isLegal ? 'bg-purple-50 text-purple-700 border-purple-200' : cfg.bg + ' ' + cfg.color}`}
                                                    >
                                                        {evt.title}
                                                    </div>
                                                );
                                            })}
                                            {dayEvents.length > 2 && (
                                                <div className="text-[10px] text-muted-foreground pl-1">+{dayEvents.length - 2} more</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        <UpcomingEvents events={events} onEdit={handleEdit} onDelete={handleDelete} />

                        {/* Legal Dates Card */}
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="px-5 py-4 border-b border-border">
                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <Icon name="Star" size={16} color="var(--color-primary)" />
                                    {t('calendar.legalDates')}
                                </h3>
                            </div>
                            <div className="divide-y divide-border">
                                {LEGAL_DATES.map(ld => (
                                    <div key={ld.title} className="px-5 py-3 flex items-center gap-3">
                                        <div className="flex-shrink-0 w-10 text-center">
                                            <div className="text-xs text-muted-foreground">{MONTHS[ld.month - 1].slice(0, 3)}</div>
                                            <div className="text-base font-bold text-primary">{ld.day}</div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{ld.title}</p>
                                            <p className="text-xs text-muted-foreground">{ld.notes}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <EventModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEventToEdit(null); }}
                onSave={handleSave}
                eventToEdit={eventToEdit}
            />
        </div>
    );
};

export default LegalCalendar;
