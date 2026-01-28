import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { mockData } from '@routecare/shared'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.tripEvent.deleteMany()
  await prisma.claim.deleteMany()
  await prisma.gPSPing.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.passenger.deleteMany()
  await prisma.driver.deleteMany()
  await prisma.vehicle.deleteMany()

  console.log('✨ Cleared existing data')

  // Seed Vehicles - use exact data from mockData
  const vehicles = await Promise.all(
    mockData.vehicles.map((vehicle) =>
      prisma.vehicle.create({
        data: {
          id: vehicle.id,
          name: vehicle.name,
          type: vehicle.type,
          licensePlate: vehicle.licensePlate,
          capacity: vehicle.capacity,
          wheelchairAccessible: vehicle.wheelchairAccessible,
          mileage: vehicle.mileage,
        },
      })
    )
  )
  console.log(`✅ Created ${vehicles.length} vehicles`)

  // Seed Drivers
  const drivers = await Promise.all(
    mockData.drivers.map((driver) =>
      prisma.driver.create({
        data: {
          id: driver.id,
          name: driver.name,
          initials: driver.initials,
          phone: driver.phone,
          status: driver.status,
          vehicleId: driver.vehicleId,
          certifications: driver.certifications,
          zone: driver.zone,
          shiftStart: driver.shift.start,
          shiftEnd: driver.shift.end,
          tripsToday: driver.stats.tripsToday,
          onTimeRate: driver.stats.onTimeRate,
          totalMiles: driver.stats.totalMiles,
        },
      })
    )
  )
  console.log(`✅ Created ${drivers.length} drivers`)

  // Seed Passengers
  const passengers = await Promise.all(
    mockData.trips.map((trip) =>
      prisma.passenger.create({
        data: {
          id: `pass-${trip.id}`,
          memberIdMasked: trip.passenger.memberIdMasked,
          name: trip.passenger.name,
          phone: trip.passenger.phone,
          dateOfBirth: new Date(trip.passenger.dateOfBirth),
          age: trip.passenger.age,
          gender: trip.passenger.gender,
          weight: trip.passenger.weight,
          mobilityLevel: trip.passenger.mobilityLevel,
          specialNeeds: trip.passenger.specialNeeds || [],
          preferredLanguage: trip.passenger.preferredLanguage,
          insuranceProvider: trip.passenger.insuranceProvider,
          insuranceId: trip.passenger.insuranceId,
          insuranceStatus: trip.passenger.insuranceStatus,
        },
      })
    )
  )
  console.log(`✅ Created ${passengers.length} passengers`)

  // Seed Trips
  const trips = await Promise.all(
    mockData.trips.map((trip, index) =>
      prisma.trip.create({
        data: {
          id: trip.id,
          type: trip.type,
          priority: trip.priority,
          status: trip.status,
          passengerId: `pass-${trip.id}`,
          pickupAddress: trip.pickup.address,
          pickupLat: trip.pickup.lat,
          pickupLng: trip.pickup.lng,
          pickupScheduledTime: trip.pickup.scheduledTime ? new Date(trip.pickup.scheduledTime) : null,
          pickupActualTime: trip.pickup.actualTime ? new Date(trip.pickup.actualTime) : null,
          pickupNotes: trip.pickup.notes,
          dropoffAddress: trip.dropoff.address,
          dropoffLat: trip.dropoff.lat,
          dropoffLng: trip.dropoff.lng,
          dropoffScheduledTime: trip.dropoff.scheduledTime ? new Date(trip.dropoff.scheduledTime) : null,
          dropoffActualTime: trip.dropoff.actualTime ? new Date(trip.dropoff.actualTime) : null,
          dropoffNotes: trip.dropoff.notes,
          scheduledWindowStart: new Date(trip.scheduledPickupWindow.start),
          scheduledWindowEnd: new Date(trip.scheduledPickupWindow.end),
          driverId: trip.driverId,
          vehicleId: trip.vehicleId,
          estimatedMiles: trip.estimatedMiles,
          estimatedDuration: trip.estimatedDuration,
          lateRisk: trip.lateRisk,
          notes: trip.notes,
        },
      })
    )
  )
  console.log(`✅ Created ${trips.length} trips`)

  // Seed Trip Events
  const events = await Promise.all(
    mockData.tripEvents.map((event) =>
      prisma.tripEvent.create({
        data: {
          id: event.id,
          tripId: event.tripId,
          type: event.type,
          timestamp: new Date(event.timestamp),
          locationLat: event.location?.lat,
          locationLng: event.location?.lng,
          notes: event.notes,
          createdBy: event.createdBy,
        },
      })
    )
  )
  console.log(`✅ Created ${events.length} trip events`)

  // Seed GPS Pings (latest ping for each driver)
  const gpsPings = await Promise.all(
    mockData.gpsPings.slice(-3).map((ping) =>
      prisma.gPSPing.create({
        data: {
          driverId: ping.driverId,
          lat: ping.lat,
          lng: ping.lng,
          heading: ping.heading,
          speed: ping.speed,
          timestamp: new Date(ping.timestamp),
        },
      })
    )
  )
  console.log(`✅ Created ${gpsPings.length} GPS pings`)

  // Seed Claims
  const claims = await Promise.all(
    mockData.claims.map((claim) =>
      prisma.claim.create({
        data: {
          id: claim.id,
          tripId: claim.tripId,
          patientName: claim.patientName,
          insuranceProvider: claim.insuranceProvider,
          insuranceId: claim.insuranceId,
          totalCharge: claim.totalCharge,
          status: claim.status,
          submittedAt: claim.submittedAt ? new Date(claim.submittedAt) : null,
          processedAt: claim.processedAt ? new Date(claim.processedAt) : null,
          paidAt: claim.paidAt ? new Date(claim.paidAt) : null,
          rejectionReason: claim.rejectionReason,
        },
      })
    )
  )
  console.log(`✅ Created ${claims.length} claims`)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
