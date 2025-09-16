'use client'

import type { StaticImageData } from 'next/image'
import NextImage from 'next/image'
import React from 'react'
import { cn } from '@/utilities/ui'
import { cssVariables } from '@/cssVariables'
import { getClientSideURL } from '@/utilities/getURL'
import type { Props as MediaProps } from '../types'

const { breakpoints } = cssVariables

const placeholderBlur =
  'data:image/png;base64,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'

const isAbsolute = (u?: string) => !!u && /^(https?:)?\/\//i.test(u)
const isBad = (u?: string) => !!u && (/^\/undefined\//i.test(u) || /^undefined\//i.test(u))

const joinBase = (base: string, path: string) => {
  if (!path) return base
  if (!base.endsWith('/') && !path.startsWith('/')) return `${base}/${path}`
  if (base.endsWith('/') && path.startsWith('/')) return `${base}${path.slice(1)}`
  return `${base}${path}`
}

// public, safe to use client-side
const s3Direct = (filename?: string) => {
  if (!filename) return undefined
  const b = process.env.NEXT_PUBLIC_S3_BUCKET
  const r = process.env.NEXT_PUBLIC_S3_REGION
  return b && r ? `https://${b}.s3.${r}.amazonaws.com/${filename}` : undefined
}

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    imgClassName,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
  } = props

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string | undefined = srcFromProps

  if (!src && resource && typeof resource === 'object') {
    const {
      alt: altFromResource,
      height: fullHeight,
      url,
      width: fullWidth,
      filename,
      updatedAt,
      sizes,
    } = resource as any

    width = fullWidth
    height = fullHeight
    alt = altFromResource || ''
    const cacheTag = updatedAt ? `?${updatedAt}` : ''

    if (isAbsolute(url)) {
      src = `${url}${cacheTag}`
    } else if (url && !isBad(url)) {
      src = `${joinBase(getClientSideURL(), url)}${cacheTag}`
    } else if (filename) {
      // Prefer a direct S3 URL for broken/legacy docs
      src = s3Direct(filename) || joinBase(getClientSideURL(), `/media/${filename}`)
    } else if (sizes && typeof sizes === 'object') {
      const firstValid = Object.values(sizes).find(
        (s: any) => s?.url && !isBad((s as any).url as string),
      ) as any
      if (firstValid?.url) {
        const su = firstValid.url as string
        src = isAbsolute(su) ? su : joinBase(getClientSideURL(), su)
      }
    }
  }

  if (!src) return null

  const loading = loadingFromProps || (!priority ? 'lazy' : undefined)
  const sizes =
    sizeFromProps ||
    Object.entries(breakpoints)
      .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
      .join(', ')

  const isSVG = (s?: string) => typeof s === 'string' && s.toLowerCase().endsWith('.svg')

  // inside your component, right before the return you already compute `src`, `width`, `height`...

  return (
    <picture
      className={cn(
        'relative',
        fill ? 'block w-full h-full' : undefined, // ✅ add h-full
        imgClassName,
      )}
      style={fill && width && height ? { aspectRatio: `${width}/${height}` } : undefined}
    >
      <NextImage
        alt={alt || ''}
        fill={fill}
        height={!fill ? height : undefined}
        // avoid blur on SVGs (optional, but quieter)
        placeholder={isSVG(typeof src === 'string' ? src : undefined) ? undefined : 'blur'}
        blurDataURL={isSVG(typeof src === 'string' ? src : undefined) ? undefined : placeholderBlur}
        priority={priority}
        quality={100}
        loading={loading}
        sizes={sizes}
        src={src!}
        width={!fill ? width : undefined}
      />
    </picture>
  )
}
