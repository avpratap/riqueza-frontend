'use client'

import { useState } from 'react'
import { orderService } from '@/lib/orderService'

export default function TestOrderPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testOrder = async () => {
    setLoading(true)
    try {
      const orderData = {
        customer_info: {
          firstName: 'Pratap',
          lastName: 'Singh',
          email: 'iitkpratap@gmail.com',
          phone: '9352101757',
          address: 'Serawato Ki Dhani',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '303702',
          landmark: ''
        },
        delivery_info: {
          method: 'Standard Delivery',
          address: 'Serawato Ki Dhani, Jaipur, Rajasthan - 303702',
          estimated_days: '5-7 business days',
          fee: 0
        },
        payment_info: {
          method: 'UPI Payment',
          details: 'Google Pay, PhonePe, Paytm'
        },
        order_notes: '',
        delivery_fee: 0
      }

      console.log('Testing order creation with data:', orderData)
      const order = await orderService.createOrder(orderData)
      console.log('Order created successfully:', order)
      setResult({ success: true, order })
    } catch (error) {
      console.error('Order creation failed:', error)
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Order Creation</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <button
            onClick={testOrder}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Order Creation'}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Result:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
