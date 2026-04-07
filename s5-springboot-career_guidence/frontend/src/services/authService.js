import api from './api'

const TOKEN_KEY = 'auth_token'
const SESSION_KEY = 'auth_user'

/**
 * Login via backend API.
 * POST /api/auth/login { email, password }
 * Response: { token, user: { id, name, email, role } }
 */
export async function login(email, password) {
    const response = await api.post('/api/auth/login', { email, password })
    const { token, user } = response.data

    // Persist token and user session
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))

    return { user, role: user.role }
}

/**
 * Register a new student user.
 * POST /api/auth/register { name, email, password, role: "user" }
 * Then auto-login to get a JWT token.
 */
export async function signup(formData) {
    // Register
    await api.post('/api/auth/register', {
        name: formData.fullName || formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user',
    })

    // Auto-login after registration
    return login(formData.email, formData.password)
}

/**
 * Register a new admin user.
 * POST /api/auth/register { name, email, password, role: "admin" }
 * Then auto-login to get a JWT token.
 */
export async function adminSignup(formData) {
    // Register
    await api.post('/api/auth/register', {
        name: formData.fullName || formData.name,
        email: formData.email,
        password: formData.password,
        role: 'admin',
    })

    // Auto-login after registration
    return login(formData.email, formData.password)
}

/**
 * Get the currently logged-in user from localStorage.
 */
export function getCurrentUser() {
    try {
        const item = localStorage.getItem(SESSION_KEY)
        return item ? JSON.parse(item) : null
    } catch {
        return null
    }
}

/**
 * Get the stored JWT token.
 */
export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}

/**
 * Logout — clear token and user session.
 */
export function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(SESSION_KEY)
}

/**
 * Change password — still client-side since backend has no endpoint.
 * This is a no-op placeholder for now.
 */
export async function changePassword(userId, oldPassword, newPassword) {
    throw new Error('Change password is not yet supported by the backend')
}

/**
 * Get all users — delegates to userService (admin only).
 * Kept here for backward compatibility with imports.
 */
export async function getAllUsers() {
    const response = await api.get('/api/users')
    return response.data
}
