'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';

// Fix Leaflet default icon issue with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Driver {
  id: string;
  name: string;
  initials: string;
  status: string;
  gpsPings?: Array<{ lat: number; lng: number }>;
}

interface FleetMapProps {
  drivers: Driver[];
  selectedTripPickup?: { lat: number; lng: number; address: string };
  selectedTripDropoff?: { lat: number; lng: number; address: string };
}

export function FleetMapClient({ drivers, selectedTripPickup, selectedTripDropoff }: FleetMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map('fleet-map').setView([27.9506, -82.4572], 11); // Tampa, FL

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add driver markers
    drivers.forEach(driver => {
      if (driver.gpsPings && driver.gpsPings.length > 0) {
        const lastPing = driver.gpsPings[0];

        const icon = L.divIcon({
          html: `
            <div class="relative">
              <div class="w-10 h-10 rounded-full border-3 flex items-center justify-center text-white font-bold shadow-lg ${
                driver.status === 'available' ? 'bg-green-500 border-green-300' :
                driver.status === 'on_trip' ? 'bg-blue-500 border-blue-300' :
                'bg-gray-500 border-gray-300'
              }">
                ${driver.initials}
              </div>
            </div>
          `,
          className: '',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker([lastPing.lat, lastPing.lng], { icon })
          .bindPopup(`
            <div class="text-sm">
              <strong>${driver.name}</strong><br/>
              Status: ${driver.status}
            </div>
          `)
          .addTo(mapRef.current!);

        markersRef.current.push(marker);
      }
    });

    // Add trip markers if selected
    if (selectedTripPickup) {
      const pickupIcon = L.divIcon({
        html: '<div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>',
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const pickupMarker = L.marker([selectedTripPickup.lat, selectedTripPickup.lng], { icon: pickupIcon })
        .bindPopup(`<strong>Pickup:</strong><br/>${selectedTripPickup.address}`)
        .addTo(mapRef.current!);
      markersRef.current.push(pickupMarker);
    }

    if (selectedTripDropoff) {
      const dropoffIcon = L.divIcon({
        html: '<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>',
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const dropoffMarker = L.marker([selectedTripDropoff.lat, selectedTripDropoff.lng], { icon: dropoffIcon })
        .bindPopup(`<strong>Dropoff:</strong><br/>${selectedTripDropoff.address}`)
        .addTo(mapRef.current!);
      markersRef.current.push(dropoffMarker);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
    };
  }, [drivers, selectedTripPickup, selectedTripDropoff]);

  return <div id="fleet-map" className="w-full h-full rounded-lg" />;
}
