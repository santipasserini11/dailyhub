'use client';

import { Home, MessageSquare, LayoutGrid, Star, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/context';
import { useMemo } from 'react';
import { isOverdue } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  onClick?: () => void;
}

function NavItem({ icon, label, active, badge, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 py-2 px-3 relative',
        active ? 'text-accent' : 'text-gray-400'
      )}
      style={{ color: active ? '#496BE3' : undefined }}
    >
      <div className="relative">
        {icon}
        {badge && badge > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </div>
      <span className="text-[10px] font-medium">{label}</span>
      {active && (
        <span 
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ backgroundColor: '#496BE3' }}
        />
      )}
    </button>
  );
}

export function BottomNav() {
  const { tasks } = useApp();
  
  // Count urgent tasks (overdue or due today)
  const urgentCount = useMemo(() => {
    return tasks.filter(t => !t.completed && isOverdue(t.dueDate)).length;
  }, [tasks]);

  return (
    <nav className="flex items-center justify-around bg-white border-t border-gray-100 safe-area-pb">
      <NavItem 
        icon={<Home className="w-5 h-5" />} 
        label="Inicio" 
        active 
        badge={urgentCount}
      />
      <NavItem icon={<MessageSquare className="w-5 h-5" />} label="Chats" />
      <NavItem icon={<LayoutGrid className="w-5 h-5" />} label="Apps" />
      <NavItem icon={<Star className="w-5 h-5" />} label="Reconocimientos" />
      <NavItem icon={<User className="w-5 h-5" />} label="Perfil" />
    </nav>
  );
}
