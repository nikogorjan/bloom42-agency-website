// src/data/page.ts
import { unstable_cache } from 'next/cache'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import configPromise from '@payload-config'
import type { AppLocale } from '@/types/locale'

type PageDoc = RequiredDataFromCollectionSlug<'pages'>

export function getPageCached({
  slug,
  locale,
  draft,
}: {
  slug: string
  locale: AppLocale | 'all'
  draft: boolean
}): Promise<PageDoc | null> {
  return unstable_cache(
    async () => {
      const payload = await getPayload({ config: configPromise })
      const res = await payload.find({
        collection: 'pages',
        draft,
        limit: 1,
        pagination: false,
        overrideAccess: draft,
        locale,
        fallbackLocale: 'en',
        where: { slug: { equals: slug } },
      })
      return (res.docs?.[0] as PageDoc | undefined) ?? null
    },
    // key must include locale+slug
    ['page', locale, slug, draft ? 'draft' : 'published'],
    {
      // long TTL; we bust via tag immediately from webhooks/hooks
      revalidate: 60 * 60 * 24,
      tags: [`page:${locale}:${slug}`],
    },
  )()
}
