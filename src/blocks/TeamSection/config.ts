// src/blocks/TeamSection/config.ts
import type { Block } from 'payload'
import { linkGroup } from '@/fields/linkGroup'

const FALLBACK_THUMB = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120' fill='none'>
    <rect x='10' y='10' width='140' height='100' rx='10' stroke='#CFCFCF' stroke-width='2'/>
    <path d='M10 60h140' stroke='#CFCFCF' stroke-width='2'/>
    <circle cx='36' cy='36' r='12' stroke='#CFCFCF' stroke-width='2' fill='none'/>
    <rect x='60' y='26' width='70' height='8' rx='4' fill='#CFCFCF'/>
    <rect x='60' y='40' width='44' height='8' rx='4' fill='#E5E5E5'/>
    <rect x='22' y='80' width='116' height='10' rx='5' fill='#EDEDED'/>
  </svg>
`)}`

function getThumbURL() {
  // Highest priority: explicit env for this block
  const fromEnv = (process.env.TEAM_SECTION_ICON_URL || '').trim()
  if (fromEnv) return fromEnv

  // Optional: build from S3 bucket if you host admin thumbnails there
  if (process.env.S3_BUCKET && process.env.S3_REGION) {
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/team-section.webp`
  }

  // Fallback: inline SVG
  return FALLBACK_THUMB
}

export const TeamSection: Block = {
  slug: 'teamSection',
  interfaceName: 'TeamSectionBlock',
  imageURL: getThumbURL(),
  labels: { singular: 'Team Section', plural: 'Team Sections' },
  fields: [
    // Top copy
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: { description: 'Optional small line above the heading.' },
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: false,
      admin: { description: 'Section title (e.g. “Our team”).' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { rows: 3, description: 'Short description under the heading.' },
    },

    // Team members
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'team-members',
      hasMany: true,
      required: true,
      admin: {
        description:
          'Pick people from Team Members. Drag to reorder (order is respected on the page).',
      },
    },

    // Bottom footer content with CTA
    {
      name: 'footer',
      type: 'group',
      admin: {
        description: 'Optional block at the bottom (e.g. “About us” or “We’re hiring”).',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          localized: true,
          admin: { description: 'Footer heading (e.g. “About us”).' },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          admin: { rows: 3 },
        },
        linkGroup({
          overrides: {
            name: 'cta', // single button
            maxRows: 1,
            labels: { singular: 'Button', plural: 'Button' },
            admin: {
              description: 'Optional bottom CTA (e.g. “About us”).',
              initCollapsed: false,
            },
          },
        }),
      ],
    },
  ],
}
