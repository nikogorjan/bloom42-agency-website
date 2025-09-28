import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import {
  revalidateProjectCategory,
  revalidateProjectCategoryDelete,
} from './Projects/hooks/revalidatePage'

export const ProjectCategories: CollectionConfig = {
  slug: 'project-categories',
  labels: {
    singular: 'Project Category',
    plural: 'Project Categories',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    // group: 'Taxonomies', // optional: uncomment to group in sidebar
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true, // optional if you want per-locale titles
    },
    // Optional niceties (uncomment if you want them)
    // { name: 'description', type: 'textarea' },
    // { name: 'icon', type: 'upload', relationTo: 'media' },

    ...slugField(), // keep slug non-localized so URLs stay stable across locales
  ],
  hooks: {
    afterChange: [revalidateProjectCategory],
    afterDelete: [revalidateProjectCategoryDelete],
  },
}
