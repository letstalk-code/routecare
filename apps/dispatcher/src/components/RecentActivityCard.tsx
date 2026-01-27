'use client';

import { TripEvent } from '@/shared';
import { motion } from 'framer-motion';

interface RecentActivityCardProps {
  events: TripEvent[];
  title?: string;
}

export function RecentActivityCard({ events, title = 'Recent Activity' }: RecentActivityCardProps) {
  const getEventIcon = (type: TripEvent['type']) => {
    const icons = {
      trip_created: '📝',
      trip_assigned: '✅',
      en_route_pickup: '🚗',
      arrived_pickup: '📍',
      passenger_onboard: '👤',
      en_route_dropoff: '🚙',
      arrived_dropoff: '🏁',
      trip_completed: '✓',
      trip_cancelled: '❌',
    };
    return icons[type] || '•';
  };

  const getEventLabel = (type: TripEvent['type']) => {
    const labels = {
      trip_created: 'Trip Created',
      trip_assigned: 'Driver Assigned',
      en_route_pickup: 'En Route to Pickup',
      arrived_pickup: 'Arrived at Pickup',
      passenger_onboard: 'Passenger Onboard',
      en_route_dropoff: 'En Route to Dropoff',
      arrived_dropoff: 'Arrived at Dropoff',
      trip_completed: 'Trip Completed',
      trip_cancelled: 'Trip Cancelled',
    };
    return labels[type] || type;
  };

  const getEventColor = (type: TripEvent['type']) => {
    if (type === 'trip_completed') return 'text-emerald-400 bg-emerald-500/10';
    if (type === 'trip_cancelled') return 'text-red-400 bg-red-500/10';
    if (type === 'passenger_onboard') return 'text-blue-400 bg-blue-500/10';
    return 'text-slate-400 bg-slate-500/10';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
    >
      <h3 className="text-lg font-semibold text-white mb-6">{title}</h3>

      <div className="space-y-1">
        {events.slice(0, 8).map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
          >
            {/* Event Icon */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getEventColor(event.type)} group-hover:scale-110 transition-transform`}>
              <span className="text-sm">{getEventIcon(event.type)}</span>
            </div>

            {/* Event Info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {getEventLabel(event.type)}
              </div>
              <div className="text-xs text-slate-400 truncate">
                Trip {event.tripId} • {event.createdBy}
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs text-slate-500">
              {formatTime(event.timestamp)}
            </div>
          </motion.div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-8">
          <div className="text-slate-600 text-4xl mb-3">📋</div>
          <p className="text-slate-400 text-sm">No recent activity</p>
        </div>
      )}
    </motion.div>
  );
}
