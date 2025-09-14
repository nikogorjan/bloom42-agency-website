// src/components/CMSLink.tsx
'use client'

import React from 'react'
import { Button, type ButtonProps } from '@/components/ui/button'
import AnimatedButton from '@/components/ui/animated-button'
import LeafButton from '@/components/ui/leaf-button'
import { cn } from '@/utilities/ui'
import type { Page, Post } from '@/payload-types'
import { TransitionLink } from '@/page-transition/transition-link'
import { useAnimatedNavigation } from '@/page-transition/transition-provider'

type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant']
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | null
  url?: string | null
}

function isExternalHref(href: string) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/|mailto:|tel:)/i.test(href)
}
function isHashHref(href: string) {
  return href.startsWith('#')
}
function isInternalNavigable(href: string, newTab?: boolean | null) {
  if (newTab) return false
  if (!href) return false
  if (isHashHref(href)) return false
  if (isExternalHref(href)) return false
  return true
}

export const CMSLink: React.FC<CMSLinkType> = ({
  type,
  appearance = 'inline',
  children,
  className,
  label,
  newTab,
  reference,
  size,
  url,
}) => {
  const { onNavigate } = useAnimatedNavigation()

  // Build href (same logic as you had)
  const href =
    type === 'reference' && typeof reference?.value === 'object' && (reference.value as any).slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          (reference.value as any).slug
        }`
      : url || ''

  if (!href) return null

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' as const } : {}

  const handleButtonClick: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> = (e) => {
    if (!isInternalNavigable(href, newTab)) return // let default behavior happen
    e.preventDefault()
    onNavigate(href)
  }

  // Inline links → TransitionLink
  if (appearance === 'inline') {
    return (
      <TransitionLink className={cn(className)} href={href} {...newTabProps}>
        {label}
        {children}
      </TransitionLink>
    )
  }

  // AnimatedButton variant
  if (appearance === 'default') {
    return (
      <AnimatedButton
        href={href}
        size={size || 'default'}
        className={className}
        {...newTabProps}
        onClick={handleButtonClick}
      >
        {label}
        {children}
      </AnimatedButton>
    )
  }

  // LeafButton variant
  if (appearance === 'animatedArrow') {
    return (
      <LeafButton
        href={href}
        size={size || 'default'}
        className={className}
        {...newTabProps}
        onClick={handleButtonClick}
      >
        {label}
        {children}
      </LeafButton>
    )
  }

  // Fallback: Button asChild + TransitionLink
  return (
    <Button asChild size={size || undefined} variant={appearance} className={className}>
      <TransitionLink className={cn(className)} href={href} {...newTabProps}>
        {label}
        {children}
      </TransitionLink>
    </Button>
  )
}
