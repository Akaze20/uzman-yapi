import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    'bce3ed676bfd255b-78-187-87-159.serveousercontent.com',
    'localhost:3001',
    'localhost:3000'
  ]
};

export default withNextIntl(nextConfig);
