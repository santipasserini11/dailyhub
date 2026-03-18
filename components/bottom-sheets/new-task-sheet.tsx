'use client';

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { currentUser, isHoliday } from '@/lib/data';
import { formatDate, TODAY } from '@/lib/utils';
import { AlertTriangle, Video, Link2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NewTaskSheet() {
  const { addTask, tasks, closeBottomSheet } = useApp();
  const [name, setName] = useState('');
  const [detail, setDetail] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dependsOn, setDependsOn] = useState('');
  const [showHolidayWarning, setShowHolidayWarning] = useState(false);
  const [hasVideocall, setHasVideocall] = useState(false);
  const [videocallLink, setVideocallLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

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

  const generateVideocallLink = () => {
    const randomId = Math.random().toString(36).substring(2, 10);
    const link = `https://meet.humand.co/${randomId}`;
    setVideocallLink(link);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(videocallLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
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
          placeholder="Descripcion opcional"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 resize-none"
          style={{ '--tw-ring-color': '#496BE3' } as React.CSSProperties}
        />
      </div>

      {/* Due date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha limite *
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
              Este dia es feriado o estas de licencia. Queres continuar igualmente?
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
          Yo — {currentUser.name}
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

      {/* Videocall toggle */}
      <div className="border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => {
            setHasVideocall(!hasVideocall);
            if (!hasVideocall && !videocallLink) {
              generateVideocallLink();
            }
          }}
          className={cn(
            'w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all',
            hasVideocall 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          )}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              hasVideocall ? 'bg-blue-500' : 'bg-gray-300'
            )}>
              <Video className={cn(
                'w-5 h-5',
                hasVideocall ? 'text-white' : 'text-gray-500'
              )} />
            </div>
            <div className="text-left">
              <p className={cn(
                'font-medium',
                hasVideocall ? 'text-blue-700' : 'text-gray-700'
              )}>
                Agregar videollamada
              </p>
              <p className="text-xs text-gray-500">
                Incluir link de reunion
              </p>
            </div>
          </div>
          <div className={cn(
            'w-12 h-7 rounded-full p-1 transition-colors',
            hasVideocall ? 'bg-blue-500' : 'bg-gray-300'
          )}>
            <div className={cn(
              'w-5 h-5 bg-white rounded-full shadow transition-transform',
              hasVideocall && 'translate-x-5'
            )} />
          </div>
        </button>

        {/* Videocall link - Google Meet style */}
        {hasVideocall && videocallLink && (
          <div className="mt-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-3">
              <Video className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Link de la reunion</span>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-3 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-white/80 shrink-0" />
              <span className="text-white text-sm flex-1 truncate font-mono">
                {videocallLink}
              </span>
              <button
                type="button"
                onClick={copyLink}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-lg font-medium text-sm flex items-center gap-1 transition-all',
                  linkCopied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                )}
              >
                {linkCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </button>
            </div>
            <p className="text-white/70 text-xs mt-2">
              El link se compartira automaticamente con los participantes
            </p>
          </div>
        )}
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
