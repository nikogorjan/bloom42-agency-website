// src/Footer/Component.tsx
import { getLocale } from 'next-intl/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { TransitionLink } from '@/page-transition/transition-link'
import { getFooterCached } from '@/data/footer'

export async function Footer() {
  const locale = (await getLocale()) as 'en' | 'sl'
  const footerData = (await getFooterCached(locale)) as Footer

  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
        <TransitionLink className="flex items-center" href="/">
          <Logo />
        </TransitionLink>

        <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
          <nav className="flex flex-col md:flex-row gap-4">
            {navItems.map(({ link }, i) => (
              <CMSLink className="text-white" key={i} {...link} />
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
