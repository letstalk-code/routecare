'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { useSSE } from '@/lib/use-sse';
import {
  PatientInfoCard,
  BillingStatsCard,
  ClaimsTable,
  ProvidersCard,
  FleetMap,
  TripConditionsBadge,
  AddTripModal,
} from '@/components';
import { FleetMap } from '@/components/FleetMap';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FleetMap } from '@/components/FleetMap';

export default function DispatchPage() {
  const [selectedTab, setSelectedTab] = useState<'needs_action' | 'discharge' | 'scheduled' | 'all'>('needs_action');
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>({
    tripsToday: 0,
    dischargePendingStat: 0,
    onTimeRateScheduled: 0,
    activeDrivers: 0,
    availableDrivers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAddTripModal, setShowAddTripModal] = useState(false);

  // Real-time updates via SSE
  const { connected, lastUpdate } = useSSE({
    url: '/api/sse/dispatch',
    onMessage: (message) => {
      if (message.type === 'update' && message.data) {
        setTrips(message.data.trips || []);
        setDrivers(message.data.drivers || []);
        setKpis(message.data.kpis || kpis);
        setLoading(false);
      }
    },
    enabled: true,
  });

  // Load data from API (fallback for initial load)
  const loadData = async () => {
    try {
      const [tripsData, driversData, kpisData] = await Promise.all([
        api.trips.getAll(),
        api.drivers.getAll(),
        api.dashboard.getKpis(),
      ]);
      setTrips(tripsData.trips);
      setDrivers(driversData.drivers);
      setKpis(kpisData.kpis);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only load manually if SSE is not connected
    if (!connected) {
      loadData();
    }
  }, [connected]);

  // Use mock data for driver suggestions (not yet implemented in API)
  const driverSuggestions: any[] = [];

  const filteredTrips = trips
    .filter((trip) => {
      if (selectedTab === 'needs_action') {
        // Show STAT, unassigned, or high priority trips that need immediate action
        return trip.priority === 'STAT' || trip.status === 'unassigned';
      }
      if (selectedTab === 'discharge') return trip.type === 'discharge';
      if (selectedTab === 'scheduled') return trip.priority === 'scheduled';
      return true;
    })
    .sort((a, b) => {
      // Always pin STAT trips to the top
      if (a.priority === 'STAT' && b.priority !== 'STAT') return -1;
      if (b.priority === 'STAT' && a.priority !== 'STAT') return 1;
      // Then unassigned trips
      if (a.status === 'unassigned' && b.status !== 'unassigned') return -1;
      if (b.status === 'unassigned' && a.status !== 'unassigned') return 1;
      return 0;
    });

  const selectedTripData = trips.find((t) => t.id === selectedTrip);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-slate-600 dark:text-slate-400">Loading dispatch data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-purple-900/30 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="px-4 lg:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-white/10"
              aria-label="Back to Dashboard"
            >
              <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl lg:text-2xl font-bold">RouteCare — Dispatch & Fleet Tracking</h1>
            {/* Real-time connection indicator */}
            <div className="flex items-center gap-2 ml-4">
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                {connected ? 'Live' : 'Disconnected'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddTripModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors text-sm"
            >
              + Create Trip
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="px-4 lg:px-6 py-4 grid grid-cols-2 md:grid-cols-5 gap-3 lg:gap-4">
        <KpiCard label="Trips Today" value={kpis.tripsToday} />
        <KpiCard label="STAT Pending" value={kpis.dischargePendingStat} alert />
        <KpiCard label="On-Time Rate" value={`${kpis.onTimeRateScheduled}%`} />
        <KpiCard label="Active Drivers" value={kpis.activeDrivers} />
        <KpiCard label="Available" value={kpis.availableDrivers} />
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 lg:h-[calc(100vh-200px)]">
        {/* Dispatch Queue - Shows first on mobile, side on desktop */}
        <div className={`w-full lg:w-[450px] glass-panel rounded-lg p-4 lg:p-6 flex flex-col max-h-[600px] lg:max-h-none ${selectedTripData ? 'hidden lg:flex' : ''}`}>
          <h2 className="text-lg font-semibold mb-4">Dispatch Queue</h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            <TabButton
              active={selectedTab === 'needs_action'}
              onClick={() => setSelectedTab('needs_action')}
              label="Needs Action"
              count={trips.filter((t) => t.priority === 'STAT' || t.status === 'unassigned').length}
              alert
            />
            <TabButton
              active={selectedTab === 'discharge'}
              onClick={() => setSelectedTab('discharge')}
              label="Discharge"
              count={trips.filter((t) => t.type === 'discharge').length}
            />
            <TabButton
              active={selectedTab === 'scheduled'}
              onClick={() => setSelectedTab('scheduled')}
              label="Scheduled"
              count={trips.filter((t) => t.priority === 'scheduled').length}
            />
            <TabButton
              active={selectedTab === 'all'}
              onClick={() => setSelectedTab('all')}
              label="All"
              count={trips.length}
            />
          </div>

          {/* Trip List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => setSelectedTrip(trip.id)}
                className={`p-3 rounded-lg cursor-pointer transition ${
                  selectedTrip === trip.id
                    ? 'bg-indigo-600/30 border border-indigo-500'
                    : trip.priority === 'STAT'
                    ? 'bg-red-900/20 hover:bg-red-900/30 border border-red-500/40 ring-1 ring-red-500/20'
                    : 'bg-slate-800/50 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold">{trip.passenger.name}</div>
                    <div className="text-xs text-slate-400">{trip.passenger.memberIdMasked}</div>
                  </div>
                  {trip.priority === 'STAT' && (
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">STAT</span>
                  )}
                </div>
                <div className="text-sm text-slate-300 mb-2">
                  <div className="truncate">📍 {trip.pickupAddress}</div>
                  <div className="truncate">🏥 {trip.dropoffAddress}</div>
                </div>
                <div className="mb-2">
                  <TripConditionsBadge
                    mobilityLevel={trip.passenger.mobilityLevel}
                    specialNeeds={trip.passenger.specialNeeds}
                    compact
                  />
                </div>
                <div className="mt-2 flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      trip.status === 'unassigned' ? 'bg-yellow-500/20 text-yellow-400' :
                      trip.status === 'on_trip' ? 'bg-blue-500/20 text-blue-400' :
                      trip.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      'bg-slate-600/20 text-slate-400'
                    }`}>
                      {trip.status}
                    </span>
                    <span className="text-xs text-slate-400">{trip.estimatedMiles} mi</span>
                  </div>
                  {trip.driverId && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (confirm('Unassign driver from this trip?')) {
                          try {
                            await api.trips.unassign(trip.id);
                            await loadData();
                          } catch (error) {
                            alert('Failed to unassign driver.');
                          }
                        }
                      }}
                      className="px-2 py-1 bg-amber-600/80 hover:bg-amber-600 text-white text-xs rounded transition-colors"
                    >
                      Unassign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

          <FleetMap drivers={drivers} selectedTripPickup={selectedTripData ? { lat: selectedTripData.pickupLat, lng: selectedTripData.pickupLng, address: selectedTripData.pickupAddress } : undefined} selectedTripDropoff={selectedTripData ? { lat: selectedTripData.dropoffLat, lng: selectedTripData.dropoffLng, address: selectedTripData.dropoffAddress } : undefined} />
          <FleetMap drivers={drivers} selectedTripPickup={selectedTripData ? { lat: selectedTripData.pickupLat, lng: selectedTripData.pickupLng, address: selectedTripData.pickupAddress } : undefined} selectedTripDropoff={selectedTripData ? { lat: selectedTripData.dropoffLat, lng: selectedTripData.dropoffLng, address: selectedTripData.dropoffAddress } : undefined} />
          <FleetMap drivers={drivers} selectedTripPickup={selectedTripData ? { lat: selectedTripData.pickupLat, lng: selectedTripData.pickupLng, address: selectedTripData.pickupAddress } : undefined} selectedTripDropoff={selectedTripData ? { lat: selectedTripData.dropoffLat, lng: selectedTripData.dropoffLng, address: selectedTripData.dropoffAddress } : undefined} />
          <FleetMap drivers={drivers} selectedTripPickup={selectedTripData ? { lat: selectedTripData.pickupLat, lng: selectedTripData.pickupLng, address: selectedTripData.pickupAddress } : undefined} selectedTripDropoff={selectedTripData ? { lat: selectedTripData.dropoffLat, lng: selectedTripData.dropoffLng, address: selectedTripData.dropoffAddress } : undefined} />
          <FleetMap drivers={drivers} selectedTripPickup={selectedTripData ? { lat: selectedTripData.pickupLat, lng: selectedTripData.pickupLng, address: selectedTripData.pickupAddress } : undefined} selectedTripDropoff={selectedTripData ? { lat: selectedTripData.dropoffLat, lng: selectedTripData.dropoffLng, address: selectedTripData.dropoffAddress } : undefined} />
          <FleetMap drivers={drivers} selectedTripPickup={selectedTripData ? { lat: selectedTripData.pickupLat, lng: selectedTripData.pickupLng, address: selectedTripData.pickupAddress } : undefined} selectedTripDropoff={selectedTripData ? { lat: selectedTripData.dropoffLat, lng: selectedTripData.dropoffLng, address: selectedTripData.dropoffAddress } : undefined} />
          <FleetMap drivers={drivers} selectedTripPickup={selectedTripData ? { lat: selectedTripData.pickupLat, lng: selectedTripData.pickupLng, address: selectedTripData.pickupAddress } : undefined} selectedTripDropoff={selectedTripData ? { lat: selectedTripData.dropoffLat, lng: selectedTripData.dropoffLng, address: selectedTripData.dropoffAddress } : undefined} />
          <FleetMap drivers={drivers} selectedTripPickup={selectedTripData ? { lat: selectedTripData.pickupLat, lng: selectedTripData.pickupLng, address: selectedTripData.pickupAddress } : undefined} selectedTripDropoff={selectedTripData ? { lat: selectedTripData.dropoffLat, lng: selectedTripData.dropoffLng, address: selectedTripData.dropoffAddress } : undefined} />
          <FleetMap drivers={drivers} selectedTripPickup={selectedTripData ? { lat: selectedTripData.pickupLat, lng: selectedTripData.pickupLng, address: selectedTripData.pickupAddress } : undefined} selectedTripDropoff={selectedTripData ? { lat: selectedTripData.dropoffLat, lng: selectedTripData.dropoffLng, address: selectedTripData.dropoffAddress } : undefined} />
          <FleetMap drivers={drivers} selectedTripPickup={selectedTripData ? { lat: selectedTripData.pickupLat, lng: selectedTripData.pickupLng, address: selectedTripData.pickupAddress } : undefined} selectedTripDropoff={selectedTripData ? { lat: selectedTripData.dropoffLat, lng: selectedTripData.dropoffLng, address: selectedTripData.dropoffAddress } : undefined} />
          <FleetMap drivers={drivers} selectedTripPickup={selectedTripData ? { lat: selectedTripData.pickupLat, lng: selectedTripData.pickupLng, address: selectedTripData.pickupAddress } : undefined} selectedTripDropoff={selectedTripData ? { lat: selectedTripData.dropoffLat, lng: selectedTripData.dropoffLng, address: selectedTripData.dropoffAddress } : undefined} />
          <FleetMap drivers={drivers} selectedTripPickup={selectedTripData ? { lat: selectedTripData.pickupLat, lng: selectedTripData.pickupLng, address: selectedTripData.pickupAddress } : undefined} selectedTripDropoff={selectedTripData ? { lat: selectedTripData.dropoffLat, lng: selectedTripData.dropoffLng, address: selectedTripData.dropoffAddress } : undefined} />
          <FleetMap drivers={drivers} selectedTripPickup={selectedTripData ? { lat: selectedTripData.pickupLat, lng: selectedTripData.pickupLng, address: selectedTripData.pickupAddress } : undefined} selectedTripDropoff={selectedTripData ? { lat: selectedTripData.dropoffLat, lng: selectedTripData.dropoffLng, address: selectedTripData.dropoffAddress } : undefined} />
                    }`} />
                    <span className="text-sm">{driver.initials} - {driver.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trip Detail Panel - Full screen on mobile, sidebar on desktop */}
        {selectedTripData && (
          <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto">
            <div className="glass-panel rounded-lg p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Trip Details</h2>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="text-slate-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              {/* Trip Actions */}
              <div className="flex gap-2 mb-4">
                {selectedTripData.driverId && (
                  <button
                    onClick={async () => {
                      if (confirm('Unassign driver from this trip?')) {
                        try {
                          await api.trips.unassign(selectedTripData.id);
                          await loadData();
                        } catch (error) {
                          alert('Failed to unassign driver. Please try again.');
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg font-medium transition-colors"
                  >
                    Unassign Driver
                  </button>
                )}
                <button
                  onClick={async () => {
                    if (confirm('Delete this trip? This action cannot be undone.')) {
                      try {
                        await api.trips.delete(selectedTripData.id);
                        setSelectedTrip(null);
                        await loadData();
                      } catch (error) {
                        alert('Failed to delete trip. Please try again.');
                      }
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                >
                  Delete Trip
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-400 mb-2">Trip ID</div>
                  <div className="font-mono text-sm text-slate-300">{selectedTripData.id}</div>
                </div>

                <TripConditionsBadge
                  mobilityLevel={selectedTripData.passenger.mobilityLevel}
                  specialNeeds={selectedTripData.passenger.specialNeeds}
                />

                <div>
                  <div className="text-sm text-slate-400 mb-1">Pickup</div>
                  <div className="text-sm bg-slate-800/50 p-2 rounded">{selectedTripData.pickupAddress}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Dropoff</div>
                  <div className="text-sm bg-slate-800/50 p-2 rounded">{selectedTripData.dropoffAddress}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-slate-400">Distance</div>
                    <div className="text-lg font-semibold">{selectedTripData.estimatedMiles} mi</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Duration</div>
                    <div className="text-lg font-semibold">{selectedTripData.estimatedDuration} min</div>
                  </div>
                </div>
                {selectedTripData.notes && (
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Notes</div>
                    <div className="text-sm bg-slate-800/50 p-2 rounded">{selectedTripData.notes}</div>
                  </div>
                )}
                {selectedTripData.status === 'unassigned' && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-slate-300">Recommended Drivers</div>
                      {driverSuggestions.find((ds) => ds.tripId === selectedTripData.id)?.suggestions[0] && (
                        <button
                          onClick={() => {
                            const topDriver = driverSuggestions.find((ds) => ds.tripId === selectedTripData.id)?.suggestions[0];
                            const driver = drivers.find((d) => d.id === topDriver?.driverId);
                            alert(`Assigning ${driver?.name} to trip ${selectedTripData.id} (UI only - no backend)`);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition"
                        >
                          Assign Top Match
                        </button>
                      )}
                    </div>
                    {driverSuggestions
                      .find((ds: any) => ds.tripId === selectedTripData.id)
                      ?.suggestions.slice(0, 3)
                      .map((suggestion: any, idx: number) => {
                        const driver = drivers.find((d) => d.id === suggestion.driverId);
                        return (
                          <div
                            key={suggestion.driverId}
                            className={`p-3 rounded mb-2 transition ${
                              idx === 0
                                ? 'bg-emerald-900/20 border border-emerald-500/30 ring-1 ring-emerald-500/20'
                                : 'bg-slate-800/50 hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                {idx === 0 && <span className="text-emerald-400 text-xs">★</span>}
                                <div className="font-medium text-sm">{driver?.name}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-xs font-semibold text-indigo-400">Score: {suggestion.score}</div>
                                <button
                                  onClick={() => {
                                    alert(`Assigning ${driver?.name} to trip ${selectedTripData.id} (UI only)`);
                                  }}
                                  className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs rounded transition"
                                >
                                  Assign
                                </button>
                              </div>
                            </div>
                            <div className="text-xs text-slate-400 mb-1">
                              {suggestion.distance} mi away • {driver?.zone} zone • {driver?.status}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {suggestion.reasons.map((reason: string, i: number) => (
                                <span key={i} className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                                  {reason}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            <PatientInfoCard passenger={selectedTripData.passenger} />
          </div>
        )}
      </div>

      {/* Add Trip Modal */}
      <AddTripModal
        isOpen={showAddTripModal}
        onClose={() => setShowAddTripModal(false)}
        onSuccess={() => {
          loadData();
        }}
      />
    </div>
  );
}

function KpiCard({ label, value, alert }: { label: string; value: string | number; alert?: boolean }) {
  return (
    <div className={`glass-panel rounded-lg p-4 ${alert ? 'ring-2 ring-red-500' : ''}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
  alert,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  alert?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded text-sm transition whitespace-nowrap ${
        active
          ? alert
            ? 'bg-red-600 text-white ring-2 ring-red-400/50'
            : 'bg-indigo-600 text-white'
          : alert && count > 0
          ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 ring-1 ring-red-500/50'
          : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
      }`}
    >
      {label} ({count})
    </button>
  );
}
