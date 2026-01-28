import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/dashboard/kpis - Get dashboard KPIs
export async function GET(request: NextRequest) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Trips today count
    const tripsToday = await prisma.trip.count({
      where: {
        scheduledWindowStart: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    // STAT discharge pending count
    const dischargePendingStat = await prisma.trip.count({
      where: {
        type: 'discharge',
        priority: 'STAT',
        status: {
          in: ['unassigned', 'assigned'],
        },
      },
    })

    // Calculate on-time rate for scheduled trips
    const completedTripsToday = await prisma.trip.findMany({
      where: {
        status: 'completed',
        scheduledWindowStart: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        pickupScheduledTime: true,
        pickupActualTime: true,
      },
    })

    let onTimeCount = 0
    completedTripsToday.forEach((trip) => {
      if (trip.pickupScheduledTime && trip.pickupActualTime) {
        const diff = trip.pickupActualTime.getTime() - trip.pickupScheduledTime.getTime()
        const minutesLate = diff / (1000 * 60)
        if (minutesLate <= 15) {
          onTimeCount++
        }
      }
    })

    const onTimeRateScheduled = completedTripsToday.length > 0
      ? Math.round((onTimeCount / completedTripsToday.length) * 100)
      : 0

    // Active drivers (not off_duty)
    const activeDrivers = await prisma.driver.count({
      where: {
        status: {
          not: 'off_duty',
        },
      },
    })

    // Available drivers
    const availableDrivers = await prisma.driver.count({
      where: {
        status: 'available',
      },
    })

    const kpis = {
      tripsToday,
      dischargePendingStat,
      onTimeRateScheduled,
      activeDrivers,
      availableDrivers,
    }

    return NextResponse.json({ kpis })
  } catch (error) {
    console.error('Error fetching KPIs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch KPIs' },
      { status: 500 }
    )
  }
}
