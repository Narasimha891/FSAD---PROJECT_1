import { get, set } from './storageService'

const KEY = 'bookmarks'

export function getBookmarks(userId) {
    const all = get(KEY) || []
    return all.filter(b => b.userId === userId)
}

export function isBookmarked(userId, webinarId) {
    const all = get(KEY) || []
    return all.some(b => b.userId === userId && b.webinarId === webinarId)
}

export function toggleBookmark(userId, webinarId, webinarTitle) {
    const all = get(KEY) || []
    const exists = all.findIndex(b => b.userId === userId && b.webinarId === webinarId)
    if (exists !== -1) {
        all.splice(exists, 1)
        set(KEY, all)
        return false // removed
    }
    all.push({
        id: crypto.randomUUID(),
        userId,
        webinarId,
        webinarTitle,
        createdAt: new Date().toISOString()
    })
    set(KEY, all)
    return true // added
}

export function removeBookmark(userId, webinarId) {
    const all = get(KEY) || []
    set(KEY, all.filter(b => !(b.userId === userId && b.webinarId === webinarId)))
}
