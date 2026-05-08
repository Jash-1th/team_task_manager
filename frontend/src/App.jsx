import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import './index.css'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">Loading...</div>
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
