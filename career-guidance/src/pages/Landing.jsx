import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Auth.css'

export default function Landing() {
    const navigate = useNavigate()

    return (
        <div className="landing-container">
            <div className="landing-header">
                <span className="landing-logo">🎓</span>
                <h1>EduWebinar Platform</h1>
                <p>Host, manage, and attend educational webinars and workshops. Your gateway to continuous learning.</p>
            </div>

            <div className="portal-grid">
                <div className="portal-card user-card" onClick={() => navigate('/login')}>
                    <span className="portal-icon">🎒</span>
                    <h2>Attendee Portal</h2>
                    <p>Browse upcoming webinars, register for events, attend live sessions, and access recordings & materials.</p>
                    <button className="portal-btn">Enter as Attendee →</button>
                </div>

                <div className="portal-card admin-card" onClick={() => navigate('/admin/login')}>
                    <span className="portal-icon">🛡️</span>
                    <h2>Admin Portal</h2>
                    <p>Schedule webinars, manage registrations, upload post‑event resources, and monitor platform activity.</p>
                    <button className="portal-btn">Admin Login →</button>
                </div>
            </div>

            <div className="landing-features">
                <span className="landing-feature">✦ Live Webinar Streaming</span>
                <span className="landing-feature">✦ Workshop Registration</span>
                <span className="landing-feature">✦ Post‑Event Recordings</span>
                <span className="landing-feature">✦ Resource Downloads</span>
            </div>
        </div>
    )
}
