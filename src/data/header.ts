// src/data/header.ts
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { AppLocale } from '@/types/locale'

export const getHeaderCached = (locale: AppLocale) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      return payload.findGlobal({
        slug: 'header',
        depth: 1,
        locale,
        fallbackLocale: 'en',
      })
    },
    // cache key must include locale
    ['header', locale],
    { tags: ['header'], revalidate: 60 * 60 * 24 }, // long TTL; instant bust via tag
  )()
