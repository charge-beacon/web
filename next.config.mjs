/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        config.resolve.alias['@/'] = './';
        return config;
    }
};

export default nextConfig;
