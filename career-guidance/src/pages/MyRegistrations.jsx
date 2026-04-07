import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getUserRegistrations, cancelRegistration } from '../services/registrationService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function MyRegistrations() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('active')

    useEffect(() => {
        getUserRegistrations(user.id).then(setRegistrations).finally(() => setLoading(false))
    }, [user])

    const handleCancel = async (id) => {
        try {
            await cancelRegistration(id)
            setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelled' } : r))
            addToast('Registration cancelled.')
        } catch { addToast('Failed to cancel.', 'error') }
    }

    if (loading) return <LoadingSpinner />

    const active = registrations.filter(r => r.status === 'Registered')
    const attended = registrations.filter(r => r.status === 'Attended')
    const cancelled = registrations.filter(r => r.status === 'Cancelled')
    const current = tab === 'active' ? active : tab === 'attended' ? attended : cancelled

    return (
        <div className="page-container">
            <h1>📋 My Registrations</h1>
            <p className="subtitle">Manage your webinar and workshop registrations</p>

            <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="dashboard-card"><h3>📅 Active</h3><div className="dashboard-card-value">{active.length}</div><p>Upcoming events</p></div>
                <div className="dashboard-card"><h3>✅ Attended</h3><div className="dashboard-card-value">{attended.length}</div><p>Events completed</p></div>
                <div className="dashboard-card"><h3>❌ Cancelled</h3><div className="dashboard-card-value">{cancelled.length}</div><p>Cancelled registrations</p></div>
            </div>

            <section className="section">
                <div className="button-group" style={{ marginBottom: '1rem' }}>
                    <button className={`btn ${tab === 'active' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('active')}>Active ({active.length})</button>
                    <button className={`btn ${tab === 'attended' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('attended')}>Attended ({attended.length})</button>
                    <button className={`btn ${tab === 'cancelled' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('cancelled')}>Cancelled ({cancelled.length})</button>
                </div>

                {current.length === 0 ? (
                    <div className="card">
                        <p>{tab === 'active' ? 'No upcoming registrations.' : tab === 'attended' ? 'No attended events yet.' : 'No cancelled registrations.'}</p>
                        {tab === 'active' && <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={() => navigate('/user/webinars')}>Browse Webinars →</button>}
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table">
                            <thead><tr><th>Event</th><th>Type</th><th>Speaker</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {current.map(r => (
                                    <tr key={r.id}>
                                        <td><strong>{r.webinarTitle}</strong></td>
                                        <td>{r.webinarType}</td>
                                        <td>{r.speaker}</td>
                                        <td>{r.webinarDate} at {r.webinarTime}</td>
                                        <td><span className={`status ${r.status === 'Registered' ? 'status-confirmed' : r.status === 'Attended' ? 'status-completed' : 'status-cancelled'}`}>{r.status}</span></td>
                                        <td>
                                            {r.status === 'Registered' && (
                                                <div className="button-group" style={{ gap: '0.4rem' }}>
                                                    <button className="btn btn-small" onClick={() => navigate('/user/live/' + r.webinarId)}>Join →</button>
                                                    <button className="btn btn-danger" style={{ fontSize: '0.95rem', padding: '0.3rem 0.6rem' }} onClick={() => handleCancel(r.id)}>Cancel</button>
                                                </div>
                                            )}
                                            {r.status === 'Attended' && <button className="btn btn-small" onClick={() => navigate('/user/resources')}>Resources →</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <div style={{ marginTop: '1rem' }}>
                <button className="btn btn-primary" onClick={() => navigate('/user/webinars')}>📅 Browse More Webinars</button>
            </div>
        </div>
    )
}
