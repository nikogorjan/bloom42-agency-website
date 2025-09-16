// src/components/Media/VideoMedia/index.tsx
'use client'

import React, { useEffect, useRef } from 'react'
import { cn } from '@/utilities/ui'
import { getClientSideURL } from '@/utilities/getURL'
import type { Props as MediaProps } from '../types'

const isAbsolute = (u?: string) => !!u && /^(https?:)?\/\//i.test(u)
const isBad = (u?: string) => !!u && (/^\/undefined\//i.test(u) || /^undefined\//i.test(u))
const s3Direct = (filename?: string) => {
  if (!filename) return undefined
  const b = process.env.NEXT_PUBLIC_S3_BUCKET
  const r = process.env.NEXT_PUBLIC_S3_REGION
  return b && r ? `https://${b}.s3.${r}.amazonaws.com/${filename}` : undefined
}

export const VideoMedia: React.FC<MediaProps> = ({ onClick, resource, videoClassName }) => {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    ref.current?.addEventListener('suspend', () => {})
  }, [])

  if (resource && typeof resource === 'object') {
    const { url, filename } = resource as any
    let src: string | undefined

    if (isAbsolute(url)) src = url
    else if (url && !isBad(url))
      src = `${getClientSideURL()}${url.startsWith('/') ? '' : '/'}${url}`
    else if (filename) src = s3Direct(filename) || `${getClientSideURL()}/media/${filename}`

    if (!src) return null

    return (
      <video
        autoPlay
        className={cn(videoClassName)}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        preload="metadata"
        ref={ref}
      >
        <source src={src} />
      </video>
    )
  }

  return null
}
