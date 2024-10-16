/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'resources.premierleague.com',
            port: '',
            pathname: '/premierleague/**',
          },
        ],
      },
};

export default nextConfig;
