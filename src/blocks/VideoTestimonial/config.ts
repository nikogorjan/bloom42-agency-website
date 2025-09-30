import type { Block } from 'payload'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
} from '@payloadcms/richtext-lexical'
import { linkGroup } from '@/fields/linkGroup'
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
  const fromEnv = (process.env.VIDEO_TESTIMONIAL_ICON_URL || '').trim()
  if (fromEnv) return fromEnv
  if (process.env.S3_BUCKET && process.env.S3_REGION) {
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/video-testimonial.webp`
  }
  return FALLBACK_THUMB
}

export const VideoTestimonial: Block = {
  slug: 'videoTestimonial',
  interfaceName: 'VideoTestimonialBlock',
  imageURL: getThumbURL(),
  labels: { singular: 'Video Testimonial', plural: 'Video Testimonials' },
  fields: [
    // Rich text (testimonial copy / headline)
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          CoralHighlightFeature(),
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description: 'Testimonial text or short story (supports headings, bold, links, etc.)',
      },
    },

    // Video (upload to "media")
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Video',
      admin: { description: 'Upload a vertical (9:16) clip for best results.' },
    },

    // CTA button (single link)
    linkGroup({
      overrides: {
        name: 'cta',
        maxRows: 1,
        labels: { singular: 'Button', plural: 'Button' },
        admin: {
          description: 'Optional CTA under the text (e.g. “See more stories”).',
          initCollapsed: false,
        },
      },
    }),

    // Optional toggles (if you want them editable later; default behavior is autoplay+muted+loop)
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Autoplay video on load (recommended).' },
    },
    {
      name: 'loop',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'mutedByDefault',
      type: 'checkbox',
      defaultValue: true,
      label: 'Muted by default',
    },
  ],
}
