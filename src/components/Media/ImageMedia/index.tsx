'use client'

import type { StaticImageData } from 'next/image'
import NextImage from 'next/image'
import React from 'react'
import { cn } from '@/utilities/ui'
import { cssVariables } from '@/cssVariables'
import { getClientSideURL } from '@/utilities/getURL'
import type { Props as MediaProps } from '../types'

const { breakpoints } = cssVariables

const placeholderBlur = 'data:image/png;base64,iVBORw0K...' // keep your existing data URL

const isAbsolute = (u?: string) => !!u && /^(https?:)?\/\//i.test(u)
const isBad = (u?: string) => !!u && (/^\/undefined\//i.test(u) || /^undefined\//i.test(u))
const isSVG = (u?: string) => !!u && /\.svg(\?|#|$)/i.test(u)

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
      src = s3Direct(filename) || joinBase(getClientSideURL(), `/media/${filename}`)
    } else if (sizes && typeof sizes === 'object') {
      const firstValid = Object.values(sizes).find((s: any) => s?.url && !isBad(s.url)) as any
      if (firstValid?.url) {
        const su = firstValid.url as string
        src = isAbsolute(su) ? su : joinBase(getClientSideURL(), su)
      }
    }
  }

  if (!src) return null

  // Only use blur placeholder on non-SVG and >= 40px images
  const smallKnown =
    typeof width === 'number' && typeof height === 'number' && Math.max(width, height) < 40
  const allowBlur = !isSVG(String(src)) && !smallKnown

  const loading = loadingFromProps || (!priority ? 'lazy' : undefined)
  const sizes =
    sizeFromProps ||
    Object.entries(breakpoints)
      .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
      .join(', ')
  const isRemote = typeof src === 'string' && /^(https?:)?\/\//i.test(src)
  return (
    <picture
      className={cn(fill ? 'absolute inset-0' : 'block', 'overflow-hidden rounded-[inherit]')}
    >
      <NextImage
        alt={alt || ''}
        fill={fill}
        height={!fill ? height : undefined}
        /* turn off blur for tiny or SVG images */
        placeholder={allowBlur ? 'blur' : undefined}
        blurDataURL={allowBlur ? placeholderBlur : undefined}
        priority={priority}
        quality={100}
        loading={loading}
        sizes={sizes}
        src={src}
        width={!fill ? width : undefined}
        className={cn(imgClassName)}
        unoptimized={isRemote}
      />
    </picture>
  )
}
