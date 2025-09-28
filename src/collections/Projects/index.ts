import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { linkGroup } from '@/fields/linkGroup' // ← add this
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { revalidateProject, revalidateProjectDelete } from './hooks/revalidatePage'

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    header: true,
    slug: true,
    image: true,
    description: true,
    links: true,
    projectCategories: true,
  },
  admin: {
    useAsTitle: 'header',
    defaultColumns: ['header', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'projects',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'projects',
        req,
      }),
  },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },

    // Localized content
    { name: 'header', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },

    // 🔽 Replace the old group with your standardized linkGroup
    linkGroup({
      // pass appearances if you want to limit choices; otherwise inherit defaults
      // appearances: ['primary', 'secondary', 'link'],
      overrides: {
        // enforce a single CTA for the card
        maxRows: 1,
        labels: { singular: 'Button', plural: 'Button' },
        admin: {
          description: 'Primary CTA button for this project (optional).',
          initCollapsed: true,
        },
        // required: true, // uncomment if you want to force a CTA
      },
    }),

    {
      name: 'projectCategories',
      type: 'relationship',
      relationTo: 'project-categories',
      hasMany: true,
      // add `localized: true` if you want different categories per locale
    },

    ...slugField(), // keep NON-localized for stable URLs

    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidateProject],
    afterDelete: [revalidateProjectDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
