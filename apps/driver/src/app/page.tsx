'use client';

import { mockData, Trip, TripEvent } from '@routecare/shared';
import { useState } from 'react';
import { TripRequirementsCard } from '@/components/TripRequirementsCard';
import { PatientCard } from '@/components/PatientCard';

export default function DriverPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'active' | 'completed'>('active');

  const driver = mockData.drivers[0]; // Default to Carlos Martinez (drv_001)
  const myTrips = mockData.trips.filter((t) => t.driverId === driver.id);

  const activeTrips = myTrips.filter((t) =>
    ['assigned', 'en_route_pickup', 'arrived_pickup', 'on_trip', 'arrived_dropoff'].includes(t.status)
  );
  const upcomingTrips = myTrips.filter((t) => t.status === 'assigned');
  const completedTrips = myTrips.filter((t) => t.status === 'completed');

  const currentTrip = activeTrips[0];
  const tripEvents = currentTrip
    ? mockData.tripEvents.filter((e) => e.tripId === currentTrip.id)
    : [];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full glass-panel rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🚗</div>
            <h1 className="text-3xl font-bold mb-2">RouteCare Driver</h1>
            <p className="text-slate-400">Welcome back! Please log in to continue.</p>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition"
            >
              Log In as {driver.name}
            </button>
            <div className="text-center text-sm text-slate-500">
              Mock login - no authentication required
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (selectedTab === 'active' && currentTrip) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setSelectedTab('upcoming')} className="text-2xl">←</button>
            <h1 className="font-semibold">Active Trip</h1>
            <div className="w-8" />
          </div>
        </header>

        {/* Trip Info */}
        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          <div className="glass-panel rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-lg">{currentTrip.passenger.name}</div>
                <div className="text-sm text-slate-400">{currentTrip.passenger.memberIdMasked}</div>
              </div>
              {currentTrip.priority === 'STAT' && (
                <span className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full">
                  STAT
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="text-2xl">📍</div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Pickup</div>
                  <div className="text-sm">{currentTrip.pickup.address}</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-2xl">🏥</div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Dropoff</div>
                  <div className="text-sm">{currentTrip.dropoff.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Requirements Widget */}
          <TripRequirementsCard trip={currentTrip} />

          {/* Patient Information Widget */}
          <PatientCard passenger={currentTrip.passenger} />

          {/* Action Buttons */}
          <div className="space-y-3">
            {currentTrip.status === 'assigned' && (
              <ActionButton label="Start Trip" />
            )}
            {currentTrip.status === 'en_route_pickup' && (
              <ActionButton label="Arrived at Pickup" />
            )}
            {currentTrip.status === 'arrived_pickup' && (
              <ActionButton label="Passenger Onboard" />
            )}
            {currentTrip.status === 'on_trip' && (
              <ActionButton label="Arrived at Dropoff" />
            )}
            {currentTrip.status === 'arrived_dropoff' && (
              <ActionButton label="Complete Trip" />
            )}
          </div>

          {/* Timeline */}
          <div className="glass-panel rounded-lg p-4">
            <h3 className="font-semibold mb-3">Trip Timeline</h3>
            <div className="space-y-3">
              {tripEvents.map((event) => (
                <TimelineEvent key={event.id} event={event} />
              ))}
            </div>
          </div>

          {/* GPS Indicator */}
          <div className="glass-panel rounded-lg p-4 flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <div className="text-sm">GPS Active - Location tracking enabled</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">{driver.name}</h1>
            <div className="text-sm text-slate-400">{driver.phone}</div>
          </div>
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
            {driver.initials}
          </div>
        </div>

        {/* Status Toggle */}
        <div className="flex gap-2">
          <button className="flex-1 py-2 bg-green-600 rounded-lg text-sm font-medium">
            Available
          </button>
          <button className="flex-1 py-2 bg-slate-800 text-slate-400 rounded-lg text-sm font-medium">
            On Break
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <StatCard label="Trips Today" value={driver.stats.tripsToday} />
        <StatCard label="On-Time" value={`${driver.stats.onTimeRate}%`} />
        <StatCard label="Miles" value={driver.stats.totalMiles} />
      </div>

      {/* Tabs */}
      <div className="px-4 flex gap-2 mb-4">
        <TabBtn active={selectedTab === 'upcoming'} onClick={() => setSelectedTab('upcoming')}>
          Upcoming ({upcomingTrips.length})
        </TabBtn>
        <TabBtn active={selectedTab === 'active'} onClick={() => setSelectedTab('active')}>
          Active ({activeTrips.length})
        </TabBtn>
        <TabBtn active={selectedTab === 'completed'} onClick={() => setSelectedTab('completed')}>
          Completed ({completedTrips.length})
        </TabBtn>
      </div>

      {/* Trip List */}
      <div className="flex-1 px-4 pb-4 space-y-3">
        {(selectedTab === 'upcoming' ? upcomingTrips :
          selectedTab === 'active' ? activeTrips :
          completedTrips).map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold text-lg transition">
      {label}
    </button>
  );
}

function TimelineEvent({ event }: { event: TripEvent }) {
  const time = new Date(event.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 bg-indigo-500 rounded-full" />
        <div className="w-0.5 h-full bg-slate-700" />
      </div>
      <div className="pb-4">
        <div className="text-sm font-medium">{event.type.replace(/_/g, ' ')}</div>
        <div className="text-xs text-slate-400">{time}</div>
        {event.notes && <div className="text-xs text-slate-500 mt-1">{event.notes}</div>}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass-panel rounded-lg p-3 text-center">
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        active ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
      }`}
    >
      {children}
    </button>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  return (
    <div className="glass-panel rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold">{trip.passenger.name}</div>
          <div className="text-xs text-slate-400">{trip.passenger.memberIdMasked}</div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full ${
          trip.status === 'on_trip' ? 'bg-blue-500/20 text-blue-400' :
          trip.status === 'completed' ? 'bg-green-500/20 text-green-400' :
          'bg-slate-600/20 text-slate-400'
        }`}>
          {trip.status}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex gap-2">
          <span>📍</span>
          <span className="text-slate-300 truncate">{trip.pickup.address}</span>
        </div>
        <div className="flex gap-2">
          <span>🏥</span>
          <span className="text-slate-300 truncate">{trip.dropoff.address}</span>
        </div>
      </div>
    </div>
  );
}
