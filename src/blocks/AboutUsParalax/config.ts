// src/blocks/AboutUsParalax/config.ts
import type { Block } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
} from '@payloadcms/richtext-lexical'

const FALLBACK_THUMB = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120' fill='none'>
    <rect x='10' y='12' width='140' height='96' rx='10' stroke='#CFCFCF' stroke-width='2'/>
    <path d='M26 80h108' stroke='#CFCFCF' stroke-width='2'/>
  </svg>
`)}`

function getThumbURL() {
  const fromEnv = (process.env.ABOUT_US_PARALAX_ICON_URL || '').trim()
  if (fromEnv) return fromEnv
  if (process.env.S3_BUCKET && process.env.S3_REGION) {
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/about-us-paralax.webp`
  }
  return FALLBACK_THUMB
}

export const AboutUsParalax: Block = {
  slug: 'aboutUsParalax',
  interfaceName: 'AboutUsParalaxBlock',
  imageURL: getThumbURL(),
  labels: { singular: 'About Us Paralax', plural: 'About Us Paralax' },
  fields: [
    {
      type: 'group',
      name: 'header',
      admin: { description: 'Top heading + intro copy.' },
      fields: [
        {
          name: 'intro',
          label: 'Intro',
          type: 'richText',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
          admin: { description: 'Rich text shown under the heading.' },
        },
      ],
    },
    {
      name: 'products',
      label: 'Items',
      type: 'array',
      required: true,
      labels: { singular: 'Item', plural: 'Items' },
      admin: { description: 'Cards that slide in the parallax rows.' },
      fields: [
        {
          name: 'link',
          type: 'text',
          required: false,
          admin: { description: 'Any string (internal path, external URL, hash, etc.)' },
        },
        {
          name: 'thumbnail',
          label: 'Thumbnail',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: { description: 'Image shown in the card.' },
        },
      ],
    },
  ],
}
