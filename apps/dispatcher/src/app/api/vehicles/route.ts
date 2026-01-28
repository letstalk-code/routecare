import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vehicles - Get all vehicles
export async function GET(request: NextRequest) {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ vehicles })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 }
    )
  }
}

// POST /api/vehicles - Create a new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const vehicle = await prisma.vehicle.create({
      data: {
        name: body.name,
        type: body.type,
        licensePlate: body.licensePlate,
        capacity: body.capacity,
        wheelchairAccessible: body.wheelchairAccessible,
        mileage: body.mileage || 0,
      },
    })

    return NextResponse.json({ vehicle }, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}
