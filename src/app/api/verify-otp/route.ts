import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/smsService'

export async function POST(request: NextRequest) {
  try {
    const { verificationId, otp, phoneNumber } = await request.json()
    
    if (!verificationId || !otp || !phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Verification ID, OTP, and phone number are required' },
        { status: 400 }
      )
    }
    
    // Verify OTP
    const result = await verifyOTP(verificationId, otp, phoneNumber)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Invalid OTP' },
        { status: 400 }
      )
    }
    
  } catch (error: any) {
    console.error('API Error - Verify OTP:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
