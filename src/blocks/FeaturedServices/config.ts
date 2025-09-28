// /src/blocks/FeaturedServices/config.ts
import type { Block } from 'payload'
import { link } from '@/fields/link'

// Fallback inline icon so admin always shows something
const FALLBACK_THUMB = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120' fill='none'>
    <rect x='12' y='16' width='136' height='16' rx='8' stroke='#CFCFCF' stroke-width='2'/>
    <rect x='12' y='52' width='136' height='16' rx='8' stroke='#CFCFCF' stroke-width='2'/>
    <rect x='12' y='88' width='136' height='16' rx='8' stroke='#CFCFCF' stroke-width='2'/>
  </svg>
`)}`

function getThumbURL() {
  const fromEnv = (process.env.FEATURED_SERVICES_ICON_URL || '').trim()
  if (fromEnv) return fromEnv
  if (process.env.S3_BUCKET && process.env.S3_REGION) {
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/featured-services.webp`
  }
  return FALLBACK_THUMB
}

export const FeaturedServices: Block = {
  slug: 'featuredServices',
  interfaceName: 'FeaturedServicesBlock',
  imageURL: getThumbURL(), // uses S3 URL or fallback
  labels: { singular: 'Featured Services', plural: 'Featured Services' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: false,
      admin: { description: 'Optional section heading' },
    },
    {
      name: 'items',
      label: 'Links',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      admin: { description: 'Add as many as you want. Drag to reorder.' },
      minRows: 1,
      fields: [
        { name: 'heading', type: 'text', required: true, localized: true },
        { name: 'subheading', type: 'text', required: false, localized: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        link({ overrides: { label: 'Target' } }) as any,
      ],
    },
  ],
}
