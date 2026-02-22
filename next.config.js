/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // For static export (Netlify)
  images: {
    unoptimized: true, // Required for static export
    domains: ['firebasestorage.googleapis.com'],
  },
  trailingSlash: true,
};

module.exports = nextConfig;
