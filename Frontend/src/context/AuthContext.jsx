import { createContext, useState, useEffect, useContext } from "react"
import {
  login as authLogin,
  logout as authLogout,
  getCurrentUser,
  isAuthenticated as checkAuth,
  fetchUserProfile
} from "../services/authService"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user từ localStorage khi mount
  useEffect(() => {
    const savedUser = getCurrentUser()
    if (savedUser && checkAuth()) {
      setUser(savedUser)
    } else {
      // Nếu token hết hạn, xóa dữ liệu cũ
      if (savedUser && !checkAuth()) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  // Login function
  const login = async (email, password) => {
    const result = await authLogin(email, password)
    setUser(result.user)
    return result
  }

  // Logout function
  const logout = async () => {
    await authLogout()
    setUser(null)
  }

  // Refresh user profile from API
  const refreshUser = async () => {
    const updatedUser = await fetchUserProfile()
    if (updatedUser) {
      setUser(updatedUser)
    }
  }

  // Check if authenticated
  const isAuthenticated = () => {
    return !!user && checkAuth()
  }

  // Get user role
  const role = user?.role || null

  const value = {
    user,
    setUser,
    login,
    logout,
    refreshUser,
    isAuthenticated,
    role,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook để sử dụng AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}