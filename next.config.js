/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')(
  './lib/i18n/request.ts'
);

const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['localhost', 'api.eldesco.am']
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/en',
        permanent: false
      }
    ];
  }
};

module.exports = withNextIntl(nextConfig);
