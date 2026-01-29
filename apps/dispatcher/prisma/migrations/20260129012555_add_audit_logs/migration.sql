-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('trip_created', 'trip_updated', 'trip_deleted', 'trip_assigned', 'trip_unassigned', 'driver_created', 'driver_updated', 'driver_status_changed', 'passenger_created', 'passenger_updated', 'vehicle_created', 'vehicle_updated', 'claim_created', 'claim_updated');

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userName" TEXT NOT NULL DEFAULT 'system',
    "changes" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");
