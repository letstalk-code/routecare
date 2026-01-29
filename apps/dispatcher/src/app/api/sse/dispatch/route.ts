import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/sse/dispatch - Server-Sent Events for real-time dispatch updates
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`)
      )

      // Function to send updates
      const sendUpdate = async () => {
        try {
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          // Fetch latest trips and drivers with optimized queries
          const [trips, drivers, tripsToday, dischargePending, activeDrivers, availableDrivers] = await Promise.all([
            prisma.trip.findMany({
              where: {
                OR: [
                  { status: { in: ['unassigned', 'assigned', 'on_trip'] } },
                  { createdAt: { gte: today } },
                ],
              },
              include: {
                passenger: {
                  select: {
                    id: true,
                    name: true,
                    memberIdMasked: true,
                    mobilityLevel: true,
                    specialNeeds: true,
                  },
                },
                driver: {
                  select: {
                    id: true,
                    name: true,
                    initials: true,
                  },
                },
              },
              orderBy: { createdAt: 'desc' },
              take: 50,
            }),
            prisma.driver.findMany({
              select: {
                id: true,
                name: true,
                initials: true,
                status: true,
                gpsPings: true,
                tripsToday: true,
                onTimeRate: true,
              },
              orderBy: { name: 'asc' },
            }),
            prisma.trip.count({
              where: { createdAt: { gte: today } },
            }),
            prisma.trip.count({
              where: {
                type: 'discharge',
                status: { in: ['unassigned', 'assigned'] },
              },
            }),
            prisma.driver.count({
              where: { status: { in: ['available', 'on_trip'] } },
            }),
            prisma.driver.count({
              where: { status: 'available' },
            }),
          ])

          // Use pre-calculated on-time rate from driver stats
          const avgOnTimeRate = drivers.length > 0
            ? Math.round(drivers.reduce((sum, d) => sum + d.onTimeRate, 0) / drivers.length)
            : 0

          const kpis = {
            tripsToday,
            dischargePendingStat: dischargePending,
            onTimeRateScheduled: avgOnTimeRate,
            activeDrivers,
            availableDrivers,
          }

          // Send update event
          const updateData = {
            type: 'update',
            timestamp: new Date().toISOString(),
            data: {
              trips,
              drivers,
              kpis,
            },
          }

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(updateData)}\n\n`)
          )
        } catch (error) {
          console.error('Error sending SSE update:', error)
        }
      }

      // Send initial data immediately
      await sendUpdate()

      // Set up interval to send updates every 5 seconds
      const interval = setInterval(sendUpdate, 5000)

      // Clean up on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  // Return SSE response with proper headers
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering in nginx
    },
  })
}
