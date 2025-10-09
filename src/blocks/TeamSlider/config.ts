// src/blocks/TeamSlider/config.ts
import type { Block } from 'payload'
import { linkGroup } from '@/fields/linkGroup'

const FALLBACK_THUMB = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='160' height='120' viewBox='0 0 160 120' fill='none'>
    <rect x='10' y='12' width='140' height='96' rx='10' stroke='#CFCFCF' stroke-width='2'/>
    <rect x='26' y='40' width='108' height='56' rx='6' stroke='#CFCFCF' stroke-width='2'/>
    <circle cx='40' cy='32' r='6' fill='#CFCFCF'/>
    <circle cx='56' cy='32' r='6' fill='#CFCFCF'/>
    <circle cx='72' cy='32' r='6' fill='#CFCFCF'/>
  </svg>
`)}`

function getThumbURL() {
  const fromEnv = (process.env.TEAM_SLIDER_ICON_URL || '').trim()
  if (fromEnv) return fromEnv
  if (process.env.S3_BUCKET && process.env.S3_REGION) {
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/team-slider.webp`
  }
  return FALLBACK_THUMB
}

export const TeamSlider: Block = {
  slug: 'teamSlider',
  interfaceName: 'TeamSliderBlock',
  imageURL: getThumbURL(),
  labels: { singular: 'Team Slider', plural: 'Team Sliders' },
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
      admin: { description: 'Section title (e.g. “Meet the team”).' },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { rows: 3, description: 'Short description under the heading.' },
    },

    // Pull members from the collection (order is respected)
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'team-members',
      hasMany: true,
      required: true,
      admin: {
        description: 'Pick people from Team Members. Drag to reorder (order = slide order).',
      },
    },

    // Optional: automatically use latest N members instead of manual selection
    {
      name: 'auto',
      type: 'group',
      admin: { description: 'Optional automatic listing instead of manual selection.' },
      fields: [
        { name: 'enabled', type: 'checkbox', defaultValue: false },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 6,
          admin: { condition: (_, siblingData) => !!siblingData.enabled },
        },
      ],
    },

    // Buttons shown on *each* slide (mapped to ButtonProps in the component layer)
    linkGroup({
      // These map neatly to your Button variants shown in the example
      overrides: {
        name: 'buttons',
        maxRows: 2,
        labels: { singular: 'Button', plural: 'Buttons' },
        admin: {
          description:
            'Optional buttons to repeat for every slide (e.g., “View profile”, “Connect on LinkedIn”).',
          initCollapsed: false,
        },
      },
    }),
  ],
}
