-- CreateEnum
CREATE TYPE "DriverStatus" AS ENUM ('available', 'on_trip', 'off_duty', 'break');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('sedan', 'wheelchair_van', 'ambulette');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "MobilityLevel" AS ENUM ('ambulatory', 'wheelchair', 'stretcher');

-- CreateEnum
CREATE TYPE "InsuranceStatus" AS ENUM ('Active', 'Inactive', 'Pending');

-- CreateEnum
CREATE TYPE "TripType" AS ENUM ('discharge', 'dialysis', 'appointment', 'recurring');

-- CreateEnum
CREATE TYPE "TripPriority" AS ENUM ('STAT', 'urgent', 'scheduled');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('unassigned', 'assigned', 'en_route_pickup', 'arrived_pickup', 'on_trip', 'arrived_dropoff', 'completed', 'cancelled');

-- CreateEnum
CREATE TYPE "LateRisk" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "TripEventType" AS ENUM ('trip_created', 'trip_assigned', 'en_route_pickup', 'arrived_pickup', 'passenger_onboard', 'en_route_dropoff', 'arrived_dropoff', 'trip_completed', 'trip_cancelled');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('ready_to_bill', 'approved', 'paid', 'rejected');

-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "initials" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" "DriverStatus" NOT NULL DEFAULT 'off_duty',
    "vehicleId" TEXT,
    "certifications" TEXT[],
    "zone" TEXT NOT NULL,
    "shiftStart" TEXT NOT NULL,
    "shiftEnd" TEXT NOT NULL,
    "tripsToday" INTEGER NOT NULL DEFAULT 0,
    "onTimeRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalMiles" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "VehicleType" NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "wheelchairAccessible" BOOLEAN NOT NULL,
    "mileage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passengers" (
    "id" TEXT NOT NULL,
    "memberIdMasked" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "weight" DOUBLE PRECISION,
    "mobilityLevel" "MobilityLevel" NOT NULL,
    "specialNeeds" TEXT[],
    "preferredLanguage" TEXT,
    "insuranceProvider" TEXT NOT NULL,
    "insuranceId" TEXT NOT NULL,
    "insuranceStatus" "InsuranceStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "passengers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trips" (
    "id" TEXT NOT NULL,
    "type" "TripType" NOT NULL,
    "priority" "TripPriority" NOT NULL DEFAULT 'scheduled',
    "status" "TripStatus" NOT NULL DEFAULT 'unassigned',
    "passengerId" TEXT NOT NULL,
    "pickupAddress" TEXT NOT NULL,
    "pickupLat" DOUBLE PRECISION NOT NULL,
    "pickupLng" DOUBLE PRECISION NOT NULL,
    "pickupScheduledTime" TIMESTAMP(3),
    "pickupActualTime" TIMESTAMP(3),
    "pickupNotes" TEXT,
    "dropoffAddress" TEXT NOT NULL,
    "dropoffLat" DOUBLE PRECISION NOT NULL,
    "dropoffLng" DOUBLE PRECISION NOT NULL,
    "dropoffScheduledTime" TIMESTAMP(3),
    "dropoffActualTime" TIMESTAMP(3),
    "dropoffNotes" TEXT,
    "scheduledWindowStart" TIMESTAMP(3) NOT NULL,
    "scheduledWindowEnd" TIMESTAMP(3) NOT NULL,
    "driverId" TEXT,
    "vehicleId" TEXT,
    "estimatedMiles" DOUBLE PRECISION NOT NULL,
    "estimatedDuration" INTEGER NOT NULL,
    "lateRisk" "LateRisk" NOT NULL DEFAULT 'low',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trip_events" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "type" "TripEventType" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locationLat" DOUBLE PRECISION,
    "locationLng" DOUBLE PRECISION,
    "notes" TEXT,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "trip_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gps_pings" (
    "id" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "heading" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gps_pings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claims" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "insuranceProvider" TEXT NOT NULL,
    "insuranceId" TEXT NOT NULL,
    "totalCharge" DOUBLE PRECISION NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'ready_to_bill',
    "submittedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "claims_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "vehicles_licensePlate_key" ON "vehicles"("licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "claims_tripId_key" ON "claims"("tripId");

-- AddForeignKey
ALTER TABLE "drivers" ADD CONSTRAINT "drivers_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "passengers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "vehicles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_events" ADD CONSTRAINT "trip_events_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gps_pings" ADD CONSTRAINT "gps_pings_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claims" ADD CONSTRAINT "claims_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "trips"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
