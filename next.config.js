/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/supabase-proxy/:path*',
        destination: 'https://iwwyyrzlguylckyumgas.supabase.co/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
