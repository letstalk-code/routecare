import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/claims - Get all claims with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const tripId = searchParams.get('tripId')

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (tripId) {
      where.tripId = tripId
    }

    const claims = await prisma.claim.findMany({
      where,
      include: {
        trip: {
          include: {
            passenger: true,
            driver: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ claims })
  } catch (error) {
    console.error('Error fetching claims:', error)
    return NextResponse.json(
      { error: 'Failed to fetch claims' },
      { status: 500 }
    )
  }
}

// POST /api/claims - Create a new claim
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Verify trip exists and is completed
    const trip = await prisma.trip.findUnique({
      where: { id: body.tripId },
      include: { passenger: true },
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    const claim = await prisma.claim.create({
      data: {
        tripId: body.tripId,
        patientName: body.patientName || trip.passenger.name,
        insuranceProvider: body.insuranceProvider || trip.passenger.insuranceProvider,
        insuranceId: body.insuranceId || trip.passenger.insuranceId,
        totalCharge: body.totalCharge,
        status: body.status || 'ready_to_bill',
        submittedAt: body.submittedAt ? new Date(body.submittedAt) : null,
        processedAt: body.processedAt ? new Date(body.processedAt) : null,
        paidAt: body.paidAt ? new Date(body.paidAt) : null,
        rejectionReason: body.rejectionReason,
      },
      include: {
        trip: {
          include: {
            passenger: true,
          },
        },
      },
    })

    return NextResponse.json({ claim }, { status: 201 })
  } catch (error) {
    console.error('Error creating claim:', error)
    return NextResponse.json(
      { error: 'Failed to create claim' },
      { status: 500 }
    )
  }
}
