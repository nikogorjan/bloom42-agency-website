// src/app/[locale]/layout.tsx
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

import './globals.css' // one level up from [locale] folder
import React from 'react'
import { bebasNeue, figtree } from '../../../fonts/fonts'

// —————————————————————————————————————————————————————
// STATIC METADATA (works the same as before)
export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: { card: 'summary_large_image', creator: '@payloadcms' },
}

// —————————————————————————————————————————————————————
// ① Enable static export for every supported language
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale })) // :contentReference[oaicite:1]{index=1}
}

// —————————————————————————————————————————————————————
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await params

  // ② Validate & register the locale for this request
  if (!hasLocale(routing.locales, locale)) notFound() // :contentReference[oaicite:2]{index=2}
  setRequestLocale(locale) // :contentReference[oaicite:3]{index=3}

  // ③ Whatever extra work you already had (draft mode, …)
  const { isEnabled } = await draftMode()

  return (
    <html
      lang={locale}
      className={`${bebasNeue.variable} ${figtree.variable}`}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>

      <body>
        {/* ▼ next-intl now wraps the whole app */}
        <NextIntlClientProvider>
          <Providers>
            <AdminBar adminBarProps={{ preview: isEnabled }} />
            <Header />
            {children}
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
