import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getBookmarks, removeBookmark } from '../services/bookmarkService'
import { getWebinarById } from '../services/webinarService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function SavedWebinars() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()
    const [bookmarkedWebinars, setBookmarkedWebinars] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            const bks = getBookmarks(user.id)
            const webinars = await Promise.all(
                bks.map(async b => {
                    const w = await getWebinarById(b.webinarId)
                    return w ? { ...w, bookmarkId: b.id, bookmarkedAt: b.createdAt } : null
                })
            )
            setBookmarkedWebinars(webinars.filter(Boolean))
            setLoading(false)
        }
        if (user) load()
    }, [user])

    const handleRemove = (webinarId) => {
        removeBookmark(user.id, webinarId)
        setBookmarkedWebinars(prev => prev.filter(w => w.id !== webinarId))
        addToast('Bookmark removed')
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="page-container">
            <h1>🔖 Saved Webinars</h1>
            <p className="subtitle">Your wishlisted webinars and events</p>

            <section className="section">
                {bookmarkedWebinars.length === 0 ? (
                    <div className="card">
                        <p>No saved webinars yet. Browse webinars and bookmark the ones you're interested in!</p>
                        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/user/webinars')}>
                            Browse Webinars →
                        </button>
                    </div>
                ) : (
                    <div className="grid">
                        {bookmarkedWebinars.map(w => (
                            <div key={w.id} className="card">
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{w.image}</div>
                                <h3>{w.title}</h3>
                                <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{w.type} · {w.category}</p>
                                <p>🗓 {w.date} at {w.time} · ⏱ {w.duration}</p>
                                <p>👤 {w.speaker}</p>
                                <p><span className={`status ${w.status === 'Upcoming' ? 'status-active' : 'status-completed'}`}>{w.status}</span></p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                    <button className="btn btn-primary" onClick={() => navigate('/user/webinars')}>View Details</button>
                                    <button className="btn btn-danger" style={{ padding: '0.5rem 1rem' }} onClick={() => handleRemove(w.id)}>🗑 Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
