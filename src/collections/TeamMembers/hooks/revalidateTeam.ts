// src/collections/TeamMembers/hooks/revalidateTeam.ts
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

// ---------- tags & paths ----------
const isPublished = (doc: any) => doc?._status === 'published'

// If you have detail pages for members, keep these helpers; otherwise you can skip path posts.
const teamMemberTag = (locale: string, slug: string) => `team-member:${locale}:${slug}`
const teamMemberPath = (locale: string, slug: string) => `/${locale}/team/${slug}`

// Any page with a TeamSection should subscribe to this tag (e.g. in your page fetch).
export const teamListTag = 'team-members'

export const revalidateTeamMember: CollectionAfterChangeHook = async ({ doc, req }) => {
  if (!isPublished(doc)) return
  const slug = doc.slug as string
  if (!slug) return
  const locale = (req?.locale as string) || 'en'

  // Individual member (if you have detail pages)
  await post({ type: 'tag', tag: teamMemberTag(locale, slug) })
  await post({ type: 'path', path: teamMemberPath(locale, slug) })

  // Any TeamSection / team lists
  await post({ type: 'tag', tag: teamListTag })
}

export const revalidateTeamMemberDelete: CollectionAfterDeleteHook = async ({ doc, req }) => {
  const slug = doc.slug as string
  const locale = (req?.locale as string) || 'en'
  if (slug) {
    await post({ type: 'tag', tag: teamMemberTag(locale, slug) })
    await post({ type: 'path', path: teamMemberPath(locale, slug) })
  }
  await post({ type: 'tag', tag: teamListTag })
}
