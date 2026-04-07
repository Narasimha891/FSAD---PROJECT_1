import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Auth.css'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const ADMIN_FEATURES = [
    { icon: '📅', text: 'Schedule & manage webinars' },
    { icon: '📊', text: 'Registration analytics' },
    { icon: '📁', text: 'Upload post-event resources' },
    { icon: '👤', text: 'User account management' },
]

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const { loginAs } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()

    React.useEffect(() => {
        const remembered = localStorage.getItem('ew_remember_admin_email')
        if (remembered) { setEmail(remembered); setRememberMe(true) }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!email || !password) { setError('Please fill in all credentials'); return }

        setLoading(true)
        try {
            const { user } = await loginAs(email, password, 'admin')
            if (rememberMe) localStorage.setItem('ew_remember_admin_email', email)
            else localStorage.removeItem('ew_remember_admin_email')
            addToast(`Admin access granted. Welcome, ${user.name}! 🛡️`)
            navigate('/admin/dashboard', { replace: true })
        } catch (err) {
            setError(err.message)
        } finally { setLoading(false) }
    }

    return (
        <div className="admin-login-container">
            <div className="admin-login-left">
                <span style={{ fontSize: '4.5rem' }}>🛡️</span>
                <h2>Admin Control Centre</h2>
                <p>Manage webinars, registrations, and post‑event resources for the EduWebinar platform.</p>
                <div style={{ marginTop: '2.5rem', width: '100%', maxWidth: '280px' }}>
                    {ADMIN_FEATURES.map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '1.05rem', marginBottom: '1rem', borderLeft: '3px solid rgba(245,158,11,0.4)', paddingLeft: '1rem' }}>
                            <span style={{ fontSize: '1.4rem' }}>{f.icon}</span><span>{f.text}</span>
                        </div>
                    ))}
                </div>
                <div className="admin-security-badge">🔒 Secure authenticated session · Role-verified access</div>
            </div>

            <div className="admin-login-right">
                <div className="admin-login-card">
                    <h1>Admin Login</h1>
                    <p className="subtitle" style={{ textAlign: 'center', marginBottom: '1.8rem', color: '#94a3b8' }}>Enter your administrator credentials</p>

                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group">
                            <label>Admin Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@platform.com" disabled={loading} autoComplete="email" />
                        </div>
                        <div className="admin-form-group">
                            <label>Password</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter admin password" disabled={loading} autoComplete="current-password" style={{ paddingRight: '3rem' }} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#94a3b8', padding: 0 }} tabIndex={-1}>
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <label className="admin-remember">
                            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} /> Remember me
                        </label>

                        {error && <div className="admin-error">⚠️ {error}</div>}
                        <button type="submit" className="admin-login-btn" disabled={loading}>{loading ? 'Verifying...' : '🔓 Access Admin Panel'}</button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                        <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Don't have an admin account? <Link to="/admin/signup" style={{ color: '#f59e0b', fontWeight: 700, textDecoration: 'none' }}>Sign up here</Link></p>
                    </div>

                    <div style={{ marginTop: '1.5rem', padding: '0.85rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '1rem', color: '#92400e' }}>
                        <p style={{ margin: '0 0 0.3rem', fontWeight: 600 }}>🔑 Demo Admin</p>
                        <p style={{ margin: '0.2rem 0' }}>Email: <code style={{ color: '#d97706' }}>admin@demo.com</code> / Password: <code style={{ color: '#d97706' }}>admin123</code></p>
                    </div>

                    <div className="admin-back-link">
                        <Link to="/">← Back to Portal Selection</Link>
                        <span style={{ color: '#cbd5e1', margin: '0 0.5rem' }}>·</span>
                        <Link to="/login" style={{ color: '#6366f1', fontSize: '1.05rem', textDecoration: 'none' }}>Attendee Portal</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
