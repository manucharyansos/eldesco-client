/** @type {import('next').NextConfig} */
const staticExport = process.env.BUILD_STATIC === '1';

const nextConfig = {
  poweredByHeader: false,
  output: staticExport ? 'export' : (process.env.BUILD_STANDALONE ? 'standalone' : undefined),
  trailingSlash: staticExport,
  images: { unoptimized: true },
};

if (!staticExport) {
  nextConfig.redirects = async () => [{ source: '/', destination: '/hy', permanent: false }];
  nextConfig.headers = async () => [
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
      source: '/images/:path*',
      headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
    },
  ];
}

module.exports = nextConfig;
