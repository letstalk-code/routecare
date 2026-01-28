import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/trips/[id]/assign - Assign driver to trip
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.driverId) {
      return NextResponse.json(
        { error: 'driverId is required' },
        { status: 400 }
      )
    }

    // Get driver details
    const driver = await prisma.driver.findUnique({
      where: { id: body.driverId },
      include: { vehicle: true },
    })

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      )
    }

    // Update trip with driver and vehicle assignment
    const trip = await prisma.trip.update({
      where: { id },
      data: {
        driverId: body.driverId,
        vehicleId: driver.vehicleId,
        status: 'assigned',
      },
      include: {
        passenger: true,
        driver: true,
        vehicle: true,
        events: {
          orderBy: { timestamp: 'desc' },
          take: 5,
        },
      },
    })

    // Create trip assignment event
    await prisma.tripEvent.create({
      data: {
        tripId: id,
        type: 'trip_assigned',
        notes: `Assigned to ${driver.name}`,
        createdBy: 'system',
      },
    })

    // Update driver status to on_trip
    await prisma.driver.update({
      where: { id: body.driverId },
      data: { status: 'on_trip' },
    })

    return NextResponse.json({ trip })
  } catch (error) {
    console.error('Error assigning trip:', error)
    return NextResponse.json(
      { error: 'Failed to assign trip' },
      { status: 500 }
    )
  }
}
