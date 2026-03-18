'use client';

import { absentToday } from '@/lib/data';
import { Avatar } from '@/components/ui/avatar';
import { formatDateRange, getLeaveTypeLabel } from '@/lib/utils';

export function WhosOutSheet() {
  return (
    <div className="space-y-3">
      {absentToday.map((person) => (
        <div key={person.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
          <Avatar name={person.name} initials={person.avatar} size="lg" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800">{person.name}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span 
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: person.leaveType === 'medical-leave' ? '#FEF3C7' : '#CCFBF1',
                  color: person.leaveType === 'medical-leave' ? '#92400E' : '#0F766E'
                }}
              >
                {getLeaveTypeLabel(person.leaveType)}
              </span>
              <span className="text-xs text-gray-500">
                {formatDateRange(person.startDate, person.endDate)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Líder: {person.leader.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
