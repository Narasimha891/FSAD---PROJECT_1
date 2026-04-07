import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'
import { useAuth } from '../context/AuthContext'
import { getCareerInsights } from '../services/recommendationService'
import { getCertificates } from '../services/certificateService'
import { getUserRegistrations } from '../services/registrationService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ProgressTracker() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [insights, setInsights] = useState(null)
    const [certificates, setCertificates] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (user) {
            const i = getCareerInsights(user.id)
            const c = getCertificates(user.id)
            setInsights(i)
            setCertificates(c)
            setLoading(false)
        }
    }, [user])

    if (loading || !insights) return <LoadingSpinner />

    const categories = Object.entries(insights.categoryBreakdown)
    const maxCount = Math.max(...categories.map(([, v]) => v), 1)

    // Badges
    const badges = []
    if (insights.totalAttended >= 1) badges.push({ icon: '🌟', label: 'First Step', desc: 'Attended your first event' })
    if (insights.totalAttended >= 3) badges.push({ icon: '🔥', label: 'On Fire', desc: 'Attended 3+ events' })
    if (insights.totalAttended >= 5) badges.push({ icon: '🏆', label: 'Achiever', desc: 'Attended 5+ events' })
    if (certificates.length >= 1) badges.push({ icon: '🎓', label: 'Certified', desc: 'Earned your first certificate' })
    if (categories.length >= 3) badges.push({ icon: '🌈', label: 'Explorer', desc: 'Explored 3+ categories' })
    if (insights.completionRate >= 80) badges.push({ icon: '💎', label: 'Committed', desc: '80%+ completion rate' })

    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444']

    return (
        <div className="page-container">
            <h1>📈 Learning Progress</h1>
            <p className="subtitle">Track your learning journey and career development</p>

            {/* Stats Overview */}
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>📋 Registered</h3>
                    <div className="dashboard-card-value">{insights.totalRegistered}</div>
                    <p>Total registrations</p>
                </div>
                <div className="dashboard-card">
                    <h3>✅ Attended</h3>
                    <div className="dashboard-card-value">{insights.totalAttended}</div>
                    <p>Events completed</p>
                </div>
                <div className="dashboard-card">
                    <h3>📊 Completion</h3>
                    <div className="dashboard-card-value">{insights.completionRate}%</div>
                    <p>Completion rate</p>
                </div>
                <div className="dashboard-card">
                    <h3>🎓 Certificates</h3>
                    <div className="dashboard-card-value">{certificates.length}</div>
                    <p>Certificates earned</p>
                </div>
            </div>

            {/* Category Breakdown */}
            <section className="section">
                <h2>📊 Category Breakdown</h2>
                {categories.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No data yet. Register for webinars to see your category breakdown!</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {categories.map(([cat, count], i) => (
                            <div key={cat}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{cat}</span>
                                    <span style={{ fontWeight: 700, color: colors[i % colors.length] }}>{count} event{count > 1 ? 's' : ''}</span>
                                </div>
                                <div style={{ background: 'var(--bg-dark)', borderRadius: '10px', height: '14px', overflow: 'hidden' }}>
                                    <div style={{
                                        width: `${(count / maxCount) * 100}%`,
                                        height: '100%',
                                        background: `linear-gradient(135deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`,
                                        borderRadius: '10px',
                                        transition: 'width 0.5s ease'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Badges */}
            <section className="section">
                <h2>🏅 Achievement Badges</h2>
                {badges.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>Attend events to unlock badges!</p>
                ) : (
                    <div className="grid">
                        {badges.map((badge, i) => (
                            <div key={i} className="card" style={{ textAlign: 'center', borderLeft: `5px solid ${colors[i % colors.length]}` }}>
                                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{badge.icon}</div>
                                <h3>{badge.label}</h3>
                                <p>{badge.desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Career Insight */}
            <section className="section">
                <h2>🤖 AI Career Insight</h2>
                <div className="card" style={{ borderLeft: '5px solid var(--accent)' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💡</div>
                    <h3>Your Top Interest: {insights.topCategory}</h3>
                    <p style={{ lineHeight: 1.8, fontSize: '1.1rem' }}>{insights.suggestion}</p>
                    <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/user/webinars')}>
                        Browse Related Webinars →
                    </button>
                </div>
            </section>
        </div>
    )
}
