import type { Block } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

const FALLBACK_THUMB = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120' fill='none'>
    <defs>
      <linearGradient id='g' x1='0' y1='60' x2='160' y2='60' gradientUnits='userSpaceOnUse'>
        <stop stop-color='#CFCFCF' stop-opacity='0'/>
        <stop offset='1' stop-color='#CFCFCF'/>
      </linearGradient>
    </defs>
    <rect x='12' y='36' width='10' height='10' rx='5' fill='#CFCFCF'/>
    <rect x='72' y='56' width='10' height='10' rx='5' fill='#CFCFCF'/>
    <rect x='132' y='28' width='10' height='10' rx='5' fill='#CFCFCF'/>
    <path d='M20 60 H140' stroke='url(#g)' stroke-width='3' stroke-linecap='round'/>
  </svg>
`)}`
function getThumbURL() {
  const fromEnv = (process.env.TIMELINE_ICON_URL || '').trim()
  if (fromEnv) return fromEnv
  if (process.env.S3_BUCKET && process.env.S3_REGION) {
    // 👇 S3 thumbnail for the block in the admin UI
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/timeline.webp`
  }
  return FALLBACK_THUMB
}

export const Timeline: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  imageURL: getThumbURL(),
  labels: { singular: 'Timeline', plural: 'Timelines' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'Section title (e.g. “Our team”).' },
    },
    {
      name: 'items',
      label: 'Timeline Items',
      type: 'array',
      required: true,
      labels: { singular: 'Item', plural: 'Items' },
      admin: { description: 'Add entries (drag to reorder).' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: false, label: 'Photo' },
        {
          name: 'header',
          type: 'text',
          localized: true,
          required: true,
          label: 'Header',
        },
        {
          name: 'description',
          label: 'Description',
          type: 'richText',
          localized: true,
          required: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
  ],
}
