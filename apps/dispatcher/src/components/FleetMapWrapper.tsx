'use client';

import dynamic from 'next/dynamic';

const FleetMap = dynamic(() => import('./FleetMapClient').then(mod => ({ default: mod.FleetMapClient })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-lg bg-slate-800/30 flex items-center justify-center">
      <div className="text-slate-400">Loading map...</div>
    </div>
  ),
});

interface Driver {
  id: string;
  name: string;
  initials: string;
  status: string;
  gpsPings?: Array<{ lat: number; lng: number }>;
}

interface FleetMapWrapperProps {
  drivers: Driver[];
  selectedTripPickup?: { lat: number; lng: number; address: string };
  selectedTripDropoff?: { lat: number; lng: number; address: string };
}

export function FleetMapWrapper(props: FleetMapWrapperProps) {
  return <FleetMap {...props} />;
}
