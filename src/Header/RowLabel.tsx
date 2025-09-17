'use client'

import type { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'
import React from 'react'

type NavItem = NonNullable<Header['navItems']>[number]

// narrow legacy shape: { link: { label?: string } }
function isLegacyLinkItem(x: unknown): x is { link: { label?: unknown } } {
  return typeof x === 'object' && x !== null && 'link' in x
}

// generic prop check
function hasStringProp<T extends string>(obj: unknown, key: T): obj is Record<T, string> {
  return (
    typeof obj === 'object' && obj !== null && typeof (obj as Record<T, unknown>)[key] === 'string'
  )
}

// extract a label from either new or legacy shape
function extractLabel(item: unknown): string | null {
  // legacy: { link: { label: string } }
  if (isLegacyLinkItem(item)) {
    const maybe = (item as { link?: { label?: unknown } }).link?.label
    return typeof maybe === 'string' && maybe.trim() ? maybe : null
  }

  // new union often has a top-level `label?: string`
  if (hasStringProp(item, 'label') && item.label.trim()) {
    return item.label
  }

  // otherwise, nothing useful
  return null
}

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NavItem>()

  const labelText = (() => {
    const label = extractLabel(data?.data)
    if (label) {
      const idx = data?.rowNumber !== undefined ? data.rowNumber + 1 : ''
      return `Nav item ${idx}: ${label}`
    }
    return 'Row'
  })()

  return <div>{labelText}</div>
}
