// MOCK DATA - Typed using contracts.ts
import type {
  Driver,
  Vehicle,
  Trip,
  TripEvent,
  GPSPing,
  DashboardKpis,
  DriverSuggestions,
  Claim,
  BillingStats,
  TransportationProvider,
} from './contracts';

// ============================================================================
// VEHICLES
// ============================================================================

export const vehicles: Vehicle[] = [
  {
    id: 'veh_001',
    name: 'Fleet 101',
    type: 'wheelchair_van',
    licensePlate: 'ABC-1234',
    capacity: 4,
    wheelchairAccessible: true,
    mileage: 45230,
  },
  {
    id: 'veh_002',
    name: 'Fleet 102',
    type: 'sedan',
    licensePlate: 'DEF-5678',
    capacity: 3,
    wheelchairAccessible: false,
    mileage: 32100,
  },
  {
    id: 'veh_003',
    name: 'Fleet 103',
    type: 'wheelchair_van',
    licensePlate: 'GHI-9012',
    capacity: 4,
    wheelchairAccessible: true,
    mileage: 28950,
  },
];

// ============================================================================
// DRIVERS
// ============================================================================

export const drivers: Driver[] = [
  {
    id: 'drv_001',
    name: 'Carlos Martinez',
    initials: 'CM',
    phone: '555-0101',
    status: 'on_trip',
    vehicleId: 'veh_001',
    certifications: ['BLS', 'Wheelchair Lift', 'Stretcher'],
    zone: 'North',
    shift: {
      start: '06:00',
      end: '14:00',
    },
    stats: {
      tripsToday: 4,
      onTimeRate: 95,
      totalMiles: 87,
    },
  },
  {
    id: 'drv_002',
    name: 'Maria Santos',
    initials: 'MS',
    phone: '555-0102',
    status: 'available',
    vehicleId: 'veh_002',
    certifications: ['BLS', 'CPR'],
    zone: 'Central',
    shift: {
      start: '07:00',
      end: '15:00',
    },
    stats: {
      tripsToday: 3,
      onTimeRate: 98,
      totalMiles: 62,
    },
  },
  {
    id: 'drv_003',
    name: 'James Rodriguez',
    initials: 'JR',
    phone: '555-0103',
    status: 'on_trip',
    vehicleId: 'veh_003',
    certifications: ['BLS', 'Wheelchair Lift'],
    zone: 'South',
    shift: {
      start: '08:00',
      end: '16:00',
    },
    stats: {
      tripsToday: 2,
      onTimeRate: 88,
      totalMiles: 45,
    },
  },
];

// ============================================================================
// TRIPS
// ============================================================================

export const trips: Trip[] = [
  // STAT Discharge - Unassigned (High Priority)
  {
    id: 'trip_001',
    type: 'discharge',
    priority: 'STAT',
    status: 'unassigned',
    passenger: {
      memberIdMasked: '***-**-6789',
      name: 'Robert Chen',
      phone: '555-1001',
      dateOfBirth: '12/15/1967',
      age: 59,
      gender: 'Male',
      weight: 178,
      mobilityLevel: 'wheelchair',
      specialNeeds: ['Oxygen Tank', 'Fragile'],
      insuranceProvider: 'New York Medicaid',
      insuranceId: '32327675',
      insuranceStatus: 'Active',
    },
    pickup: {
      address: 'Memorial Hospital, 123 Health Blvd',
      lat: 40.7589,
      lng: -73.9851,
      scheduledTime: '2026-01-27T14:30:00Z',
    },
    dropoff: {
      address: '456 Oak Street, Apt 3B',
      lat: 40.7489,
      lng: -73.9651,
    },
    scheduledPickupWindow: {
      start: '2026-01-27T14:30:00Z',
      end: '2026-01-27T15:00:00Z',
    },
    estimatedMiles: 8.2,
    estimatedDuration: 25,
    lateRisk: 'high',
    createdAt: '2026-01-27T14:15:00Z',
    updatedAt: '2026-01-27T14:15:00Z',
    notes: 'Patient discharge from ER. Requires wheelchair van with O2 compatibility.',
  },
  // Dialysis - On Trip
  {
    id: 'trip_002',
    type: 'dialysis',
    priority: 'scheduled',
    status: 'on_trip',
    passenger: {
      memberIdMasked: '***-**-1234',
      name: 'Mary Johnson',
      phone: '555-2001',
      dateOfBirth: '03/22/1955',
      age: 71,
      gender: 'Female',
      weight: 142,
      mobilityLevel: 'ambulatory',
      insuranceProvider: 'Medicare Part B',
      insuranceId: '45612389',
      insuranceStatus: 'Active',
    },
    pickup: {
      address: '789 Elm Avenue',
      lat: 40.7289,
      lng: -73.9951,
      scheduledTime: '2026-01-27T09:00:00Z',
      actualTime: '2026-01-27T09:03:00Z',
    },
    dropoff: {
      address: 'Downtown Dialysis Center, 321 Medical Plaza',
      lat: 40.7189,
      lng: -73.9751,
    },
    scheduledPickupWindow: {
      start: '2026-01-27T09:00:00Z',
      end: '2026-01-27T09:15:00Z',
    },
    driverId: 'drv_001',
    vehicleId: 'veh_001',
    estimatedMiles: 6.5,
    estimatedDuration: 18,
    lateRisk: 'low',
    createdAt: '2026-01-26T18:00:00Z',
    updatedAt: '2026-01-27T09:05:00Z',
    notes: 'Regular Mon/Wed/Fri dialysis patient.',
  },
  // Dialysis - Completed
  {
    id: 'trip_003',
    type: 'dialysis',
    priority: 'scheduled',
    status: 'completed',
    passenger: {
      memberIdMasked: '***-**-5678',
      name: 'Thomas Wright',
      phone: '555-3001',
      dateOfBirth: '08/09/1962',
      age: 64,
      gender: 'Male',
      weight: 195,
      mobilityLevel: 'ambulatory',
      insuranceProvider: 'Colorado Medicaid',
      insuranceId: '78904512',
      insuranceStatus: 'Active',
    },
    pickup: {
      address: '159 Pine Street',
      lat: 40.7689,
      lng: -74.0051,
      scheduledTime: '2026-01-27T07:00:00Z',
      actualTime: '2026-01-27T06:58:00Z',
    },
    dropoff: {
      address: 'Westside Dialysis, 753 River Road',
      lat: 40.7589,
      lng: -74.0151,
      actualTime: '2026-01-27T07:22:00Z',
    },
    scheduledPickupWindow: {
      start: '2026-01-27T07:00:00Z',
      end: '2026-01-27T07:15:00Z',
    },
    driverId: 'drv_002',
    vehicleId: 'veh_002',
    estimatedMiles: 5.8,
    estimatedDuration: 15,
    lateRisk: 'low',
    createdAt: '2026-01-26T16:00:00Z',
    updatedAt: '2026-01-27T07:25:00Z',
  },
  // Appointment - En Route to Pickup
  {
    id: 'trip_004',
    type: 'appointment',
    priority: 'scheduled',
    status: 'en_route_pickup',
    passenger: {
      memberIdMasked: '***-**-9012',
      name: 'Lisa Anderson',
      phone: '555-4001',
      dateOfBirth: '06/14/1975',
      age: 51,
      gender: 'Female',
      weight: 165,
      mobilityLevel: 'wheelchair',
      specialNeeds: ['Service Animal'],
      insuranceProvider: 'Medicare Part B',
      insuranceId: '55667788',
      insuranceStatus: 'Active',
    },
    pickup: {
      address: '951 Broadway',
      lat: 40.7889,
      lng: -73.9551,
      scheduledTime: '2026-01-27T11:00:00Z',
    },
    dropoff: {
      address: 'City Medical Center, 147 Hospital Drive',
      lat: 40.7989,
      lng: -73.9451,
    },
    scheduledPickupWindow: {
      start: '2026-01-27T11:00:00Z',
      end: '2026-01-27T11:20:00Z',
    },
    driverId: 'drv_003',
    vehicleId: 'veh_003',
    estimatedMiles: 4.2,
    estimatedDuration: 12,
    lateRisk: 'medium',
    createdAt: '2026-01-26T14:00:00Z',
    updatedAt: '2026-01-27T10:45:00Z',
    notes: 'Patient has service dog. Orthopedic appointment at 11:30 AM.',
  },
  // Dialysis - Unassigned (For Batch Builder)
  {
    id: 'trip_005',
    type: 'dialysis',
    priority: 'scheduled',
    status: 'unassigned',
    passenger: {
      memberIdMasked: '***-**-3456',
      name: 'David Kim',
      phone: '555-5001',
      dateOfBirth: '11/28/1968',
      age: 58,
      gender: 'Male',
      weight: 172,
      mobilityLevel: 'ambulatory',
      insuranceProvider: 'New York Medicaid',
      insuranceId: '22334455',
      insuranceStatus: 'Active',
    },
    pickup: {
      address: '357 Market Street',
      lat: 40.7189,
      lng: -73.9851,
      scheduledTime: '2026-01-27T13:00:00Z',
    },
    dropoff: {
      address: 'Downtown Dialysis Center, 321 Medical Plaza',
      lat: 40.7189,
      lng: -73.9751,
    },
    scheduledPickupWindow: {
      start: '2026-01-27T13:00:00Z',
      end: '2026-01-27T13:15:00Z',
    },
    estimatedMiles: 1.8,
    estimatedDuration: 8,
    lateRisk: 'low',
    createdAt: '2026-01-26T17:00:00Z',
    updatedAt: '2026-01-26T17:00:00Z',
    notes: 'Same facility as trip_002. Possible batch candidate.',
  },
  // Dialysis - Unassigned (For Batch Builder)
  {
    id: 'trip_006',
    type: 'dialysis',
    priority: 'scheduled',
    status: 'unassigned',
    passenger: {
      memberIdMasked: '***-**-7890',
      name: 'Patricia Lee',
      phone: '555-6001',
      dateOfBirth: '02/18/1961',
      age: 65,
      gender: 'Female',
      weight: 138,
      mobilityLevel: 'ambulatory',
      insuranceProvider: 'Medicare Part B',
      insuranceId: '99887766',
      insuranceStatus: 'Active',
    },
    pickup: {
      address: '842 Union Avenue',
      lat: 40.7229,
      lng: -73.9881,
      scheduledTime: '2026-01-27T13:15:00Z',
    },
    dropoff: {
      address: 'Downtown Dialysis Center, 321 Medical Plaza',
      lat: 40.7189,
      lng: -73.9751,
    },
    scheduledPickupWindow: {
      start: '2026-01-27T13:15:00Z',
      end: '2026-01-27T13:30:00Z',
    },
    estimatedMiles: 2.4,
    estimatedDuration: 10,
    lateRisk: 'low',
    createdAt: '2026-01-26T17:00:00Z',
    updatedAt: '2026-01-26T17:00:00Z',
    notes: 'Same facility as trip_002 and trip_005. Possible batch candidate.',
  },
];

// ============================================================================
// TRIP EVENTS
// ============================================================================

export const tripEvents: TripEvent[] = [
  // Events for trip_002 (dialysis on_trip)
  {
    id: 'evt_001',
    tripId: 'trip_002',
    type: 'trip_created',
    timestamp: '2026-01-26T18:00:00Z',
    createdBy: 'system',
  },
  {
    id: 'evt_002',
    tripId: 'trip_002',
    type: 'trip_assigned',
    timestamp: '2026-01-26T18:05:00Z',
    notes: 'Assigned to Carlos Martinez',
    createdBy: 'dispatcher_jane',
  },
  {
    id: 'evt_003',
    tripId: 'trip_002',
    type: 'en_route_pickup',
    timestamp: '2026-01-27T08:45:00Z',
    location: { lat: 40.7389, lng: -73.9851 },
    createdBy: 'drv_001',
  },
  {
    id: 'evt_004',
    tripId: 'trip_002',
    type: 'arrived_pickup',
    timestamp: '2026-01-27T09:00:00Z',
    location: { lat: 40.7289, lng: -73.9951 },
    createdBy: 'drv_001',
  },
  {
    id: 'evt_005',
    tripId: 'trip_002',
    type: 'passenger_onboard',
    timestamp: '2026-01-27T09:03:00Z',
    location: { lat: 40.7289, lng: -73.9951 },
    createdBy: 'drv_001',
  },
  {
    id: 'evt_006',
    tripId: 'trip_002',
    type: 'en_route_dropoff',
    timestamp: '2026-01-27T09:05:00Z',
    location: { lat: 40.7289, lng: -73.9951 },
    createdBy: 'drv_001',
  },
  // Events for trip_003 (completed)
  {
    id: 'evt_007',
    tripId: 'trip_003',
    type: 'trip_created',
    timestamp: '2026-01-26T16:00:00Z',
    createdBy: 'system',
  },
  {
    id: 'evt_008',
    tripId: 'trip_003',
    type: 'trip_assigned',
    timestamp: '2026-01-26T16:10:00Z',
    notes: 'Assigned to Maria Santos',
    createdBy: 'dispatcher_john',
  },
  {
    id: 'evt_009',
    tripId: 'trip_003',
    type: 'en_route_pickup',
    timestamp: '2026-01-27T06:45:00Z',
    location: { lat: 40.7589, lng: -74.0051 },
    createdBy: 'drv_002',
  },
  {
    id: 'evt_010',
    tripId: 'trip_003',
    type: 'arrived_pickup',
    timestamp: '2026-01-27T06:55:00Z',
    location: { lat: 40.7689, lng: -74.0051 },
    createdBy: 'drv_002',
  },
  {
    id: 'evt_011',
    tripId: 'trip_003',
    type: 'passenger_onboard',
    timestamp: '2026-01-27T06:58:00Z',
    location: { lat: 40.7689, lng: -74.0051 },
    createdBy: 'drv_002',
  },
  {
    id: 'evt_012',
    tripId: 'trip_003',
    type: 'en_route_dropoff',
    timestamp: '2026-01-27T07:00:00Z',
    location: { lat: 40.7689, lng: -74.0051 },
    createdBy: 'drv_002',
  },
  {
    id: 'evt_013',
    tripId: 'trip_003',
    type: 'arrived_dropoff',
    timestamp: '2026-01-27T07:20:00Z',
    location: { lat: 40.7589, lng: -74.0151 },
    createdBy: 'drv_002',
  },
  {
    id: 'evt_014',
    tripId: 'trip_003',
    type: 'trip_completed',
    timestamp: '2026-01-27T07:22:00Z',
    location: { lat: 40.7589, lng: -74.0151 },
    createdBy: 'drv_002',
  },
  // Events for trip_004 (en_route_pickup)
  {
    id: 'evt_015',
    tripId: 'trip_004',
    type: 'trip_created',
    timestamp: '2026-01-26T14:00:00Z',
    createdBy: 'system',
  },
  {
    id: 'evt_016',
    tripId: 'trip_004',
    type: 'trip_assigned',
    timestamp: '2026-01-26T14:15:00Z',
    notes: 'Assigned to James Rodriguez',
    createdBy: 'dispatcher_jane',
  },
  {
    id: 'evt_017',
    tripId: 'trip_004',
    type: 'en_route_pickup',
    timestamp: '2026-01-27T10:45:00Z',
    location: { lat: 40.7789, lng: -73.9651 },
    createdBy: 'drv_003',
  },
  // Events for trip_001 (STAT discharge unassigned)
  {
    id: 'evt_018',
    tripId: 'trip_001',
    type: 'trip_created',
    timestamp: '2026-01-27T14:15:00Z',
    createdBy: 'system',
    notes: 'STAT discharge from ER',
  },
];

// ============================================================================
// GPS PINGS (for animated map routes)
// ============================================================================

export const gpsPings: GPSPing[] = [
  // Driver 1 (CM) - Route for trip_002
  { driverId: 'drv_001', lat: 40.7389, lng: -73.9851, heading: 180, speed: 25, timestamp: '2026-01-27T08:45:00Z' },
  { driverId: 'drv_001', lat: 40.7339, lng: -73.9901, heading: 180, speed: 28, timestamp: '2026-01-27T08:50:00Z' },
  { driverId: 'drv_001', lat: 40.7289, lng: -73.9951, heading: 180, speed: 15, timestamp: '2026-01-27T08:58:00Z' },
  { driverId: 'drv_001', lat: 40.7289, lng: -73.9951, heading: 0, speed: 0, timestamp: '2026-01-27T09:00:00Z' },
  { driverId: 'drv_001', lat: 40.7289, lng: -73.9951, heading: 90, speed: 5, timestamp: '2026-01-27T09:05:00Z' },
  { driverId: 'drv_001', lat: 40.7249, lng: -73.9851, heading: 90, speed: 30, timestamp: '2026-01-27T09:10:00Z' },
  { driverId: 'drv_001', lat: 40.7219, lng: -73.9781, heading: 90, speed: 32, timestamp: '2026-01-27T09:15:00Z' },

  // Driver 2 (MS) - Completed trip, now available
  { driverId: 'drv_002', lat: 40.7589, lng: -74.0151, heading: 0, speed: 0, timestamp: '2026-01-27T07:25:00Z' },
  { driverId: 'drv_002', lat: 40.7589, lng: -74.0151, heading: 0, speed: 0, timestamp: '2026-01-27T10:00:00Z' },

  // Driver 3 (JR) - En route to pickup for trip_004
  { driverId: 'drv_003', lat: 40.7789, lng: -73.9651, heading: 45, speed: 22, timestamp: '2026-01-27T10:45:00Z' },
  { driverId: 'drv_003', lat: 40.7839, lng: -73.9601, heading: 45, speed: 25, timestamp: '2026-01-27T10:50:00Z' },
  { driverId: 'drv_003', lat: 40.7869, lng: -73.9571, heading: 45, speed: 18, timestamp: '2026-01-27T10:55:00Z' },
];

// ============================================================================
// DASHBOARD KPIs
// ============================================================================

export const kpis: DashboardKpis = {
  tripsToday: 6,
  dischargePendingStat: 1,
  onTimeRateScheduled: 92,
  activeDrivers: 3,
  availableDrivers: 1,
};

// ============================================================================
// DRIVER SUGGESTIONS
// ============================================================================

export const driverSuggestions: DriverSuggestions[] = [
  // Suggestions for trip_001 (STAT discharge)
  {
    tripId: 'trip_001',
    suggestions: [
      {
        driverId: 'drv_002',
        score: 95,
        estimatedPickupTime: '2026-01-27T14:40:00Z',
        estimatedArrivalTime: '2026-01-27T15:05:00Z',
        distance: 3.2,
        reasons: [
          'Currently available',
          'Closest to pickup location',
          'High on-time rate (98%)',
          'BLS certified',
        ],
      },
      {
        driverId: 'drv_001',
        score: 78,
        estimatedPickupTime: '2026-01-27T15:10:00Z',
        estimatedArrivalTime: '2026-01-27T15:35:00Z',
        distance: 8.5,
        reasons: [
          'Wheelchair van available',
          'Stretcher certified',
          'Will be available after current trip',
        ],
      },
      {
        driverId: 'drv_003',
        score: 72,
        estimatedPickupTime: '2026-01-27T15:15:00Z',
        estimatedArrivalTime: '2026-01-27T15:40:00Z',
        distance: 9.2,
        reasons: [
          'Wheelchair van available',
          'Will be available after current trip',
        ],
      },
    ],
    generatedAt: '2026-01-27T14:16:00Z',
  },
  // Suggestions for trip_005 (batch candidate)
  {
    tripId: 'trip_005',
    suggestions: [
      {
        driverId: 'drv_001',
        score: 88,
        estimatedPickupTime: '2026-01-27T12:55:00Z',
        estimatedArrivalTime: '2026-01-27T13:05:00Z',
        distance: 2.1,
        reasons: [
          'Can batch with trip_002 (same facility)',
          'In the area at pickup time',
          'Wheelchair accessible',
        ],
      },
    ],
    generatedAt: '2026-01-27T10:00:00Z',
  },
];

// ============================================================================
// CLAIMS & BILLING
// ============================================================================

export const claims: Claim[] = [
  {
    id: 'clm_001',
    tripId: 'trip_003',
    patientName: 'Thomas Wright',
    insuranceProvider: 'Colorado Medicaid',
    insuranceId: '78904512',
    totalCharge: 116.52,
    status: 'ready_to_bill',
    submittedAt: '2026-01-27T11:00:00Z',
  },
  {
    id: 'clm_002',
    tripId: 'trip_004',
    patientName: 'Sarah Martinez',
    insuranceProvider: 'Medicare Part B',
    insuranceId: '12345678',
    totalCharge: 121.75,
    status: 'paid',
    submittedAt: '2026-01-26T15:30:00Z',
    processedAt: '2026-01-27T09:00:00Z',
    paidAt: '2026-01-27T10:45:00Z',
  },
  {
    id: 'clm_003',
    tripId: 'trip_005',
    patientName: 'Mark Foster',
    insuranceProvider: 'New York Medicaid',
    insuranceId: '98765432',
    totalCharge: 85.31,
    status: 'approved',
    submittedAt: '2026-01-26T14:00:00Z',
    processedAt: '2026-01-27T08:30:00Z',
  },
];

export const billingStats: BillingStats = {
  totalProcessed: 8848.72,
  totalPaid: 6279.97,
  averageClaimValue: 118.45,
  rejectionRate: 7.2,
  pendingClaims: 12,
};

// ============================================================================
// TRANSPORTATION PROVIDERS
// ============================================================================

export const transportationProviders: TransportationProvider[] = [
  {
    id: 'prov_001',
    name: 'iCabbi',
    priority: '1st Priority',
    status: 'Verified',
    averageResponseTime: 4.2,
    completionRate: 98.5,
    rating: 4.8,
  },
  {
    id: 'prov_002',
    name: 'Uber',
    priority: '2nd Priority',
    status: 'Verified',
    averageResponseTime: 6.8,
    completionRate: 94.2,
    rating: 4.5,
  },
  {
    id: 'prov_003',
    name: 'Lyft, Inc.',
    priority: '3rd Priority',
    status: 'Verified',
    averageResponseTime: 7.5,
    completionRate: 92.8,
    rating: 4.3,
  },
];

// ============================================================================
// EXPORT ALL MOCK DATA
// ============================================================================

export const mockData = {
  vehicles,
  drivers,
  trips,
  tripEvents,
  gpsPings,
  kpis,
  driverSuggestions,
  claims,
  billingStats,
  transportationProviders,
};
