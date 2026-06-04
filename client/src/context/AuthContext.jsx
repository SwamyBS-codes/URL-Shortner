import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  fetchCurrentUser,
  getStoredToken,
  login as loginApi,
  register as registerApi,
  setStoredToken,
} from '../api/authApi'
import { setAuthToken } from '../api/httpClient'
import { useToast } from './ToastContext'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { addToast } = useToast()
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')

  const hydrateSession = useCallback(async () => {
    const token = getStoredToken()
    if (!token) {
      setAuthToken(null)
      setUser(null)
      setIsAuthLoading(false)
      return
    }

    setAuthToken(token)
    try {
      const profile = await fetchCurrentUser()
      setUser(profile)
    } catch {
      setStoredToken(null)
      setAuthToken(null)
      setUser(null)
    } finally {
      setIsAuthLoading(false)
    }
  }, [])

  useEffect(() => {
    hydrateSession()
  }, [hydrateSession])

  const openAuthModal = useCallback((mode = 'login') => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false)
  }, [])

  const login = useCallback(
    async (credentials) => {
      const data = await loginApi(credentials)
      setStoredToken(data.token)
      setAuthToken(data.token)
      setUser(data.user)
      closeAuthModal()
      addToast(`Welcome back, ${data.user.name}!`, 'success')
      return data.user
    },
    [addToast, closeAuthModal],
  )

  const register = useCallback(
    async (payload) => {
      const data = await registerApi(payload)
      setStoredToken(data.token)
      setAuthToken(data.token)
      setUser(data.user)
      closeAuthModal()
      addToast(`Account created. Welcome, ${data.user.name}!`, 'success')
      return data.user
    },
    [addToast, closeAuthModal],
  )

  const logout = useCallback(() => {
    setStoredToken(null)
    setAuthToken(null)
    setUser(null)
    addToast('Signed out successfully.', 'success')
  }, [addToast])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      authModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      login,
      register,
      logout,
    }),
    [
      user,
      isAuthLoading,
      authModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      login,
      register,
      logout,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
