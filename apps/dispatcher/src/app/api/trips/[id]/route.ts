import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/trips/[id] - Get single trip with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        passenger: true,
        driver: true,
        vehicle: true,
        events: {
          orderBy: { timestamp: 'desc' },
        },
        claim: true,
      },
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ trip })
  } catch (error) {
    console.error('Error fetching trip:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trip' },
      { status: 500 }
    )
  }
}

// PUT /api/trips/[id] - Update trip
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Build update data object
    const updateData: any = {}

    // Only include fields that are provided
    if (body.type !== undefined) updateData.type = body.type
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.status !== undefined) updateData.status = body.status
    if (body.pickupAddress !== undefined) updateData.pickupAddress = body.pickupAddress
    if (body.pickupLat !== undefined) updateData.pickupLat = body.pickupLat
    if (body.pickupLng !== undefined) updateData.pickupLng = body.pickupLng
    if (body.pickupScheduledTime !== undefined) updateData.pickupScheduledTime = body.pickupScheduledTime ? new Date(body.pickupScheduledTime) : null
    if (body.pickupActualTime !== undefined) updateData.pickupActualTime = body.pickupActualTime ? new Date(body.pickupActualTime) : null
    if (body.pickupNotes !== undefined) updateData.pickupNotes = body.pickupNotes
    if (body.dropoffAddress !== undefined) updateData.dropoffAddress = body.dropoffAddress
    if (body.dropoffLat !== undefined) updateData.dropoffLat = body.dropoffLat
    if (body.dropoffLng !== undefined) updateData.dropoffLng = body.dropoffLng
    if (body.dropoffScheduledTime !== undefined) updateData.dropoffScheduledTime = body.dropoffScheduledTime ? new Date(body.dropoffScheduledTime) : null
    if (body.dropoffActualTime !== undefined) updateData.dropoffActualTime = body.dropoffActualTime ? new Date(body.dropoffActualTime) : null
    if (body.dropoffNotes !== undefined) updateData.dropoffNotes = body.dropoffNotes
    if (body.scheduledWindowStart !== undefined) updateData.scheduledWindowStart = new Date(body.scheduledWindowStart)
    if (body.scheduledWindowEnd !== undefined) updateData.scheduledWindowEnd = new Date(body.scheduledWindowEnd)
    if (body.driverId !== undefined) updateData.driverId = body.driverId
    if (body.vehicleId !== undefined) updateData.vehicleId = body.vehicleId
    if (body.estimatedMiles !== undefined) updateData.estimatedMiles = body.estimatedMiles
    if (body.estimatedDuration !== undefined) updateData.estimatedDuration = body.estimatedDuration
    if (body.lateRisk !== undefined) updateData.lateRisk = body.lateRisk
    if (body.notes !== undefined) updateData.notes = body.notes

    const trip = await prisma.trip.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ trip })
  } catch (error) {
    console.error('Error updating trip:', error)
    return NextResponse.json(
      { error: 'Failed to update trip' },
      { status: 500 }
    )
  }
}

// DELETE /api/trips/[id] - Soft delete trip (set status to cancelled)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const trip = await prisma.trip.update({
      where: { id },
      data: { status: 'cancelled' },
    })

    // Create cancellation event
    await prisma.tripEvent.create({
      data: {
        tripId: id,
        type: 'trip_cancelled',
        createdBy: 'system',
      },
    })

    return NextResponse.json({ success: true, trip })
  } catch (error) {
    console.error('Error cancelling trip:', error)
    return NextResponse.json(
      { error: 'Failed to cancel trip' },
      { status: 500 }
    )
  }
}
