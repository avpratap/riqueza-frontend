'use client'

import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, logout, transferGuestCart } from '@/store/slices/authSlice'
import { loadAuthData } from '@/lib/authStorage'
import { validateToken } from '@/lib/tokenValidation'
import { RootState } from '@/store/store'

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useDispatch()
  const { cartTransferCompleted } = useSelector((state: RootState) => state.auth)
  const [isClient, setIsClient] = useState(false)
  const [hasAttemptedTransfer, setHasAttemptedTransfer] = useState(false)
  const [isTransferring, setIsTransferring] = useState(false)

  useEffect(() => {
    // Mark as client-side rendered
    setIsClient(true)
    
    const restoreAuthState = async () => {
      try {
        // Only run on client side to prevent hydration issues
        if (typeof window === 'undefined') return
        
        // Load stored auth data
        const authData = loadAuthData()
        
        if (authData) {
          // For now, restore auth state without backend validation
          // TODO: Add backend validation later for production
          dispatch(login({ user: authData.user, token: authData.token }))
          console.log('✅ Auth state restored from localStorage:', authData.user.name)
          
          // Check if cart transfer is needed after restoring auth state
          setTimeout(() => {
            // Prevent multiple transfer attempts
            if (hasAttemptedTransfer) {
              console.log('ℹ️ Cart transfer already attempted, skipping...')
              return
            }

            const cartData = localStorage.getItem('cartState')
            
            if (cartData && !hasAttemptedTransfer && !cartTransferCompleted && !isTransferring) {
              try {
                const parsed = JSON.parse(cartData)
                if (parsed.items && parsed.items.length > 0) {
                  console.log('🔄 Cart items detected after auth restore, transferring...')
                  console.log(`📊 Found ${parsed.items.length} items in localStorage`)
                  setHasAttemptedTransfer(true) // Mark as attempted
                  setIsTransferring(true) // Mark as transferring
                  
                  // Add a longer delay to prevent rapid calls
                  setTimeout(() => {
                    dispatch(transferGuestCart() as any).finally(() => {
                      setIsTransferring(false) // Reset transferring flag
                    })
                  }, 1000) // Increased delay to 1 second
                } else {
                  console.log('ℹ️ No cart items to transfer')
                }
              } catch (error) {
                console.error('❌ Error checking cart for transfer:', error)
                setIsTransferring(false) // Reset on error
              }
            } else if (hasAttemptedTransfer || cartTransferCompleted || isTransferring) {
              console.log('ℹ️ Cart transfer already attempted, completed, or in progress, skipping...')
            } else {
              console.log('ℹ️ No cart data found in localStorage')
            }
          }, 1500) // Wait 1.5 seconds for auth state to be fully established
        } else {
          console.log('ℹ️ No stored auth data found')
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error)
        // Clear any invalid stored data
        dispatch(logout())
      }
    }

    // Only run on client side
    if (typeof window !== 'undefined') {
      restoreAuthState()
    }
  }, [dispatch])

  // Prevent hydration mismatch by not rendering auth-dependent content on server
  if (!isClient) {
    return <>{children}</>
  }

  return <>{children}</>
}

export default AuthProvider
