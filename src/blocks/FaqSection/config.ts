// src/blocks/FaqAccordion/config.ts
import type { Block } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
} from '@payloadcms/richtext-lexical'
import { CoralHighlightFeature } from '@/components/common/rich-text/lexical-features/coralHighlight/feature.server'

const FALLBACK_THUMB = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120' fill='none'>
    <rect x='10' y='10' width='140' height='100' rx='10' stroke='#CFCFCF' stroke-width='2'/>
    <path d='M40 60h80' stroke='#CFCFCF' stroke-width='2' />
    <polygon points='58,50 80,60 58,70' fill='#CFCFCF'/>
    <rect x='22' y='82' width='116' height='10' rx='5' fill='#EDEDED'/>
  </svg>
`)}`

function getThumbURL() {
  const fromEnv = (process.env.FAQ_ACCORDION_ICON_URL || '').trim()
  if (fromEnv) return fromEnv
  if (process.env.S3_BUCKET && process.env.S3_REGION) {
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/faq-accordion.webp`
  }
  return FALLBACK_THUMB
}

export const FaqAccordion: Block = {
  slug: 'faqAccordion',
  interfaceName: 'FaqAccordionBlock',
  imageURL: getThumbURL(),
  labels: { singular: 'FAQ / Testimonial Q&A', plural: 'FAQ / Testimonial Q&A' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
      label: 'Heading',
      admin: { placeholder: 'FAQs' },
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      admin: { description: 'Optional short description under the heading.' },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          CoralHighlightFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h4', 'h5', 'h6'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: 'questions',
      type: 'array',
      required: true,
      labels: { singular: 'Item', plural: 'Items' },
      admin: {
        description:
          'Add question & answer items. Answers support rich text (bold, links, highlight, etc).',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          admin: { placeholder: 'Question text goes here' },
        },
        {
          name: 'answer',
          type: 'richText',
          localized: true,
          required: true,
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              CoralHighlightFeature(),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
        },
      ],
    },
  ],
}
