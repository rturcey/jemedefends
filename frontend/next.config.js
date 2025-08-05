/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        // ✅ UNIQUEMENT les appels API vers le backend FastAPI
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/api/:path*',
        },
        // ⚠️ NE PAS rediriger /formulaire - Next.js gère cette route
      ]
    }
    return []
  },

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },

  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development'
  },

  experimental: {
    typedRoutes: true,
  },

  // ✅ Désactiver le conflit de routes avec le backend
  trailingSlash: false,

  // ✅ Configuration optimisée pour éviter les boucles
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

module.exports = nextConfig