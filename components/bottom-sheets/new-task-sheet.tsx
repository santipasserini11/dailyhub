'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { currentUser, isHoliday } from '@/lib/data';
import { formatDate, TODAY } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

export function NewTaskSheet() {
  const { addTask, tasks, closeBottomSheet } = useApp();
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dependsOn, setDependsOn] = useState('');
  const [showHolidayWarning, setShowHolidayWarning] = useState(false);

  const activeTasks = tasks.filter(t => !t.completed);

  const handleDateChange = (value: string) => {
    setDueDate(value);
    if (value) {
      const date = new Date(value);
      if (isHoliday(date)) {
        setShowHolidayWarning(true);
      } else {
        setShowHolidayWarning(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dueDate) return;

    addTask({
      title: name,
      tag: 'General',
      createdByMe: true,
      dueDate: new Date(dueDate),
      completed: false,
      dependsOn: dependsOn || undefined,
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
          placeholder="Nombre de la tarea"
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent"
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
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 resize-none"
          style={{ '--tw-ring-color': '#496BE3' } as React.CSSProperties}
        />
      </div>

      {/* Due date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha límite *
        </label>
        <input
          type="date"
          value={dueDate}
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

      {/* Responsible */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Responsable
        </label>
        <div className="px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-700">
          🧑 Yo — {currentUser.name}
        </div>
      </div>

      {/* Depends on */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Depende de otra tarea
        </label>
        <select
          value={dependsOn}
          onChange={(e) => setDependsOn(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 bg-white"
          style={{ '--tw-ring-color': '#496BE3' } as React.CSSProperties}
        >
          <option value="">Ninguna</option>
          {activeTasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
        style={{ backgroundColor: '#496BE3' }}
      >
        Crear tarea
      </button>
    </form>
  );
}
