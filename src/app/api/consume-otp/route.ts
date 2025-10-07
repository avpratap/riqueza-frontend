import { NextRequest, NextResponse } from 'next/server'
import { consumeOTP } from '@/lib/smsService'

export async function POST(request: NextRequest) {
  try {
    const { verificationId } = await request.json()
    
    if (!verificationId) {
      return NextResponse.json(
        { success: false, error: 'Verification ID is required' },
        { status: 400 }
      )
    }
    
    const result = await consumeOTP(verificationId)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'OTP consumed successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to consume OTP' },
        { status: 400 }
      )
    }
    
  } catch (error: any) {
    console.error('API Error - Consume OTP:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
