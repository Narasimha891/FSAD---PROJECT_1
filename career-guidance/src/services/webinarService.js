import api from './api'

/**
 * Get all webinars from backend.
 * GET /api/webinars
 */
export async function getWebinars() {
    const response = await api.get('/api/webinars')
    return response.data
}

/**
 * Get upcoming webinars (filter by date on client side).
 */
export async function getUpcomingWebinars() {
    const all = await getWebinars()
    const now = new Date()
    return all.filter(w => {
        if (w.status === 'Upcoming') return true
        if (w.date) return new Date(w.date) >= now
        return false
    })
}

/**
 * Get completed webinars (filter by date on client side).
 */
export async function getCompletedWebinars() {
    const all = await getWebinars()
    const now = new Date()
    return all.filter(w => {
        if (w.status === 'Completed') return true
        if (w.date) return new Date(w.date) < now
        return false
    })
}

/**
 * Get a single webinar by ID.
 * GET /api/webinars/{id}
 */
export async function getWebinarById(id) {
    try {
        const response = await api.get(`/api/webinars/${id}`)
        return response.data
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null
        }
        throw error
    }
}

/**
 * Create a new webinar (admin only).
 * POST /api/webinars
 */
export async function addWebinar(data) {
    const response = await api.post('/api/webinars', {
        title: data.title,
        category: data.category,
        description: data.description,
        speaker: data.speaker,
        date: data.date,
        imagePath: data.imagePath || data.image || null,
    })
    return response.data
}

/**
 * Update a webinar (admin only).
 * PUT /api/webinars/{id}
 */
export async function updateWebinar(id, data) {
    const response = await api.put(`/api/webinars/${id}`, {
        title: data.title,
        category: data.category,
        description: data.description,
        speaker: data.speaker,
        date: data.date,
        imagePath: data.imagePath || data.image || null,
    })
    return response.data
}

/**
 * Delete a webinar (admin only).
 * DELETE /api/webinars/{id}
 */
export async function deleteWebinar(id) {
    await api.delete(`/api/webinars/${id}`)
}
