'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  return (
    <footer className="bg-gray-900 text-white mt-auto w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 py-8 sm:py-10 lg:py-12">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-base sm:text-lg">R</span>
              </div>
              <span className="text-lg sm:text-xl font-bold">Riqueza Electric</span>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-md">
              Leading the electric mobility revolution in India with innovative, 
              sustainable, and smart transportation solutions.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a 
                href="https://www.facebook.com/riquezaelectric" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://twitter.com/riquezaelectric" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://www.instagram.com/riquezaelectric" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/riquezaelectric" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://www.youtube.com/@riquezaelectric" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Follow us on YouTube"
              >
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Products & Services */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Products & Services</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/products/scooters" className="text-gray-300 hover:text-white transition-colors duration-200">Electric Scooters</Link></li>
              <li><Link href="/products/bikes" className="text-gray-300 hover:text-white transition-colors duration-200">Electric Bikes</Link></li>
              <li><Link href="/products/accessories" className="text-gray-300 hover:text-white transition-colors duration-200">Accessories</Link></li>
              <li><Link href="/test-ride" className="text-gray-300 hover:text-white transition-colors duration-200">Test Ride</Link></li>
              <li><Link href="/service" className="text-gray-300 hover:text-white transition-colors duration-200">Service & Support</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Support</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/help" className="text-gray-300 hover:text-white transition-colors duration-200">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact Us</Link></li>
              <li><Link href="/warranty" className="text-gray-300 hover:text-white transition-colors duration-200">Warranty</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors duration-200">FAQ</Link></li>
              <li><Link href="/downloads" className="text-gray-300 hover:text-white transition-colors duration-200">Downloads</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Company</h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-white transition-colors duration-200">Careers</Link></li>
              <li><Link href="/press" className="text-gray-300 hover:text-white transition-colors duration-200">Press</Link></li>
              <li><Link href="/investors" className="text-gray-300 hover:text-white transition-colors duration-200">Investors</Link></li>
              <li><Link href="/sustainability" className="text-gray-300 hover:text-white transition-colors duration-200">Sustainability</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact & Newsletter */}
        <div className="border-t border-gray-800 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Contact Info */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Get in Touch</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-gray-300 text-xs sm:text-sm break-words">+91 1800 102 1234</span>
                </div>
                <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-gray-300 text-xs sm:text-sm break-all">support@olaelectric.com</span>
                </div>
                <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">Bangalore, Karnataka, India</span>
                </div>
                <div className="flex items-start sm:items-center space-x-2 sm:space-x-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-gray-300 text-xs sm:text-sm">Mon - Fri: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Stay Updated</h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Subscribe to our newsletter for the latest updates, offers, and news.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 sm:space-x-2 sm:space-y-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 sm:space-y-0">
            <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              © 2024 Riqueza Electric. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200 whitespace-nowrap">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200 whitespace-nowrap">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200 whitespace-nowrap">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
