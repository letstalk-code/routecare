'use client';

import { TransportationProvider } from '@/shared';
import { motion } from 'framer-motion';

interface ProvidersCardProps {
  providers: TransportationProvider[];
}

export function ProvidersCard({ providers }: ProvidersCardProps) {
  const getPriorityColor = (priority: string) => {
    if (priority === '1st Priority') return 'text-emerald-400 bg-emerald-500/10';
    if (priority === '2nd Priority') return 'text-yellow-400 bg-yellow-500/10';
    return 'text-slate-400 bg-slate-500/10';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'Verified') {
      return (
        <svg className="w-4 h-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
    >
      <h3 className="text-lg font-semibold mb-6">Preferred Providers</h3>

      <div className="space-y-3">
        {providers.map((provider, index) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
          >
            {/* Provider Icon/Logo */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/30 transition-colors">
              <span className="text-lg font-bold text-white">
                {provider.name.charAt(0)}
              </span>
            </div>

            {/* Provider Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-white truncate">{provider.name}</span>
                {getStatusIcon(provider.status)}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(provider.priority)}`}>
                  {provider.priority}
                </span>
                <span className="text-xs text-slate-400">
                  {provider.completionRate}% completion
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="text-right">
              <div className="text-sm font-semibold text-white">{provider.averageResponseTime} min</div>
              <div className="text-xs text-slate-400">avg response</div>
            </div>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors font-medium">
        Manage Providers
      </button>
    </motion.div>
  );
}
