import type { Block } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { linkGroup } from '@/fields/linkGroup'

const FALLBACK_THUMB = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120' fill='none'>
      <rect x='12' y='12' width='60' height='40' rx='6' stroke='#CFCFCF' stroke-width='2'/>
      <rect x='88' y='12' width='60' height='40' rx='6' stroke='#CFCFCF' stroke-width='2'/>
      <rect x='12' y='68' width='60' height='40' rx='6' stroke='#CFCFCF' stroke-width='2'/>
      <rect x='88' y='68' width='60' height='40' rx='6' stroke='#CFCFCF' stroke-width='2'/>
    </svg>
  `)}`
function getThumbURL() {
  const fromEnv = (process.env.FEATURED_PROJECTS_ICON_URL || '').trim()
  if (fromEnv) return fromEnv
  // optional: build from bucket/region if you follow a fixed path
  if (process.env.S3_BUCKET && process.env.S3_REGION) {
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/brand-explainer.webp`
  }
  return FALLBACK_THUMB
}

export const BrandExplainer: Block = {
  slug: 'brandExplainer',
  interfaceName: 'BrandExplainerBlock',
  imageURL: getThumbURL(),
  labels: { singular: 'Brand Explainer', plural: 'Brand Explainer' },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      label: 'Tagline',
      admin: { placeholder: 'Short pre-heading (optional)' },
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
      label: 'Heading',
      admin: { placeholder: 'Tell us about your project' },
    },
    {
      name: 'content',
      label: 'Content',
      type: 'richText',
      localized: true,
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: { description: 'Rich text shown on the left.' },
    },
    linkGroup({
      overrides: {
        name: 'cta',
        maxRows: 1,
        labels: { singular: 'Button', plural: 'Button' },
        admin: {
          description: 'Optional bottom CTA (e.g. “View all”).',
          initCollapsed: false,
        },
      },
    }),
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: { mimeType: { contains: 'image' } },
      admin: { description: 'Displayed on the right.' },
    },
  ],
}
