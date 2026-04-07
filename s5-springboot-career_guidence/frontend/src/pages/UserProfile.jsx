import React, { useState, useEffect } from 'react'
import '../styles/Dashboard.css'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getProfile, updateProfile } from '../services/userService'
import { changePassword } from '../services/authService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function UserProfile() {
  const { user, refreshUser, logout } = useAuth()
  const { addToast } = useToast()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPwForm, setShowPwForm] = useState(false)
  const [pwData, setPwData] = useState({ old: '', newPw: '', confirm: '' })

  useEffect(() => { getProfile(user.id).then(setProfile).catch(() => addToast('Failed to load profile', 'error')).finally(() => setLoading(false)) }, [user])

  const handleChange = (e) => { const { name, value } = e.target; setProfile(p => ({ ...p, [name]: value })) }

  const handleSave = async () => {
    setSaving(true)
    try { const updated = await updateProfile(user.id, profile); setProfile(updated); refreshUser(); setIsEditing(false); addToast('Profile updated!') }
    catch (e) { addToast(e.message, 'error') } finally { setSaving(false) }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pwData.newPw !== pwData.confirm) { addToast('Passwords do not match', 'error'); return }
    if (pwData.newPw.length < 6) { addToast('Min 6 characters', 'error'); return }
    try { await changePassword(user.id, pwData.old, pwData.newPw); addToast('Password changed!'); setShowPwForm(false); setPwData({ old: '', newPw: '', confirm: '' }) }
    catch (e) { addToast(e.message, 'error') }
  }

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `my-profile-${Date.now()}.json`; a.click()
    addToast('Profile data downloaded!')
  }

  if (loading || !profile) return <LoadingSpinner />

  return (
    <div className="page-container">
      <h1>👤 My Profile</h1>
      <p className="subtitle">Manage your EduWebinar profile</p>

      <section className="section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>Profile Information</h2>
          <button className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`} onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={saving}>
            {saving ? 'Saving...' : isEditing ? '✓ Save Changes' : '✎ Edit Profile'}
          </button>
        </div>
        <div className="grid">
          <div className="card">
            <h3>Personal Information</h3>
            <div className="form-group"><label>Full Name</label><input type="text" name="name" value={profile.name || ''} onChange={handleChange} disabled={!isEditing} /></div>
            <div className="form-group"><label>Email</label><input type="email" value={profile.email || ''} disabled /></div>
            <div className="form-group"><label>Phone</label><input type="tel" name="phone" value={profile.phone || ''} onChange={handleChange} disabled={!isEditing} placeholder="Phone number" /></div>
          </div>
          <div className="card">
            <h3>Organization & Bio</h3>
            <div className="form-group"><label>Organization</label><input type="text" name="organization" value={profile.organization || ''} onChange={handleChange} disabled={!isEditing} placeholder="Company / University" /></div>
            <div className="form-group"><label>Bio</label><textarea name="bio" value={profile.bio || ''} onChange={handleChange} disabled={!isEditing} rows="4" placeholder="Tell us about yourself..." /></div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>⚙️ Account Settings</h2>
        <div className="grid">
          <div className="card">
            <h3>🔐 Password</h3>
            <p>Change your account password.</p>
            {!showPwForm ? <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setShowPwForm(true)}>Change Password</button> : (
              <form onSubmit={handleChangePassword} style={{ marginTop: '1rem' }}>
                <div className="form-group"><label>Current Password</label><input type="password" value={pwData.old} onChange={e => setPwData(p => ({ ...p, old: e.target.value }))} /></div>
                <div className="form-group"><label>New Password</label><input type="password" value={pwData.newPw} onChange={e => setPwData(p => ({ ...p, newPw: e.target.value }))} /></div>
                <div className="form-group"><label>Confirm</label><input type="password" value={pwData.confirm} onChange={e => setPwData(p => ({ ...p, confirm: e.target.value }))} /></div>
                <div className="button-group"><button type="submit" className="btn btn-primary">Update</button><button type="button" className="btn btn-secondary" onClick={() => { setShowPwForm(false); setPwData({ old: '', newPw: '', confirm: '' }) }}>Cancel</button></div>
              </form>
            )}
          </div>
          <div className="card"><h3>📥 Download Data</h3><p>Download your profile data as JSON.</p><button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={handleDownload}>Download My Data</button></div>
          <div className="card"><h3>🚪 Logout</h3><p>Sign out of your session.</p><button className="btn btn-danger" style={{ marginTop: '1rem' }} onClick={logout}>Logout</button></div>
        </div>
      </section>
    </div>
  )
}
