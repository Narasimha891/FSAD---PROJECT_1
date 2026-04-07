import React, { useState, useEffect } from 'react'
import '../styles/Dashboard.css'
import { getAllUsers } from '../services/authService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => { getAllUsers().then(setUsers).finally(() => setLoading(false)) }, [])

    const filtered = users.filter(u => {
        const q = search.toLowerCase()
        return !search || (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
    })

    if (loading) return <LoadingSpinner />

    return (
        <div className="page-container">
            <h1>👤 User Management</h1>
            <p className="subtitle">View registered attendee accounts</p>

            <section className="section">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search users..." style={{ fontSize: '1.1rem' }} />
                </div>
            </section>

            <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="dashboard-card"><h3>Total Users</h3><div className="dashboard-card-value">{users.length}</div></div>
                <div className="dashboard-card"><h3>Attendees</h3><div className="dashboard-card-value">{users.filter(u => u.role === 'user').length}</div></div>
                <div className="dashboard-card"><h3>Admins</h3><div className="dashboard-card-value">{users.filter(u => u.role === 'admin').length}</div></div>
            </div>

            <section className="section">
                <div className="table-responsive">
                    <table className="table">
                        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Organization</th><th>Joined</th></tr></thead>
                        <tbody>
                            {filtered.map(u => (
                                <tr key={u.id}>
                                    <td><strong>{u.name}</strong></td>
                                    <td>{u.email}</td>
                                    <td><span style={{ background: u.role === 'admin' ? '#f7971e' : '#667eea', color: 'white', padding: '0.25rem 0.6rem', borderRadius: '12px', fontSize: '1rem' }}>{u.role}</span></td>
                                    <td>{u.organization || '—'}</td>
                                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
