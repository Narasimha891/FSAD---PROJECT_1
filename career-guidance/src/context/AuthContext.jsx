import React, { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser, login as svcLogin, signup as svcSignup, adminSignup as svcAdminSignup, logout as svcLogout } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [authLoading, setAuthLoading] = useState(true)

    // Restore session on app load
    useEffect(() => {
        const saved = getCurrentUser()
        if (saved) {
            setUser(saved)
            setRole(saved.role)
        }
        setAuthLoading(false)
    }, [])

    const login = async (email, password) => {
        const { user: u, role: r } = await svcLogin(email, password)
        setUser(u)
        setRole(r)
        return { user: u, role: r }
    }

    /**
     * Like login() but throws if the authenticated user's role doesn't match allowedRole.
     * Used to enforce portal separation (student portal vs admin portal).
     */
    const loginAs = async (email, password, allowedRole) => {
        const { user: u, role: r } = await svcLogin(email, password)
        if (r !== allowedRole) {
            // Mismatch — logout and throw
            svcLogout()
            throw new Error(
                allowedRole === 'user'
                    ? 'Admin accounts must use the Admin Portal. Use the "Admin Login" link below.'
                    : 'This portal is for administrators only. Students should use the Student Portal.'
            )
        }
        setUser(u)
        setRole(r)
        return { user: u, role: r }
    }

    const signup = async (formData) => {
        const { user: u, role: r } = await svcSignup(formData)
        setUser(u)
        setRole(r)
        return { user: u, role: r }
    }

    const adminSignup = async (formData) => {
        const { user: u, role: r } = await svcAdminSignup(formData)
        setUser(u)
        setRole(r)
        return { user: u, role: r }
    }

    const logout = () => {
        svcLogout()
        setUser(null)
        setRole(null)
    }

    // Allow components to refresh user state from storage (e.g. after profile update)
    const refreshUser = () => {
        const saved = getCurrentUser()
        if (saved) {
            setUser(saved)
            setRole(saved.role)
        }
    }

    return (
        <AuthContext.Provider value={{ user, role, authLoading, login, loginAs, signup, adminSignup, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
    return ctx
}
