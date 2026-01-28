import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/drivers/[id] - Get single driver with stats
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        vehicle: true,
        trips: {
          where: {
            status: {
              in: ['assigned', 'en_route_pickup', 'arrived_pickup', 'on_trip', 'arrived_dropoff'],
            },
          },
          include: {
            passenger: true,
          },
          orderBy: { scheduledWindowStart: 'asc' },
        },
      },
    })

    if (!driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      )
    }

    const activeTrip = driver.trips[0] || null

    return NextResponse.json({ driver, activeTrip })
  } catch (error) {
    console.error('Error fetching driver:', error)
    return NextResponse.json(
      { error: 'Failed to fetch driver' },
      { status: 500 }
    )
  }
}

// PUT /api/drivers/[id] - Update driver
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Build update data object
    const updateData: any = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.status !== undefined) updateData.status = body.status
    if (body.vehicleId !== undefined) updateData.vehicleId = body.vehicleId
    if (body.certifications !== undefined) updateData.certifications = body.certifications
    if (body.zone !== undefined) updateData.zone = body.zone
    if (body.shiftStart !== undefined) updateData.shiftStart = body.shiftStart
    if (body.shiftEnd !== undefined) updateData.shiftEnd = body.shiftEnd
    if (body.tripsToday !== undefined) updateData.tripsToday = body.tripsToday
    if (body.onTimeRate !== undefined) updateData.onTimeRate = body.onTimeRate
    if (body.totalMiles !== undefined) updateData.totalMiles = body.totalMiles

    const driver = await prisma.driver.update({
      where: { id },
      data: updateData,
      include: {
        vehicle: true,
      },
    })

    return NextResponse.json({ driver })
  } catch (error) {
    console.error('Error updating driver:', error)
    return NextResponse.json(
      { error: 'Failed to update driver' },
      { status: 500 }
    )
  }
}
