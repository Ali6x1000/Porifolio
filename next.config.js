/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/alijr',
        destination: 'https://personal-qm2fsvczr-ali-nawafs-projects.vercel.app/alijr',
      },
      {
        source: '/alijr/:path*',
        destination: 'https://personal-qm2fsvczr-ali-nawafs-projects.vercel.app/alijr/:path*',
      },
    ]
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    unoptimized: true
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
}

module.exports = nextConfig
