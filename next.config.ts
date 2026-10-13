import fs from 'fs';
import path from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

const requestPath = './src/i18n/request.ts';
const hasRequestConfig = fs.existsSync(path.resolve(process.cwd(), requestPath));

const withNextIntl = hasRequestConfig 
  ? createNextIntlPlugin(requestPath) 
  : (cfg: any) => cfg;

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      'next-intl/config': './src/i18n/request.ts'
    }
  },
  allowedDevOrigins: [
    'bce3ed676bfd255b-78-187-87-159.serveousercontent.com',
    'localhost:3001',
    'localhost:3000'
  ]
};

export default withNextIntl(nextConfig);
