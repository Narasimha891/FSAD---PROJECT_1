import React, { useState, useEffect } from 'react'
import '../styles/Dashboard.css'
import { useToast } from '../context/ToastContext'
import { getWebinars, addWebinar, updateWebinar, deleteWebinar } from '../services/webinarService'
import LoadingSpinner from '../components/LoadingSpinner'

const CATEGORIES = ['Technology', 'Web Development', 'Cloud Computing', 'Data Science', 'Design', 'Security', 'Business', 'Other']
const BLANK = { title: '', type: 'Webinar', category: '', description: '', speaker: '', speakerBio: '', date: '', time: '', duration: '', capacity: '', platform: 'Zoom', image: '📹', tags: '' }

export default function AdminWebinars() {
    const { addToast } = useToast()
    const [webinars, setWebinars] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState(BLANK)
    const [editingId, setEditingId] = useState(null)

    useEffect(() => { getWebinars().then(setWebinars).finally(() => setLoading(false)) }, [])

    const handleChange = (e) => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })) }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.title || !formData.category || !formData.speaker || !formData.date || !formData.time) {
            addToast('Please fill in all required fields', 'error'); return
        }
        try {
            const data = { ...formData, capacity: parseInt(formData.capacity) || 100, tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags }
            if (editingId) {
                await updateWebinar(editingId, data)
                setWebinars(prev => prev.map(w => w.id === editingId ? { ...w, ...data } : w))
                addToast('Webinar updated!')
            } else {
                const newW = await addWebinar(data)
                setWebinars(prev => [...prev, newW])
                addToast('Webinar scheduled!')
            }
            setFormData(BLANK); setEditingId(null); setShowForm(false)
        } catch { addToast('Operation failed', 'error') }
    }

    const handleEdit = (w) => {
        setFormData({ ...w, tags: (w.tags || []).join(', '), capacity: String(w.capacity || '') })
        setEditingId(w.id); setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return
        await deleteWebinar(id)
        setWebinars(prev => prev.filter(w => w.id !== id))
        addToast('Event deleted.')
    }

    const handleStatusToggle = async (w) => {
        const newStatus = w.status === 'Upcoming' ? 'Completed' : 'Upcoming'
        await updateWebinar(w.id, { status: newStatus })
        setWebinars(prev => prev.map(x => x.id === w.id ? { ...x, status: newStatus } : x))
        addToast(`Status changed to ${newStatus}`)
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="page-container">
            <h1>📅 Manage Webinars & Workshops</h1>
            <p className="subtitle">Schedule, edit, and manage educational events</p>

            <section className="section">
                <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(BLANK) }}>
                    {showForm ? '✕ Cancel' : '+ Schedule New Event'}
                </button>
            </section>

            {showForm && (
                <section className="section">
                    <h2>{editingId ? 'Edit Event' : 'Schedule New Event'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group"><label>Title *</label><input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Event title" /></div>
                            <div className="form-group"><label>Type *</label><select name="type" value={formData.type} onChange={handleChange}><option>Webinar</option><option>Workshop</option></select></div>
                            <div className="form-group"><label>Category *</label><select name="category" value={formData.category} onChange={handleChange}><option value="">Select…</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                            <div className="form-group"><label>Speaker *</label><input type="text" name="speaker" value={formData.speaker} onChange={handleChange} placeholder="Speaker name" /></div>
                            <div className="form-group"><label>Date *</label><input type="date" name="date" value={formData.date} onChange={handleChange} /></div>
                            <div className="form-group"><label>Time *</label><input type="time" name="time" value={formData.time} onChange={handleChange} /></div>
                            <div className="form-group"><label>Duration</label><input type="text" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g. 90 min" /></div>
                            <div className="form-group"><label>Capacity</label><input type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="200" /></div>
                            <div className="form-group"><label>Platform</label><select name="platform" value={formData.platform} onChange={handleChange}><option>Zoom</option><option>Google Meet</option><option>Microsoft Teams</option><option>Other</option></select></div>
                            <div className="form-group"><label>Emoji Icon</label><input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="📹" /></div>
                        </div>
                        <div className="form-group"><label>Speaker Bio</label><textarea name="speakerBio" value={formData.speakerBio} onChange={handleChange} rows="2" placeholder="Brief bio" /></div>
                        <div className="form-group"><label>Description *</label><textarea name="description" value={formData.description} onChange={handleChange} rows="3" placeholder="Event description" /></div>
                        <div className="form-group"><label>Tags (comma-separated)</label><input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="AI, ML, Beginner" /></div>
                        <div className="button-group">
                            <button type="submit" className="btn btn-primary">{editingId ? '✓ Update Event' : '✓ Schedule Event'}</button>
                            <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setFormData(BLANK) }}>Cancel</button>
                        </div>
                    </form>
                </section>
            )}

            <section className="section">
                <h2>All Events ({webinars.length})</h2>
                <div className="table-responsive">
                    <table className="table">
                        <thead><tr><th>Event</th><th>Type</th><th>Speaker</th><th>Date</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
                        <tbody>
                            {webinars.map(w => (
                                <tr key={w.id}>
                                    <td><strong>{w.image} {w.title}</strong><br /><small style={{ color: '#888' }}>{w.category}</small></td>
                                    <td>{w.type}</td>
                                    <td>{w.speaker}</td>
                                    <td>{w.date} {w.time}</td>
                                    <td>{w.capacity}</td>
                                    <td>
                                        <button style={{ background: w.status === 'Upcoming' ? '#fff3cd' : '#d4edda', color: w.status === 'Upcoming' ? '#856404' : '#155724', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }} onClick={() => handleStatusToggle(w)}>
                                            {w.status}
                                        </button>
                                    </td>
                                    <td>
                                        <div className="button-group" style={{ gap: '0.4rem' }}>
                                            <button className="btn btn-small" onClick={() => handleEdit(w)}>Edit</button>
                                            <button className="btn btn-danger" style={{ fontSize: '0.95rem', padding: '0.3rem 0.6rem' }} onClick={() => handleDelete(w.id)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}
