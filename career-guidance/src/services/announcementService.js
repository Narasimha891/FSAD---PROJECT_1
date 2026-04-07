import { get, set } from './storageService'

const KEY = 'announcements'

function seedAnnouncements() {
    const existing = get(KEY)
    if (existing) return
    set(KEY, [
        {
            id: 'ann-1',
            title: 'Welcome to EduWebinar! 🎉',
            content: 'We are excited to launch our new webinar platform. Browse upcoming events, register, and start your learning journey today!',
            priority: 'info',
            createdAt: new Date().toISOString(),
            createdBy: 'Admin'
        },
        {
            id: 'ann-2',
            title: 'New Workshop Series Announced 🚀',
            content: 'We have partnered with industry leaders to bring you hands-on workshops in Machine Learning, Cloud Architecture, and UI/UX Design. Check the Webinars page for details.',
            priority: 'important',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            createdBy: 'Admin'
        }
    ])
}
seedAnnouncements()

export function getAnnouncements() {
    return (get(KEY) || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function addAnnouncement(data) {
    const all = get(KEY) || []
    const announcement = {
        id: crypto.randomUUID(),
        title: data.title,
        content: data.content,
        priority: data.priority || 'info',
        createdAt: new Date().toISOString(),
        createdBy: data.createdBy || 'Admin'
    }
    all.push(announcement)
    set(KEY, all)
    return announcement
}

export function updateAnnouncement(id, data) {
    const all = get(KEY) || []
    const idx = all.findIndex(a => a.id === id)
    if (idx === -1) throw new Error('Announcement not found')
    all[idx] = { ...all[idx], ...data }
    set(KEY, all)
    return all[idx]
}

export function deleteAnnouncement(id) {
    const all = get(KEY) || []
    set(KEY, all.filter(a => a.id !== id))
}
