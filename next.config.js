/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'cdn.olaelectric.com', 'res.cloudinary.com', 'assets.olaelectric.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: 'riqueza-electric',
  },
  // Enable static exports for Vercel
  output: 'standalone',
  // Optimize for production
  swcMinify: true,
  // Enable compression
  compress: true,
}

module.exports = nextConfig
