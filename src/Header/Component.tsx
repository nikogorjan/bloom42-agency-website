// src/Header/Component.tsx
import { getLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { HeaderClient } from './Component.client'
import type { Header } from '@/payload-types'
import type { AppLocale } from '@/types/locale'

export async function Header() {
  const locale = (await getLocale()) as AppLocale
  const payload = await getPayload({ config: configPromise })

  const headerData = await payload.findGlobal({
    slug: 'header',
    depth: 1,
    locale,
    fallbackLocale: 'en',
  })

  return <HeaderClient data={headerData as Header} />
}
