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
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container-max">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-xl font-bold">Riqueza Electric</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Leading the electric mobility revolution in India with innovative, 
              sustainable, and smart transportation solutions.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Products & Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Products & Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products/scooters" className="text-gray-300 hover:text-white transition-colors duration-200">Electric Scooters</Link></li>
              <li><Link href="/products/bikes" className="text-gray-300 hover:text-white transition-colors duration-200">Electric Bikes</Link></li>
              <li><Link href="/products/accessories" className="text-gray-300 hover:text-white transition-colors duration-200">Accessories</Link></li>
              <li><Link href="/test-ride" className="text-gray-300 hover:text-white transition-colors duration-200">Test Ride</Link></li>
              <li><Link href="/service" className="text-gray-300 hover:text-white transition-colors duration-200">Service & Support</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/help" className="text-gray-300 hover:text-white transition-colors duration-200">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200">Contact Us</Link></li>
              <li><Link href="/warranty" className="text-gray-300 hover:text-white transition-colors duration-200">Warranty</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white transition-colors duration-200">FAQ</Link></li>
              <li><Link href="/downloads" className="text-gray-300 hover:text-white transition-colors duration-200">Downloads</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors duration-200">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-white transition-colors duration-200">Careers</Link></li>
              <li><Link href="/press" className="text-gray-300 hover:text-white transition-colors duration-200">Press</Link></li>
              <li><Link href="/investors" className="text-gray-300 hover:text-white transition-colors duration-200">Investors</Link></li>
              <li><Link href="/sustainability" className="text-gray-300 hover:text-white transition-colors duration-200">Sustainability</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact & Newsletter */}
        <div className="border-t border-gray-800 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Get in Touch</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">+91 1800 102 1234</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">support@olaelectric.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">Bangalore, Karnataka, India</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary-400" />
                  <span className="text-gray-300">Mon - Fri: 9:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stay Updated</h3>
              <p className="text-gray-300 text-sm">
                Subscribe to our newsletter for the latest updates, offers, and news.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2024 Riqueza Electric. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200">
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
