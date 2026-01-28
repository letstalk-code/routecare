import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/drivers/[id]/gps - Record GPS ping for driver
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    if (!body.lat || !body.lng) {
      return NextResponse.json(
        { error: 'lat and lng are required' },
        { status: 400 }
      )
    }

    // Create GPS ping
    await prisma.gPSPing.create({
      data: {
        driverId: id,
        lat: body.lat,
        lng: body.lng,
        heading: body.heading || 0,
        speed: body.speed || 0,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error recording GPS ping:', error)
    return NextResponse.json(
      { error: 'Failed to record GPS ping' },
      { status: 500 }
    )
  }
}

// GET /api/drivers/[id]/gps - Get recent GPS pings for driver
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    const pings = await prisma.gPSPing.findMany({
      where: { driverId: id },
      orderBy: { timestamp: 'desc' },
      take: limit,
    })

    return NextResponse.json({ pings })
  } catch (error) {
    console.error('Error fetching GPS pings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GPS pings' },
      { status: 500 }
    )
  }
}
