'use client';

import { 
  Cake, 
  Gift, 
  Building2, 
  Palmtree, 
  Stethoscope, 
  Calendar,
  TrendingUp,
  MessageSquare,
  GraduationCap,
  CheckSquare,
  ClipboardList,
  Phone,
  Megaphone,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Map category to Lucide icon component
const iconMap: Record<string, LucideIcon> = {
  'birthday': Cake,
  'anniversary': Gift,
  'holiday': Building2,
  'vacation': Palmtree,
  'medical-leave': Stethoscope,
  'company-event': Calendar,
  'performance': TrendingUp,
  'survey': MessageSquare,
  'training': GraduationCap,
  'onboarding': CheckSquare,
  'task': ClipboardList,
  'videocall': Phone,
  'communication': Megaphone,
};

interface CategoryIconProps {
  category: string;
  className?: string;
  size?: number;
}

export function CategoryIcon({ category, className, size = 16 }: CategoryIconProps) {
  const Icon = iconMap[category];
  
  if (!Icon) {
    return null;
  }
  
  return <Icon className={cn('shrink-0', className)} size={size} />;
}

// Export the map for direct access if needed
export { iconMap };
