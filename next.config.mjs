/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'out',
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
