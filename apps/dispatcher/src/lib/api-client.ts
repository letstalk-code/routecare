// Frontend API Client for RouteCare
// Provides typed methods for all API endpoints

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

// Helper function for API calls
async function apiCall(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(error.error || 'Request failed')
  }

  return res.json()
}

export const api = {
  // ==========================================================================
  // TRIPS
  // ==========================================================================
  trips: {
    /**
     * Get all trips with optional filters
     */
    getAll: async (filters?: {
      status?: string
      priority?: string
      driverId?: string
      date?: string
    }) => {
      const query = new URLSearchParams(
        Object.entries(filters || {}).filter(([_, v]) => v !== undefined) as [string, string][]
      ).toString()
      return apiCall(`/api/trips?${query}`)
    },

    /**
     * Get single trip by ID
     */
    getById: async (id: string) => {
      return apiCall(`/api/trips/${id}`)
    },

    /**
     * Create a new trip
     */
    create: async (data: any) => {
      return apiCall('/api/trips', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    /**
     * Update a trip
     */
    update: async (id: string, data: any) => {
      return apiCall(`/api/trips/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    /**
     * Cancel a trip (soft delete)
     */
    delete: async (id: string) => {
      return apiCall(`/api/trips/${id}`, {
        method: 'DELETE',
      })
    },

    /**
     * Assign a driver to a trip
     */
    assign: async (id: string, driverId: string) => {
      return apiCall(`/api/trips/${id}/assign`, {
        method: 'POST',
        body: JSON.stringify({ driverId }),
      })
    },

    /**
     * Unassign driver from a trip
     */
    unassign: async (id: string) => {
      return apiCall(`/api/trips/${id}/unassign`, {
        method: 'POST',
      })
    },

    /**
     * Get all events for a trip
     */
    getEvents: async (id: string) => {
      return apiCall(`/api/trips/${id}/events`)
    },

    /**
     * Create a trip event (status update)
     */
    createEvent: async (id: string, data: {
      type: string
      lat?: number
      lng?: number
      notes?: string
      createdBy?: string
    }) => {
      return apiCall(`/api/trips/${id}/events`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },

  // ==========================================================================
  // DRIVERS
  // ==========================================================================
  drivers: {
    /**
     * Get all drivers with optional filters
     */
    getAll: async (filters?: {
      status?: string
      zone?: string
    }) => {
      const query = new URLSearchParams(
        Object.entries(filters || {}).filter(([_, v]) => v !== undefined) as [string, string][]
      ).toString()
      return apiCall(`/api/drivers?${query}`)
    },

    /**
     * Get single driver by ID
     */
    getById: async (id: string) => {
      return apiCall(`/api/drivers/${id}`)
    },

    /**
     * Create a new driver
     */
    create: async (data: any) => {
      return apiCall('/api/drivers', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    /**
     * Update driver details
     */
    update: async (id: string, data: any) => {
      return apiCall(`/api/drivers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    /**
     * Update driver status
     */
    updateStatus: async (id: string, status: string) => {
      return apiCall(`/api/drivers/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })
    },

    /**
     * Record GPS ping for driver
     */
    recordGPS: async (id: string, data: {
      lat: number
      lng: number
      heading?: number
      speed?: number
    }) => {
      return apiCall(`/api/drivers/${id}/gps`, {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    /**
     * Get recent GPS pings for driver
     */
    getGPS: async (id: string, limit = 10) => {
      return apiCall(`/api/drivers/${id}/gps?limit=${limit}`)
    },
  },

  // ==========================================================================
  // DASHBOARD
  // ==========================================================================
  dashboard: {
    /**
     * Get dashboard KPIs
     */
    getKpis: async () => {
      return apiCall('/api/dashboard/kpis')
    },
  },

  // ==========================================================================
  // VEHICLES
  // ==========================================================================
  vehicles: {
    /**
     * Get all vehicles
     */
    getAll: async () => {
      return apiCall('/api/vehicles')
    },

    /**
     * Create a new vehicle
     */
    create: async (data: any) => {
      return apiCall('/api/vehicles', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },

  // ==========================================================================
  // PASSENGERS
  // ==========================================================================
  passengers: {
    /**
     * Get all passengers
     */
    getAll: async (search?: string) => {
      const query = search ? `?search=${encodeURIComponent(search)}` : ''
      return apiCall(`/api/passengers${query}`)
    },

    /**
     * Create a new passenger
     */
    create: async (data: any) => {
      return apiCall('/api/passengers', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },

  // ==========================================================================
  // CLAIMS
  // ==========================================================================
  claims: {
    /**
     * Get all claims
     */
    getAll: async (filters?: {
      status?: string
      tripId?: string
    }) => {
      const query = new URLSearchParams(
        Object.entries(filters || {}).filter(([_, v]) => v !== undefined) as [string, string][]
      ).toString()
      return apiCall(`/api/claims?${query}`)
    },

    /**
     * Create a new claim
     */
    create: async (data: any) => {
      return apiCall('/api/claims', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
  },
}
