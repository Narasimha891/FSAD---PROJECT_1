import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getWebinars } from '../services/webinarService'
import { registerForWebinar, isUserRegistered } from '../services/registrationService'
import { getAverageRating, getFeedbackByWebinar } from '../services/feedbackService'
import { isBookmarked, toggleBookmark } from '../services/bookmarkService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function BrowseWebinars() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()
    const [webinars, setWebinars] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('All')
    const [typeFilter, setTypeFilter] = useState('All')
    const [statusFilter, setStatusFilter] = useState('All')
    const [sortBy, setSortBy] = useState('date')
    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState(null)
    const [registeredIds, setRegisteredIds] = useState(new Set())
    const [bookmarkedIds, setBookmarkedIds] = useState(new Set())
    const [registering, setRegistering] = useState(false)

    useEffect(() => {
        async function load() {
            const all = await getWebinars()
            setWebinars(all)
            const regSet = new Set()
            const bkSet = new Set()
            for (const w of all) {
                const reg = await isUserRegistered(user.id, w.id)
                if (reg) regSet.add(w.id)
                if (isBookmarked(user.id, w.id)) bkSet.add(w.id)
            }
            setRegisteredIds(regSet)
            setBookmarkedIds(bkSet)
            setLoading(false)
        }
        if (user) load()
    }, [user])

    const categories = ['All', ...new Set(webinars.map(w => w.category).filter(Boolean))]
    const types = ['All', 'Webinar', 'Workshop']
    const statuses = ['All', 'Upcoming', 'Completed']

    const filtered = webinars.filter(w => {
        const matchCat = filter === 'All' || w.category === filter
        const matchType = typeFilter === 'All' || w.type === typeFilter
        const matchStatus = statusFilter === 'All' || w.status === statusFilter
        const q = search.toLowerCase()
        const matchSearch = !search ||
            (w.title || '').toLowerCase().includes(q) ||
            (w.description || '').toLowerCase().includes(q) ||
            (w.speaker || '').toLowerCase().includes(q) ||
            (w.tags || []).some(t => (t || '').toLowerCase().includes(q))
        return matchCat && matchType && matchStatus && matchSearch
    }).sort((a, b) => {
        if (sortBy === 'date') return new Date(a.date || 0) - new Date(b.date || 0)
        if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '')
        if (sortBy === 'rating') return getAverageRating(b.id) - getAverageRating(a.id)
        return 0
    })

    const handleRegister = async (webinar) => {
        setRegistering(true)
        try {
            await registerForWebinar(user.id, user.name, user.email, webinar)
            setRegisteredIds(prev => new Set([...prev, webinar.id]))
            addToast(`Registered for "${webinar.title}"! ✅`)
        } catch (err) {
            addToast(err.message, 'error')
        } finally { setRegistering(false) }
    }

    const handleBookmark = (webinar) => {
        const added = toggleBookmark(user.id, webinar.id, webinar.title)
        setBookmarkedIds(prev => {
            const next = new Set(prev)
            added ? next.add(webinar.id) : next.delete(webinar.id)
            return next
        })
        addToast(added ? 'Bookmarked! 🔖' : 'Bookmark removed')
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="page-container">
            <h1>📅 Browse Webinars & Workshops</h1>
            <p className="subtitle">Discover and register for upcoming educational events</p>

            <section className="section">
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by title, speaker, topic, or tag..." style={{ fontSize: '1.1rem' }} />
                </div>

                <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ marginRight: '0.5rem' }}>Category:</strong>
                    {categories.map(c => <button key={c} className={`btn ${filter === c ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.4rem 1rem', fontSize: '1rem' }} onClick={() => setFilter(c)}>{c}</button>)}
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ marginRight: '0.5rem' }}>Type:</strong>
                    {types.map(t => <button key={t} className={`btn ${typeFilter === t ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.4rem 1rem', fontSize: '1rem' }} onClick={() => setTypeFilter(t)}>{t}</button>)}
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ marginRight: '0.5rem' }}>Status:</strong>
                    {statuses.map(s => <button key={s} className={`btn ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`} style={{ padding: '0.4rem 1rem', fontSize: '1rem' }} onClick={() => setStatusFilter(s)}>{s}</button>)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                    <p style={{ color: '#888' }}>Showing {filtered.length} event{filtered.length !== 1 ? 's' : ''}</p>
                    <div>
                        <strong style={{ marginRight: '0.5rem' }}>Sort:</strong>
                        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '2px solid var(--border)', fontSize: '1rem', fontFamily: 'inherit' }}>
                            <option value="date">📅 Date</option>
                            <option value="title">🔤 Title</option>
                            <option value="rating">⭐ Rating</option>
                        </select>
                    </div>
                </div>
            </section>

            {filtered.length === 0 ? (
                <div className="card"><p>No events match your search. Try different keywords.</p></div>
            ) : (
                <div className="grid">
                    {filtered.map(w => {
                        const avg = getAverageRating(w.id)
                        const fbCount = getFeedbackByWebinar(w.id).length
                        return (
                            <div key={w.id} className="card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '3rem' }}>{w.image}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button onClick={() => handleBookmark(w)} title={bookmarkedIds.has(w.id) ? 'Remove bookmark' : 'Bookmark'} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.25rem' }}>
                                            {bookmarkedIds.has(w.id) ? '🔖' : '📑'}
                                        </button>
                                        <span className={`status ${w.status === 'Upcoming' ? 'status-pending' : 'status-completed'}`}>{w.status}</span>
                                    </div>
                                </div>
                                <h3 style={{ marginTop: '0.5rem' }}>{w.title}</h3>
                                <p style={{ color: '#667eea', fontWeight: 'bold' }}>{w.type} · {w.category}</p>
                                <p>👤 <strong style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate(`/speaker/${encodeURIComponent(w.speaker)}`)}>{w.speaker}</strong></p>
                                <p>🗓 {w.date} at {w.time} · ⏱ {w.duration}</p>
                                <p>📍 {w.platform} · 👥 Capacity: {w.capacity}</p>
                                {avg > 0 && <p>⭐ {avg}/5 ({fbCount} review{fbCount !== 1 ? 's' : ''})</p>}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', margin: '0.75rem 0' }}>
                                    {(w.tags || []).map((tag, i) => <span key={i} className="skill-tag" style={{ fontSize: '0.95rem', padding: '0.3rem 0.7rem' }}>{tag}</span>)}
                                </div>
                                <p className="card-description">{w.description}</p>
                                <div className="button-group">
                                    <button className="btn btn-primary" onClick={() => setSelected(w)}>View Details</button>
                                    {w.status === 'Upcoming' && (
                                        registeredIds.has(w.id)
                                            ? <button className="btn btn-success" disabled>✅ Registered</button>
                                            : <button className="btn btn-secondary" onClick={() => handleRegister(w)} disabled={registering}>{registering ? 'Registering...' : '📝 Register'}</button>
                                    )}
                                    {w.status === 'Completed' && w.recordingUrl && (
                                        <button className="btn btn-secondary" onClick={() => navigate('/user/resources')}>📁 View Resources</button>
                                    )}
                                    <button className="btn btn-secondary" style={{ padding: '0.5rem 0.8rem' }} onClick={() => navigate(`/user/forum?webinarId=${w.id}`)}>💬 Discuss</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Detail Modal */}
            {selected && (
                <div className="modal" onClick={() => setSelected(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selected.image} {selected.title}</h2>
                            <button className="close-btn" onClick={() => setSelected(null)}>×</button>
                        </div>
                        <div className="modal-body">
                            <h3>Overview</h3><p>{selected.description}</p>
                            <h3 style={{ marginTop: '1rem' }}>Speaker</h3>
                            <p><strong style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => { setSelected(null); navigate(`/speaker/${encodeURIComponent(selected.speaker)}`) }}>{selected.speaker}</strong></p>
                            <p style={{ color: '#888' }}>{selected.speakerBio}</p>
                            {getAverageRating(selected.id) > 0 && (
                                <>
                                    <h3 style={{ marginTop: '1rem' }}>Rating</h3>
                                    <p>⭐ {getAverageRating(selected.id)}/5 ({getFeedbackByWebinar(selected.id).length} reviews)</p>
                                </>
                            )}
                            <h3 style={{ marginTop: '1rem' }}>Event Details</h3>
                            <ul>
                                <li><strong>Type:</strong> {selected.type}</li>
                                <li><strong>Category:</strong> {selected.category}</li>
                                <li><strong>Date:</strong> {selected.date} at {selected.time}</li>
                                <li><strong>Duration:</strong> {selected.duration}</li>
                                <li><strong>Platform:</strong> {selected.platform}</li>
                                <li><strong>Capacity:</strong> {selected.capacity} attendees</li>
                            </ul>
                            <h3 style={{ marginTop: '1rem' }}>Tags</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {(selected.tags || []).map((t, i) => <span key={i} className="skill-tag">{t}</span>)}
                            </div>
                            <div className="button-group" style={{ marginTop: '1.5rem' }}>
                                {selected.status === 'Upcoming' && !registeredIds.has(selected.id) && (
                                    <button className="btn btn-primary" onClick={() => { handleRegister(selected); setSelected(null) }}>📝 Register Now</button>
                                )}
                                {registeredIds.has(selected.id) && <button className="btn btn-success" disabled>✅ Already Registered</button>}
                                {selected.status === 'Upcoming' && registeredIds.has(selected.id) && (
                                    <button className="btn btn-primary" onClick={() => { setSelected(null); navigate('/user/live/' + selected.id) }}>▶ Join Session</button>
                                )}
                                <button className="btn btn-secondary" onClick={() => handleBookmark(selected)}>{bookmarkedIds.has(selected.id) ? '🔖 Bookmarked' : '📑 Bookmark'}</button>
                                <button className="btn btn-secondary" onClick={() => { setSelected(null); navigate(`/user/forum?webinarId=${selected.id}`) }}>💬 Discussion</button>
                                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
