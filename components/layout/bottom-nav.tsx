'use client';

import { Home, MessageSquare, LayoutGrid, Star, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-1 py-2 px-3 relative',
        active ? 'text-accent' : 'text-gray-400'
      )}
      style={{ color: active ? '#496BE3' : undefined }}
    >
      {icon}
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
  return (
    <nav className="flex items-center justify-around bg-white border-t border-gray-100 safe-area-pb">
      <NavItem icon={<Home className="w-5 h-5" />} label="Inicio" active />
      <NavItem icon={<MessageSquare className="w-5 h-5" />} label="Chats" />
      <NavItem icon={<LayoutGrid className="w-5 h-5" />} label="Apps" />
      <NavItem icon={<Star className="w-5 h-5" />} label="Reconocimientos" />
      <NavItem icon={<User className="w-5 h-5" />} label="Perfil" />
    </nav>
  );
}
