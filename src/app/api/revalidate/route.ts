// src/app/api/revalidate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: NextRequest) {
  console.log('[revalidate] hit')
  const auth = req.headers.get('authorization') || ''
  const secret = process.env.REVALIDATE_SECRET

  // Expect: Authorization: Bearer <secret>
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}) as any)
  const { type, path, tag } = body as { type: 'path' | 'tag'; path?: string; tag?: string }

  try {
    if (type === 'path') {
      if (!path) throw new Error('Missing path')
      // 'page' ensures the page is rebuilt
      revalidatePath(path, 'page')
      return NextResponse.json({ ok: true, revalidated: { type, path } })
    }

    if (type === 'tag') {
      if (!tag) throw new Error('Missing tag')
      revalidateTag(tag)
      return NextResponse.json({ ok: true, revalidated: { type, tag } })
    }

    throw new Error('Unknown type')
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}
