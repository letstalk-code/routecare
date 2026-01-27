'use client';

import { Trip } from '@/shared';

interface TripRequirementsCardProps {
  trip: Trip;
}

export function TripRequirementsCard({ trip }: TripRequirementsCardProps) {
  const getMobilityIcon = (level: string) => {
    if (level === 'wheelchair') return '♿';
    if (level === 'stretcher') return '🛏️';
    return '🚶';
  };

  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="text-sm font-semibold text-slate-300 mb-3">Trip Requirements</div>

      <div className="space-y-2">
        {/* Mobility Level */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
          <div className="text-2xl">{getMobilityIcon(trip.passenger.mobilityLevel)}</div>
          <div>
            <div className="text-sm font-medium text-blue-400 capitalize">
              {trip.passenger.mobilityLevel}
            </div>
            <div className="text-xs text-blue-300/70">Mobility Assistance</div>
          </div>
        </div>

        {/* Special Needs */}
        {trip.passenger.specialNeeds && trip.passenger.specialNeeds.length > 0 && (
          <>
            {trip.passenger.specialNeeds.map((need) => (
              <div key={need} className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                <div className="text-xl">
                  {need === 'Oxygen Tank' && '💨'}
                  {need === 'Service Animal' && '🐕'}
                  {need === 'Fragile' && '⚠️'}
                </div>
                <div>
                  <div className="text-sm font-medium text-orange-400">{need}</div>
                  <div className="text-xs text-orange-300/70">Special Need</div>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Trip Type */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
          <div className="text-xl">
            {trip.type === 'discharge' && '🏥'}
            {trip.type === 'dialysis' && '💉'}
            {trip.type === 'appointment' && '📅'}
          </div>
          <div>
            <div className="text-sm font-medium text-purple-400 capitalize">{trip.type}</div>
            <div className="text-xs text-purple-300/70">Trip Type</div>
          </div>
        </div>

        {/* Priority */}
        {trip.priority === 'STAT' && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="text-xl">⚡</div>
            <div>
              <div className="text-sm font-medium text-red-400">STAT Priority</div>
              <div className="text-xs text-red-300/70">Urgent Transport Required</div>
            </div>
          </div>
        )}
      </div>

      {trip.notes && (
        <div className="mt-3 p-3 rounded-lg bg-slate-800/50 border border-white/5">
          <div className="text-xs text-slate-400 mb-1">Special Instructions</div>
          <div className="text-sm text-slate-300">{trip.notes}</div>
        </div>
      )}
    </div>
  );
}
