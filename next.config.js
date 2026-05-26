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
        has: [{ type: 'query', key: 'f' }],
        destination: '/festivals/:f',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
