// src/page-transition/transition-link.tsx
'use client'

import React, { AnchorHTMLAttributes, MouseEvent } from 'react'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
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

// normalize: remove trailing slash (except root)
function normalizePath(p: string) {
  if (!p) return '/'
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p
}
// strip locale prefix like /en or /en-US
function stripLocale(p: string) {
  const m = p.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(?=\/|$)/)
  return m ? p.replace(/^\/[a-z]{2}(?:-[A-Z]{2})?(?=\/|$)/, '') || '/' : p
}
// get pathname from possibly-relative href
function pathFromHref(href: string) {
  try {
    const u = new URL(href, window.location.origin)
    return u.pathname
  } catch {
    return href.startsWith('/') ? href : `/${href}`
  }
}
function isSameLogicalRoute(hrefStr: string, pathname: string) {
  const target = stripLocale(normalizePath(pathFromHref(hrefStr)))
  const current = stripLocale(normalizePath(pathname))
  return target === current
}

export const TransitionLink = React.forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ href, onClick, target, rel, ...rest }, ref) => {
    const ctx = useAnimatedNavigation()
    const pathname = usePathname()

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (onClick) onClick(e)
      if (e.defaultPrevented) return

      const hrefStr = typeof href === 'string' ? href : href.toString()

      // If no provider, or external/hash/new tab → let Next handle
      if (!ctx || target === '_blank' || isExternalHref(href) || isHashHref(href)) return

      // If target route is the same logical page (e.g. / vs /en), skip transition
      if (isSameLogicalRoute(hrefStr, pathname)) return

      e.preventDefault()
      ctx.onNavigate(hrefStr)
    }

    return <Link ref={ref} href={href} target={target} rel={rel} onClick={handleClick} {...rest} />
  },
)

TransitionLink.displayName = 'TransitionLink'
