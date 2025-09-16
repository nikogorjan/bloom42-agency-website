// src/app/[locale]/layout.tsx
import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

import { anton, figtree } from '../../../fonts/fonts'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { getServerSideURL } from '@/utilities/getURL'

import { Header } from '@/Header/Component'
import { Footer } from '@/Footer/Component'
import TransitionProvider from '@/page-transition/transition-provider'

import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: { card: 'summary_large_image', creator: '@payloadcms' },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const { isEnabled } = await draftMode()

  return (
    <html
      lang={locale}
      className={`${anton.variable} ${figtree.variable}`}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers>
            {/* MOVE THE PROVIDER HERE SO IT WRAPS HEADER, PAGES, AND FOOTER */}
            <TransitionProvider>
              <Header />
              {children}
              <Footer />
            </TransitionProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
