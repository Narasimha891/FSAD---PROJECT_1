import { get, set } from './storageService'

const KEY = 'notifications'

export function getNotifications(userId) {
    const all = get(KEY) || []
    return all.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getUnreadCount(userId) {
    const all = get(KEY) || []
    return all.filter(n => n.userId === userId && !n.read).length
}

export function addNotification(userId, message, type = 'info') {
    const all = get(KEY) || []
    const notification = {
        id: crypto.randomUUID(),
        userId,
        message,
        type, // 'info', 'success', 'warning', 'reminder'
        read: false,
        createdAt: new Date().toISOString()
    }
    all.push(notification)
    set(KEY, all)
    return notification
}

export function markAsRead(notificationId) {
    const all = get(KEY) || []
    const idx = all.findIndex(n => n.id === notificationId)
    if (idx !== -1) { all[idx].read = true; set(KEY, all) }
}

export function markAllAsRead(userId) {
    const all = get(KEY) || []
    all.forEach(n => { if (n.userId === userId) n.read = true })
    set(KEY, all)
}

export function deleteNotification(notificationId) {
    const all = get(KEY) || []
    set(KEY, all.filter(n => n.id !== notificationId))
}
