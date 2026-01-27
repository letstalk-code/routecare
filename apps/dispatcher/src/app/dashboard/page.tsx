'use client';

import { mockData } from '@routecare/shared';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BillingStatsCard,
  ClaimsTable,
  RecentActivityCard,
} from '@/components';

export default function DashboardPage() {
  const { kpis, claims, billingStats, trips, drivers, tripEvents } = mockData;

  const statCards = [
    { label: 'Trips Today', value: kpis.tripsToday, icon: '🚗', color: 'from-blue-500 to-cyan-500' },
    { label: 'STAT Pending', value: kpis.dischargePendingStat, icon: '⚡', color: 'from-red-500 to-orange-500', alert: true },
    { label: 'On-Time Rate', value: `${kpis.onTimeRateScheduled}%`, icon: '⏰', color: 'from-emerald-500 to-teal-500' },
    { label: 'Active Drivers', value: kpis.activeDrivers, icon: '👥', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              RouteCare Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">Fleet management & billing overview</p>
          </div>
          <Link
            href="/dispatch"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-medium transition-colors"
          >
            Open Dispatch →
          </Link>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-panel rounded-xl p-6 ${stat.alert ? 'ring-2 ring-red-500' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
                {stat.alert && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full animate-pulse">
                    Urgent
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Activity + Billing */}
          <div className="space-y-6">
            <RecentActivityCard events={tripEvents} />
            <BillingStatsCard stats={billingStats} />
          </div>

          {/* Middle/Right Column - Claims Table */}
          <div className="lg:col-span-2">
            <ClaimsTable claims={claims} />
          </div>
        </div>

        {/* Quick Fleet Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Fleet Status</h2>
            <Link href="/dispatch" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
              View Full Map →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {drivers.map((driver, index) => (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="p-4 rounded-lg bg-slate-800/30 border border-white/5 hover:border-indigo-500/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm">
                    {driver.initials}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-white">{driver.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`w-2 h-2 rounded-full ${
                        driver.status === 'available' ? 'bg-emerald-500' :
                        driver.status === 'on_trip' ? 'bg-blue-500' :
                        driver.status === 'break' ? 'bg-yellow-500' : 'bg-slate-500'
                      }`} />
                      <span className="text-xs text-slate-400 capitalize">{driver.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-white">{driver.stats.tripsToday}</div>
                    <div className="text-xs text-slate-400">Trips</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{driver.stats.onTimeRate}%</div>
                    <div className="text-xs text-slate-400">On-Time</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">{driver.stats.totalMiles}</div>
                    <div className="text-xs text-slate-400">Miles</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
