'use client'
import type { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type NavItem = NonNullable<Header['navItems']>[number]

// narrow to objects that actually have a `label` field
function hasLabel(x: unknown): x is { label?: string | null } {
  return !!x && typeof x === 'object' && 'label' in x
}

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NavItem>()
  const item = data?.data

  const labelValue = hasLabel(item) && item.label ? item.label : undefined
  const index = typeof data?.rowNumber === 'number' ? data.rowNumber + 1 : ''

  const label = labelValue ? `Nav item ${index}: ${labelValue}` : 'Row'
  return <div>{label}</div>
}
