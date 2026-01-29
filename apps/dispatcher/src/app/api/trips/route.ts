import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAuditLog } from '@/lib/audit'

// GET /api/trips - Get all trips with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const driverId = searchParams.get('driverId')
    const date = searchParams.get('date')

    // Build where clause based on query params
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (priority) {
      where.priority = priority
    }

    if (driverId) {
      where.driverId = driverId
    }

    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      where.scheduledWindowStart = {
        gte: startOfDay,
        lte: endOfDay,
      }
    }

    const trips = await prisma.trip.findMany({
      where,
      include: {
        passenger: true,
        driver: true,
        vehicle: true,
        events: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
      },
      orderBy: [
        { priority: 'asc' },
        { scheduledWindowStart: 'asc' },
      ],
    })

    const count = await prisma.trip.count({ where })

    return NextResponse.json({ trips, count })
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trips' },
      { status: 500 }
    )
  }
}

// POST /api/trips - Create a new trip
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const trip = await prisma.trip.create({
      data: {
        type: body.type,
        priority: body.priority || 'scheduled',
        status: body.status || 'unassigned',
        passengerId: body.passengerId,
        pickupAddress: body.pickupAddress,
        pickupLat: body.pickupLat,
        pickupLng: body.pickupLng,
        pickupScheduledTime: body.pickupScheduledTime ? new Date(body.pickupScheduledTime) : null,
        pickupNotes: body.pickupNotes,
        dropoffAddress: body.dropoffAddress,
        dropoffLat: body.dropoffLat,
        dropoffLng: body.dropoffLng,
        dropoffScheduledTime: body.dropoffScheduledTime ? new Date(body.dropoffScheduledTime) : null,
        dropoffNotes: body.dropoffNotes,
        scheduledWindowStart: new Date(body.scheduledWindowStart),
        scheduledWindowEnd: new Date(body.scheduledWindowEnd),
        driverId: body.driverId,
        vehicleId: body.vehicleId,
        estimatedMiles: body.estimatedMiles,
        estimatedDuration: body.estimatedDuration,
        lateRisk: body.lateRisk || 'low',
        notes: body.notes,
      },
      include: {
        passenger: true,
        driver: true,
        vehicle: true,
      },
    })

    // Create initial trip event
    await prisma.tripEvent.create({
      data: {
        tripId: trip.id,
        type: 'trip_created',
        createdBy: 'system',
      },
    })

    // Audit log
    await createAuditLog({
      action: 'trip_created',
      entityType: 'trip',
      entityId: trip.id,
      metadata: { passengerId: trip.passengerId, priority: trip.priority },
    })

    return NextResponse.json({ trip }, { status: 201 })
  } catch (error) {
    console.error('Error creating trip:', error)
    return NextResponse.json(
      { error: 'Failed to create trip' },
      { status: 500 }
    )
  }
}
