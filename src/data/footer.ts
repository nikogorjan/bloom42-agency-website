// src/data/footer.ts
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { AppLocale } from '@/types/locale'

export const getFooterCached = (locale: AppLocale) =>
  unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      return payload.findGlobal({
        slug: 'footer',
        depth: 1,
        locale,
        fallbackLocale: 'en',
      })
    },
    ['footer', locale],
    { tags: ['footer'], revalidate: 60 * 60 * 24 },
  )()
