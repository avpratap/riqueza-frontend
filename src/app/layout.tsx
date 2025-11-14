import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/store/provider'
import { Toaster } from 'react-hot-toast'
import AuthProvider from '@/components/auth/AuthProvider'
import BuyNowModalWrapper from '@/components/modals/BuyNowModalWrapper'
import CartModal from '@/components/modals/CartModal'
import AuthModalWrapper from '@/components/auth/AuthModalWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Riqueza Electric - Electric Vehicles & Mobility Solutions',
  description: 'Experience the future of mobility with our electric vehicles, scooters, and sustainable transportation solutions.',
  keywords: 'electric vehicles, electric scooters, sustainable mobility, green transportation, Riqueza Electric',
  authors: [{ name: 'Riqueza Electric Team' }],
  robots: 'index, follow',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
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
        {/* Hide Next.js error overlay */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function hideErrorOverlay() {
                  try {
                    var elements = document.querySelectorAll(
                      '[data-nextjs-toast], ' +
                      '[data-nextjs-toast="true"], ' +
                      '.nextjs-toast-errors-parent, ' +
                      '[data-nextjs-toast-wrapper], ' +
                      '.nextjs-toast-errors, ' +
                      '[class*="nextjs-toast"]'
                    );
                    for (var i = 0; i < elements.length; i++) {
                      elements[i].style.display = 'none';
                      elements[i].style.visibility = 'hidden';
                      elements[i].style.opacity = '0';
                      elements[i].remove();
                    }
                  } catch(e) {}
                }
                
                // Run immediately
                hideErrorOverlay();
                
                // Run on DOM ready
                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', hideErrorOverlay);
                } else {
                  hideErrorOverlay();
                }
                
                // Run continuously to catch dynamically added elements
                setInterval(hideErrorOverlay, 100);
                
                // Use MutationObserver to catch elements as they're added
                if (document.body) {
                  var observer = new MutationObserver(hideErrorOverlay);
                  observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['class', 'data-nextjs-toast']
                  });
                } else {
                  document.addEventListener('DOMContentLoaded', function() {
                    var observer = new MutationObserver(hideErrorOverlay);
                    observer.observe(document.body, {
                      childList: true,
                      subtree: true,
                      attributes: true,
                      attributeFilter: ['class', 'data-nextjs-toast']
                    });
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            {children}
            <BuyNowModalWrapper />
            <CartModal />
            <AuthModalWrapper />
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
