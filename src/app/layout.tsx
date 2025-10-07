import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/store/provider'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/components/auth/AuthProvider'
import BuyNowModalWrapper from '@/components/modals/BuyNowModalWrapper'
import CartModal from '@/components/modals/CartModal'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Riqueza Electric - Electric Vehicles & Mobility Solutions',
  description: 'Experience the future of mobility with our electric vehicles, scooters, and sustainable transportation solutions.',
  keywords: 'electric vehicles, electric scooters, sustainable mobility, green transportation, Riqueza Electric',
  authors: [{ name: 'Riqueza Electric Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Firebase reCAPTCHA script */}
        <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
        <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-auth-compat.js"></script>
      </head>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            {children}
            <BuyNowModalWrapper />
            <CartModal />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}
