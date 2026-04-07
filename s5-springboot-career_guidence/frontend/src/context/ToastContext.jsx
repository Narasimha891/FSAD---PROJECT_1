import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback((message, type = 'success') => {
        const id = crypto.randomUUID()
        setToasts((prev) => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 4000)
    }, [])

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div style={{
                position: 'fixed', top: '80px', right: '1.5rem',
                zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.75rem'
            }}>
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        onClick={() => removeToast(t.id)}
                        style={{
                            padding: '0.85rem 1.2rem',
                            borderRadius: '8px',
                            color: '#fff',
                            cursor: 'pointer',
                            maxWidth: '340px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                            background: t.type === 'error' ? '#e53e3e'
                                : t.type === 'warning' ? '#dd6b20'
                                    : '#38a169',
                            animation: 'slideIn 0.25s ease'
                        }}
                    >
                        <span style={{ fontSize: '1.1rem' }}>
                            {t.type === 'error' ? '✕' : t.type === 'warning' ? '⚠' : '✓'}
                        </span>
                        <span style={{ fontSize: '0.92rem' }}>{t.message}</span>
                    </div>
                ))}
            </div>
            <style>{`@keyframes slideIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }`}</style>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be inside <ToastProvider>')
    return ctx
}
