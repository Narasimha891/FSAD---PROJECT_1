import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Wraps a route and redirects to /login if:
 *  - Not logged in, OR
 *  - Logged in but wrong role (e.g. user tries to access /admin/*)
 * Passes ?returnTo= so login can redirect back after auth.
 */
export default function ProtectedRoute({ children, requiredRole }) {
    const { user, role, authLoading } = useAuth()
    const location = useLocation()

    if (authLoading) return null // avoid flash before session is restored

    if (!user) {
        const isAdminRoute = location.pathname.startsWith('/admin')
        const loginPath = isAdminRoute
            ? `/admin/login?returnTo=${encodeURIComponent(location.pathname)}`
            : `/login?returnTo=${encodeURIComponent(location.pathname)}`
        return <Navigate to={loginPath} replace />
    }

    if (requiredRole && role !== requiredRole) {
        // Wrong role — send to their own dashboard
        return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />
    }

    return children
}
