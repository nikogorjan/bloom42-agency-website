import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

// ---------- small helper ----------
const baseURL =
  process.env.INTERNAL_REVALIDATE_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  'http://localhost:3000'

const secret = process.env.REVALIDATE_SECRET as string

async function post(body: any) {
  if (!secret) {
    console.error('REVALIDATE_SECRET is not set')
    return
  }
  const res = await fetch(`${baseURL}/api/revalidate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    console.error('Revalidate call failed:', res.status, txt)
  }
}

// ---------- tag & path helpers ----------
const isPublished = (doc: any) => doc?._status === 'published'

// Pages
const pageTag = (locale: string, slug: string) => `page:${locale}:${slug || 'home'}`
const pagePath = (locale: string, slug: string) =>
  slug === 'home' ? `/${locale}` : `/${locale}/${slug}`

// Projects
const projectTag = (locale: string, slug: string) => `project:${locale}:${slug}`
const projectsListTag = 'projects'
const projectsIndexPath = (locale: string) => `/${locale}/projects`
const projectPath = (locale: string, slug: string) => `/${locale}/projects/${slug}`

// Categories (used by lists / filters / chips)
const projectCategoriesTag = 'project-categories'

// ---------- PAGES hooks ----------
export const revalidatePage: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!isPublished(doc)) return
  const slug = doc.slug || 'home'
  const locale = (req?.locale as string) || 'en'
  await post({ type: 'tag', tag: pageTag(locale, slug) })
  await post({ type: 'path', path: pagePath(locale, slug) })
}

export const revalidateDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const slug = doc.slug || 'home'
  const locale = (req?.locale as string) || 'en'
  await post({ type: 'tag', tag: pageTag(locale, slug) })
  await post({ type: 'path', path: pagePath(locale, slug) })
}

// ---------- PROJECTS hooks ----------
export const revalidateProject: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!isPublished(doc)) return
  const slug = doc.slug as string
  if (!slug) return
  const locale = (req?.locale as string) || 'en'

  // detail page
  await post({ type: 'tag', tag: projectTag(locale, slug) })
  await post({ type: 'path', path: projectPath(locale, slug) })

  // lists / featured / index
  await post({ type: 'tag', tag: projectsListTag })
  await post({ type: 'path', path: projectsIndexPath(locale) })
}

export const revalidateProjectDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const slug = doc.slug as string
  const locale = (req?.locale as string) || 'en'
  if (slug) {
    await post({ type: 'tag', tag: projectTag(locale, slug) })
    await post({ type: 'path', path: projectPath(locale, slug) })
  }
  await post({ type: 'tag', tag: projectsListTag })
  await post({ type: 'path', path: projectsIndexPath(locale) })
}

// ---------- PROJECT CATEGORIES hooks ----------
export const revalidateProjectCategory: CollectionAfterChangeHook = async ({ req }) => {
  const locale = (req?.locale as string) || 'en'
  // Any category change affects lists/filters
  await post({ type: 'tag', tag: projectCategoriesTag })
  await post({ type: 'tag', tag: projectsListTag })
  await post({ type: 'path', path: projectsIndexPath(locale) })
}

export const revalidateProjectCategoryDelete: CollectionAfterDeleteHook = async ({ req }) => {
  const locale = (req?.locale as string) || 'en'
  await post({ type: 'tag', tag: projectCategoriesTag })
  await post({ type: 'tag', tag: projectsListTag })
  await post({ type: 'path', path: projectsIndexPath(locale) })
}
