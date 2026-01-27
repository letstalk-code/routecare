'use client';

import { BillingStats } from '@/shared';
import { motion } from 'framer-motion';

interface BillingStatsCardProps {
  stats: BillingStats;
}

export function BillingStatsCard({ stats }: BillingStatsCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Billing Overview</h3>
        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
          View All →
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
          <div className="text-emerald-400 text-sm mb-1">Total Processed</div>
          <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalProcessed)}</div>
        </div>
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
          <div className="text-blue-400 text-sm mb-1">Total Paid</div>
          <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalPaid)}</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <span className="text-slate-400 text-sm">Average Claim Value</span>
          <span className="text-white font-semibold">{formatCurrency(stats.averageClaimValue)}</span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-white/5">
          <span className="text-slate-400 text-sm">Rejection Rate</span>
          <span className={`font-semibold ${stats.rejectionRate > 10 ? 'text-red-400' : stats.rejectionRate > 5 ? 'text-yellow-400' : 'text-emerald-400'}`}>
            {stats.rejectionRate}%
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-slate-400 text-sm">Pending Claims</span>
          <span className="text-white font-semibold">{stats.pendingClaims}</span>
        </div>
      </div>
    </motion.div>
  );
}
