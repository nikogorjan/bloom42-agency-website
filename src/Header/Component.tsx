// src/Header/Component.tsx
import { getLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { HeaderClient } from './Component.client'
import type { Header } from '@/payload-types'
import type { AppLocale } from '@/types/locale'
import { getHeaderCached } from '@/data/header'

export async function Header() {
  const locale = (await getLocale()) as AppLocale

  const headerData = (await getHeaderCached(locale)) as Header

  return <HeaderClient data={headerData as Header} />
}
