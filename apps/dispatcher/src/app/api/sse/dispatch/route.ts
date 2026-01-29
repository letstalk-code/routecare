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
          // Fetch latest trips and drivers
          const [trips, drivers, kpis] = await Promise.all([
            prisma.trip.findMany({
              include: {
                passenger: true,
                driver: true,
                vehicle: true,
              },
              orderBy: { createdAt: 'desc' },
              take: 100, // Limit to recent trips
            }),
            prisma.driver.findMany({
              include: {
                vehicle: true,
              },
              orderBy: { name: 'asc' },
            }),
            // Calculate KPIs
            Promise.resolve().then(async () => {
              const today = new Date()
              today.setHours(0, 0, 0, 0)

              const [
                tripsToday,
                dischargePending,
                scheduledTrips,
                activeDrivers,
                availableDrivers,
              ] = await Promise.all([
                prisma.trip.count({
                  where: { createdAt: { gte: today } },
                }),
                prisma.trip.count({
                  where: {
                    type: 'discharge',
                    status: { in: ['unassigned', 'assigned'] },
                  },
                }),
                prisma.trip.findMany({
                  where: {
                    priority: 'scheduled',
                    status: 'completed',
                    dropoffActualTime: { not: null },
                  },
                  select: {
                    scheduledWindowStart: true,
                    dropoffActualTime: true,
                  },
                }),
                prisma.driver.count({
                  where: { status: { in: ['available', 'on_trip'] } },
                }),
                prisma.driver.count({
                  where: { status: 'available' },
                }),
              ])

              // Calculate on-time rate
              const onTimeTrips = scheduledTrips.filter(
                (trip) =>
                  trip.dropoffActualTime &&
                  trip.dropoffActualTime <= trip.scheduledWindowStart
              )
              const onTimeRate =
                scheduledTrips.length > 0
                  ? (onTimeTrips.length / scheduledTrips.length) * 100
                  : 0

              return {
                tripsToday,
                dischargePendingStat: dischargePending,
                onTimeRateScheduled: Math.round(onTimeRate),
                activeDrivers,
                availableDrivers,
              }
            }),
          ])

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
