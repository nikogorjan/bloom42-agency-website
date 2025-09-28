// src/blocks/CreativeGrowthScroller/config.ts
import type { Block } from 'payload'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

const FALLBACK_THUMB = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120' fill='none'>
    <rect x='10' y='10' width='140' height='100' rx='10' stroke='#CFCFCF' stroke-width='2'/>
    <path d='M10 60h140' stroke='#CFCFCF' stroke-width='2'/>
    <circle cx='40' cy='35' r='12' stroke='#CFCFCF' stroke-width='2' fill='none'/>
    <path d='M22 92l20-20 12 12 24-24 30 32' stroke='#CFCFCF' stroke-width='2' fill='none'/>
  </svg>
`)}`

function getThumbURL() {
  const fromEnv = (process.env.CREATIVE_GROWTH_SCROLLER_ICON_URL || '').trim()
  if (fromEnv) return fromEnv
  // Optional: build from bucket/region if you keep admin icons in a known path
  if (process.env.S3_BUCKET && process.env.S3_REGION) {
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/creative-growth-scroller.webp`
  }
  return FALLBACK_THUMB
}

export const CreativeGrowthScroller: Block = {
  slug: 'creativeGrowthScroller',
  interfaceName: 'CreativeGrowthScrollerBlock',
  imageURL: getThumbURL(),
  labels: { singular: 'Creative/Growth Scroller', plural: 'Creative/Growth Scrollers' },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      admin: { initCollapsed: true },
      labels: { singular: 'Section', plural: 'Sections' },
      fields: [
        // IMAGES (S3 URLs)
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        // COPY
        {
          name: 'heading',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { rows: 3, description: 'Short lead-in (1–3 sentences).' },
          localized: true,
        },
        {
          name: 'richText',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
          label: 'Rich text',
          localized: true,
        },

        // BULLETS with header
        {
          name: 'bullets',
          type: 'array',
          labels: { singular: 'Bullets group', plural: 'Bullets groups' },
          admin: { description: 'Optional bullet groups with a small header.' },
          fields: [
            {
              name: 'header',
              type: 'text',
              required: true,
              localized: true,
              label: 'Group header',
            },
            {
              name: 'items',
              type: 'array',
              labels: { singular: 'Bullet', plural: 'Bullets' },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: 'Bullet text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
