/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // ESLint no está instalado como dependencia; no bloquear el build por linting.
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig


