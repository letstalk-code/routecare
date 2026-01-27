# RouteCare - NEMT Dispatch & Driver Tracking

**Frontend-only implementation** with mock data. No backend or API calls.

## Project Structure

```
routecare/
├── apps/
│   ├── dispatcher/     # Next.js dispatcher dashboard
│   └── driver/         # Next.js driver PWA app
├── packages/
│   └── shared/         # Shared types and mock data
│       ├── contracts.ts   # Contract Guard (single source of truth)
│       ├── mockData.ts    # Typed mock data
│       └── index.ts       # Re-exports
├── package.json        # Root workspace config
└── pnpm-workspace.yaml
```

## Installation

```bash
# Install dependencies
npm install
```

## Running the Apps

### Dispatcher Dashboard
```bash
npm run dev:dispatcher
```
Then open: **http://localhost:3008**

Routes:
- `/` - Cinematic entry page with animated stats and CTA buttons
- `/dispatch` - Dispatcher dashboard with KPIs, map, and trip queue

### Driver App
```bash
npm run dev:driver
```
Then open: **http://localhost:3009**

Note: The driver app runs on a separate Next.js dev server. You'll need to run both commands in separate terminals.

## Features

### Dispatcher Dashboard
- **Entry Page**: Cinematic landing with framer-motion animations, gradient headlines, animated counters, and SVG map motif
- **KPI Cards**: Real-time metrics (trips today, STAT pending, on-time rate, active drivers)
- **Fleet Map**: Visual representation of driver locations and status
- **Dispatch Queue**: Tabbed interface (Discharge/Scheduled/All) with trip filtering
- **Trip Details**: Slide-over panel with passenger info, stops, driver suggestions
- **Glass morphism UI**: Modern dark theme with backdrop blur effects

### Driver App
- **Mock Login**: Simple authentication screen (UI only)
- **Driver Dashboard**: Status toggle, stats cards, trip tabs
- **Active Trip Workflow**: Step-by-step buttons (Start → Arrive → Onboard → Complete)
- **Trip Timeline**: Event history with timestamps
- **GPS Indicator**: Visual feedback for location tracking
- **Mobile-First Design**: Optimized for smartphone screens
- **PWA Ready**: Manifest file included for install-like behavior

## Mock Data

All data flows from `packages/shared/src/mockData.ts`:
- 3 Drivers (CM, MS, JR)
- 6 Trips (including 1 STAT discharge, dialysis, appointments)
- GPS ping history for map animation
- Trip events timeline
- Driver suggestions with scoring

## Type Safety

All types are defined in `packages/shared/src/contracts.ts` (Contract Guard).
UI apps import types from `@routecare/shared` - no type definitions in apps.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Framer Motion** (animations)
- **CSS** (glass morphism, gradients)
- **npm workspaces** (monorepo)

## Development

```bash
# Type check all packages
npm run type-check

# Build all apps
npm run build
```

---

**Note**: This is a frontend-only build. No backend, no API calls, no external services. All data is mocked locally.
