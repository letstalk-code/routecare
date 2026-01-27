'use client';

import { Passenger } from '@routecare/shared';
import { motion } from 'framer-motion';

interface PatientInfoCardProps {
  passenger: Passenger;
}

export function PatientInfoCard({ passenger }: PatientInfoCardProps) {
  const getGenderIcon = (gender: string) => {
    if (gender === 'Female') return '♀';
    if (gender === 'Male') return '♂';
    return '⚥';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Active') return 'text-emerald-400 bg-emerald-500/10';
    if (status === 'Inactive') return 'text-red-400 bg-red-500/10';
    return 'text-yellow-400 bg-yellow-500/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Personal Information</h3>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {/* Date of Birth */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-400">Date of Birth</div>
            <div className="text-white font-medium">{passenger.dateOfBirth} ({passenger.age} years)</div>
          </div>
        </div>

        {/* Gender */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <span className="text-lg text-purple-400">{getGenderIcon(passenger.gender)}</span>
          </div>
          <div className="flex-1">
            <div className="text-sm text-slate-400">Gender</div>
            <div className="text-white font-medium">{passenger.gender}</div>
          </div>
        </div>

        {/* Weight */}
        {passenger.weight && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm text-slate-400">Weight</div>
              <div className="text-white font-medium">{passenger.weight} lb</div>
            </div>
          </div>
        )}

        {/* Insurance */}
        <div className="pt-3 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-slate-300">{passenger.insuranceProvider}</div>
            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(passenger.insuranceStatus)}`}>
              {passenger.insuranceStatus}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            <span className="text-slate-400">Insurance ID</span>
            <span className="text-white font-mono">{passenger.insuranceId}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
