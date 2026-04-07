import React, { useState, useEffect } from 'react'
import '../styles/Dashboard.css'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getCertificates, issueCertificate, downloadCertificateAsText } from '../services/certificateService'
import { getUserRegistrations } from '../services/registrationService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CertificatePage() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [certificates, setCertificates] = useState([])
    const [attendedEvents, setAttendedEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const [certs, regs] = await Promise.all([
                    Promise.resolve(getCertificates(user.id)),
                    getUserRegistrations(user.id)
                ])
                setCertificates(certs)
                setAttendedEvents(regs.filter(r => r.status === 'Attended'))
            } catch (e) { console.error(e) }
            finally { setLoading(false) }
        }
        if (user) load()
    }, [user])

    const handleIssueCert = (reg) => {
        const cert = issueCertificate({
            userId: user.id,
            userName: user.name,
            webinarId: reg.webinarId,
            webinarTitle: reg.webinarTitle,
            speaker: reg.speaker,
            date: reg.webinarDate,
            duration: reg.webinarDuration || '60 min'
        })
        setCertificates(prev => {
            if (prev.some(c => c.id === cert.id)) return prev
            return [cert, ...prev]
        })
        addToast('Certificate issued! 🎓')
    }

    const handleDownload = (cert) => {
        downloadCertificateAsText(cert)
        addToast('Certificate downloaded!')
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="page-container">
            <h1>🎓 My Certificates</h1>
            <p className="subtitle">View and download your completion certificates</p>

            {/* Issue certificates for attended events that don't have one */}
            {attendedEvents.length > 0 && (
                <section className="section">
                    <h2>📋 Eligible for Certificate</h2>
                    {attendedEvents.filter(r => !certificates.some(c => c.webinarId === r.webinarId)).length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>All certificates have been issued! ✅</p>
                    ) : (
                        <div className="grid">
                            {attendedEvents.filter(r => !certificates.some(c => c.webinarId === r.webinarId)).map(r => (
                                <div key={r.id} className="card">
                                    <h3>{r.webinarTitle}</h3>
                                    <p>👤 {r.speaker}</p>
                                    <p>🗓 {r.webinarDate}</p>
                                    <button className="btn btn-primary" style={{ marginTop: '0.75rem' }} onClick={() => handleIssueCert(r)}>
                                        🎓 Generate Certificate
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* Existing certificates */}
            <section className="section">
                <h2>🏆 Issued Certificates</h2>
                {certificates.length === 0 ? (
                    <div className="card"><p>No certificates yet. Attend webinars to earn certificates!</p></div>
                ) : (
                    <div className="grid">
                        {certificates.map(cert => (
                            <div key={cert.id} className="card" style={{ borderLeft: '5px solid var(--success)' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🏅</div>
                                <h3>{cert.webinarTitle}</h3>
                                <p>👤 Speaker: {cert.speaker}</p>
                                <p>🗓 Date: {cert.date}</p>
                                <p>⏱ Duration: {cert.duration}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                    Certificate ID: <code>{cert.id}</code>
                                </p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                                </p>
                                <button className="btn btn-success" style={{ marginTop: '0.75rem' }} onClick={() => handleDownload(cert)}>
                                    📥 Download Certificate
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
