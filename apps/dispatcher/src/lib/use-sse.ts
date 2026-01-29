'use client'

import { useEffect, useRef, useState } from 'react'

interface SSEMessage {
  type: string
  timestamp: string
  data?: any
}

interface UseSSEOptions {
  url: string
  onMessage?: (data: SSEMessage) => void
  onError?: (error: Event) => void
  reconnectInterval?: number
  enabled?: boolean
}

export function useSSE({
  url,
  onMessage,
  onError,
  reconnectInterval = 3000,
  enabled = true,
}: UseSSEOptions) {
  const [connected, setConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled) {
      // Close existing connection if disabled
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
        setConnected(false)
      }
      return
    }

    const connect = () => {
      // Close existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }

      // Create new EventSource
      const eventSource = new EventSource(url)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        console.log('[SSE] Connected to', url)
        setConnected(true)
        setLastUpdate(new Date())

        // Clear any pending reconnect
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = null
        }
      }

      eventSource.onmessage = (event) => {
        try {
          const data: SSEMessage = JSON.parse(event.data)
          setLastUpdate(new Date())

          if (onMessage) {
            onMessage(data)
          }
        } catch (error) {
          console.error('[SSE] Error parsing message:', error)
        }
      }

      eventSource.onerror = (error) => {
        console.error('[SSE] Error:', error)
        setConnected(false)

        if (onError) {
          onError(error)
        }

        // Close the connection
        eventSource.close()

        // Attempt to reconnect after delay
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('[SSE] Attempting to reconnect...')
          connect()
        }, reconnectInterval)
      }
    }

    // Initial connection
    connect()

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }
    }
  }, [url, enabled, reconnectInterval, onMessage, onError])

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
      setConnected(false)
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
  }

  return {
    connected,
    lastUpdate,
    disconnect,
  }
}
