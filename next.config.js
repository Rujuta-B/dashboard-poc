/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      // Next.js 15: Enhanced security with unguessable endpoints
      bodySizeLimit: '2mb',
    },
    // Next.js 15: Post-response code execution
    after: true,
    // Next.js 15: Improved caching semantics
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    domains: ['images.clerk.dev'],
  },
  // Enable Turbopack for faster development (Next.js 15)
  // Run with: npm run dev --turbo
}

module.exports = nextConfig