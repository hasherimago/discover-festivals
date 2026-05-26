/** @type {import('next').Config} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [{ type: 'query', key: 'f', value: '(?<slug>.*)' }],
        destination: '/festivals/:slug',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
