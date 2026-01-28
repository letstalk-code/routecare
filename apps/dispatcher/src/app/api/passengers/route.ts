import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/passengers - Get all passengers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { memberIdMasked: { contains: search } },
      ]
    }

    const passengers = await prisma.passenger.findMany({
      where,
      orderBy: { name: 'asc' },
      take: 50,
    })

    return NextResponse.json({ passengers })
  } catch (error) {
    console.error('Error fetching passengers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch passengers' },
      { status: 500 }
    )
  }
}

// POST /api/passengers - Create a new passenger
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const passenger = await prisma.passenger.create({
      data: {
        memberIdMasked: body.memberIdMasked,
        name: body.name,
        phone: body.phone,
        dateOfBirth: new Date(body.dateOfBirth),
        age: body.age,
        gender: body.gender,
        weight: body.weight,
        mobilityLevel: body.mobilityLevel,
        specialNeeds: body.specialNeeds || [],
        preferredLanguage: body.preferredLanguage,
        insuranceProvider: body.insuranceProvider,
        insuranceId: body.insuranceId,
        insuranceStatus: body.insuranceStatus || 'Active',
      },
    })

    return NextResponse.json({ passenger }, { status: 201 })
  } catch (error) {
    console.error('Error creating passenger:', error)
    return NextResponse.json(
      { error: 'Failed to create passenger' },
      { status: 500 }
    )
  }
}
