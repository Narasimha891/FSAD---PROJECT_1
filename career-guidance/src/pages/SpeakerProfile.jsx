import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'
import { getWebinars } from '../services/webinarService'
import { getFeedbackByWebinar, getAverageRating } from '../services/feedbackService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function SpeakerProfile() {
    const { speakerName } = useParams()
    const navigate = useNavigate()
    const [webinars, setWebinars] = useState([])
    const [loading, setLoading] = useState(true)

    const decodedName = decodeURIComponent(speakerName || '')

    useEffect(() => {
        getWebinars().then(all => {
            setWebinars(all.filter(w => w.speaker === decodedName))
            setLoading(false)
        })
    }, [decodedName])

    if (loading) return <LoadingSpinner />

    const speaker = webinars[0]
    const upcomingCount = webinars.filter(w => w.status === 'Upcoming').length
    const completedCount = webinars.filter(w => w.status === 'Completed').length
    const categories = [...new Set(webinars.map(w => w.category))]

    return (
        <div className="page-container">
            <h1>👤 {decodedName}</h1>
            <p className="subtitle">{speaker?.speakerBio || 'Speaker & Industry Expert'}</p>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>📅 Total Events</h3>
                    <div className="dashboard-card-value">{webinars.length}</div>
                    <p>Webinars & workshops</p>
                </div>
                <div className="dashboard-card">
                    <h3>🟢 Upcoming</h3>
                    <div className="dashboard-card-value">{upcomingCount}</div>
                    <p>Upcoming events</p>
                </div>
                <div className="dashboard-card">
                    <h3>✅ Completed</h3>
                    <div className="dashboard-card-value">{completedCount}</div>
                    <p>Past events</p>
                </div>
                <div className="dashboard-card">
                    <h3>📚 Categories</h3>
                    <div className="dashboard-card-value">{categories.length}</div>
                    <p>{categories.join(', ') || 'Various'}</p>
                </div>
            </div>

            <section className="section">
                <h2>📅 Events by {decodedName}</h2>
                {webinars.length === 0 ? (
                    <div className="card"><p>No events found for this speaker.</p></div>
                ) : (
                    <div className="grid">
                        {webinars.map(w => {
                            const avg = getAverageRating(w.id)
                            const feedbackCount = getFeedbackByWebinar(w.id).length
                            return (
                                <div key={w.id} className="card">
                                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{w.image}</div>
                                    <h3>{w.title}</h3>
                                    <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{w.type} · {w.category}</p>
                                    <p>🗓 {w.date} at {w.time} · ⏱ {w.duration}</p>
                                    <p><span className={`status ${w.status === 'Upcoming' ? 'status-active' : 'status-completed'}`}>{w.status}</span></p>
                                    {avg > 0 && <p>⭐ {avg}/5 ({feedbackCount} review{feedbackCount !== 1 ? 's' : ''})</p>}
                                    <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{w.description?.slice(0, 120)}...</p>
                                    <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => navigate('/user/webinars')}>
                                        View Details →
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}
