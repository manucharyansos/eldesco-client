/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  './lib/i18n/request.ts'
);

const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['localhost', '127.0.0.1', 'api.eldesco.am']
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/hy',
        permanent: false
      }
    ];
  }
};

module.exports = withNextIntl(nextConfig);
