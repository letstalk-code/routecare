-- CreateIndex
CREATE INDEX "trips_status_idx" ON "trips"("status");

-- CreateIndex
CREATE INDEX "trips_type_idx" ON "trips"("type");

-- CreateIndex
CREATE INDEX "trips_createdAt_idx" ON "trips"("createdAt");

-- CreateIndex
CREATE INDEX "trips_status_type_idx" ON "trips"("status", "type");

-- CreateIndex
CREATE INDEX "trips_priority_idx" ON "trips"("priority");

-- CreateIndex
CREATE INDEX "drivers_status_idx" ON "drivers"("status");
