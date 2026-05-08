import { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      validateToken()
    } else {
      localStorage.removeItem('token')
      setLoading(false)
    }
  }, [token])

  const validateToken = async () => {
    try {
      const response = await authAPI.getMe()
      setUser(response.data.user)
    } catch (error) {
      console.error('Token validation failed:', error)
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password })
    const { user: userData, token: authToken } = response.data
    setUser(userData)
    setToken(authToken)
    return userData
  }

  const signup = async (userData) => {
    const response = await authAPI.signup(userData)
    const { user: newUser, token: authToken } = response.data
    setUser(newUser)
    setToken(authToken)
    return newUser
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
  }

  const isAdmin = () => user?.role === 'Admin'
  const isMember = () => user?.role === 'Member'

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      signup,
      logout,
      isAdmin,
      isMember
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
