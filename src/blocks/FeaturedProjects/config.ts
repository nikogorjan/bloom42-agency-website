// /src/blocks/FeaturedProjects/config.ts
import { linkGroup } from '@/fields/linkGroup'
import type { Block } from 'payload'

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
    return `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/featured-projects.webp`
  }
  return FALLBACK_THUMB
}

export const FeaturedProjects: Block = {
  slug: 'featuredProjects',
  interfaceName: 'FeaturedProjectsBlock',
  imageURL: getThumbURL(),
  labels: { singular: 'Featured Projects', plural: 'Featured Projects' },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Our Featured Projects',
    },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      required: true,
      admin: { description: 'Pick and drag to reorder.' },
    },
    linkGroup({
      // If you want to restrict styles, pass: appearances: ['outline','chevronRight']
      overrides: {
        name: 'cta', // <- avoid clashing with Project.links
        maxRows: 1, // only one button
        labels: { singular: 'Button', plural: 'Button' },
        admin: {
          description: 'Optional bottom CTA (e.g. “View all”).',
          initCollapsed: false,
        },
      },
    }),
  ],
}
