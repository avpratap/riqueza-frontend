'use client'

import { useState, useEffect } from 'react'

export default function DebugAuthPage() {
  const [authInfo, setAuthInfo] = useState<any>(null)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken')
      const guestSessionId = localStorage.getItem('guestSessionId')
      
      setAuthInfo({
        hasAuthToken: !!token,
        authToken: token,
        hasGuestSessionId: !!guestSessionId,
        guestSessionId: guestSessionId,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    }

    checkAuth()
  }, [])

  const clearAuth = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('guestSessionId')
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Authentication</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(authInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Actions:</h2>
          <button
            onClick={clearAuth}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700"
          >
            Clear All Auth Data
          </button>
        </div>
      </div>
    </div>
  )
}
