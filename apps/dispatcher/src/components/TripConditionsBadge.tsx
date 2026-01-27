'use client';

import { MobilityLevel } from '@routecare/shared';

interface TripConditionsBadgeProps {
  mobilityLevel: MobilityLevel;
  specialNeeds?: string[];
  compact?: boolean;
}

export function TripConditionsBadge({ mobilityLevel, specialNeeds = [], compact = false }: TripConditionsBadgeProps) {
  const getMobilityConfig = (level: MobilityLevel) => {
    const configs = {
      ambulatory: {
        icon: '🚶',
        label: 'Ambulatory',
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        description: 'Standard Walk-In',
      },
      wheelchair: {
        icon: '♿',
        label: 'Wheelchair',
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        description: 'Wheelchair Required',
      },
      stretcher: {
        icon: '🛏️',
        label: 'Stretcher',
        color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        description: 'Stretcher Transport',
      },
    };
    return configs[level];
  };

  const config = getMobilityConfig(mobilityLevel);

  if (compact) {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}>
          <span>{config.icon}</span>
          <span>{config.label}</span>
        </span>
        {specialNeeds.map((need) => (
          <span
            key={need}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border bg-orange-500/10 text-orange-400 border-orange-500/30"
          >
            {need === 'Oxygen Tank' && '💨'}
            {need === 'Service Animal' && '🐕'}
            {need === 'Fragile' && '⚠️'}
            <span>{need}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">Trip Conditions</div>
      <div className="space-y-2">
        <div className={`flex items-center gap-3 p-3 rounded-lg border ${config.color}`}>
          <span className="text-2xl">{config.icon}</span>
          <div>
            <div className="font-semibold">{config.label}</div>
            <div className="text-xs opacity-75">{config.description}</div>
          </div>
        </div>
        {specialNeeds.map((need) => (
          <div
            key={need}
            className="flex items-center gap-3 p-3 rounded-lg border bg-orange-500/10 text-orange-400 border-orange-500/30"
          >
            <span className="text-xl">
              {need === 'Oxygen Tank' && '💨'}
              {need === 'Service Animal' && '🐕'}
              {need === 'Fragile' && '⚠️'}
            </span>
            <div>
              <div className="font-semibold">{need}</div>
              <div className="text-xs opacity-75">Special Needs</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
