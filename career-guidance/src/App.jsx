import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './styles/Common.css'

import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

import Landing from './pages/Landing'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import AdminSignUp from './pages/AdminSignUp'
import SignUp from './pages/SignUp'
import UserDashboard from './pages/UserDashboard'
import BrowseWebinars from './pages/BrowseWebinars'
import MyRegistrations from './pages/MyRegistrations'
import LiveSession from './pages/LiveSession'
import Resources from './pages/Resources'
import UserProfile from './pages/UserProfile'
import AdminDashboard from './pages/AdminDashboard'
import AdminWebinars from './pages/AdminWebinars'
import AdminRegistrations from './pages/AdminRegistrations'
import AdminResources from './pages/AdminResources'
import AdminUsers from './pages/AdminUsers'

// New feature pages
import Calendar from './pages/Calendar'
import CertificatePage from './pages/CertificatePage'
import DiscussionBoard from './pages/DiscussionBoard'
import ProgressTracker from './pages/ProgressTracker'
import SpeakerProfile from './pages/SpeakerProfile'
import AdminAnnouncements from './pages/AdminAnnouncements'
import UserAnnouncements from './pages/UserAnnouncements'
import SavedWebinars from './pages/SavedWebinars'

function AppRoutes() {
  const { user, role } = useAuth()

  return (
    <>
      {user && <Navbar />}
      <Routes>
        {/* Public / Auth */}
        <Route path="/" element={user ? <Navigate to={role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace /> : <Landing />} />
        <Route path="/login" element={user && role === 'user' ? <Navigate to="/user/dashboard" replace /> : user && role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : <Login />} />
        <Route path="/admin/login" element={user && role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : user && role === 'user' ? <Navigate to="/user/dashboard" replace /> : <AdminLogin />} />
        <Route path="/signup" element={user ? <Navigate to="/user/dashboard" replace /> : <SignUp />} />
        <Route path="/admin/signup" element={user && role === 'admin' ? <Navigate to="/admin/dashboard" replace /> : user && role === 'user' ? <Navigate to="/user/dashboard" replace /> : <AdminSignUp />} />

        {/* User routes */}
        <Route path="/user/dashboard" element={<ProtectedRoute requiredRole="user"><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/webinars" element={<ProtectedRoute requiredRole="user"><BrowseWebinars /></ProtectedRoute>} />
        <Route path="/user/registrations" element={<ProtectedRoute requiredRole="user"><MyRegistrations /></ProtectedRoute>} />
        <Route path="/user/live/:id" element={<ProtectedRoute requiredRole="user"><LiveSession /></ProtectedRoute>} />
        <Route path="/user/resources" element={<ProtectedRoute requiredRole="user"><Resources /></ProtectedRoute>} />
        <Route path="/user/profile" element={<ProtectedRoute requiredRole="user"><UserProfile /></ProtectedRoute>} />

        {/* New user routes */}
        <Route path="/user/calendar" element={<ProtectedRoute requiredRole="user"><Calendar /></ProtectedRoute>} />
        <Route path="/user/certificates" element={<ProtectedRoute requiredRole="user"><CertificatePage /></ProtectedRoute>} />
        <Route path="/user/forum" element={<ProtectedRoute requiredRole="user"><DiscussionBoard /></ProtectedRoute>} />
        <Route path="/user/progress" element={<ProtectedRoute requiredRole="user"><ProgressTracker /></ProtectedRoute>} />
        <Route path="/user/saved" element={<ProtectedRoute requiredRole="user"><SavedWebinars /></ProtectedRoute>} />
        <Route path="/user/announcements" element={<ProtectedRoute requiredRole="user"><UserAnnouncements /></ProtectedRoute>} />
        <Route path="/speaker/:speakerName" element={<ProtectedRoute requiredRole="user"><SpeakerProfile /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/webinars" element={<ProtectedRoute requiredRole="admin"><AdminWebinars /></ProtectedRoute>} />
        <Route path="/admin/registrations" element={<ProtectedRoute requiredRole="admin"><AdminRegistrations /></ProtectedRoute>} />
        <Route path="/admin/resources" element={<ProtectedRoute requiredRole="admin"><AdminResources /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="admin"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/announcements" element={<ProtectedRoute requiredRole="admin"><AdminAnnouncements /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Router>
              <div className="app-container">
                <AppRoutes />
              </div>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
