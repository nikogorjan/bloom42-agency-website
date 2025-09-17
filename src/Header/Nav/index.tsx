'use client'

import React from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { SearchIcon } from 'lucide-react'

type NavItem = NonNullable<HeaderType['navItems']>[number]

// legacy payload shape: { link: {...} }
function isLegacyLinkItem(x: unknown): x is { link: any } {
  return !!x && typeof x === 'object' && 'link' in x
}

function toCMSLink(item: NavItem) {
  if (item?.type === 'dropdown') return null // handled elsewhere

  if (item?.type === 'custom') {
    return {
      type: 'custom' as const,
      url: item.url ?? '#',
      label: item.label ?? '',
      newTab: item.newTab ?? false,
    }
  }

  if (item?.type === 'reference' && item.reference) {
    return {
      type: 'reference' as const,
      reference: item.reference,
      label: item.label ?? '',
      newTab: item.newTab ?? false,
    }
  }

  return null
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const navItems = data?.navItems ?? []

  return (
    <nav className="flex gap-3 items-center">
      {navItems.map((item, i) => {
        // render legacy `{ link }` items if you still have them
        if (isLegacyLinkItem(item)) {
          return <CMSLink key={i} {...item.link} appearance="link" />
        }

        // render new union items
        const link = toCMSLink(item as NavItem)
        if (!link) return null
        return <CMSLink key={i} {...link} appearance="link" />
      })}

      <Link href="/search">
        <SearchIcon className="w-5 text-primary" />
      </Link>
    </nav>
  )
}
