// Token validation utilities
export interface TokenValidationResult {
  isValid: boolean
  user?: any
  error?: string
}

// Validate JWT token with backend
export const validateToken = async (token: string): Promise<TokenValidationResult> => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      return {
        isValid: true,
        user: data.user
      }
    } else {
      return {
        isValid: false,
        error: 'Token validation failed'
      }
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'Network error during token validation'
    }
  }
}

// Check if token is expired (basic check)
export const isTokenExpired = (timestamp: number): boolean => {
  const now = Date.now()
  const tokenAge = now - timestamp
  const tokenExpiry = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
  
  return tokenAge > tokenExpiry
}
