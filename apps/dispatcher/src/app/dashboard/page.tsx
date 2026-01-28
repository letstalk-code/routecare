'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import {
  BillingStatsCard,
  ClaimsTable,
  RecentActivityCard,
  AddDriverModal,
  AddVehicleModal,
  AddPassengerModal,
  AssignDriverModal,
} from '@/components';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function DashboardPage() {
  const [kpis, setKpis] = useState<any>({
    tripsToday: 0,
    dischargePendingStat: 0,
    onTimeRateScheduled: 0,
    activeDrivers: 0,
    availableDrivers: 0,
  });
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showAddPassengerModal, setShowAddPassengerModal] = useState(false);
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string>('');

  // Load data from API
  const loadData = async () => {
    try {
      const [kpisData, tripsData] = await Promise.all([
        api.dashboard.getKpis(),
        api.trips.getAll(),
      ]);
      setKpis(kpisData.kpis);
      setTrips(tripsData.trips);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Use mock data for claims, billingStats, drivers, and tripEvents (not yet implemented in API)
  const claims: any[] = [];
  const billingStats = {
    totalProcessed: 0,
    totalPaid: 0,
    averageClaimValue: 0,
    rejectionRate: 0,
    pendingClaims: 0,
  };
  const drivers: any[] = [];
  const tripEvents: any[] = [];

  const statCards = [
    { label: 'Trips Today', value: kpis.tripsToday, icon: '🚗', color: 'from-blue-500 to-cyan-500' },
    { label: 'STAT Pending', value: kpis.dischargePendingStat, icon: '⚡', color: 'from-red-500 to-orange-500', alert: true },
    { label: 'On-Time Rate', value: `${kpis.onTimeRateScheduled}%`, icon: '⏰', color: 'from-emerald-500 to-teal-500' },
    { label: 'Active Drivers', value: kpis.activeDrivers, icon: '👥', color: 'from-purple-500 to-pink-500' },
  ];

  // Items that need immediate attention
  const needsAttention = trips
    .filter((trip) => trip.priority === 'STAT' || trip.status === 'unassigned')
    .slice(0, 5)
    .map((trip) => ({
      id: trip.id,
      title: `${trip.passenger?.name || 'Unknown'} - ${trip.type === 'discharge' ? 'Discharge' : 'Scheduled'}`,
      subtitle: `${trip.pickupAddress || 'N/A'} → ${trip.dropoffAddress || 'N/A'}`,
      reason: trip.priority === 'STAT' ? 'STAT Priority' : 'Unassigned',
      urgent: trip.priority === 'STAT',
      action: 'Assign Driver',
      tripId: trip.id,
    }));

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-purple-900/30 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              RouteCare Dashboard
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Fleet management & billing overview</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              ⚙️ Settings
            </Link>
            <ThemeToggle />
            <Link
              href="/dispatch"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
            >
              Open Dispatch →
            </Link>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Quick Actions:</span>
            <button
              onClick={() => setShowAddPassengerModal(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              + Add Passenger
            </button>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              + Add Vehicle
            </button>
            <button
              onClick={() => setShowAddDriverModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              + Add Driver
            </button>
          </div>
        </div>

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
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Needs Attention Section */}
        {needsAttention.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-xl p-6 border-l-4 border-red-500"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-xl">
                  ⚠️
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Needs Attention</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{needsAttention.length} items require action</p>
                </div>
              </div>
              <Link
                href="/dispatch"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Open Dispatch
              </Link>
            </div>
            <div className="space-y-2">
              {needsAttention.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 hover:border-red-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-slate-900 dark:text-white truncate">{item.title}</h3>
                        {item.urgent && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-600 dark:text-red-400 text-xs rounded whitespace-nowrap">
                            STAT
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 truncate mb-2">{item.subtitle}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${
                          item.urgent
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {item.reason}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTripId(item.tripId);
                        setShowAssignDriverModal(true);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded transition-colors whitespace-nowrap"
                    >
                      {item.action}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

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

        {/* Quick Fleet Overview - Enhanced Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Fleet Status</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Real-time driver activity and performance</p>
            </div>
            <Link href="/dispatch" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
              View Full Map →
            </Link>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Driver</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Current Trip</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Today</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">On-Time</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-slate-600 dark:text-slate-400">Miles</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver, index) => {
                  const currentTrip = trips.find(t => t.driverId === driver.id && t.status === 'on_trip');
                  return (
                    <motion.tr
                      key={driver.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="border-b border-slate-200 dark:border-white/5 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white">
                            {driver.initials}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{driver.name}</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">{driver.zone} Zone</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            driver.status === 'available' ? 'bg-emerald-500 animate-pulse' :
                            driver.status === 'on_trip' ? 'bg-blue-500' :
                            driver.status === 'break' ? 'bg-yellow-500' : 'bg-slate-500'
                          }`} />
                          <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">{driver.status.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {currentTrip ? (
                          <div className="text-sm">
                            <div className="text-slate-900 dark:text-white truncate max-w-xs">{currentTrip.passenger.name}</div>
                            <div className="text-xs text-slate-600 dark:text-slate-400 truncate">{currentTrip.dropoff.address.split(',')[0]}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{driver.stats.tripsToday}</span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`text-lg font-bold ${
                          driver.stats.onTimeRate >= 90 ? 'text-emerald-400' :
                          driver.stats.onTimeRate >= 75 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {driver.stats.onTimeRate}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">{driver.stats.totalMiles}</span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {drivers.map((driver, index) => (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="p-4 rounded-lg bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-sm text-white">
                    {driver.initials}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-slate-900 dark:text-white">{driver.name}</div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className={`w-2 h-2 rounded-full ${
                        driver.status === 'available' ? 'bg-emerald-500' :
                        driver.status === 'on_trip' ? 'bg-blue-500' :
                        driver.status === 'break' ? 'bg-yellow-500' : 'bg-slate-500'
                      }`} />
                      <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">{driver.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{driver.stats.tripsToday}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Trips</div>
                  </div>
                  <div>
                    <div className={`text-lg font-bold ${
                      driver.stats.onTimeRate >= 90 ? 'text-emerald-600 dark:text-emerald-400' :
                      driver.stats.onTimeRate >= 75 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {driver.stats.onTimeRate}%
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">On-Time</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-slate-900 dark:text-white">{driver.stats.totalMiles}</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Miles</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Add Driver Modal */}
      <AddDriverModal
        isOpen={showAddDriverModal}
        onClose={() => setShowAddDriverModal(false)}
        onSuccess={() => {
          loadData();
        }}
      />

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={showAddVehicleModal}
        onClose={() => setShowAddVehicleModal(false)}
        onSuccess={() => {
          loadData();
        }}
      />

      {/* Add Passenger Modal */}
      <AddPassengerModal
        isOpen={showAddPassengerModal}
        onClose={() => setShowAddPassengerModal(false)}
        onSuccess={() => {
          loadData();
        }}
      />

      {/* Assign Driver Modal */}
      <AssignDriverModal
        isOpen={showAssignDriverModal}
        onClose={() => setShowAssignDriverModal(false)}
        onSuccess={() => {
          loadData();
        }}
        tripId={selectedTripId}
      />
    </div>
  );
}
