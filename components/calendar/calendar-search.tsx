'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '@/lib/context';
import { Search, X, Command } from 'lucide-react';
import { categoryColors } from '@/lib/data';
import { CategoryIcon } from '@/components/ui/category-icon';
import { CalendarEvent } from '@/lib/types';
import { cn, formatDate } from '@/lib/utils';

export function CalendarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { events, openBottomSheet } = useApp();

  // Handle keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Filter events based on query
  const filteredEvents = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    return events.filter(event => {
      const titleMatch = event.title.toLowerCase().includes(searchTerm);
      const personMatch = event.person?.name.toLowerCase().includes(searchTerm);
      const organizerMatch = event.organizer?.name.toLowerCase().includes(searchTerm);
      return titleMatch || personMatch || organizerMatch;
    }).slice(0, 10); // Limit to 10 results
  }, [events, query]);

  const handleSelectEvent = (event: CalendarEvent) => {
    setIsOpen(false);
    setQuery('');
    if (event.category === 'videocall') {
      openBottomSheet({ type: 'videocall', event });
    } else {
      openBottomSheet({ type: 'event', event });
    }
  };

  const formatEventDate = (event: CalendarEvent) => {
    const date = new Date(event.startDate);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    const dateStr = date.toLocaleDateString('es-ES', options);
    if (event.startTime) {
      return `${dateStr} - ${event.startTime}`;
    }
    return dateStr;
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors w-full"
      >
        <Search className="w-4 h-4" />
        <span className="flex-1 text-left">Buscar eventos, personas...</span>
        <span className="flex items-center gap-0.5 text-xs text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">
          <Command className="w-3 h-3" />K
        </span>
      </button>

      {/* Search modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => { setIsOpen(false); setQuery(''); }}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Search input */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar eventos, personas..."
                className="flex-1 text-base outline-none placeholder:text-gray-400"
              />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <button 
                onClick={() => { setIsOpen(false); setQuery(''); }}
                className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-auto">
              {query.trim() === '' ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  Escribe para buscar eventos, reuniones, cumpleanos...
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No se encontraron resultados para "{query}"
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {filteredEvents.map((event) => (
                    <button
                      key={event.id}
                      onClick={() => handleSelectEvent(event)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                      {/* Color indicator and icon */}
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-1 h-10 rounded-full"
                          style={{ backgroundColor: categoryColors[event.category] }}
                        />
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${categoryColors[event.category]}15` }}
                        >
                          <CategoryIcon 
                            category={event.category} 
                            size={16} 
                            className="shrink-0"
                            style={{ color: categoryColors[event.category] }}
                          />
                        </div>
                      </div>
                      
                      {/* Event info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          {formatEventDate(event)}
                          {event.organizer && ` - ${event.organizer.name}`}
                          {event.person && ` - ${event.person.name}`}
                        </p>
                      </div>

                      {/* Category badge */}
                      <span 
                        className="text-[10px] px-2 py-1 rounded-full text-white shrink-0"
                        style={{ backgroundColor: categoryColors[event.category] }}
                      >
                        {event.category === 'videocall' ? 'Reunion' : 
                         event.category === 'birthday' ? 'Cumpleanos' :
                         event.category === 'anniversary' ? 'Aniversario' :
                         event.category === 'vacation' ? 'Vacaciones' :
                         event.category === 'company-event' ? 'Evento' :
                         event.category === 'training' ? 'Capacitacion' :
                         event.category === 'communication' ? 'Comunicacion' :
                         event.category}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
