import api from './api'

const SESSION_KEY = 'auth_user'

/**
 * Get all users (admin only).
 * GET /api/users
 */
export async function getAllUsers() {
    const response = await api.get('/api/users')
    return response.data
}

/**
 * Get current user's profile from localStorage session.
 * No backend endpoint for single user profile — read from session.
 */
export async function getProfile(userId) {
    const session = localStorage.getItem(SESSION_KEY)
    if (session) {
        const user = JSON.parse(session)
        if (String(user.id) === String(userId)) {
            return user
        }
    }
    throw new Error('User not found')
}

/**
 * Update user profile.
 * No backend PUT /api/users/:id endpoint — update localStorage session only.
 */
export async function updateProfile(userId, data) {
    const session = localStorage.getItem(SESSION_KEY)
    if (!session) throw new Error('User not found')

    const user = JSON.parse(session)
    if (String(user.id) !== String(userId)) throw new Error('User not found')

    // Merge allowed fields (don't allow role or password changes)
    const { password, role, id, ...allowed } = data
    const updated = { ...user, ...allowed }

    localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
    return updated
}
