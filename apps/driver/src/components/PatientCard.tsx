'use client';

import { Passenger } from '@routecare/shared';

interface PatientCardProps {
  passenger: Passenger;
}

export function PatientCard({ passenger }: PatientCardProps) {
  const getGenderIcon = (gender: string) => {
    if (gender === 'Female') return '♀';
    if (gender === 'Male') return '♂';
    return '⚥';
  };

  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="text-sm font-semibold text-slate-300 mb-3">Patient Information</div>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
          {passenger.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white">{passenger.name}</div>
          <div className="text-xs text-slate-400">{passenger.memberIdMasked}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-400">
              {getGenderIcon(passenger.gender)} {passenger.gender}
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">{passenger.age} years</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {passenger.weight && (
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-xs text-slate-400">Weight</span>
            <span className="text-sm font-medium text-white">{passenger.weight} lb</span>
          </div>
        )}
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <span className="text-xs text-slate-400">Phone</span>
          <span className="text-sm font-medium text-white">{passenger.phone}</span>
        </div>
        {passenger.preferredLanguage && (
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-xs text-slate-400">Language</span>
            <span className="text-sm font-medium text-white">{passenger.preferredLanguage}</span>
          </div>
        )}
      </div>

      <div className="mt-3 p-3 rounded-lg bg-slate-800/50 border border-white/5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-400">Insurance</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            passenger.insuranceStatus === 'Active'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          }`}>
            {passenger.insuranceStatus}
          </span>
        </div>
        <div className="text-sm font-medium text-white">{passenger.insuranceProvider}</div>
        <div className="text-xs text-slate-400 font-mono mt-0.5">ID: {passenger.insuranceId}</div>
      </div>
    </div>
  );
}
