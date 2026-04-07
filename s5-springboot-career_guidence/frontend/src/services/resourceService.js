import api from './api'

/**
 * Get all resources.
 * GET /api/resources
 */
export async function getResources() {
    const response = await api.get('/api/resources')
    return response.data
}

/**
 * Get resources filtered by category (client-side filter).
 * Backend has GET /api/resources/category/{category} but we can also filter locally.
 */
export async function getResourcesByCategory(category) {
    const response = await api.get(`/api/resources/category/${category}`)
    return response.data
}

/**
 * Get resources for a specific webinar (client-side filter).
 * The backend doesn't have a webinar-based filter, so we filter locally.
 */
export async function getResourcesByWebinar(webinarId) {
    const all = await getResources()
    return all.filter(r => String(r.webinarId) === String(webinarId))
}

/**
 * Add a new resource (admin only).
 * POST /api/resources
 */
export async function addResource(data) {
    const response = await api.post('/api/resources', {
        title: data.title,
        category: data.category,
        description: data.description,
        url: data.url || data.fileUrl || '',
        type: data.type,
    })
    return response.data
}

/**
 * Update a resource (admin only).
 * PUT /api/resources/{id}
 */
export async function updateResource(id, data) {
    const response = await api.put(`/api/resources/${id}`, {
        title: data.title,
        category: data.category,
        description: data.description,
        url: data.url || data.fileUrl || '',
        type: data.type,
    })
    return response.data
}

/**
 * Delete a resource (admin only).
 * DELETE /api/resources/{id}
 */
export async function deleteResource(id) {
    await api.delete(`/api/resources/${id}`)
}

/**
 * Search resources by keyword.
 * GET /api/resources/search?keyword=...
 */
export async function searchResources(keyword) {
    const response = await api.get('/api/resources/search', {
        params: { keyword },
    })
    return response.data
}
