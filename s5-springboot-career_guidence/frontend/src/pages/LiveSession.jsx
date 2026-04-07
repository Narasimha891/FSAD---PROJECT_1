import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'
import '../styles/Auth.css'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getWebinarById } from '../services/webinarService'
import { isUserRegistered, markAttended } from '../services/registrationService'
import { getResourcesByWebinar } from '../services/resourceService'
import { addFeedback, hasUserReviewed, getFeedbackByWebinar, getAverageRating } from '../services/feedbackService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function LiveSession() {
    const { id } = useParams()
    const { user } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()
    const [webinar, setWebinar] = useState(null)
    const [registration, setRegistration] = useState(null)
    const [resources, setResources] = useState([])
    const [loading, setLoading] = useState(true)
    const [joined, setJoined] = useState(false)
    const [chatMessages, setChatMessages] = useState([
        { sender: 'System', text: 'Welcome to the live session! The chat is active.', time: 'now' },
    ])
    const [chatInput, setChatInput] = useState('')

    // Feedback state
    const [showFeedback, setShowFeedback] = useState(false)
    const [feedbackRating, setFeedbackRating] = useState(0)
    const [feedbackHover, setFeedbackHover] = useState(0)
    const [feedbackComment, setFeedbackComment] = useState('')
    const [hasReviewed, setHasReviewed] = useState(false)
    const [feedbackList, setFeedbackList] = useState([])

    useEffect(() => {
        async function load() {
            const [w, reg, res] = await Promise.all([
                getWebinarById(id),
                isUserRegistered(user.id, id),
                getResourcesByWebinar(id)
            ])
            setWebinar(w)
            setRegistration(reg)
            setResources(res)
            setHasReviewed(hasUserReviewed(id, user.id))
            setFeedbackList(getFeedbackByWebinar(id))
            setLoading(false)
        }
        load()
    }, [id, user])

    const handleJoin = async () => {
        setJoined(true)
        if (registration) {
            try { await markAttended(registration.id) } catch { }
        }
        addToast('You have joined the live session! 🎥')
        setChatMessages(prev => [...prev, { sender: 'System', text: `${user.name} has joined the session.`, time: 'now' }])
    }

    const handleSendChat = (e) => {
        e.preventDefault()
        if (!chatInput.trim()) return
        setChatMessages(prev => [...prev, { sender: user.name, text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
        setChatInput('')
    }

    const handleSubmitFeedback = () => {
        if (feedbackRating === 0) { addToast('Please select a rating', 'error'); return }
        addFeedback({
            webinarId: id,
            userId: user.id,
            userName: user.name,
            rating: feedbackRating,
            comment: feedbackComment
        })
        setHasReviewed(true)
        setFeedbackList(getFeedbackByWebinar(id))
        setShowFeedback(false)
        addToast('Thank you for your feedback! ⭐')
    }

    const avgRating = getAverageRating(id)

    if (loading) return <LoadingSpinner />
    if (!webinar) return <div className="page-container"><h1>Event Not Found</h1><p>This webinar does not exist.</p><button className="btn btn-primary" onClick={() => navigate('/user/webinars')}>Browse Webinars</button></div>

    return (
        <div className="page-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1>{webinar.image} {webinar.title}</h1>
                    <p className="subtitle">{webinar.type} · {webinar.category} · by {webinar.speaker}</p>
                </div>
                {joined && <div className="live-badge"><span className="live-dot"></span> LIVE</div>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                {/* Main content — stream area */}
                <div>
                    <section className="section" style={{ minHeight: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: joined ? 'linear-gradient(135deg, #1a1a2e, #16213e)' : '#f5f5f5', color: joined ? 'white' : '#333', borderRadius: '12px' }}>
                        {!joined ? (
                            <>
                                <span style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>{webinar.image}</span>
                                <h2 style={{ color: joined ? 'white' : '#333' }}>{webinar.title}</h2>
                                <p style={{ marginBottom: '1rem' }}>🗓 {webinar.date} at {webinar.time} · ⏱ {webinar.duration}</p>
                                <p style={{ marginBottom: '1.5rem', color: '#888' }}>👤 Speaker: {webinar.speaker}</p>
                                {!registration && (
                                    <p style={{ color: '#ff6b6b', marginBottom: '1rem' }}>⚠️ You are not registered for this event. <button className="btn btn-small" onClick={() => navigate('/user/webinars')}>Register first</button></p>
                                )}
                                <button className="btn btn-primary" style={{ fontSize: '1.25rem', padding: '0.9rem 2.5rem' }} onClick={handleJoin} disabled={!registration}>
                                    ▶️ Join Live Session
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{ width: '100%', height: '300px', background: 'linear-gradient(135deg, #0f0c29, #302b63)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '5.5rem' }}>🎥</span>
                                    <p style={{ marginTop: '1rem', fontSize: '1.35rem', opacity: 0.8 }}>Live Stream Active</p>
                                    <p style={{ opacity: 0.5, fontSize: '1.05rem' }}>Simulated live streaming — {webinar.platform}</p>
                                </div>
                                <div className="button-group">
                                    <button className="btn btn-danger" onClick={() => { setJoined(false); addToast('You left the session.') }}>📴 Leave Session</button>
                                    {!hasReviewed && <button className="btn btn-secondary" onClick={() => setShowFeedback(true)}>⭐ Rate This Session</button>}
                                </div>
                            </>
                        )}
                    </section>

                    {/* Feedback Section */}
                    {showFeedback && !hasReviewed && (
                        <section className="section" style={{ marginTop: '1.5rem' }}>
                            <h2>⭐ Rate This Session</h2>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star}
                                        onClick={() => setFeedbackRating(star)}
                                        onMouseEnter={() => setFeedbackHover(star)}
                                        onMouseLeave={() => setFeedbackHover(0)}
                                        style={{
                                            fontSize: '2.5rem',
                                            cursor: 'pointer',
                                            transition: 'transform 0.15s',
                                            transform: (feedbackHover >= star || feedbackRating >= star) ? 'scale(1.2)' : 'scale(1)'
                                        }}>
                                        {(feedbackHover >= star || feedbackRating >= star) ? '⭐' : '☆'}
                                    </span>
                                ))}
                            </div>
                            <div className="form-group">
                                <textarea value={feedbackComment} onChange={e => setFeedbackComment(e.target.value)} placeholder="Share your thoughts about this session..." rows="3" />
                            </div>
                            <div className="button-group">
                                <button className="btn btn-primary" onClick={handleSubmitFeedback}>Submit Review</button>
                                <button className="btn btn-secondary" onClick={() => setShowFeedback(false)}>Cancel</button>
                            </div>
                        </section>
                    )}

                    {hasReviewed && (
                        <section className="section" style={{ marginTop: '1.5rem', borderLeft: '5px solid var(--success)' }}>
                            <p style={{ fontWeight: 700, color: 'var(--success)' }}>✅ You've reviewed this session. Thank you!</p>
                        </section>
                    )}

                    {/* Reviews */}
                    {feedbackList.length > 0 && (
                        <section className="section" style={{ marginTop: '1.5rem' }}>
                            <h2>📝 Reviews ({feedbackList.length}) — ⭐ {avgRating}/5</h2>
                            {feedbackList.map(fb => (
                                <div key={fb.id} style={{ padding: '1rem 0', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong style={{ color: 'var(--primary)' }}>{fb.userName}</strong>
                                        <span>{'⭐'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}</span>
                                    </div>
                                    {fb.comment && <p style={{ marginTop: '0.35rem', color: 'var(--text-secondary)' }}>{fb.comment}</p>}
                                    <small style={{ color: 'var(--text-muted)' }}>{new Date(fb.createdAt).toLocaleDateString()}</small>
                                </div>
                            ))}
                        </section>
                    )}

                    {/* Event Details */}
                    <section className="section" style={{ marginTop: '1.5rem' }}>
                        <h2>📋 Event Details</h2>
                        <p>{webinar.description}</p>
                        <div style={{ marginTop: '1rem' }}>
                            <strong>Speaker:</strong> {webinar.speaker}
                            <p style={{ color: '#888', fontSize: '1.05rem' }}>{webinar.speakerBio}</p>
                        </div>
                        {resources.length > 0 && (
                            <div style={{ marginTop: '1.5rem' }}>
                                <h3>📁 Event Resources</h3>
                                <ul>
                                    {resources.map(r => (
                                        <li key={r.id} style={{ marginBottom: '0.5rem' }}>
                                            <strong>{r.title}</strong> ({r.type}) — {r.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div className="button-group" style={{ marginTop: '1rem' }}>
                            <button className="btn btn-secondary" onClick={() => navigate(`/user/forum?webinarId=${id}`)}>💬 Discussion Board</button>
                            <button className="btn btn-secondary" onClick={() => navigate('/user/certificates')}>🎓 View Certificates</button>
                        </div>
                    </section>
                </div>

                {/* Chat sidebar */}
                <div>
                    <section className="section" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <h2 style={{ fontSize: '1.35rem' }}>💬 Live Chat</h2>
                        <div style={{ flex: 1, overflowY: 'auto', maxHeight: '400px', background: '#f9f9f9', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
                            {chatMessages.map((msg, i) => (
                                <div key={i} style={{ marginBottom: '0.75rem' }}>
                                    <strong style={{ color: msg.sender === 'System' ? '#667eea' : msg.sender === user.name ? '#764ba2' : '#333' }}>{msg.sender}</strong>
                                    <span style={{ color: '#aaa', fontSize: '0.95rem', marginLeft: '0.5rem' }}>{msg.time}</span>
                                    <p style={{ margin: '0.2rem 0 0', color: '#555' }}>{msg.text}</p>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder={joined ? "Type a message..." : "Join session to chat"} disabled={!joined} style={{ flex: 1 }} />
                            <button type="submit" className="btn btn-primary" disabled={!joined} style={{ margin: 0, padding: '0.5rem 1rem' }}>Send</button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    )
}
