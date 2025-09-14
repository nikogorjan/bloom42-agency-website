// src/page-transition/transition-link.tsx
'use client'

import React, { AnchorHTMLAttributes, MouseEvent } from 'react'
import Link, { LinkProps } from 'next/link'
import { useAnimatedNavigation } from '@/page-transition/transition-provider'

type TransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  Omit<LinkProps, 'href'> & {
    href: string | URL
    children: React.ReactNode
  }

function isExternalHref(href: string | URL) {
  const s = typeof href === 'string' ? href : href.toString()
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/|mailto:|tel:)/i.test(s)
}
function isHashHref(href: string | URL) {
  const s = typeof href === 'string' ? href : href.toString()
  return s.startsWith('#')
}

export const TransitionLink = React.forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ href, onClick, target, rel, ...rest }, ref) => {
    const ctx = useAnimatedNavigation() // may be null if outside provider

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e)
      if (e.defaultPrevented) return

      const hrefStr = typeof href === 'string' ? href : href.toString()

      // If no provider, or external/hash/new tab → let the browser/Next handle it
      if (!ctx || target === '_blank' || isExternalHref(href) || isHashHref(href)) return

      // Intercept and run transition
      e.preventDefault()
      ctx.onNavigate(hrefStr)
    }

    return <Link ref={ref} href={href} target={target} rel={rel} onClick={handleClick} {...rest} />
  },
)

TransitionLink.displayName = 'TransitionLink'
