import { get, set } from './storageService'

const KEY = 'feedback'

export function getFeedback() {
    return get(KEY) || []
}

export function getFeedbackByWebinar(webinarId) {
    const all = get(KEY) || []
    return all.filter(f => f.webinarId === webinarId)
}

export function getAverageRating(webinarId) {
    const fb = getFeedbackByWebinar(webinarId)
    if (fb.length === 0) return 0
    return +(fb.reduce((sum, f) => sum + f.rating, 0) / fb.length).toFixed(1)
}

export function hasUserReviewed(webinarId, userId) {
    const all = get(KEY) || []
    return all.some(f => f.webinarId === webinarId && f.userId === userId)
}

export function addFeedback(data) {
    const all = get(KEY) || []
    const feedback = {
        id: crypto.randomUUID(),
        webinarId: data.webinarId,
        userId: data.userId,
        userName: data.userName,
        rating: data.rating,
        comment: data.comment || '',
        createdAt: new Date().toISOString()
    }
    all.push(feedback)
    set(KEY, all)
    return feedback
}

export function deleteFeedback(id) {
    const all = get(KEY) || []
    set(KEY, all.filter(f => f.id !== id))
}
