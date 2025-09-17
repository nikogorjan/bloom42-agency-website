// src/util/revalidate.ts
const baseURL =
  process.env.INTERNAL_REVALIDATE_URL || // set this in each env
  process.env.NEXT_PUBLIC_SERVER_URL || // fallback
  'http://localhost:3000' // dev default

const secret = process.env.REVALIDATE_SECRET as string

async function post(body: any) {
  if (!secret) throw new Error('REVALIDATE_SECRET is not set')

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

export const revalidatePathNow = (path: string) => post({ type: 'path', path })
export const revalidateHeaderNow = () => post({ type: 'tag', tag: 'header' })
export const revalidateFooterNow = () => post({ type: 'tag', tag: 'footer' })
