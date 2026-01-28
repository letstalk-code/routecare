import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { TripStatus } from '@prisma/client'

// POST /api/trips/[id]/events - Create trip event (status update)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.type) {
      return NextResponse.json(
        { error: 'Event type is required' },
        { status: 400 }
      )
    }

    // Create the event
    const event = await prisma.tripEvent.create({
      data: {
        tripId: id,
        type: body.type,
        locationLat: body.lat,
        locationLng: body.lng,
        notes: body.notes,
        createdBy: body.createdBy || 'system',
      },
    })

    // Update trip status based on event type
    const statusMap: Record<string, TripStatus> = {
      trip_assigned: TripStatus.assigned,
      en_route_pickup: TripStatus.en_route_pickup,
      arrived_pickup: TripStatus.arrived_pickup,
      passenger_onboard: TripStatus.on_trip,
      en_route_dropoff: TripStatus.on_trip,
      arrived_dropoff: TripStatus.arrived_dropoff,
      trip_completed: TripStatus.completed,
      trip_cancelled: TripStatus.cancelled,
    }

    const newStatus = statusMap[body.type]
    if (newStatus) {
      await prisma.trip.update({
        where: { id },
        data: { status: newStatus },
      })
    }

    // Update actual times based on event type
    if (body.type === 'arrived_pickup' || body.type === 'passenger_onboard') {
      await prisma.trip.update({
        where: { id },
        data: { pickupActualTime: new Date() },
      })
    } else if (body.type === 'arrived_dropoff' || body.type === 'trip_completed') {
      await prisma.trip.update({
        where: { id },
        data: { dropoffActualTime: new Date() },
      })
    }

    return NextResponse.json({ event })
  } catch (error) {
    console.error('Error creating trip event:', error)
    return NextResponse.json(
      { error: 'Failed to create trip event' },
      { status: 500 }
    )
  }
}

// GET /api/trips/[id]/events - Get all events for a trip
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const events = await prisma.tripEvent.findMany({
      where: { tripId: id },
      orderBy: { timestamp: 'desc' },
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching trip events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trip events' },
      { status: 500 }
    )
  }
}
