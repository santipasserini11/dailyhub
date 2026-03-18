'use client';

import { useMemo, useCallback, useState, useRef } from 'react';
import { useApp } from '@/lib/context';
import { Task } from '@/lib/types';
import { isOverdue, isDueToday, formatDate, cn } from '@/lib/utils';
import { Check, Plus, PartyPopper, Trash2 } from 'lucide-react';

export function TasksSection() {
  const { tasks, toggleTask, openBottomSheet } = useApp();

  const { activeTasks, completedTasks, allCompleted } = useMemo(() => {
    const active = tasks.filter(t => !t.completed).sort((a, b) => {
      // Overdue first, then today, then future
      const aOverdue = isOverdue(a.dueDate);
      const bOverdue = isOverdue(b.dueDate);
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
    const completed = tasks.filter(t => t.completed);
    return {
      activeTasks: active,
      completedTasks: completed,
      allCompleted: active.length === 0 && completed.length > 0,
    };
  }, [tasks]);

  const handleToggle = useCallback((id: string) => {
    toggleTask(id);
  }, [toggleTask]);

  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Mis tareas</h2>
      
      {allCompleted ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <PartyPopper className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-700 font-medium">
            Cumpliste todas las tareas del dia, felicitaciones!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {activeTasks.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={() => handleToggle(task.id)} />
            ))}
            {completedTasks.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={() => handleToggle(task.id)} completed />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => openBottomSheet({ type: 'new-task' })}
        className="flex items-center gap-2 mt-3 text-sm font-medium hover:underline"
        style={{ color: '#496BE3' }}
      >
        <Plus className="w-4 h-4" />
        Agregar tarea
      </button>
    </section>
  );
}

function TaskRow({ task, onToggle, completed }: { task: Task; onToggle: () => void; completed?: boolean }) {
  const overdue = !completed && isOverdue(task.dueDate);
  const dueToday = !completed && isDueToday(task.dueDate);
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startXRef = useRef(0);

  const getDueBadge = useCallback(() => {
    if (completed && task.completedDate) {
      return {
        text: `Completada ${formatDate(task.completedDate, "d MMM")}`,
        className: 'bg-gray-100 text-gray-500',
      };
    }
    if (overdue) {
      return {
        text: 'Vencida',
        className: 'bg-red-100 text-red-700',
      };
    }
    if (dueToday) {
      return {
        text: 'Hoy',
        className: 'bg-orange-100 text-orange-700',
      };
    }
    return {
      text: formatDate(task.dueDate, "MMM d"),
      className: 'bg-gray-100 text-gray-600',
    };
  }, [completed, task.completedDate, task.dueDate, overdue, dueToday]);

  const badge = getDueBadge();

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!swiping) return;
    const diff = e.touches[0].clientX - startXRef.current;
    // Limit swipe distance
    const limitedDiff = Math.max(-80, Math.min(80, diff));
    setSwipeX(limitedDiff);
  };

  const handleTouchEnd = () => {
    if (swipeX > 60) {
      // Swipe right - complete
      onToggle();
    }
    // Swipe left - delete (would need delete handler)
    setSwipeX(0);
    setSwiping(false);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Swipe actions background */}
      <div className="absolute inset-y-0 left-0 w-20 bg-green-500 flex items-center justify-center">
        <Check className="w-5 h-5 text-white" />
      </div>
      <div className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center">
        <Trash2 className="w-5 h-5 text-white" />
      </div>
      
      {/* Main content */}
      <div 
        className={cn(
          'flex items-start gap-3 p-3 bg-white relative transition-transform',
          completed && 'opacity-50',
          overdue && 'border-l-2 border-l-red-500'
        )}
        style={{ transform: `translateX(${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          onClick={onToggle}
          className={cn(
            'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors',
            completed 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          {completed && <Check className="w-3 h-3 text-white" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm font-medium text-gray-800',
            completed && 'line-through'
          )}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {task.tag}
            </span>
            {task.createdByMe ? (
              <span 
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#EEF2FF', color: '#496BE3' }}
              >
                Creada por mi
              </span>
            ) : task.assignedBy && (
              <span 
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
              >
                Asignada por {task.assignedBy.name.split(' ')[0]}
              </span>
            )}
          </div>
        </div>

        <span className={cn('text-xs px-2 py-0.5 rounded-full shrink-0', badge.className)}>
          {badge.text}
        </span>
      </div>
    </div>
  );
}
