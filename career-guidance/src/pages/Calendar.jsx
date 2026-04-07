import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'
import { useAuth } from '../context/AuthContext'
import { getWebinars } from '../services/webinarService'
import { getUserRegistrations } from '../services/registrationService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Calendar() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [webinars, setWebinars] = useState([])
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentMonth, setCurrentMonth] = useState(new Date())

    useEffect(() => {
        async function load() {
            try {
                const [w, r] = await Promise.all([getWebinars(), getUserRegistrations(user.id)])
                setWebinars(w)
                setRegistrations(r.filter(reg => reg.status !== 'Cancelled'))
            } catch (e) { console.error(e) }
            finally { setLoading(false) }
        }
        if (user) load()
    }, [user])

    const registeredIds = new Set(registrations.map(r => r.webinarId))

    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

    const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1))
    const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1))

    const getEventsForDay = (day) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        return webinars.filter(w => w.date === dateStr)
    }

    const days = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(d)

    const today = new Date()
    const isToday = (day) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

    if (loading) return <LoadingSpinner />

    return (
        <div className="page-container">
            <h1>📅 Event Calendar</h1>
            <p className="subtitle">View all webinars and workshops on a calendar</p>

            <section className="section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <button className="btn btn-secondary" onClick={prevMonth}>← Previous</button>
                    <h2 style={{ border: 'none', padding: 0, margin: 0 }}>{monthName}</h2>
                    <button className="btn btn-secondary" onClick={nextMonth}>Next →</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-secondary)', fontSize: '1rem', background: 'var(--bg-dark)', borderRadius: '8px' }}>{d}</div>
                    ))}
                    {days.map((day, i) => {
                        const events = day ? getEventsForDay(day) : []
                        return (
                            <div key={i} style={{
                                minHeight: '100px',
                                padding: '0.5rem',
                                background: day ? (isToday(day) ? 'rgba(99, 102, 241, 0.08)' : 'var(--white)') : 'transparent',
                                border: day ? '1px solid var(--border)' : 'none',
                                borderRadius: '8px',
                                position: 'relative'
                            }}>
                                {day && (
                                    <>
                                        <div style={{ fontWeight: isToday(day) ? 800 : 600, color: isToday(day) ? 'var(--primary)' : 'var(--text)', fontSize: '1rem' }}>{day}</div>
                                        {events.map(ev => (
                                            <div key={ev.id} onClick={() => navigate('/user/webinars')} style={{
                                                background: registeredIds.has(ev.id) ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                                color: '#fff',
                                                fontSize: '0.78rem',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                marginTop: '3px',
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                fontWeight: 600
                                            }}>
                                                {ev.image} {ev.title.length > 15 ? ev.title.slice(0, 15) + '…' : ev.title}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', fontSize: '0.95rem' }}>
                    <span><span style={{ display: 'inline-block', width: '14px', height: '14px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: '3px', marginRight: '6px', verticalAlign: 'middle' }}></span> Available Events</span>
                    <span><span style={{ display: 'inline-block', width: '14px', height: '14px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '3px', marginRight: '6px', verticalAlign: 'middle' }}></span> Registered Events</span>
                </div>
            </section>
        </div>
    )
}
