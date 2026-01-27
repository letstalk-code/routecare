// CONTRACT GUARD - Single Source of Truth for All Types
// No type definitions should exist outside this file in the UI apps

// ============================================================================
// BASE TYPES
// ============================================================================

export type ISODateTime = string; // ISO 8601 format

// ============================================================================
// ENUMS & LITERALS
// ============================================================================

export type TripType = 'discharge' | 'dialysis' | 'appointment' | 'recurring';

export type TripPriority = 'STAT' | 'urgent' | 'scheduled';

export type TripStatus =
  | 'unassigned'
  | 'assigned'
  | 'en_route_pickup'
  | 'arrived_pickup'
  | 'on_trip'
  | 'arrived_dropoff'
  | 'completed'
  | 'cancelled';

export type DriverStatus = 'available' | 'on_trip' | 'off_duty' | 'break';

export type VehicleType = 'sedan' | 'wheelchair_van' | 'ambulette';

export type MobilityLevel = 'ambulatory' | 'wheelchair' | 'stretcher';

export type LateRisk = 'low' | 'medium' | 'high';

export type TripEventType =
  | 'trip_created'
  | 'trip_assigned'
  | 'en_route_pickup'
  | 'arrived_pickup'
  | 'passenger_onboard'
  | 'en_route_dropoff'
  | 'arrived_dropoff'
  | 'trip_completed'
  | 'trip_cancelled';

// ============================================================================
// ENTITY TYPES
// ============================================================================

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  licensePlate: string;
  capacity: number;
  wheelchairAccessible: boolean;
  mileage: number;
}

export interface Driver {
  id: string;
  name: string;
  initials: string;
  phone: string;
  status: DriverStatus;
  vehicleId: string;
  certifications: string[];
  zone: string;
  shift: {
    start: string; // HH:mm format
    end: string;
  };
  stats: {
    tripsToday: number;
    onTimeRate: number;
    totalMiles: number;
  };
}

export interface TripStop {
  address: string;
  lat: number;
  lng: number;
  scheduledTime?: ISODateTime;
  actualTime?: ISODateTime;
  notes?: string;
}

export interface Passenger {
  memberIdMasked: string;
  name: string;
  phone: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight?: number; // in lbs
  mobilityLevel: MobilityLevel;
  specialNeeds?: string[];
  preferredLanguage?: string;
  insuranceProvider: string;
  insuranceId: string;
  insuranceStatus: 'Active' | 'Inactive' | 'Pending';
}

export interface Trip {
  id: string;
  type: TripType;
  priority: TripPriority;
  status: TripStatus;
  passenger: Passenger;
  pickup: TripStop;
  dropoff: TripStop;
  scheduledPickupWindow: {
    start: ISODateTime;
    end: ISODateTime;
  };
  driverId?: string;
  vehicleId?: string;
  estimatedMiles: number;
  estimatedDuration: number; // minutes
  lateRisk: LateRisk;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  notes?: string;
}

export interface TripEvent {
  id: string;
  tripId: string;
  type: TripEventType;
  timestamp: ISODateTime;
  location?: {
    lat: number;
    lng: number;
  };
  notes?: string;
  createdBy: string; // user or system
}

export interface GPSPing {
  driverId: string;
  lat: number;
  lng: number;
  heading: number; // degrees
  speed: number; // mph
  timestamp: ISODateTime;
}

// ============================================================================
// DASHBOARD & ANALYTICS TYPES
// ============================================================================

export interface DashboardKpis {
  tripsToday: number;
  dischargePendingStat: number;
  onTimeRateScheduled: number; // percentage
  activeDrivers: number;
  availableDrivers: number;
}

export interface DriverSuggestion {
  driverId: string;
  score: number; // 0-100
  estimatedPickupTime: ISODateTime;
  estimatedArrivalTime: ISODateTime;
  distance: number; // miles from current location to pickup
  reasons: string[]; // why this driver is suggested
}

export interface DriverSuggestions {
  tripId: string;
  suggestions: DriverSuggestion[];
  generatedAt: ISODateTime;
}

// ============================================================================
// BILLING & CLAIMS TYPES
// ============================================================================

export type ClaimStatus = 'ready_to_bill' | 'approved' | 'paid' | 'rejected';

export interface Claim {
  id: string;
  tripId: string;
  patientName: string;
  insuranceProvider: string;
  insuranceId: string;
  totalCharge: number;
  status: ClaimStatus;
  submittedAt?: ISODateTime;
  processedAt?: ISODateTime;
  paidAt?: ISODateTime;
  rejectionReason?: string;
}

export interface BillingStats {
  totalProcessed: number;
  totalPaid: number;
  averageClaimValue: number;
  rejectionRate: number; // percentage
  pendingClaims: number;
}

// ============================================================================
// TRANSPORTATION PROVIDER TYPES
// ============================================================================

export type ProviderPriority = '1st Priority' | '2nd Priority' | '3rd Priority';
export type ProviderStatus = 'Verified' | 'Unverified' | 'Suspended';

export interface TransportationProvider {
  id: string;
  name: string;
  priority: ProviderPriority;
  status: ProviderStatus;
  averageResponseTime: number; // minutes
  completionRate: number; // percentage
  rating: number; // 0-5
}
