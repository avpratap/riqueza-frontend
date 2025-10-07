/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'cdn.olaelectric.com', 'res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: 'ola-electric-clone',
    NEXT_PUBLIC_BACKEND_URL: 'http://localhost:5000',
  },
}

module.exports = nextConfig
