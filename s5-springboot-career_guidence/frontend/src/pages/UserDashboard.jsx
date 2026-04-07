import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'
import { useAuth } from '../context/AuthContext'
import { getUserRegistrations } from '../services/registrationService'
import { getUpcomingWebinars } from '../services/webinarService'
import { getRecommendations } from '../services/recommendationService'
import { getBookmarks } from '../services/bookmarkService'
import { getAnnouncements } from '../services/announcementService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function UserDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [registrations, setRegistrations] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const [regs, events] = await Promise.all([getUserRegistrations(user.id), getUpcomingWebinars()])
        setRegistrations(regs.filter(r => r.status !== 'Cancelled'))
        setUpcoming(events)
        setRecommendations(getRecommendations(user.id, 3))
        setBookmarks(getBookmarks(user.id))
        setAnnouncements(getAnnouncements().slice(0, 2))
        setError(null)
      } catch (e) {
        console.error(e)
        if (e.code === 'ERR_NETWORK' || e.message === 'Network Error') {
          setError('Unable to connect to the server. Please make sure the backend is running on port 8080.')
        } else {
          setError('Something went wrong while loading your dashboard. Please try again.')
        }
      } finally { setLoading(false) }
    }
    if (user) load()
  }, [user])

  const activeRegs = registrations.filter(r => r.status === 'Registered')
  const attended = registrations.filter(r => r.status === 'Attended')

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-container">
      <h1>👋 Welcome, {user?.name}!</h1>
      <p className="subtitle">Your Webinar & Workshop Dashboard</p>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderLeft: '5px solid #ef4444', borderRadius: '8px', padding: '1rem 1.5rem', marginBottom: '1.5rem', color: '#991b1b' }}>
          <strong>⚠️ Connection Error:</strong> {error}
          <button className="btn btn-small" style={{ marginLeft: '1rem' }} onClick={() => { setLoading(true); setError(null); window.location.reload() }}>Retry</button>
        </div>
      )}

      {/* Announcements Banner */}
      {announcements.length > 0 && (
        <section className="section" style={{ borderLeft: '5px solid #3b82f6', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ border: 'none', padding: 0, margin: 0 }}>📢 Latest Announcements</h2>
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={() => navigate('/user/announcements')}>View All →</button>
          </div>
          {announcements.map(ann => (
            <div key={ann.id} style={{ marginTop: '0.75rem', padding: '0.5rem 0', borderTop: '1px solid rgba(59,130,246,0.15)' }}>
              <strong>{ann.title}</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>{ann.content.slice(0, 120)}{ann.content.length > 120 ? '...' : ''}</p>
            </div>
          ))}
        </section>
      )}

      <section className="section">
        <h2>Quick Actions</h2>
        <div className="button-group">
          <button className="btn btn-primary" onClick={() => navigate('/user/webinars')}>📅 Browse Webinars</button>
          <button className="btn btn-primary" onClick={() => navigate('/user/registrations')}>📋 My Registrations</button>
          <button className="btn btn-secondary" onClick={() => navigate('/user/calendar')}>📅 Calendar</button>
          <button className="btn btn-secondary" onClick={() => navigate('/user/saved')}>🔖 Saved ({bookmarks.length})</button>
          <button className="btn btn-secondary" onClick={() => navigate('/user/progress')}>📈 Progress</button>
          <button className="btn btn-secondary" onClick={() => navigate('/user/certificates')}>🎓 Certificates</button>
          <button className="btn btn-secondary" onClick={() => navigate('/user/resources')}>📁 Resources</button>
          <button className="btn btn-secondary" onClick={() => navigate('/user/profile')}>👤 My Profile</button>
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>📅 Upcoming Registrations</h3>
          <div className="dashboard-card-value">{activeRegs.length}</div>
          <p>Events you're registered for</p>
          <button className="btn btn-small" onClick={() => navigate('/user/registrations')}>View →</button>
        </div>
        <div className="dashboard-card">
          <h3>✅ Events Attended</h3>
          <div className="dashboard-card-value">{attended.length}</div>
          <p>Sessions completed</p>
        </div>
        <div className="dashboard-card">
          <h3>🌐 Available Webinars</h3>
          <div className="dashboard-card-value">{upcoming.length}</div>
          <p>Upcoming events to join</p>
          <button className="btn btn-small" onClick={() => navigate('/user/webinars')}>Browse →</button>
        </div>
        <div className="dashboard-card">
          <h3>🔖 Saved Events</h3>
          <div className="dashboard-card-value">{bookmarks.length}</div>
          <p>Bookmarked webinars</p>
          <button className="btn btn-small" onClick={() => navigate('/user/saved')}>View →</button>
        </div>
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <section className="section">
          <h2>🤖 Recommended for You</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', marginTop: '-0.5rem' }}>Based on your interests and activity</p>
          <div className="grid">
            {recommendations.map(w => (
              <div key={w.id} className="card" style={{ borderLeft: '5px solid var(--accent)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{w.image}</div>
                <h3>{w.title}</h3>
                <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{w.type} · {w.category}</p>
                <p>🗓 {w.date} at {w.time} · ⏱ {w.duration}</p>
                <p>👤 {w.speaker}</p>
                <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => navigate('/user/webinars')}>View Details →</button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2>📋 Your Upcoming Events</h2>
        {activeRegs.length === 0 ? (
          <div className="card"><p>No upcoming registrations. <button className="btn btn-small" onClick={() => navigate('/user/webinars')}>Browse webinars →</button></p></div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead><tr><th>Event</th><th>Type</th><th>Speaker</th><th>Date & Time</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {activeRegs.slice(0, 5).map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.webinarTitle}</strong></td>
                    <td>{r.webinarType}</td>
                    <td>{r.speaker}</td>
                    <td>{r.webinarDate} at {r.webinarTime}</td>
                    <td><span className="status status-confirmed">{r.status}</span></td>
                    <td><button className="btn btn-small" onClick={() => navigate('/user/live/' + r.webinarId)}>Join →</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="section">
        <h2>⭐ Featured Upcoming Webinars</h2>
        {upcoming.length === 0 ? (
          <div className="card"><p>No upcoming webinars at this time.</p></div>
        ) : (
          <div className="grid">
            {upcoming.slice(0, 3).map(w => (
              <div key={w.id} className="card">
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{w.image}</div>
                <h3>{w.title}</h3>
                <p style={{ color: '#667eea', fontWeight: 'bold' }}>{w.type} · {w.category}</p>
                <p>🗓 {w.date} at {w.time} · ⏱ {w.duration}</p>
                <p>👤 {w.speaker}</p>
                <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => navigate('/user/webinars')}>View Details →</button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
