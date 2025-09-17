import React, { Fragment } from 'react'

import type { Props } from './types'
import { ImageMedia } from './ImageMedia'
import { VideoMedia } from './VideoMedia'

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = 'div', resource } = props

  const isVideo = typeof resource === 'object' && resource?.mimeType?.includes('video')

  const child = isVideo ? <VideoMedia {...props} /> : <ImageMedia {...props} />

  // No wrapper
  if (htmlElement === null) return <>{child}</>

  // Use provided element or fall back to 'div'
  const Element = (htmlElement || 'div') as React.ElementType

  // Only pass className to intrinsic elements (div, span, etc.)
  const elementProps =
    typeof htmlElement === 'string' || htmlElement === undefined ? { className } : {}

  return React.createElement(Element, elementProps, child)
}
