# Phase I: Backend Implementation Plan

## Current State
- **Frontend-only** implementation with mock data
- Two Next.js apps: dispatcher (port 3008) and driver (port 3009)
- Shared types in `packages/shared/src/contracts.ts`
- Mock data in `packages/shared/src/mockData.ts`
- No backend, no database, no API endpoints

## Phase I Goals
Transform the frontend-only prototype into a fully functional system with:
1. PostgreSQL database with proper schema
2. REST API endpoints for all CRUD operations
3. Real-time updates for dispatch queue
4. Data persistence and state management
5. Authentication foundation

---

## Architecture Overview

### Technology Stack
- **Database**: PostgreSQL (hosted on Supabase or Railway)
- **ORM**: Prisma (type-safe database client)
- **API**: Next.js App Router API Routes (`route.ts` files)
- **Real-time**: Server-Sent Events (SSE) for dispatch updates
- **Authentication**: NextAuth.js (Phase II)

### Directory Structure
```
apps/dispatcher/
├── src/
│   ├── app/
│   │   ├── api/                    # NEW: API routes
│   │   │   ├── trips/
│   │   │   │   ├── route.ts        # GET all, POST new
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts    # GET, PUT, DELETE specific trip
│   │   │   ├── drivers/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── passengers/
│   │   │   ├── vehicles/
│   │   │   ├── events/
│   │   │   └── sse/
│   │   │       └── route.ts        # Server-Sent Events endpoint
│   │   ├── dispatch/page.tsx
│   │   └── dashboard/page.tsx
│   └── lib/                        # NEW: Backend utilities
│       ├── prisma.ts               # Prisma client singleton
│       ├── api-client.ts           # Frontend API client
│       └── sse.ts                  # SSE utilities
├── prisma/                         # NEW: Prisma setup
│   ├── schema.prisma               # Database schema
│   ├── seed.ts                     # Seed with mock data
│   └── migrations/
└── package.json
```

---

## Implementation Steps

### Step 1: Database Setup
**Tasks:**
1. Install Prisma dependencies
2. Initialize Prisma in dispatcher app
3. Choose database provider (Supabase recommended)
4. Configure database connection string

**Commands:**
```bash
cd apps/dispatcher
npm install prisma @prisma/client
npx prisma init
```

**Files Created:**
- `apps/dispatcher/prisma/schema.prisma`
- `apps/dispatcher/.env` (with DATABASE_URL)

---

### Step 2: Define Database Schema

**Schema Design:**

```prisma
// prisma/schema.prisma

model Driver {
  id              String   @id @default(cuid())
  name            String
  initials        String
  phone           String
  status          DriverStatus @default(off_duty)
  vehicleId       String?
  vehicle         Vehicle? @relation(fields: [vehicleId], references: [id])
  certifications  String[]
  zone            String
  shiftStart      String
  shiftEnd        String
  tripsToday      Int      @default(0)
  onTimeRate      Float    @default(0)
  totalMiles      Float    @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  trips           Trip[]
  gpsPings        GPSPing[]
}

model Vehicle {
  id                    String      @id @default(cuid())
  name                  String
  type                  VehicleType
  licensePlate          String      @unique
  capacity              Int
  wheelchairAccessible  Boolean
  mileage               Float
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt

  drivers               Driver[]
  trips                 Trip[]
}

model Passenger {
  id                  String   @id @default(cuid())
  memberIdMasked      String
  name                String
  phone               String
  dateOfBirth         DateTime
  age                 Int
  gender              Gender
  weight              Float?
  mobilityLevel       MobilityLevel
  specialNeeds        String[]
  preferredLanguage   String?
  insuranceProvider   String
  insuranceId         String
  insuranceStatus     InsuranceStatus
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  trips               Trip[]
}

model Trip {
  id                        String       @id @default(cuid())
  type                      TripType
  priority                  TripPriority @default(scheduled)
  status                    TripStatus   @default(unassigned)

  passengerId               String
  passenger                 Passenger    @relation(fields: [passengerId], references: [id])

  pickupAddress             String
  pickupLat                 Float
  pickupLng                 Float
  pickupScheduledTime       DateTime?
  pickupActualTime          DateTime?
  pickupNotes               String?

  dropoffAddress            String
  dropoffLat                Float
  dropoffLng                Float
  dropoffScheduledTime      DateTime?
  dropoffActualTime         DateTime?
  dropoffNotes              String?

  scheduledWindowStart      DateTime
  scheduledWindowEnd        DateTime

  driverId                  String?
  driver                    Driver?      @relation(fields: [driverId], references: [id])

  vehicleId                 String?
  vehicle                   Vehicle?     @relation(fields: [vehicleId], references: [id])

  estimatedMiles            Float
  estimatedDuration         Int
  lateRisk                  LateRisk     @default(low)
  notes                     String?

  createdAt                 DateTime     @default(now())
  updatedAt                 DateTime     @updatedAt

  events                    TripEvent[]
  claim                     Claim?
}

model TripEvent {
  id          String        @id @default(cuid())
  tripId      String
  trip        Trip          @relation(fields: [tripId], references: [id], onDelete: Cascade)
  type        TripEventType
  timestamp   DateTime      @default(now())
  locationLat Float?
  locationLng Float?
  notes       String?
  createdBy   String
}

model GPSPing {
  id          String   @id @default(cuid())
  driverId    String
  driver      Driver   @relation(fields: [driverId], references: [id])
  lat         Float
  lng         Float
  heading     Float
  speed       Float
  timestamp   DateTime @default(now())
}

model Claim {
  id                String      @id @default(cuid())
  tripId            String      @unique
  trip              Trip        @relation(fields: [tripId], references: [id])
  patientName       String
  insuranceProvider String
  insuranceId       String
  totalCharge       Float
  status            ClaimStatus @default(ready_to_bill)
  submittedAt       DateTime?
  processedAt       DateTime?
  paidAt            DateTime?
  rejectionReason   String?
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
}

// Enums
enum DriverStatus {
  available
  on_trip
  off_duty
  break
}

enum VehicleType {
  sedan
  wheelchair_van
  ambulette
}

enum Gender {
  Male
  Female
  Other
}

enum MobilityLevel {
  ambulatory
  wheelchair
  stretcher
}

enum InsuranceStatus {
  Active
  Inactive
  Pending
}

enum TripType {
  discharge
  dialysis
  appointment
  recurring
}

enum TripPriority {
  STAT
  urgent
  scheduled
}

enum TripStatus {
  unassigned
  assigned
  en_route_pickup
  arrived_pickup
  on_trip
  arrived_dropoff
  completed
  cancelled
}

enum LateRisk {
  low
  medium
  high
}

enum TripEventType {
  trip_created
  trip_assigned
  en_route_pickup
  arrived_pickup
  passenger_onboard
  en_route_dropoff
  arrived_dropoff
  trip_completed
  trip_cancelled
}

enum ClaimStatus {
  ready_to_bill
  approved
  paid
  rejected
}
```

---

### Step 3: API Routes Design

#### Trips API

**`/api/trips` - GET**
- Returns all trips with filters
- Query params: `status`, `priority`, `driverId`, `date`
- Response: `{ trips: Trip[], count: number }`

**`/api/trips` - POST**
- Creates a new trip
- Body: Trip data (without id, timestamps)
- Response: `{ trip: Trip }`

**`/api/trips/[id]` - GET**
- Returns single trip with full details
- Response: `{ trip: Trip }`

**`/api/trips/[id]` - PUT**
- Updates trip (status, driver assignment, etc.)
- Body: Partial trip data
- Response: `{ trip: Trip }`

**`/api/trips/[id]` - DELETE**
- Soft deletes trip (sets status to cancelled)
- Response: `{ success: boolean }`

**`/api/trips/[id]/assign` - POST**
- Assigns driver to trip
- Body: `{ driverId: string }`
- Response: `{ trip: Trip }`

**`/api/trips/[id]/events` - POST**
- Creates trip event (status update)
- Body: `{ type: TripEventType, notes?: string }`
- Response: `{ event: TripEvent }`

#### Drivers API

**`/api/drivers` - GET**
- Returns all drivers
- Query params: `status`, `zone`
- Response: `{ drivers: Driver[] }`

**`/api/drivers/[id]` - GET**
- Returns single driver with stats
- Response: `{ driver: Driver, activeTrip?: Trip }`

**`/api/drivers/[id]` - PUT**
- Updates driver (status, location, etc.)
- Body: Partial driver data
- Response: `{ driver: Driver }`

**`/api/drivers/[id]/gps` - POST**
- Records GPS ping
- Body: `{ lat, lng, heading, speed }`
- Response: `{ success: boolean }`

#### Dashboard API

**`/api/dashboard/kpis` - GET**
- Returns dashboard KPIs
- Response: `{ kpis: DashboardKpis }`

**`/api/dashboard/suggestions/[tripId]` - GET**
- Returns driver suggestions for trip
- Response: `{ suggestions: DriverSuggestion[] }`

#### Real-time API

**`/api/sse/dispatch` - GET (SSE)**
- Server-Sent Events endpoint
- Streams trip updates, driver status changes
- Events: `trip-updated`, `trip-created`, `driver-status-changed`

---

### Step 4: Prisma Client Setup

**File: `src/lib/prisma.ts`**
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```

---

### Step 5: Frontend API Client

**File: `src/lib/api-client.ts`**
```typescript
import type { Trip, Driver, DashboardKpis } from '@routecare/shared'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

export const api = {
  trips: {
    getAll: async (filters?: Record<string, string>) => {
      const query = new URLSearchParams(filters).toString()
      const res = await fetch(`${API_BASE}/api/trips?${query}`)
      return res.json()
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE}/api/trips/${id}`)
      return res.json()
    },
    create: async (data: Partial<Trip>) => {
      const res = await fetch(`${API_BASE}/api/trips`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    update: async (id: string, data: Partial<Trip>) => {
      const res = await fetch(`${API_BASE}/api/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    assign: async (id: string, driverId: string) => {
      const res = await fetch(`${API_BASE}/api/trips/${id}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId }),
      })
      return res.json()
    },
  },
  drivers: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/api/drivers`)
      return res.json()
    },
    getById: async (id: string) => {
      const res = await fetch(`${API_BASE}/api/drivers/${id}`)
      return res.json()
    },
    updateStatus: async (id: string, status: string) => {
      const res = await fetch(`${API_BASE}/api/drivers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      return res.json()
    },
  },
  dashboard: {
    getKpis: async () => {
      const res = await fetch(`${API_BASE}/api/dashboard/kpis`)
      return res.json()
    },
  },
}
```

---

### Step 6: Database Migration & Seeding

**Seed Script: `prisma/seed.ts`**
- Migrate existing mock data from `packages/shared/src/mockData.ts`
- Create drivers, vehicles, passengers, trips
- Maintain referential integrity

**Commands:**
```bash
# Create migration
npx prisma migrate dev --name init

# Seed database
npx prisma db seed
```

---

### Step 7: Frontend Integration

**Update Components:**
1. Replace `mockData` imports with API calls
2. Add loading states
3. Add error handling
4. Implement optimistic updates

**Example (dispatch page):**
```typescript
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import type { Trip, Driver } from '@routecare/shared';

export default function DispatchPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [tripsData, driversData] = await Promise.all([
          api.trips.getAll(),
          api.drivers.getAll(),
        ]);
        setTrips(tripsData.trips);
        setDrivers(driversData.drivers);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ... rest of component
}
```

---

### Step 8: Real-time Updates

**SSE Implementation:**
```typescript
// src/app/api/sse/dispatch/route.ts
export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send trip updates
      const interval = setInterval(async () => {
        const trips = await prisma.trip.findMany();
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'trips', data: trips })}\n\n`)
        );
      }, 5000);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

---

## Success Criteria

✅ Phase I Complete When:
1. PostgreSQL database is set up and connected
2. All Prisma models are created and migrated
3. Mock data is seeded into database
4. All API routes are implemented and tested
5. Frontend successfully fetches from API
6. Real-time updates work on dispatch page
7. No TypeScript errors
8. Builds successfully on Vercel

---

## Next Steps (Phase II)

- Authentication with NextAuth.js
- Authorization and role-based access
- WebSocket for real-time GPS tracking
- Audit logs
- Advanced analytics

---

## Timeline Estimate

- **Step 1-2**: Database setup & schema (2-3 hours)
- **Step 3-5**: API routes implementation (4-5 hours)
- **Step 6**: Migration & seeding (1-2 hours)
- **Step 7**: Frontend integration (3-4 hours)
- **Step 8**: Real-time updates (2-3 hours)

**Total: 12-17 hours of development**

---

## Questions to Resolve

1. **Database Hosting**: Supabase (free tier) or Railway?
2. **Real-time**: SSE (simpler) or WebSockets (more powerful)?
3. **Authentication**: Implement in Phase I or defer to Phase II?
4. **Driver GPS**: Store all pings or just latest location?
5. **Soft Delete**: Implement soft deletes or hard deletes for trips?
