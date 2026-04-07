import React, { useState, useEffect } from 'react'
import '../styles/Dashboard.css'
import { useToast } from '../context/ToastContext'
import { getRegistrations, cancelRegistration, markAttended } from '../services/registrationService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminRegistrations() {
    const { addToast } = useToast()
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')

    useEffect(() => { getRegistrations().then(setRegistrations).finally(() => setLoading(false)) }, [])

    const statuses = ['All', 'Registered', 'Attended', 'Cancelled']

    const filtered = registrations.filter(r => {
        const matchStatus = statusFilter === 'All' || r.status === statusFilter
        const q = search.toLowerCase()
        const matchSearch = !search ||
            (r.userName || '').toLowerCase().includes(q) ||
            (r.userEmail || '').toLowerCase().includes(q) ||
            (r.webinarTitle || '').toLowerCase().includes(q)
        return matchStatus && matchSearch
    })

    const handleCancel = async (id) => {
        await cancelRegistration(id)
        setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'Cancelled' } : r))
        addToast('Registration cancelled.')
    }

    const handleMarkAttended = async (id) => {
        await markAttended(id)
        setRegistrations(prev => prev.map(r => r.id === id ? { ...r, status: 'Attended' } : r))
        addToast('Marked as attended!')
    }

    if (loading) return <LoadingSpinner />
    const active = registrations.filter(r => r.status === 'Registered').length
    const attended = registrations.filter(r => r.status === 'Attended').length

    return (
        <div className="page-container">
            <h1>📋 Manage Registrations</h1>
            <p className="subtitle">View and manage all event registrations</p>

            <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="dashboard-card"><h3>📋 Total</h3><div className="dashboard-card-value">{registrations.length}</div><p>All registrations</p></div>
                <div className="dashboard-card"><h3>📅 Active</h3><div className="dashboard-card-value">{active}</div><p>Registered attendees</p></div>
                <div className="dashboard-card"><h3>✅ Attended</h3><div className="dashboard-card-value">{attended}</div><p>Completed</p></div>
            </div>

            <section className="section">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by name, email, or event..." style={{ fontSize: '1.1rem' }} />
                </div>
                <div className="button-group" style={{ marginBottom: '1rem' }}>
                    {statuses.map(s => <button key={s} className={`btn ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.4rem 1rem', fontSize: '1rem' }} onClick={() => setStatusFilter(s)}>{s}</button>)}
                </div>
                <p style={{ color: '#888' }}>Showing {filtered.length} registration{filtered.length !== 1 ? 's' : ''}</p>
            </section>

            <section className="section">
                {filtered.length === 0 ? <div className="card"><p>No registrations found.</p></div> : (
                    <div className="table-responsive">
                        <table className="table">
                            <thead><tr><th>User</th><th>Email</th><th>Event</th><th>Type</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                            <tbody>
                                {filtered.map(r => (
                                    <tr key={r.id}>
                                        <td><strong>{r.userName}</strong></td>
                                        <td>{r.userEmail}</td>
                                        <td>{r.webinarTitle}</td>
                                        <td>{r.webinarType}</td>
                                        <td>{r.webinarDate}</td>
                                        <td><span className={`status ${r.status === 'Registered' ? 'status-confirmed' : r.status === 'Attended' ? 'status-completed' : 'status-cancelled'}`}>{r.status}</span></td>
                                        <td>
                                            {r.status === 'Registered' && (
                                                <div className="button-group" style={{ gap: '0.4rem' }}>
                                                    <button className="btn btn-small" style={{ background: '#38a169', color: 'white' }} onClick={() => handleMarkAttended(r.id)}>✅ Attended</button>
                                                    <button className="btn btn-danger" style={{ fontSize: '0.95rem', padding: '0.3rem 0.6rem' }} onClick={() => handleCancel(r.id)}>Cancel</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    )
}
