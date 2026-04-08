import axios from 'axios'

const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:10000'
    : "https://fsad-project-1-x1yl.onrender.com";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor — handle 401 (expired/invalid token)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid — clear session and redirect to login
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
            // Only redirect if not already on a public page
            const publicPaths = ['/', '/login', '/signup', '/admin/login', '/admin/signup']
            if (!publicPaths.includes(window.location.pathname)) {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api
