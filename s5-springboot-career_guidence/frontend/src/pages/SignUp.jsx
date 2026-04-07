import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Auth.css'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function SignUp() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phone: '', organization: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signup } = useAuth()
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
      await signup(formData)
      addToast('Account created! Welcome aboard 🎉')
      navigate('/user/dashboard', { replace: true })
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <div className="user-login-container">
      <div className="user-login-card">
        <h1>🎓 Create Account</h1>
        <p className="subtitle">Join EduWebinar to access webinars & workshops</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group"><label>Full Name *</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" disabled={loading} /></div>
          <div className="form-group"><label>Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" disabled={loading} /></div>
          <div className="form-group"><label>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" disabled={loading} /></div>
          <div className="form-group"><label>Organization</label><input type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Company / University" disabled={loading} /></div>
          <div className="form-group"><label>Password *</label><input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" disabled={loading} /></div>
          <div className="form-group"><label>Confirm Password *</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" disabled={loading} /></div>
          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" className="user-login-btn" disabled={loading}>{loading ? 'Creating...' : 'Create Account →'}</button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <p style={{ color: '#888', fontSize: '1.05rem' }}>Already have an account? <Link to="/login" style={{ color: '#667eea', fontWeight: 700, textDecoration: 'none' }}>Login here</Link></p>
        </div>
        <div className="user-back-link"><Link to="/">← Back to Portal Selection</Link></div>
      </div>
    </div>
  )
}
