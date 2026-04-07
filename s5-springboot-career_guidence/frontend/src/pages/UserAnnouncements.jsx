import React, { useState, useEffect } from 'react'
import '../styles/Dashboard.css'
import { getAnnouncements } from '../services/announcementService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function UserAnnouncements() {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setAnnouncements(getAnnouncements())
        setLoading(false)
    }, [])

    const priorityColors = {
        info: { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6', icon: 'ℹ️' },
        important: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b', icon: '⚠️' },
        urgent: { bg: '#fee2e2', color: '#991b1b', border: '#ef4444', icon: '🚨' }
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="page-container">
            <h1>📢 Announcements</h1>
            <p className="subtitle">Latest updates from the EduWebinar team</p>

            <section className="section">
                {announcements.length === 0 ? (
                    <div className="card"><p>No announcements at this time. Check back later!</p></div>
                ) : (
                    announcements.map(ann => {
                        const pc = priorityColors[ann.priority] || priorityColors.info
                        return (
                            <div key={ann.id} className="card" style={{ marginBottom: '1rem', borderLeft: `5px solid ${pc.border}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{pc.icon}</span>
                                    <span style={{ background: pc.bg, color: pc.color, padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
                                        {ann.priority.toUpperCase()}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{ann.title}</h3>
                                <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>{ann.content}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                                    📅 {new Date(ann.createdAt).toLocaleDateString()} · By {ann.createdBy}
                                </p>
                            </div>
                        )
                    })
                )}
            </section>
        </div>
    )
}
