import { get, set } from './storageService'

const KEY = 'forum_posts'

export function getPostsByWebinar(webinarId) {
    const all = get(KEY) || []
    return all.filter(p => p.webinarId === webinarId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getAllPosts() {
    return get(KEY) || []
}

export function addPost(data) {
    const all = get(KEY) || []
    const post = {
        id: crypto.randomUUID(),
        webinarId: data.webinarId,
        webinarTitle: data.webinarTitle,
        userId: data.userId,
        userName: data.userName,
        content: data.content,
        replies: [],
        createdAt: new Date().toISOString()
    }
    all.push(post)
    set(KEY, all)
    return post
}

export function addReply(postId, data) {
    const all = get(KEY) || []
    const idx = all.findIndex(p => p.id === postId)
    if (idx === -1) throw new Error('Post not found')
    const reply = {
        id: crypto.randomUUID(),
        userId: data.userId,
        userName: data.userName,
        content: data.content,
        createdAt: new Date().toISOString()
    }
    all[idx].replies.push(reply)
    set(KEY, all)
    return reply
}

export function deletePost(postId) {
    const all = get(KEY) || []
    set(KEY, all.filter(p => p.id !== postId))
}
