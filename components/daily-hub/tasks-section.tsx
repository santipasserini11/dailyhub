'use client';

import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/context';
import { Task } from '@/lib/types';
import { isOverdue, isDueToday, formatDate, cn } from '@/lib/utils';
import { Check, Plus, PartyPopper } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

export function TasksSection() {
  const { tasks, toggleTask, openBottomSheet } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);

  const { activeTasks, completedTasks, allCompleted } = useMemo(() => {
    const active = tasks.filter(t => !t.completed).sort((a, b) => {
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

  const handleToggle = useCallback((id: string, index: number) => {
    toggleTask(id);
    // Smooth scroll to next pending task
    setTimeout(() => {
      if (containerRef.current && index < activeTasks.length - 1) {
        const nextTask = containerRef.current.querySelector(`[data-task-index="${index + 1}"]`);
        if (nextTask) {
          nextTask.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 300);
  }, [toggleTask, activeTasks.length]);

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
            Cumpliste todas las tareas del dia
          </p>
        </div>
      ) : (
        <div ref={containerRef} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            {activeTasks.map((task, index) => (
              <TaskRow 
                key={task.id} 
                task={task} 
                index={index}
                onToggle={() => handleToggle(task.id, index)} 
              />
            ))}
            {completedTasks.map((task, index) => (
              <TaskRow 
                key={task.id} 
                task={task} 
                index={activeTasks.length + index}
                onToggle={() => toggleTask(task.id)} 
                completed 
              />
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

function TaskRow({ task, index, onToggle, completed }: { task: Task; index: number; onToggle: () => void; completed?: boolean }) {
  const overdue = !completed && isOverdue(task.dueDate);
  const dueToday = !completed && isDueToday(task.dueDate);
  const [swipeX, setSwipeX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const rowRef = useRef<HTMLDivElement>(null);

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
      text: formatDate(task.dueDate, "d MMM"),
      className: 'bg-gray-100 text-gray-600',
    };
  }, [completed, task.completedDate, task.dueDate, overdue, dueToday]);

  const badge = getDueBadge();

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    const limitedDiff = Math.max(0, Math.min(80, diff));
    setSwipeX(limitedDiff);
  };

  const handleTouchEnd = () => {
    if (swipeX > 60) {
      onToggle();
    }
    setSwipeX(0);
    setIsDragging(false);
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    setIsDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startXRef.current;
      const limitedDiff = Math.max(0, Math.min(80, diff));
      setSwipeX(limitedDiff);
    };
    
    const handleMouseUp = () => {
      if (swipeX > 60) {
        onToggle();
      }
      setSwipeX(0);
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Get creator info
  const creatorName = task.createdByMe 
    ? 'Creada por mi' 
    : task.assignedBy 
      ? task.assignedBy.name 
      : 'Sistema';
  
  const creatorAvatar = task.createdByMe 
    ? 'YO' 
    : task.assignedBy?.avatar || 'SY';

  return (
    <div 
      ref={rowRef}
      data-task-index={index}
      className="relative overflow-hidden"
    >
      {/* Swipe background - hidden until swiping */}
      <div 
        className="absolute inset-y-0 left-0 flex items-center pl-4 transition-opacity"
        style={{ 
          backgroundColor: '#22C55E',
          width: '80px',
          opacity: swipeX > 0 ? 1 : 0,
        }}
      >
        <Check className="w-5 h-5 text-white" />
      </div>
      
      {/* Main content */}
      <div 
        className={cn(
          'flex items-start gap-3 p-3 bg-white relative select-none',
          completed && 'opacity-50',
          overdue && 'border-l-2 border-l-red-500',
          !isDragging && 'transition-transform duration-200'
        )}
        style={{ transform: `translateX(${swipeX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Checkbox - clickable */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={cn(
            'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-colors',
            completed 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-300 hover:border-green-400'
          )}
        >
          {completed && <Check className="w-3 h-3 text-white" />}
        </button>
        
        <div className="flex-1 min-w-0">
          {/* Task title */}
          <p className={cn(
            'text-sm font-medium text-gray-800',
            completed && 'line-through'
          )}>
            {task.title}
          </p>
          
          {/* Creator info with avatar */}
          <div className="flex items-center gap-1.5 mt-1">
            <Avatar 
              name={creatorName} 
              initials={creatorAvatar} 
              size="xs" 
            />
            <span className="text-xs text-gray-500">
              {creatorName}
            </span>
          </div>
        </div>

        {/* Due date badge */}
        <span className={cn('text-xs px-2 py-0.5 rounded-full shrink-0', badge.className)}>
          {badge.text}
        </span>
      </div>
    </div>
  );
}
