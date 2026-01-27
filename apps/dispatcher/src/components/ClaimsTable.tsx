'use client';

import { Claim } from '@routecare/shared';
import { motion } from 'framer-motion';

interface ClaimsTableProps {
  claims: Claim[];
  title?: string;
}

export function ClaimsTable({ claims, title = 'Recent Claims' }: ClaimsTableProps) {
  const getStatusBadge = (status: Claim['status']) => {
    const styles = {
      ready_to_bill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      approved: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      paid: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    const labels = {
      ready_to_bill: 'Ready',
      approved: 'Approved',
      paid: 'Paid',
      rejected: 'Rejected',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
        {labels[status]}
      </span>
    );
  };

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
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <button className="px-3 py-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors">
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left text-xs font-semibold text-slate-300 uppercase tracking-wider pb-3">
                <input type="checkbox" className="rounded border-white/20 bg-white/5" />
              </th>
              <th className="text-left text-xs font-semibold text-slate-300 uppercase tracking-wider pb-3">Name</th>
              <th className="text-left text-xs font-semibold text-slate-300 uppercase tracking-wider pb-3">Status</th>
              <th className="text-right text-xs font-semibold text-slate-300 uppercase tracking-wider pb-3">Total Charge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {claims.map((claim, index) => (
              <motion.tr
                key={claim.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-white/5 transition-colors cursor-pointer"
              >
                <td className="py-4">
                  <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                </td>
                <td className="py-4">
                  <div className="font-medium text-white">{claim.patientName}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{claim.insuranceProvider}</div>
                </td>
                <td className="py-4">
                  {getStatusBadge(claim.status)}
                </td>
                <td className="py-4 text-right">
                  <div className="font-semibold text-white">{formatCurrency(claim.totalCharge)}</div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {claims.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-slate-400">No claims to display</p>
        </div>
      )}
    </motion.div>
  );
}
