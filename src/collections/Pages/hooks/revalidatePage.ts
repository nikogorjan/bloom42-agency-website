import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePageTagNow, revalidatePathNow } from '@/utilities/revalidate'

// If you only want to revalidate when the page is published, keep this guard.
const isPublished = (doc: any) => doc?._status === 'published'

const pathFor = (locale: string, slug: string) =>
  slug === 'home' ? `/${locale}` : `/${locale}/${slug}`

export const revalidatePage: CollectionAfterChangeHook = async ({ doc, req }) => {
  // If you need drafts to update live preview, remove this if.
  if (!isPublished(doc)) return

  const slug = doc.slug || 'home'

  // Revalidate the specific locale that was edited:
  const editedLocale = (req?.locale as string) || 'en'
  await revalidatePageTagNow(editedLocale, slug)
  await revalidatePathNow(pathFor(editedLocale, slug))

  // If an edit should reflect across *all locales*, fan out:
  // for (const loc of routing.locales) {
  //   await revalidatePageTagNow(loc, slug)
  //   await revalidatePathNow(pathFor(loc, slug))
  // }
}

export const revalidateDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const slug = doc.slug || 'home'
  const editedLocale = (req?.locale as string) || 'en'
  await revalidatePageTagNow(editedLocale, slug)
  await revalidatePathNow(pathFor(editedLocale, slug))
  // Optionally fan out to all locales here too.
}
