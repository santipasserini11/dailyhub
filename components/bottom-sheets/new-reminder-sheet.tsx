'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { people, isHoliday } from '@/lib/data';
import { formatDate, TODAY } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { AlertTriangle, X, Video } from 'lucide-react';

const availablePeople = [
  people.valentina,
  people.carlos,
  people.sofia,
  people.martin,
];

export function NewReminderSheet() {
  const { addReminder, closeBottomSheet } = useApp();
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [frequency, setFrequency] = useState('once');
  const [isVideocall, setIsVideocall] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [showHolidayWarning, setShowHolidayWarning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDateChange = (value: string) => {
    setDate(value);
    if (value) {
      const selectedDate = new Date(value);
      if (isHoliday(selectedDate)) {
        setShowHolidayWarning(true);
      } else {
        setShowHolidayWarning(false);
      }
    }
  };

  const togglePerson = (id: string) => {
    setSelectedPeople(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const filteredPeople = availablePeople.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date || !time) return;

    const selectedDate = new Date(date);
    const [hours, minutes] = time.split(':');
    
    addReminder({
      title: name,
      category: isVideocall ? 'videocall' : 'reminder',
      startDate: selectedDate,
      isAllDay: false,
      startTime: time,
      endTime: `${String(parseInt(hours) + 1).padStart(2, '0')}:${minutes}`,
      description: detail || undefined,
    });
    closeBottomSheet();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del recordatorio"
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': '#496BE3' } as React.CSSProperties}
          required
        />
      </div>

      {/* Detail */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Detalle
        </label>
        <textarea
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Descripción opcional"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 resize-none"
          style={{ '--tw-ring-color': '#496BE3' } as React.CSSProperties}
        />
      </div>

      {/* Add people */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Agregar personas
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar personas..."
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 mb-2"
          style={{ '--tw-ring-color': '#496BE3' } as React.CSSProperties}
        />
        
        {/* Selected people */}
        {selectedPeople.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedPeople.map(id => {
              const person = availablePeople.find(p => p.id === id);
              if (!person) return null;
              return (
                <span 
                  key={id}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full text-sm"
                >
                  <Avatar name={person.name} size="sm" />
                  <span className="text-gray-700">{person.name.split(' ')[0]}</span>
                  <button type="button" onClick={() => togglePerson(id)}>
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* People list */}
        {searchQuery && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {filteredPeople.map(person => (
              <button
                key={person.id}
                type="button"
                onClick={() => {
                  togglePerson(person.id);
                  setSearchQuery('');
                }}
                className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 text-left"
              >
                <Avatar name={person.name} size="sm" />
                <span className="text-sm text-gray-700">{person.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Is videocall toggle */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">¿Es una videollamada?</span>
        </div>
        <button
          type="button"
          onClick={() => setIsVideocall(!isVideocall)}
          className={`w-11 h-6 rounded-full transition-colors ${
            isVideocall ? 'bg-accent' : 'bg-gray-300'
          }`}
          style={{ backgroundColor: isVideocall ? '#496BE3' : undefined }}
        >
          <span 
            className={`block w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
              isVideocall ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
      
      {isVideocall && (
        <p className="text-xs text-gray-500 -mt-2 ml-1">
          Se generará link: hucalls.co/abc123
        </p>
      )}

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha *
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          min={formatDate(TODAY, 'yyyy-MM-dd')}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': '#496BE3' } as React.CSSProperties}
          required
        />
        {showHolidayWarning && (
          <div className="flex items-start gap-2 mt-2 p-3 bg-yellow-50 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">
              Este día es feriado o estás de licencia. ¿Querés continuar igualmente?
            </p>
          </div>
        )}
      </div>

      {/* Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hora *
        </label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2"
          style={{ '--tw-ring-color': '#496BE3' } as React.CSSProperties}
          required
        />
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Frecuencia
        </label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 bg-white"
          style={{ '--tw-ring-color': '#496BE3' } as React.CSSProperties}
        >
          <option value="once">Una vez</option>
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensual</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#496BE3' }}
      >
        Crear recordatorio
      </button>
    </form>
  );
}
