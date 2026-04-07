import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../styles/Dashboard.css'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getPostsByWebinar, addPost, addReply, deletePost } from '../services/forumService'
import { getWebinars } from '../services/webinarService'
import LoadingSpinner from '../components/LoadingSpinner'

export default function DiscussionBoard() {
    const { user } = useAuth()
    const { addToast } = useToast()
    const [searchParams] = useSearchParams()
    const webinarId = searchParams.get('webinarId')

    const [webinars, setWebinars] = useState([])
    const [selectedWebinar, setSelectedWebinar] = useState(webinarId || '')
    const [posts, setPosts] = useState([])
    const [newPostContent, setNewPostContent] = useState('')
    const [replyContent, setReplyContent] = useState({})
    const [replyingTo, setReplyingTo] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getWebinars().then(w => { setWebinars(w); setLoading(false) })
    }, [])

    useEffect(() => {
        if (selectedWebinar) {
            setPosts(getPostsByWebinar(selectedWebinar))
        }
    }, [selectedWebinar])

    const handlePost = () => {
        if (!newPostContent.trim()) return
        if (!selectedWebinar) { addToast('Select a webinar first', 'error'); return }
        const webinar = webinars.find(w => w.id === selectedWebinar)
        addPost({
            webinarId: selectedWebinar,
            webinarTitle: webinar?.title || '',
            userId: user.id,
            userName: user.name,
            content: newPostContent
        })
        setPosts(getPostsByWebinar(selectedWebinar))
        setNewPostContent('')
        addToast('Question posted!')
    }

    const handleReply = (postId) => {
        if (!replyContent[postId]?.trim()) return
        addReply(postId, {
            userId: user.id,
            userName: user.name,
            content: replyContent[postId]
        })
        setPosts(getPostsByWebinar(selectedWebinar))
        setReplyContent(prev => ({ ...prev, [postId]: '' }))
        setReplyingTo(null)
        addToast('Reply posted!')
    }

    const handleDelete = (postId) => {
        deletePost(postId)
        setPosts(getPostsByWebinar(selectedWebinar))
        addToast('Post deleted')
    }

    const timeSince = (dateStr) => {
        const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000)
        if (seconds < 60) return 'just now'
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        return `${Math.floor(hours / 24)}d ago`
    }

    if (loading) return <LoadingSpinner />

    return (
        <div className="page-container">
            <h1>💬 Discussion Board</h1>
            <p className="subtitle">Ask questions and share insights about webinars</p>

            <section className="section">
                <div className="form-group">
                    <label>Select Webinar</label>
                    <select value={selectedWebinar} onChange={e => setSelectedWebinar(e.target.value)}>
                        <option value="">-- Choose a webinar --</option>
                        {webinars.map(w => (
                            <option key={w.id} value={w.id}>{w.image} {w.title} ({w.status})</option>
                        ))}
                    </select>
                </div>
            </section>

            {selectedWebinar && (
                <>
                    <section className="section">
                        <h2>✍️ Post a Question</h2>
                        <div className="form-group">
                            <textarea
                                value={newPostContent}
                                onChange={e => setNewPostContent(e.target.value)}
                                placeholder="Ask a question or share your thoughts..."
                                rows="3"
                            />
                        </div>
                        <button className="btn btn-primary" onClick={handlePost}>Post Question</button>
                    </section>

                    <section className="section">
                        <h2>📋 Discussions ({posts.length})</h2>
                        {posts.length === 0 ? (
                            <div className="card"><p>No discussions yet. Be the first to ask a question!</p></div>
                        ) : (
                            posts.map(post => (
                                <div key={post.id} className="card" style={{ marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <strong style={{ color: 'var(--primary)' }}>{post.userName}</strong>
                                            <span style={{ color: 'var(--text-muted)', marginLeft: '0.75rem', fontSize: '0.9rem' }}>{timeSince(post.createdAt)}</span>
                                        </div>
                                        {post.userId === user.id && (
                                            <button className="btn btn-danger" style={{ padding: '0.25rem 0.6rem', fontSize: '0.85rem' }} onClick={() => handleDelete(post.id)}>🗑</button>
                                        )}
                                    </div>
                                    <p style={{ marginTop: '0.75rem', fontSize: '1.1rem', lineHeight: 1.7 }}>{post.content}</p>

                                    {/* Replies */}
                                    {post.replies.length > 0 && (
                                        <div style={{ marginTop: '1rem', paddingLeft: '1.5rem', borderLeft: '3px solid var(--primary-light)' }}>
                                            {post.replies.map(reply => (
                                                <div key={reply.id} style={{ marginBottom: '0.75rem' }}>
                                                    <strong style={{ color: 'var(--secondary)' }}>{reply.userName}</strong>
                                                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem', fontSize: '0.85rem' }}>{timeSince(reply.createdAt)}</span>
                                                    <p style={{ marginTop: '0.25rem' }}>{reply.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Reply form */}
                                    {replyingTo === post.id ? (
                                        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                type="text"
                                                value={replyContent[post.id] || ''}
                                                onChange={e => setReplyContent(prev => ({ ...prev, [post.id]: e.target.value }))}
                                                placeholder="Write a reply..."
                                                style={{ flex: 1, padding: '0.5rem 0.75rem', border: '2px solid var(--border)', borderRadius: '8px', fontSize: '1rem', fontFamily: 'inherit' }}
                                                onKeyDown={e => e.key === 'Enter' && handleReply(post.id)}
                                            />
                                            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => handleReply(post.id)}>Reply</button>
                                            <button className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem' }} onClick={() => setReplyingTo(null)}>✕</button>
                                        </div>
                                    ) : (
                                        <button className="btn btn-secondary" style={{ marginTop: '0.75rem', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }} onClick={() => setReplyingTo(post.id)}>
                                            💬 Reply ({post.replies.length})
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </section>
                </>
            )}
        </div>
    )
}
