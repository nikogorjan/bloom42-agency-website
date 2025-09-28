// src/data/page.ts
import { unstable_cache } from 'next/cache'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import configPromise from '@payload-config'
import type { AppLocale } from '@/types/locale'

type PageDoc = RequiredDataFromCollectionSlug<'pages'>
type Args = {
  slug: string
  locale: AppLocale | 'all'
  draft: boolean
  depth?: number
}

// Raw query (no cache)
async function getPageRaw({ slug, locale, draft, depth = 3 }: Args): Promise<PageDoc | null> {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'pages',
    draft, // include drafts when requested
    limit: 1,
    pagination: false,
    overrideAccess: draft, // typical when previewing drafts
    locale,
    fallbackLocale: 'en',
    depth, // populate nested relations/blocks
    where: { slug: { equals: slug } },
  })
  return (res.docs?.[0] as PageDoc | undefined) ?? null
}

// Cached wrapper (prod only). Dev/draft → no cache.
export async function getPageCached(args: Args): Promise<PageDoc | null> {
  const isProd = process.env.NODE_ENV === 'production'

  if (!isProd || args.draft) {
    // In dev or draft mode, always go uncached
    return getPageRaw(args)
  }

  // In prod, cache with a tag that matches your Payload hook:
  // revalidatePageTagNow(locale, slug) -> `page:${locale}:${slug}`
  const fn = unstable_cache(
    () => getPageRaw({ ...args, draft: false, depth: args.depth ?? 3 }),
    ['page', String(args.locale), args.slug, 'published'],
    {
      revalidate: 60, // short TTL; tag revalidation makes updates instant anyway
      tags: [`page:${args.locale}:${args.slug || 'home'}`],
    },
  )

  return fn()
}
