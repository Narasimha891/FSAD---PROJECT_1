import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Auth.css'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function AdminSignUp() {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phone: '', organization: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const { adminSignup } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()

    const handleChange = (e) => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })) }

    const handleSubmit = async (e) => {
        e.preventDefault(); setError('')
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) { setError('Please fill in all required fields'); return }
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return }

        setLoading(true)
        try {
            await adminSignup(formData)
            addToast('Admin account created! Welcome aboard 🛡️')
            navigate('/admin/dashboard', { replace: true })
        } catch (err) { setError(err.message) } finally { setLoading(false) }
    }

    return (
        <div className="admin-login-container">
            <div className="admin-login-left">
                <span style={{ fontSize: '4.5rem' }}>🛡️</span>
                <h2>Join as Admin</h2>
                <p>Create your administrator account to manage webinars, registrations, and resources.</p>
                <div style={{ marginTop: '2.5rem', width: '100%', maxWidth: '280px' }}>
                    {[
                        { icon: '📅', text: 'Schedule & manage webinars' },
                        { icon: '📊', text: 'Registration analytics' },
                        { icon: '📁', text: 'Upload post-event resources' },
                        { icon: '👤', text: 'User account management' },
                    ].map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '1.05rem', marginBottom: '1rem', borderLeft: '3px solid rgba(245,158,11,0.4)', paddingLeft: '1rem' }}>
                            <span style={{ fontSize: '1.4rem' }}>{f.icon}</span><span>{f.text}</span>
                        </div>
                    ))}
                </div>
                <div className="admin-security-badge">🔒 Secure authenticated session · Role-verified access</div>
            </div>

            <div className="admin-login-right">
                <div className="admin-login-card">
                    <h1>🛡️ Admin Sign Up</h1>
                    <p className="subtitle" style={{ textAlign: 'center', marginBottom: '1.8rem', color: '#94a3b8' }}>Create your administrator account</p>

                    <form onSubmit={handleSubmit}>
                        <div className="admin-form-group"><label>Full Name *</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" disabled={loading} /></div>
                        <div className="admin-form-group"><label>Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@example.com" disabled={loading} /></div>
                        <div className="admin-form-group"><label>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" disabled={loading} /></div>
                        <div className="admin-form-group"><label>Organization</label><input type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Company / University" disabled={loading} /></div>
                        <div className="admin-form-group">
                            <label>Password *</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" disabled={loading} style={{ paddingRight: '3rem' }} />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#94a3b8', padding: 0 }} tabIndex={-1}>
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>
                        <div className="admin-form-group"><label>Confirm Password *</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" disabled={loading} /></div>

                        {error && <div className="admin-error">⚠️ {error}</div>}
                        <button type="submit" className="admin-login-btn" disabled={loading}>{loading ? 'Creating...' : '🛡️ Create Admin Account'}</button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                        <p style={{ color: '#64748b', fontSize: '1.05rem' }}>Already have an admin account? <Link to="/admin/login" style={{ color: '#f59e0b', fontWeight: 700, textDecoration: 'none' }}>Login here</Link></p>
                    </div>
                    <div className="admin-back-link">
                        <Link to="/">← Back to Portal Selection</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
