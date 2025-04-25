import React from 'react'
import Link from 'next/link'

import { Button, type ButtonProps } from '@/components/ui/button'
import AnimatedButton from '@/components/ui/animated-button'
import { cn } from '@/utilities/ui'

import type { Page, Post } from '@/payload-types'
import LeafButton from '../ui/leaf-button'

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
  /* 1 ─────────── build the final href ─────────── */
  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''}/${
          reference.value.slug
        }`
      : url

  if (!href) return null

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  /* 2 ─────────── plain inline link ─────────── */
  if (appearance === 'inline') {
    return (
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label}
        {children}
      </Link>
    )
  }

  /* 3 ─────────── animated default button ────── */
  if (appearance === 'default') {
    return (
      <AnimatedButton href={href} size={size || 'default'} className={className} {...newTabProps}>
        {label}
        {children}
      </AnimatedButton>
    )
  }

  /* 3 ─────────── animated leaf button ────── */
  if (appearance === 'animatedArrow') {
    return (
      <LeafButton href={href} size={size || 'default'} className={className} {...newTabProps}>
        {label}
        {children}
      </LeafButton>
    )
  }

  /* 4 ─────────── all other variants use <Button> */
  return (
    <Button asChild size={size} variant={appearance} className={className}>
      <Link className={cn(className)} href={href} {...newTabProps}>
        {label}
        {children}
      </Link>
    </Button>
  )
}
