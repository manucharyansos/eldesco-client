/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  './lib/i18n/request.ts'
);

const nextConfig = {
  output: 'standalone',
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  images: {
    unoptimized: false,
    domains: ['eldesco.am', 'api.eldesco.am'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()'
          }
        ],
      },
    ];
  },

  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: true
      }
    ];
  },

  rewrites: async () => {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'https://api.eldesco.am/api/:path*'
        }
      ]
    };
  }
};

module.exports = withNextIntl(nextConfig);
