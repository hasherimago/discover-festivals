/** @type {import('next').Config} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig
