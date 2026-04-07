import React from 'react'

export default function LoadingSpinner({ text = 'Loading...' }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '3rem', gap: '1rem'
        }}>
            <div style={{
                width: '40px', height: '40px',
                border: '4px solid #e2e8f0',
                borderTopColor: '#667eea',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite'
            }} />
            <p style={{ color: '#667eea', fontWeight: '500' }}>{text}</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
