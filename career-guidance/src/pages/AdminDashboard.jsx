import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'
import { useToast } from '../context/ToastContext'
import { getWebinars } from '../services/webinarService'
import { getRegistrations } from '../services/registrationService'
import { getResources } from '../services/resourceService'
import { getAllUsers } from '../services/authService'
import { getFeedback } from '../services/feedbackService'
import { getAnnouncements } from '../services/announcementService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminDashboard() {
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [recentRegs, setRecentRegs] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [typeData, setTypeData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [webinars, regs, resources, users] = await Promise.all([getWebinars(), getRegistrations(), getResources(), getAllUsers()])
        const feedback = getFeedback()
        const announcements = getAnnouncements()

        setStats({
          totalWebinars: webinars.length,
          upcomingWebinars: webinars.filter(w => w.status === 'Upcoming').length,
          completedWebinars: webinars.filter(w => w.status === 'Completed').length,
          totalRegistrations: regs.filter(r => r.status !== 'Cancelled').length,
          totalResources: resources.length,
          totalUsers: users.length,
          totalFeedback: feedback.length,
          avgRating: feedback.length > 0 ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1) : 'N/A',
          totalAnnouncements: announcements.length,
          attendedCount: regs.filter(r => r.status === 'Attended').length
        })

        // Category breakdown for chart
        const catMap = {}
        webinars.forEach(w => { catMap[w.category] = (catMap[w.category] || 0) + 1 })
        setCategoryData(Object.entries(catMap).sort((a, b) => b[1] - a[1]))

        // Type breakdown
        const typeMap = {}
        webinars.forEach(w => { typeMap[w.type] = (typeMap[w.type] || 0) + 1 })
        setTypeData(Object.entries(typeMap))

        const sorted = [...regs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setRecentRegs(sorted.slice(0, 5))
      } catch { addToast('Failed to load data', 'error') } finally { setLoading(false) }
    }
    load()
  }, [])

  if (loading || !stats) return <LoadingSpinner />

  const maxCat = Math.max(...categoryData.map(([, v]) => v), 1)
  const chartColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444']

  return (
    <div className="page-container">
      <h1>🎓 Admin Dashboard</h1>
      <p className="subtitle">Manage the EduWebinar platform</p>

      <section className="section">
        <h2>Quick Actions</h2>
        <div className="button-group">
          <button className="btn btn-primary" onClick={() => navigate('/admin/webinars')}>📅 Manage Webinars</button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/registrations')}>📋 Registrations</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/resources')}>📁 Resources</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/users')}>👤 Users</button>
          <button className="btn btn-secondary" onClick={() => navigate('/admin/announcements')}>📢 Announcements</button>
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-card"><h3>📅 Total Events</h3><div className="dashboard-card-value">{stats.totalWebinars}</div><p>Webinars & workshops</p></div>
        <div className="dashboard-card"><h3>🟢 Upcoming</h3><div className="dashboard-card-value">{stats.upcomingWebinars}</div><p>Scheduled events</p></div>
        <div className="dashboard-card"><h3>✅ Completed</h3><div className="dashboard-card-value">{stats.completedWebinars}</div><p>Past events</p></div>
        <div className="dashboard-card"><h3>📋 Registrations</h3><div className="dashboard-card-value">{stats.totalRegistrations}</div><p>Active registrations</p></div>
        <div className="dashboard-card"><h3>👤 Users</h3><div className="dashboard-card-value">{stats.totalUsers}</div><p>Registered accounts</p></div>
        <div className="dashboard-card"><h3>📁 Resources</h3><div className="dashboard-card-value">{stats.totalResources}</div><p>Post-event materials</p></div>
        <div className="dashboard-card"><h3>⭐ Avg Rating</h3><div className="dashboard-card-value">{stats.avgRating}</div><p>{stats.totalFeedback} reviews total</p></div>
        <div className="dashboard-card"><h3>🎯 Attended</h3><div className="dashboard-card-value">{stats.attendedCount}</div><p>Sessions completed</p></div>
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <section className="section">
          <h2>📊 Events by Category</h2>
          {categoryData.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No data</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {categoryData.map(([cat, count], i) => (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 600 }}>{cat}</span>
                    <span style={{ fontWeight: 700, color: chartColors[i % chartColors.length] }}>{count}</span>
                  </div>
                  <div style={{ background: 'var(--bg-dark)', borderRadius: '10px', height: '18px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${(count / maxCat) * 100}%`,
                      height: '100%',
                      background: `linear-gradient(135deg, ${chartColors[i % chartColors.length]}, ${chartColors[(i + 1) % chartColors.length]})`,
                      borderRadius: '10px',
                      transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="section">
          <h2>📈 Event Types Distribution</h2>
          {typeData.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No data</p> : (
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              {typeData.map(([type, count], i) => {
                const total = typeData.reduce((s, [, v]) => s + v, 0)
                const pct = Math.round((count / total) * 100)
                return (
                  <div key={type} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '120px', height: '120px', borderRadius: '50%',
                      background: `conic-gradient(${chartColors[i % chartColors.length]} ${pct}%, var(--bg-dark) ${pct}%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 0.75rem'
                    }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.3rem', color: chartColors[i % chartColors.length] }}>
                        {pct}%
                      </div>
                    </div>
                    <strong style={{ fontSize: '1.1rem' }}>{type}</strong>
                    <p style={{ color: 'var(--text-muted)' }}>{count} events</p>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      <section className="section">
        <h2>📋 Recent Registrations</h2>
        {recentRegs.length === 0 ? <div className="card"><p>No registrations yet.</p></div> : (
          <div className="table-responsive">
            <table className="table">
              <thead><tr><th>User</th><th>Event</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recentRegs.map(r => (
                  <tr key={r.id}>
                    <td>{r.userName} <br /><small style={{ color: '#888' }}>{r.userEmail}</small></td>
                    <td><strong>{r.webinarTitle}</strong></td>
                    <td>{r.webinarType}</td>
                    <td><span className={`status ${r.status === 'Registered' ? 'status-confirmed' : r.status === 'Attended' ? 'status-completed' : 'status-cancelled'}`}>{r.status}</span></td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="section">
        <h2>⚙️ Management</h2>
        <div className="grid">
          <div className="card"><h3>📅 Webinar Management</h3><p>Schedule new webinars, edit existing events, and manage event status.</p><button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => navigate('/admin/webinars')}>Manage Webinars</button></div>
          <div className="card"><h3>📁 Post-Event Resources</h3><p>Upload slides, recordings, code samples, and other materials.</p><button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => navigate('/admin/resources')}>Manage Resources</button></div>
          <div className="card"><h3>👤 User Accounts</h3><p>View and manage registered attendee accounts.</p><button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => navigate('/admin/users')}>Manage Users</button></div>
          <div className="card"><h3>📢 Announcements</h3><p>Publish announcements and communicate with all students.</p><button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => navigate('/admin/announcements')}>Manage Announcements</button></div>
        </div>
      </section>
    </div>
  )
}
