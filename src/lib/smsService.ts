// SMS Service using Twilio (Free alternative to Firebase Phone Auth)
// Dynamic import to avoid compilation issues

// Twilio Configuration (Get these from https://console.twilio.com/)
const TWILIO_ACCOUNT_SID = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN
const TWILIO_PHONE_NUMBER = process.env.NEXT_PUBLIC_TWILIO_PHONE_NUMBER


// Initialize Twilio client
let twilioClient: any = null

// Initialize Twilio client on server side
const initializeTwilio = async () => {
  if (typeof window === 'undefined' && TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && !twilioClient) {
    try {
      console.log('🔄 Initializing Twilio client...')
      // Dynamic import to avoid compilation issues
      // @ts-ignore - Twilio module has typing issues
      const twilioModule = await import('twilio')
      const Twilio = twilioModule.default || twilioModule.Twilio
      twilioClient = new Twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
      console.log('✅ Twilio client initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Twilio client:', error)
    }
  } else if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.log('⚠️ Twilio credentials not found - using development mode')
  }
}

// Generate random 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Store OTPs temporarily (in production, use Redis or database)
// Using a global variable to persist across API calls
declare global {
  var __otpStorage: Map<string, { otp: string; timestamp: number; phoneNumber: string }> | undefined
}

const otpStorage = globalThis.__otpStorage || new Map<string, { otp: string; timestamp: number; phoneNumber: string }>()
globalThis.__otpStorage = otpStorage

// Debug function to log storage state (disabled in production)
const logStorageState = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('📦 OTP Storage State:')
    console.log('  Total OTPs stored:', otpStorage.size)
    for (const [id, data] of Array.from(otpStorage.entries())) {
      console.log(`  ${id}: ${data.otp} for ${data.phoneNumber} (${new Date(data.timestamp).toLocaleTimeString()})`)
    }
  }
}

// Clean up expired OTPs (older than 5 minutes)
const cleanupExpiredOTPs = () => {
  const now = Date.now()
  const fiveMinutes = 5 * 60 * 1000
  
  for (const [key, value] of Array.from(otpStorage.entries())) {
    if (now - value.timestamp > fiveMinutes) {
      otpStorage.delete(key)
    }
  }
}

// Send OTP via Twilio SMS
export const sendOTP = async (phoneNumber: string): Promise<{ success: boolean; verificationId?: string; error?: string; otp?: string }> => {
  try {
    // Initialize Twilio if not already done
    await initializeTwilio()
    
    // Clean up expired OTPs
    cleanupExpiredOTPs()
    
    // Generate OTP
    const otp = generateOTP()
    const verificationId = `twilio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Store OTP for verification
    otpStorage.set(verificationId, {
      otp,
      timestamp: Date.now(),
      phoneNumber
    })
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📤 OTP Sent:', {
        verificationId,
        otp,
        phoneNumber,
        timestamp: new Date().toLocaleTimeString()
      })
      logStorageState()
    }
    
    // For development: Use mock SMS if Twilio not configured
    if (!twilioClient || !TWILIO_ACCOUNT_SID) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📱 Development Mode - OTP not sent via SMS, but stored for verification')
        console.log('🔑 Generated OTP:', otp)
      }
      return {
        success: true,
        verificationId,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined // Return OTP only in development
      }
    }
    
    // Send real SMS via Twilio
    console.log('📱 Sending SMS via Twilio to:', phoneNumber)
    const message = await twilioClient.messages.create({
      body: `Your Requeza Electric OTP is: ${otp}. Valid for 5 minutes.`,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber
    })
    
    console.log('✅ SMS sent successfully:', message.sid)
    return {
      success: true,
      verificationId
    }
    
  } catch (error: any) {
    console.error('SMS sending failed:', error)
    return {
      success: false,
      error: error.message || 'Failed to send SMS'
    }
  }
}

// Verify OTP without consuming it (for signup flow)
export const verifyOTPOnly = async (verificationId: string, enteredOTP: string, phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 verifyOTPOnly called:', {
        verificationId,
        enteredOTP,
        phoneNumber,
        timestamp: new Date().toLocaleTimeString()
      })
      logStorageState()
    }
    
    // Clean up expired OTPs
    cleanupExpiredOTPs()
    
    // Get stored OTP
    const storedData = otpStorage.get(verificationId)
    
    if (!storedData) {
      return {
        success: false,
        error: 'OTP expired or invalid verification ID'
      }
    }
    
    // Check if phone numbers match
    if (storedData.phoneNumber !== phoneNumber) {
      return {
        success: false,
        error: 'Phone number mismatch'
      }
    }
    
    // Check if OTP is correct
    if (storedData.otp !== enteredOTP) {
      return {
        success: false,
        error: 'Invalid OTP'
      }
    }
    
    // Check if OTP is expired (5 minutes)
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000
    
    if (now - storedData.timestamp > fiveMinutes) {
      otpStorage.delete(verificationId)
      return {
        success: false,
        error: 'OTP expired'
      }
    }
    
    // OTP verified successfully - DON'T delete it yet (for signup flow)
    return {
      success: true
    }
    
  } catch (error: any) {
    console.error('OTP verification failed:', error)
    return {
      success: false,
      error: error.message || 'OTP verification failed'
    }
  }
}

// Verify OTP and consume it (for login flow)
export const verifyOTP = async (verificationId: string, enteredOTP: string, phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 verifyOTP called:', {
        verificationId,
        enteredOTP,
        phoneNumber,
        timestamp: new Date().toLocaleTimeString()
      })
      logStorageState()
    }
    
    // Clean up expired OTPs
    cleanupExpiredOTPs()
    
    // Get stored OTP
    const storedData = otpStorage.get(verificationId)
    
    if (!storedData) {
      return {
        success: false,
        error: 'OTP expired or invalid verification ID'
      }
    }
    
    // Check if phone numbers match
    if (storedData.phoneNumber !== phoneNumber) {
      return {
        success: false,
        error: 'Phone number mismatch'
      }
    }
    
    // Check if OTP is correct
    if (storedData.otp !== enteredOTP) {
      return {
        success: false,
        error: 'Invalid OTP'
      }
    }
    
    // Check if OTP is expired (5 minutes)
    const now = Date.now()
    const fiveMinutes = 5 * 60 * 1000
    
    if (now - storedData.timestamp > fiveMinutes) {
      otpStorage.delete(verificationId)
      return {
        success: false,
        error: 'OTP expired'
      }
    }
    
    // OTP verified successfully
    otpStorage.delete(verificationId)
    
    return {
      success: true
    }
    
  } catch (error: any) {
    console.error('OTP verification failed:', error)
    return {
      success: false,
      error: error.message || 'OTP verification failed'
    }
  }
}

// Check if Twilio is configured
export const isTwilioConfigured = (): boolean => {
  return !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_PHONE_NUMBER)
}

// Consume OTP without verification (for cleanup after signup)
export const consumeOTP = async (verificationId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const storedData = otpStorage.get(verificationId)
    
    if (!storedData) {
      return {
        success: false,
        error: 'OTP not found'
      }
    }
    
    // Delete the OTP
    otpStorage.delete(verificationId)
    
    return {
      success: true
    }
    
  } catch (error: any) {
    console.error('OTP consumption failed:', error)
    return {
      success: false,
      error: error.message || 'Failed to consume OTP'
    }
  }
}

export default {
  sendOTP,
  verifyOTP,
  verifyOTPOnly,
  consumeOTP,
  generateOTP,
  isTwilioConfigured
}
