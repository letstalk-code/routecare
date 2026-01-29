import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/trips/[id]/unassign - Unassign driver from trip
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get current trip to find the driver
    const currentTrip = await prisma.trip.findUnique({
      where: { id },
      include: { driver: true },
    })

    if (!currentTrip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    const driverId = currentTrip.driverId

    // Update trip to remove driver and vehicle assignment
    const trip = await prisma.trip.update({
      where: { id },
      data: {
        driverId: null,
        vehicleId: null,
        status: 'unassigned',
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

    // Create trip unassignment event
    await prisma.tripEvent.create({
      data: {
        tripId: id,
        type: 'trip_created', // Using existing event type (could add trip_unassigned to schema later)
        notes: `Driver unassigned${currentTrip.driver ? ` (was ${currentTrip.driver.name})` : ''}`,
        createdBy: 'system',
      },
    })

    // Update driver status back to available if they were assigned
    if (driverId) {
      await prisma.driver.update({
        where: { id: driverId },
        data: { status: 'available' },
      })
    }

    return NextResponse.json({ trip })
  } catch (error) {
    console.error('Error unassigning trip:', error)
    return NextResponse.json(
      { error: 'Failed to unassign trip' },
      { status: 500 }
    )
  }
}
