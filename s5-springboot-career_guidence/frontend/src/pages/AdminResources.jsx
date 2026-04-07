import React, { useState, useEffect } from 'react'
import '../styles/Dashboard.css'
import { useToast } from '../context/ToastContext'
import { getResources, addResource, updateResource, deleteResource } from '../services/resourceService'
import { getWebinars } from '../services/webinarService'
import LoadingSpinner from '../components/LoadingSpinner'

const TYPES = ['Slides', 'Recording', 'Code', 'Template', 'Dataset', 'Notes', 'Other']
const BLANK = { webinarId: '', webinarTitle: '', title: '', type: 'Slides', description: '', fileUrl: '' }

export default function AdminResources() {
  const { addToast } = useToast()
  const [resources, setResources] = useState([])
  const [webinars, setWebinars] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(BLANK)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => { Promise.all([getResources(), getWebinars()]).then(([r, w]) => { setResources(r); setWebinars(w) }).finally(() => setLoading(false)) }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'webinarId') {
      const w = webinars.find(x => x.id === value)
      setFormData(p => ({ ...p, webinarId: value, webinarTitle: w ? w.title : '' }))
    } else {
      setFormData(p => ({ ...p, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.webinarId || !formData.type) { addToast('Fill required fields', 'error'); return }
    try {
      if (editingId) {
        await updateResource(editingId, formData)
        setResources(prev => prev.map(r => r.id === editingId ? { ...r, ...formData } : r))
        addToast('Resource updated!')
      } else {
        const newR = await addResource(formData)
        setResources(prev => [...prev, newR])
        addToast('Resource uploaded!')
      }
      setFormData(BLANK); setEditingId(null); setShowForm(false)
    } catch { addToast('Failed', 'error') }
  }

  const handleEdit = (r) => { setFormData({ ...r }); setEditingId(r.id); setShowForm(true) }
  const handleDelete = async (id) => { if (!window.confirm('Delete?')) return; await deleteResource(id); setResources(prev => prev.filter(r => r.id !== id)); addToast('Deleted.') }

  if (loading) return <LoadingSpinner />

  return (
    <div className="page-container">
      <h1>📁 Manage Post-Event Resources</h1>
      <p className="subtitle">Upload and manage slides, recordings, and materials for completed events</p>

      <section className="section">
        <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(BLANK) }}>
          {showForm ? '✕ Cancel' : '+ Upload New Resource'}
        </button>
      </section>

      {showForm && (
        <section className="section">
          <h2>{editingId ? 'Edit Resource' : 'Upload New Resource'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group"><label>Linked Webinar *</label>
              <select name="webinarId" value={formData.webinarId} onChange={handleChange}>
                <option value="">Select event…</option>
                {webinars.map(w => <option key={w.id} value={w.id}>{w.image} {w.title} ({w.status})</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group"><label>Resource Title *</label><input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Session Recording" /></div>
              <div className="form-group"><label>Type *</label><select name="type" value={formData.type} onChange={handleChange}>{TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
            </div>
            <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="2" placeholder="Brief description" /></div>
            <div className="form-group"><label>File URL / Link</label><input type="url" name="fileUrl" value={formData.fileUrl} onChange={handleChange} placeholder="https://..." /></div>
            <div className="button-group">
              <button type="submit" className="btn btn-primary">{editingId ? '✓ Update' : '✓ Upload Resource'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setFormData(BLANK) }}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      <section className="section">
        <h2>Resources ({resources.length})</h2>
        {resources.length === 0 ? <div className="card"><p>No resources uploaded yet.</p></div> : (
          <div className="table-responsive">
            <table className="table">
              <thead><tr><th>Title</th><th>Webinar</th><th>Type</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {resources.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.title}</strong></td>
                    <td>{r.webinarTitle}</td>
                    <td><span style={{ background: '#667eea', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '1rem' }}>{r.type}</span></td>
                    <td>{r.description}</td>
                    <td>
                      <div className="button-group" style={{ gap: '0.4rem' }}>
                        <button className="btn btn-small" onClick={() => handleEdit(r)}>Edit</button>
                        <button className="btn btn-danger" style={{ fontSize: '0.95rem', padding: '0.3rem 0.6rem' }} onClick={() => handleDelete(r.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
