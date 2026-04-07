import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import '../styles/Auth.css'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { loginAs } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/user/dashboard'

  React.useEffect(() => {
    const remembered = localStorage.getItem('ew_remember_email')
    if (remembered) { setEmail(remembered); setRememberMe(true) }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields'); return }

    setLoading(true)
    try {
      const { user } = await loginAs(email, password, 'user')
      if (rememberMe) localStorage.setItem('ew_remember_email', email)
      else localStorage.removeItem('ew_remember_email')
      addToast(`Welcome back, ${user.name}! 👋`)
      navigate(returnTo, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="user-login-container">
      <div className="user-login-card">
        <h1>🎒 Attendee Login</h1>
        <p className="subtitle">Sign in to browse and attend webinars</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" disabled={loading} autoComplete="email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" disabled={loading} autoComplete="current-password" style={{ paddingRight: '3rem' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#888', padding: 0 }} tabIndex={-1}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <label className="user-remember">
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} /> Remember me
          </label>

          {error && <div className="alert alert-error">{error}</div>}
          <button type="submit" className="user-login-btn" disabled={loading}>{loading ? 'Signing in...' : 'Sign In →'}</button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <p style={{ color: '#888', fontSize: '1.05rem' }}>Don't have an account? <Link to="/signup" style={{ color: '#667eea', fontWeight: 700, textDecoration: 'none' }}>Create account</Link></p>
        </div>

        <div className="user-demo-info">
          <p><strong>🎯 Demo Account:</strong></p>
          <p>📧 <code>user@demo.com</code> / 🔑 <code>user123</code></p>
        </div>

        <div className="user-back-link"><Link to="/">← Back to Portal Selection</Link></div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ color: '#aaa', fontSize: '1rem' }}>Are you an admin? <Link to="/admin/login" style={{ color: '#764ba2', fontWeight: 600, textDecoration: 'none' }}>Admin Portal →</Link></p>
        </div>
      </div>
    </div>
  )
}
