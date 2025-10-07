// Authentication storage utilities
import { isTokenExpired } from './tokenValidation'

export interface StoredAuthData {
  user: {
    id: string // UUID format: usr_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    name: string
    phone: string
    email?: string
    role: 'user' | 'admin'
    isVerified?: boolean
    createdAt?: string
    updatedAt?: string
  }
  token: string
  timestamp: number
}

const AUTH_STORAGE_KEY = 'requeza_auth_data'
const TOKEN_EXPIRY_HOURS = 24 // Token expires after 24 hours

// Save authentication data to localStorage
export const saveAuthData = (user: any, token: string): void => {
  if (typeof window === 'undefined') return
  
  const authData: StoredAuthData = {
    user,
    token,
    timestamp: Date.now()
  }
  
  try {
    // Check if there's already a different user logged in
    const existingAuth = loadAuthData()
    if (existingAuth && existingAuth.user.id !== user.id) {
      console.log('🔄 Switching users:', {
        from: existingAuth.user.phone,
        to: user.phone,
        fromName: existingAuth.user.name,
        toName: user.name
      })
    }
    
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData))
    console.log('✅ Auth data saved for user:', user.phone, user.name)
  } catch (error) {
    console.error('Failed to save auth data:', error)
  }
}

// Load authentication data from localStorage
export const loadAuthData = (): StoredAuthData | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return null
    
    const authData: StoredAuthData = JSON.parse(stored)
    
    // Check if token is expired
    if (isTokenExpired(authData.timestamp)) {
      // Token expired, remove it
      clearAuthData()
      return null
    }
    
    return authData
  } catch (error) {
    console.error('Failed to load auth data:', error)
    clearAuthData()
    return null
  }
}

// Clear authentication data from localStorage
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return
  
  try {
    const existingAuth = loadAuthData()
    if (existingAuth) {
      console.log('🚪 Logging out user:', existingAuth.user.phone, existingAuth.user.name)
    }
    localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear auth data:', error)
  }
}

// Check if user is authenticated (has valid token)
export const isAuthenticated = (): boolean => {
  const authData = loadAuthData()
  return authData !== null
}

// Get current user info for debugging
export const getCurrentUserInfo = (): { phone: string; name: string; email?: string } | null => {
  const authData = loadAuthData()
  if (!authData) return null
  
  return {
    phone: authData.user.phone,
    name: authData.user.name,
    email: authData.user.email
  }
}

// Get stored token
export const getStoredToken = (): string | null => {
  const authData = loadAuthData()
  return authData?.token || null
}

// Get stored user
export const getStoredUser = () => {
  const authData = loadAuthData()
  return authData?.user || null
}
