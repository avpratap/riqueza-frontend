import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { createUser, findUserByPhone, userExists } from '@/lib/userStorage'
import { saveAuthData, loadAuthData, clearAuthData } from '@/lib/authStorage'
import cartTransferService from '@/lib/cartTransferService'
import { clearCart } from './cartSlice'
import { RootState } from '../store'

export interface User {
  id: string // UUID format: usr_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  name: string
  phone: string
  email?: string
  avatar?: string
  role: 'user' | 'admin'
  isVerified?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  otpSent: boolean
  verificationId: string | null
  cartTransferCompleted: boolean
}

// Load initial state from localStorage if available
const loadInitialAuthState = (): AuthState => {
  if (typeof window !== 'undefined') {
    try {
      const authData = loadAuthData()
      if (authData) {
        return {
          user: authData.user,
          token: authData.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          otpSent: false,
          verificationId: null,
          cartTransferCompleted: false,
        }
      }
    } catch (error) {
      console.error('Failed to load initial auth state:', error)
    }
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    otpSent: false,
    verificationId: null,
    cartTransferCompleted: false,
  }
}

const initialState: AuthState = loadInitialAuthState()

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await new Promise<User>((resolve) => {
        setTimeout(() => {
          resolve({
            id: '1',
            name: 'John Doe',
            email: credentials.email,
            phone: '+1234567890',
            role: 'user',
            isVerified: true
          })
        }, 1000)
      })
      
      const token = 'mock-jwt-token'
      return { user: response, token }
    } catch (error) {
      return rejectWithValue('Login failed')
    }
  }
)

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (phoneNumber: string, { rejectWithValue }) => {
    try {
      // Check if we're on client side
      if (typeof window === 'undefined') {
        throw new Error('OTP can only be sent from client side')
      }

      
      // Call our backend SMS API
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send OTP')
      }
      
      // Store verification ID globally for verification
      ;(window as any).currentVerificationId = data.verificationId
      
      return {
        verificationId: data.verificationId,
        isMock: false
      }
      
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send OTP')
    }
  }
)

// Separate function to just verify OTP without creating user
export const verifyOTPOnly = createAsyncThunk(
  'auth/verifyOTPOnly',
  async ({ verificationId, otp, phoneNumber }: {
    verificationId: string;
    otp: string;
    phoneNumber: string;
  }, { rejectWithValue }) => {
    try {
      if (typeof window === 'undefined') {
        throw new Error('OTP can only be verified from client side')
      }

      const response = await fetch('http://localhost:5000/api/auth/verify-otp-only', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verificationId,
          otp,
          phoneNumber
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid OTP')
      }
      
      return { success: true }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Invalid OTP')
    }
  }
)

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ verificationId, otp, phoneNumber, name, email, isSignup }: {
    verificationId: string;
    otp: string;
    phoneNumber: string;
    name?: string;
    email?: string;
    isSignup?: boolean;
  }, { rejectWithValue }) => {
    try {
      // Check if we're on client side
      if (typeof window === 'undefined') {
        throw new Error('OTP can only be verified from client side')
      }

      
      if (isSignup) {
        // Signup flow: Call backend signup API
        if (!name) {
          throw new Error('Name is required for signup')
        }
        
        const response = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            phoneNumber,
            name,
            email,
            otp,
            verificationId
          }),
        })
        
        const data = await response.json()
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Signup failed')
        }
        
        return {
          user: data.user,
          token: data.token
        }
      } else {
        // Login flow: Call backend login API
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            phoneNumber,
            otp,
            verificationId
          }),
        })
        
        const data = await response.json()
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Login failed')
        }
        
        return {
          user: data.user,
          token: data.token
        }
      }
      
    } catch (error: any) {
      return rejectWithValue(error.message || 'Invalid OTP')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    // Simulate logout API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return null
  }
)

// Transfer guest cart to authenticated user
export const transferGuestCart = createAsyncThunk(
  'auth/transferGuestCart',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Cart transfer can only be performed on client side')
      }

      // Check if transfer has already been completed
      const state = getState() as RootState
      if (state.auth.cartTransferCompleted) {
        console.log('ℹ️ Cart transfer already completed, skipping...')
        return { success: true, message: 'Cart transfer already completed' }
      }

      const guestSessionId = localStorage.getItem('guestSessionId')
      const cartData = localStorage.getItem('cartState')

      console.log('🔄 Starting cart transfer process...')
      console.log('📊 Cart transfer details:', { 
        hasGuestSessionId: !!guestSessionId,
        hasLocalStorageCart: !!cartData,
        guestSessionId: guestSessionId ? guestSessionId.substring(0, 20) + '...' : 'none'
      })

      // Try database-based transfer first (if guest session exists)
      // Don't check localStorage - the cart might be in database only
      if (guestSessionId) {
        try {
          console.log('🔄 Attempting database-based cart transfer...')
          const result = await cartTransferService.transferGuestCartToUser(guestSessionId)
          
          if (result.success) {
            console.log('✅ Database cart transfer successful:', result.message)
            cartTransferService.clearGuestSessionId()
            // Don't clear Redux cart immediately - let it persist until user navigates
            // dispatch(clearCartAfterTransfer())
            
            return result
          } else {
            console.warn('⚠️ Database cart transfer failed, trying localStorage transfer:', result.error)
          }
        } catch (error) {
          console.warn('⚠️ Database cart transfer error, trying localStorage transfer:', error)
        }
      }

      // Fallback to localStorage-based transfer (only if localStorage has cart data)
      if (cartData) {
        const parsed = JSON.parse(cartData)
        if (parsed.items && parsed.items.length > 0) {
          console.log('🔄 Attempting localStorage-based cart transfer...')
          const result = await cartTransferService.transferLocalStorageCartToUser()
          
          if (result.success) {
            console.log('✅ localStorage cart transfer successful:', result.message)
            return result
          } else {
            console.warn('⚠️ localStorage cart transfer failed:', result.error)
          }
        }
      }

      // If we reach here, no transfer was successful or needed
      console.log('ℹ️ No cart transfer needed or no cart data available')
      return { success: false, message: 'No cart data to transfer' }
    } catch (error: any) {
      console.error('❌ Cart transfer error:', error)
      return rejectWithValue(error.message || 'Failed to transfer cart')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
    resetOTPState: (state) => {
      state.otpSent = false
      state.verificationId = null
      state.error = null
    },
    initializeAuth: (state) => {
      // Re-load auth state from localStorage
      if (typeof window !== 'undefined') {
        try {
          const authData = loadAuthData()
          if (authData) {
            state.user = authData.user
            state.token = authData.token
            state.isAuthenticated = true
            state.error = null
          } else {
            state.user = null
            state.token = null
            state.isAuthenticated = false
          }
        } catch (error) {
          console.error('Failed to initialize auth state:', error)
          state.user = null
          state.token = null
          state.isAuthenticated = false
        }
      }
    },
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload
      
      // Log user switch if different user
      if (state.user && state.user.id !== user.id) {
        console.log('🔄 User switch detected:', {
          from: state.user.phone,
          to: user.phone,
          fromName: state.user.name,
          toName: user.name
        })
      }
      
      state.isAuthenticated = true
      state.user = user
      state.token = token
      state.otpSent = false
      state.verificationId = null
      state.error = null
      
      // Save to localStorage
      saveAuthData(user, token)
      console.log('✅ User logged in:', user.phone, user.name)
      
      // Cart transfer will be handled by the AuthProvider after login
    },
    logout: (state) => {
      // Log logout
      if (state.user) {
        console.log('🚪 User logging out:', state.user.phone, state.user.name)
      }
      
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.otpSent = false
      state.verificationId = null
      state.error = null
      
      // Clear from localStorage
      clearAuthData()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.otpSent = false
        state.verificationId = null
        
        // Clear from localStorage
        clearAuthData()
      })
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.isLoading = false
        state.otpSent = true
        state.verificationId = action.payload.verificationId
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.otpSent = false
        state.verificationId = null
        
        // Save to localStorage
        saveAuthData(action.payload.user, action.payload.token)
        
        // Cart transfer will be handled by the AuthProvider after login
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(verifyOTPOnly.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyOTPOnly.fulfilled, (state) => {
        state.isLoading = false
        // Don't set authentication here, just verify OTP
      })
      .addCase(verifyOTPOnly.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(transferGuestCart.pending, (state) => {
        // Cart transfer in progress
      })
      .addCase(transferGuestCart.fulfilled, (state, action) => {
        // Cart transfer completed
        if (action.payload.success) {
          console.log('✅ Cart transfer completed in Redux')
          // Clear the cart state after successful transfer to prevent duplicates
          state.cartTransferCompleted = true
          // Clear any stored cart data to prevent re-transfer
          if (typeof window !== 'undefined') {
            localStorage.removeItem('cartState')
            localStorage.removeItem('guestSessionId')
          }
        }
      })
      .addCase(transferGuestCart.rejected, (state, action) => {
        console.error('❌ Cart transfer failed in Redux:', action.payload)
      })
  },
})

export const { clearError, updateUser, resetOTPState, initializeAuth, login, logout } = authSlice.actions
export default authSlice.reducer
