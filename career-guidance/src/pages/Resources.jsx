import React, { useState, useEffect } from 'react'
import '../styles/Dashboard.css'
import { useAuth } from '../context/AuthContext'
import { getResources } from '../services/resourceService'
import { getCompletedWebinars } from '../services/webinarService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Resources() {
    const { user } = useAuth()
    const [resources, setResources] = useState([])
    const [completed, setCompleted] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('All')

    useEffect(() => {
        async function load() {
            const [res, comp] = await Promise.all([getResources(), getCompletedWebinars()])
            setResources(res)
            setCompleted(comp)
            setLoading(false)
        }
        load()
    }, [])

    const types = ['All', ...new Set(resources.map(r => r.type))]

    const filtered = resources.filter(r => {
        const matchType = typeFilter === 'All' || r.type === typeFilter
        const q = search.toLowerCase()
        const matchSearch = !search ||
            (r.title || '').toLowerCase().includes(q) ||
            (r.webinarTitle || '').toLowerCase().includes(q) ||
            (r.description || '').toLowerCase().includes(q)
        return matchType && matchSearch
    })

    if (loading) return <LoadingSpinner />

    return (
        <div className="page-container">
            <h1>📁 Resources & Recordings</h1>
            <p className="subtitle">Access post-event materials, slides, recordings, and more</p>

            <section className="section">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search resources by title or webinar..." style={{ fontSize: '1.1rem' }} />
                </div>
                <div>
                    <strong style={{ marginRight: '0.5rem' }}>Type:</strong>
                    {types.map(t => <button key={t} className={`btn ${typeFilter === t ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.4rem 1rem', fontSize: '1rem' }} onClick={() => setTypeFilter(t)}>{t}</button>)}
                </div>
                <p style={{ marginTop: '0.75rem', color: '#888' }}>{filtered.length} resource{filtered.length !== 1 ? 's' : ''} available</p>
            </section>

            {/* Past events with recordings */}
            <section className="section">
                <h2>🎬 Past Event Recordings</h2>
                {completed.length === 0 ? (
                    <div className="card"><p>No completed events with recordings yet.</p></div>
                ) : (
                    <div className="grid">
                        {completed.map(w => (
                            <div key={w.id} className="card">
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{w.image}</div>
                                <h3>{w.title}</h3>
                                <p style={{ color: '#667eea', fontWeight: 'bold' }}>{w.type} · {w.category}</p>
                                <p>👤 {w.speaker} · 🗓 {w.date}</p>
                                {w.recordingUrl && (
                                    <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => window.open(w.recordingUrl, '_blank')}>
                                        ▶️ Watch Recording
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Resource Downloads */}
            <section className="section">
                <h2>📥 Downloadable Resources</h2>
                {filtered.length === 0 ? (
                    <div className="card"><p>No resources found matching your search.</p></div>
                ) : (
                    <div className="table-responsive">
                        <table className="table">
                            <thead><tr><th>Title</th><th>Webinar</th><th>Type</th><th>Description</th><th>Action</th></tr></thead>
                            <tbody>
                                {filtered.map(r => (
                                    <tr key={r.id}>
                                        <td><strong>{r.title}</strong></td>
                                        <td>{r.webinarTitle}</td>
                                        <td><span style={{ background: '#667eea', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '1rem' }}>{r.type}</span></td>
                                        <td>{r.description}</td>
                                        <td><button className="btn btn-small" onClick={() => { window.open(r.fileUrl, '_blank') }}>📥 Download</button></td>
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
