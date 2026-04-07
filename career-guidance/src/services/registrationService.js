import api from './api'

/**
 * Get all registrations (admin view).
 * GET /api/registrations
 */
export async function getRegistrations() {
    const response = await api.get('/api/registrations')
    return response.data
}

/**
 * Get registrations for a specific user.
 * GET /api/registrations/user/{userId}
 */
export async function getUserRegistrations(userId) {
    const response = await api.get(`/api/registrations/user/${userId}`)
    return response.data
}

/**
 * Get registrations for a specific webinar.
 * GET /api/registrations/webinar/{webinarId}
 */
export async function getWebinarRegistrations(webinarId) {
    const response = await api.get(`/api/registrations/webinar/${webinarId}`)
    return response.data
}

/**
 * Register a user for a webinar.
 * POST /api/registrations { userId, webinarId }
 *
 * Note: The backend only needs userId and webinarId.
 * Extra parameters (userName, userEmail, webinar) are accepted for
 * backward compatibility with existing page components but not sent to backend.
 */
export async function registerForWebinar(userId, userName, userEmail, webinar) {
    const webinarId = webinar?.id || webinar
    const response = await api.post('/api/registrations', {
        userId: userId,
        webinarId: webinarId,
    })
    return response.data
}

/**
 * Cancel (delete) a registration.
 * DELETE /api/registrations/{id}
 */
export async function cancelRegistration(id) {
    await api.delete(`/api/registrations/${id}`)
    return { id, status: 'Cancelled' }
}

/**
 * Check if a user is already registered for a webinar.
 * Uses getUserRegistrations and filters client-side.
 */
export async function isUserRegistered(userId, webinarId) {
    try {
        const regs = await getUserRegistrations(userId)
        const reg = regs.find(r =>
            String(r.webinarId) === String(webinarId)
        )
        return reg || null
    } catch {
        return null
    }
}

/**
 * Mark registration as attended.
 * No backend endpoint — kept as no-op for backward compatibility.
 */
export async function markAttended(id) {
    console.warn('markAttended: No backend endpoint available')
    return { id, status: 'Attended', attendedAt: new Date().toISOString() }
}
