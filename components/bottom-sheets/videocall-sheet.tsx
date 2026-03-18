'use client';

import { useState } from 'react';
import { CalendarEvent } from '@/lib/types';
import { categoryColors } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { Video, Mic, MicOff, Camera, CameraOff, Users, Clock, X } from 'lucide-react';

interface VideocallSheetProps {
  event: CalendarEvent;
  onClose: () => void;
}

// Mock participants based on event
const getParticipants = (event: CalendarEvent) => {
  const participants = [
    { name: 'Santiago Passerini', avatar: 'SP', role: 'Tu' },
  ];
  
  if (event.organizer && event.organizer.name !== 'Santiago Passerini') {
    participants.push({ 
      name: event.organizer.name, 
      avatar: event.organizer.avatar || event.organizer.name.split(' ').map(n => n[0]).join(''),
      role: 'Organizador'
    });
  }
  
  // Add some mock participants based on event type
  if (event.title.includes('Weekly') || event.title.includes('Standup')) {
    participants.push(
      { name: 'Carlos Lopez', avatar: 'CL', role: '' },
      { name: 'Sofia Herrera', avatar: 'SH', role: '' },
      { name: 'Juan Perez', avatar: 'JP', role: '' },
    );
  } else if (event.title.includes('Sprint') || event.title.includes('Planning')) {
    participants.push(
      { name: 'Roberto Mendez', avatar: 'RM', role: '' },
      { name: 'Lara Rodriguez', avatar: 'LR', role: '' },
    );
  }
  
  return participants;
};

export function VideocallSheet({ event, onClose }: VideocallSheetProps) {
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  
  const participants = getParticipants(event);
  const color = categoryColors[event.category];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Video className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{event.title}</h2>
            <p className="text-sm text-gray-500 capitalize">
              {formatDate(event.startDate, "EEEE d 'de' MMMM")}
            </p>
          </div>
        </div>
      </div>

      {/* Time */}
      <div className="flex items-center gap-2 text-gray-600">
        <Clock className="w-4 h-4" />
        <span className="text-sm">{event.startTime} - {event.endTime}</span>
        <span className="text-xs text-gray-400">
          ({parseInt(event.endTime?.split(':')[0] || '0') - parseInt(event.startTime?.split(':')[0] || '0')} hora)
        </span>
      </div>

      {/* Participants */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {participants.length} participantes
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {participants.map((p, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50"
            >
              <Avatar name={p.name} initials={p.avatar} size="sm" />
              <div>
                <p className="text-sm font-medium text-gray-800">{p.name}</p>
                {p.role && (
                  <p className="text-xs text-gray-500">{p.role}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media controls */}
      <div className="flex items-center justify-center gap-4 py-4">
        <button
          onClick={() => setMicEnabled(!micEnabled)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
            micEnabled ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'
          }`}
        >
          {micEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </button>
        <button
          onClick={() => setCameraEnabled(!cameraEnabled)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
            cameraEnabled ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-600'
          }`}
        >
          {cameraEnabled ? <Camera className="w-6 h-6" /> : <CameraOff className="w-6 h-6" />}
        </button>
      </div>

      {/* Labels */}
      <div className="flex justify-center gap-8 text-xs text-gray-500">
        <span>{micEnabled ? 'Microfono activado' : 'Microfono desactivado'}</span>
        <span>{cameraEnabled ? 'Camara activada' : 'Camara desactivada'}</span>
      </div>

      {/* Join button */}
      <button
        className="w-full py-4 rounded-xl text-white font-semibold flex items-center justify-center gap-2 text-lg"
        style={{ backgroundColor: '#22C55E' }}
      >
        <Video className="w-5 h-5" />
        Unirse ahora
      </button>
    </div>
  );
}
