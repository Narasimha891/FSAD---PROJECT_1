import React, { useState, useEffect } from 'react'
import '../styles/Dashboard.css'
import { useToast } from '../context/ToastContext'
import { getAnnouncements, addAnnouncement, deleteAnnouncement } from '../services/announcementService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function AdminAnnouncements() {
    const { addToast } = useToast()
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({ title: '', content: '', priority: 'info' })

    useEffect(() => {
        setAnnouncements(getAnnouncements())
        setLoading(false)
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.title.trim() || !form.content.trim()) {
            addToast('Title and content are required', 'error')
            return
        }
        addAnnouncement(form)
        setAnnouncements(getAnnouncements())
        setForm({ title: '', content: '', priority: 'info' })
        setShowForm(false)
        addToast('Announcement published! 📢')
    }

    const handleDelete = (id) => {
        deleteAnnouncement(id)
        setAnnouncements(getAnnouncements())
        addToast('Announcement deleted')
    }

    const priorityColors = {
        info: { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' },
        important: { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' },
        urgent: { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' }
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="page-container">
            <h1>📢 Announcements</h1>
            <p className="subtitle">Communicate with students across the platform</p>

            <section className="section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ border: 'none', padding: 0, margin: 0 }}>Manage Announcements</h2>
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        {showForm ? '✕ Cancel' : '+ New Announcement'}
                    </button>
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-dark)', borderRadius: '12px' }}>
                        <div className="form-group">
                            <label>Title</label>
                            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Announcement title..." />
                        </div>
                        <div className="form-group">
                            <label>Content</label>
                            <textarea name="content" value={form.content} onChange={handleChange} placeholder="Write your announcement..." rows="4" />
                        </div>
                        <div className="form-group">
                            <label>Priority</label>
                            <select name="priority" value={form.priority} onChange={handleChange}>
                                <option value="info">ℹ️ Info</option>
                                <option value="important">⚠️ Important</option>
                                <option value="urgent">🚨 Urgent</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary">📢 Publish Announcement</button>
                    </form>
                )}

                {announcements.length === 0 ? (
                    <div className="card"><p>No announcements yet.</p></div>
                ) : (
                    announcements.map(ann => {
                        const pc = priorityColors[ann.priority] || priorityColors.info
                        return (
                            <div key={ann.id} className="card" style={{ marginBottom: '1rem', borderLeft: `5px solid ${pc.border}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <span style={{ background: pc.bg, color: pc.color, padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, marginRight: '0.75rem' }}>
                                            {ann.priority.toUpperCase()}
                                        </span>
                                        <strong style={{ fontSize: '1.2rem' }}>{ann.title}</strong>
                                    </div>
                                    <button className="btn btn-danger" style={{ padding: '0.3rem 0.7rem', fontSize: '0.85rem' }} onClick={() => handleDelete(ann.id)}>🗑</button>
                                </div>
                                <p style={{ marginTop: '0.75rem', lineHeight: 1.7 }}>{ann.content}</p>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                                    By {ann.createdBy} · {new Date(ann.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        )
                    })
                )}
            </section>
        </div>
    )
}
