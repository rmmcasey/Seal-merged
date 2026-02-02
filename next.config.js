/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['seal.email'],
  },
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
