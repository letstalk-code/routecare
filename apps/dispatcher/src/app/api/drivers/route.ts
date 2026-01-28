import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/drivers - Get all drivers with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const zone = searchParams.get('zone')

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (zone) {
      where.zone = zone
    }

    const drivers = await prisma.driver.findMany({
      where,
      include: {
        vehicle: true,
        trips: {
          where: {
            status: {
              in: ['assigned', 'en_route_pickup', 'arrived_pickup', 'on_trip', 'arrived_dropoff'],
            },
          },
          take: 1,
          orderBy: { scheduledWindowStart: 'asc' },
          include: {
            passenger: true,
          },
        },
      },
      orderBy: [
        { status: 'asc' },
        { name: 'asc' },
      ],
    })

    return NextResponse.json({ drivers })
  } catch (error) {
    console.error('Error fetching drivers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drivers' },
      { status: 500 }
    )
  }
}

// POST /api/drivers - Create a new driver
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Generate initials from name
    const nameParts = body.name.split(' ')
    const initials = nameParts.map((part: string) => part[0]).join('').toUpperCase().slice(0, 2)

    const driver = await prisma.driver.create({
      data: {
        name: body.name,
        initials: initials,
        phone: body.phone,
        status: body.status || 'off_duty',
        vehicleId: body.vehicleId,
        certifications: body.certifications || [],
        zone: body.zone,
        shiftStart: body.shiftStart,
        shiftEnd: body.shiftEnd,
        tripsToday: 0,
        onTimeRate: 0,
        totalMiles: 0,
      },
      include: {
        vehicle: true,
      },
    })

    return NextResponse.json({ driver }, { status: 201 })
  } catch (error) {
    console.error('Error creating driver:', error)
    return NextResponse.json(
      { error: 'Failed to create driver' },
      { status: 500 }
    )
  }
}
