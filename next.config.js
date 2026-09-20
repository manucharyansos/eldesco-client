/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [{ source: '/', destination: '/hy', permanent: false }];
  },
  async headers() {
    return [
      {
        // Static assets (photos, logos) never change under the same name.
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

module.exports = nextConfig;
