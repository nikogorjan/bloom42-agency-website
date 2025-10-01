'use client'

import React from 'react'
import { Button, type ButtonProps } from '@/components/ui/button'
import AnimatedButton from '@/components/ui/animated-button'
import LeafButton from '@/components/ui/leaf-button'
import { cn } from '@/utilities/ui'
import type { Page, Post } from '@/payload-types'
import { TransitionLink } from '@/page-transition/transition-link'
import { useAnimatedNavigation } from '@/page-transition/transition-provider'
import { ChevronRight } from 'lucide-react' // 🔽 add

type CMSLinkType = {
  // 🔽 extend to accept our new appearance
  appearance?: 'inline' | ButtonProps['variant'] | 'chevronRight' | 'animatedInverted'
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
  active?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
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
  active,
  onClick,
}) => {
  const ctx = useAnimatedNavigation()

  const href =
    type === 'reference' && typeof reference?.value === 'object' && (reference.value as any).slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          (reference.value as any).slug
        }`
      : url || ''

  if (!href) return null

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' as const } : {}

  const handleButtonClick: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement> = (e) => {
    // let parent toggle selection first if provided
    onClick?.(e)
    if (e.defaultPrevented) return

    if (!isInternalNavigable(href, newTab)) return
    if (ctx?.onNavigate) {
      e.preventDefault()
      ctx.onNavigate(href)
    }
  }

  if (appearance === 'inline') {
    return (
      <TransitionLink className={cn(className)} href={href} {...newTabProps}>
        {label}
        {children}
      </TransitionLink>
    )
  }

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

  if (appearance === 'animatedInverted') {
    return (
      <AnimatedButton
        href={href}
        size={size || 'default'}
        variant="inverted"
        active={!!active}
        className={cn('rounded-full', className)}
        {...newTabProps}
        onClick={handleButtonClick}
      >
        {label}
        {children}
      </AnimatedButton>
    )
  }

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

  // 🔽 New “Chevron Right” appearance
  if (appearance === 'chevronRight') {
    return (
      <Button
        asChild
        size={size || 'default'}
        // choose variant you prefer visually: 'outline' or 'default'
        className={cn('group p-0 border-none bg-transparent text-darkGray', className)}
      >
        <TransitionLink
          href={href}
          {...newTabProps}
          onClick={handleButtonClick}
          className="inline-flex items-center"
        >
          {label}
          <ChevronRight
            aria-hidden
            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
          {children}
        </TransitionLink>
      </Button>
    )
  }

  // Fallback to any Button variant name you pass (secondary, ghost, etc.)
  return (
    <Button asChild size={size || undefined} variant={appearance} className={className}>
      <TransitionLink className={cn(className)} href={href} {...newTabProps}>
        {label}
        {children}
      </TransitionLink>
    </Button>
  )
}
