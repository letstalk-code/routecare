import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const last7Days = new Date(today)
    last7Days.setDate(last7Days.getDate() - 7)

    // Trips by day (last 7 days)
    const tripsByDay = await prisma.$queryRaw<Array<{ date: Date; count: bigint }>>`
      SELECT DATE(created_at) as date, COUNT(*)::int as count
      FROM trips
      WHERE created_at >= ${last7Days}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    // Trips by type
    const tripsByType = await prisma.trip.groupBy({
      by: ['type'],
      _count: true,
    })

    // Driver performance
    const drivers = await prisma.driver.findMany({
      select: {
        id: true,
        name: true,
        tripsToday: true,
        onTimeRate: true,
        totalMiles: true,
      },
      take: 10,
    })

    return NextResponse.json({
      tripsByDay: tripsByDay.map(d => ({ date: d.date, count: Number(d.count) })),
      tripsByType: tripsByType.map(t => ({ type: t.type, count: t._count })),
      topDrivers: drivers,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
