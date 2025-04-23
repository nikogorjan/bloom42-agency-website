// next.config.js (or .mjs / .ts)

import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin' // <-- import the plugin
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// 1️⃣  raw config -------------------------------------------------------------
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
  output: 'standalone',
}

// 2️⃣  wrap with Payload ------------------------------------------------------
const configWithPayload = withPayload(nextConfig, {
  devBundleServerPackages: false,
})

// 3️⃣  wrap with next-intl -----------------------------------------------------
const withNextIntl = createNextIntlPlugin() // you can pass options here
export default withNextIntl(configWithPayload) // final export
