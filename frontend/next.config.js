/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },

  // Compression
  compress: true,

  // Headers sécurisés
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirections SEO
  async redirects() {
    return [
      {
        source: '/test-eligibilite',
        destination: '/eligibilite',
        permanent: true,
      },
      {
        source: '/eligibilite-garantie',
        destination: '/eligibilite',
        permanent: true,
      },
    ];
  },

  // Images optimisées
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },

  async rewrites() {
    const target = process.env.BACKEND_ORIGIN || 'http://localhost:8000';
    return [
      {
        source: '/api/v1/:path*',
        destination: `${target}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
