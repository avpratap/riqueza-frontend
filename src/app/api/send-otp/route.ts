import { NextRequest, NextResponse } from 'next/server'
import { sendOTP } from '@/lib/smsService'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()
    
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      )
    }
    
    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format. Use international format (e.g., +919876543210)' },
        { status: 400 }
      )
    }
    
    // Send OTP
    const result = await sendOTP(phoneNumber)
    
    if (result.success) {
      const response: any = {
        success: true,
        verificationId: result.verificationId,
        message: 'OTP sent successfully'
      }
      
      // Include OTP in development mode for testing
      if (result.otp) {
        response.otp = result.otp
        response.message += ' (Development mode - OTP included)'
      }
      
      return NextResponse.json(response)
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send OTP' },
        { status: 500 }
      )
    }
    
  } catch (error: any) {
    console.error('API Error - Send OTP:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
