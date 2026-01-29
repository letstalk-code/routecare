# Phase II Implementation Plan

## Overview
Implement advanced features to enhance real-time capabilities, monitoring, and analytics.

**Excluded**: Authentication (will be Phase III or later)

---

## Features to Implement

### 1. Real-Time Updates (Server-Sent Events)
**Goal**: Live updates for dispatch queue without manual refresh

**Implementation**:
- Create SSE endpoint: `/api/sse/dispatch`
- Stream trip updates, driver status changes, new trips
- Frontend: Connect to SSE, auto-update state
- Reconnection logic for dropped connections

**Files**:
- `apps/dispatcher/src/app/api/sse/dispatch/route.ts` (NEW)
- `apps/dispatcher/src/lib/use-sse.ts` (NEW - React hook)
- `apps/dispatcher/src/app/dispatch/page.tsx` (MODIFY - add SSE)
- `apps/dispatcher/src/app/dashboard/page.tsx` (MODIFY - add SSE)

### 2. Audit Logs
**Goal**: Track all system actions for compliance and debugging

**Implementation**:
- Create AuditLog model in Prisma
- Log: trip creation/updates, driver assignments, status changes
- Audit log viewer page for admins
- Filter by user, entity type, date range

**Files**:
- `apps/dispatcher/prisma/schema.prisma` (MODIFY - add AuditLog model)
- `apps/dispatcher/src/app/api/audit-logs/route.ts` (NEW)
- `apps/dispatcher/src/app/audit-logs/page.tsx` (NEW)
- `apps/dispatcher/src/lib/audit.ts` (NEW - helper functions)
- Modify all API routes to log actions

### 3. Advanced Analytics Dashboard
**Goal**: Performance metrics, trends, and insights

**Implementation**:
- Driver performance metrics (on-time rate, trips completed, avg rating)
- Trip analytics (by type, by zone, by time of day)
- Revenue/billing analytics
- Charts and visualizations (using Chart.js or Recharts)

**Files**:
- `apps/dispatcher/src/app/api/analytics/route.ts` (NEW)
- `apps/dispatcher/src/app/analytics/page.tsx` (NEW)
- `apps/dispatcher/src/components/charts/` (NEW - chart components)

### 4. Enhanced KPI Dashboard
**Goal**: More comprehensive real-time metrics

**Implementation**:
- Expand existing KPI calculations
- Add: average wait time, completion rate, fleet utilization
- Real-time updates via SSE
- Historical trends (7-day, 30-day)

**Files**:
- `apps/dispatcher/src/app/api/dashboard/kpis/route.ts` (MODIFY)
- `apps/dispatcher/src/app/dashboard/page.tsx` (MODIFY)

---

## Implementation Order

### Phase 2.1: Real-Time Updates (Priority 1)
1. Create SSE endpoint
2. Implement React SSE hook
3. Connect dispatch page to SSE
4. Connect dashboard to SSE
5. Test reconnection logic

**Estimated Complexity**: Medium
**Impact**: High - eliminates manual refreshing

### Phase 2.2: Audit Logs (Priority 2)
1. Add AuditLog model to schema
2. Create migration
3. Implement audit logging helpers
4. Add logging to all API routes
5. Create audit log viewer page

**Estimated Complexity**: Medium
**Impact**: High - compliance and debugging

### Phase 2.3: Analytics Dashboard (Priority 3)
1. Install chart library (Recharts)
2. Create analytics API endpoints
3. Build analytics page UI
4. Implement chart components
5. Add filtering and date range selection

**Estimated Complexity**: High
**Impact**: Medium - business insights

### Phase 2.4: Enhanced KPIs (Priority 4)
1. Expand KPI calculations
2. Add historical trend queries
3. Update dashboard UI
4. Connect to SSE for real-time updates

**Estimated Complexity**: Low-Medium
**Impact**: Medium - better monitoring

---

## Database Schema Changes

### AuditLog Model
```prisma
model AuditLog {
  id          String   @id @default(cuid())
  action      AuditAction
  entityType  String   // "trip", "driver", "passenger", etc.
  entityId    String
  userId      String?  // Will be null until auth is implemented
  userName    String?  // Temporary: "system" or "dispatcher"
  changes     Json?    // Before/after values
  metadata    Json?    // Additional context
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime @default(now())

  @@index([entityType, entityId])
  @@index([action])
  @@index([createdAt])
}

enum AuditAction {
  trip_created
  trip_updated
  trip_deleted
  trip_assigned
  trip_unassigned
  trip_status_changed
  driver_created
  driver_updated
  driver_status_changed
  passenger_created
  passenger_updated
  vehicle_created
  vehicle_updated
  claim_created
  claim_updated
}
```

---

## Success Criteria

### Phase 2.1 Complete When:
- ✅ SSE endpoint streams trip/driver updates
- ✅ Dispatch page auto-updates without refresh
- ✅ Dashboard auto-updates without refresh
- ✅ Connection auto-reconnects on drop
- ✅ No console errors

### Phase 2.2 Complete When:
- ✅ All API actions are logged to database
- ✅ Audit log page displays all logs
- ✅ Can filter logs by type, entity, date
- ✅ Logs include before/after values
- ✅ Migration runs successfully

### Phase 2.3 Complete When:
- ✅ Analytics page shows driver performance
- ✅ Analytics page shows trip statistics
- ✅ Charts render correctly
- ✅ Can filter by date range
- ✅ Data is accurate

### Phase 2.4 Complete When:
- ✅ Dashboard shows expanded KPIs
- ✅ Historical trends display
- ✅ KPIs update in real-time via SSE
- ✅ All calculations are accurate

---

## Technical Decisions

### Real-Time: SSE vs WebSocket
**Decision**: Start with SSE
**Reasoning**:
- Simpler to implement
- One-way communication (server → client) is sufficient
- Built into HTTP, no special protocols
- Can upgrade to WebSocket later for GPS tracking

### Chart Library: Chart.js vs Recharts
**Decision**: Recharts
**Reasoning**:
- React-native components
- Better TypeScript support
- Declarative API
- Built-in responsiveness

### Audit Log Storage: Database vs File
**Decision**: Database (PostgreSQL)
**Reasoning**:
- Queryable, filterable
- Relational to other entities
- Already have PostgreSQL setup
- Supports compliance requirements

---

## Next Steps After Phase II

Once Phase II is complete:
- Phase III: GPS tracking, route optimization, communications
- Or: Return to Authentication if needed for production
- Or: Mobile driver app enhancements

---

## Notes

- Authentication is intentionally excluded per user request
- Audit logs will use "system" as userName until auth is implemented
- Real-time updates will benefit from auth later (user-specific streams)
- All features should work without auth but will be enhanced by it

