// next.config.js

import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // your configured public origin
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          protocol: url.protocol.replace(':', ''),
          hostname: url.hostname,
          pathname: '/**',
        }
      }),
      // dev localhost (when getClientSideURL resolves to http://localhost:3000)
      { protocol: 'http', hostname: 'localhost', pathname: '/**' },
      // optional: your LAN IP while developing (comment out if not needed)
      // { protocol: 'http', hostname: '192.168.178.68', pathname: '/**' },

      // S3 bucket host (Frankfurt)
      {
        protocol: 'https',
        hostname: 'bloom42-media.s3.eu-central-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
  redirects,
  output: 'standalone',
}

const configWithPayload = withPayload(nextConfig, { devBundleServerPackages: false })
const withNextIntl = createNextIntlPlugin()
export default withNextIntl(configWithPayload)
