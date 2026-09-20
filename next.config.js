/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // `BUILD_STANDALONE=1 npm run build` produces a self-contained folder (.next/standalone) that runs with plain `node server.js`.
  output: process.env.BUILD_STANDALONE ? 'standalone' : undefined,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [{ source: '/', destination: '/hy', permanent: false }];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Static assets (photos, logos) never change under the same name.
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

module.exports = nextConfig;
