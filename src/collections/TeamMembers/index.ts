// src/collections/TeamMembers/index.ts
import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { revalidateTeamMember, revalidateTeamMemberDelete } from './hooks/revalidateTeam'
import {
  lexicalEditor,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
export const TeamMembers: CollectionConfig<'team-members'> = {
  slug: 'team-members',

  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },

  defaultPopulate: {
    // helpful defaults when this doc is embedded in blocks
    image: true,
    name: true,
    jobTitle: true,
    description: true,
    socials: true,
    slug: true,
  },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'jobTitle', 'slug', 'updatedAt'],
    livePreview: {
      // if you have public profile pages for members, keep; if not, it still works
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'team-members',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'team-members',
        req,
      }),
  },

  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true, label: 'Photo' },

    // Localized content
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'jobTitle', type: 'text', localized: true, label: 'Job title' },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: { rows: 3 },
    },

    {
      name: 'quote',
      label: 'Quote',
      type: 'richText',
      localized: true,
      required: false,
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

    // Socials group
    {
      name: 'socials',
      type: 'group',
      admin: { description: 'Optional social links.' },
      fields: [
        { name: 'linkedin', type: 'text', localized: true },
        { name: 'x', type: 'text', label: 'X / Twitter', localized: true },
        { name: 'facebook', type: 'text', localized: true },
        { name: 'instagram', type: 'text', localized: true },
        { name: 'website', type: 'text', localized: true, label: 'Website' },
      ],
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
    afterChange: [revalidateTeamMember],
    afterDelete: [revalidateTeamMemberDelete],
  },

  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}

export default TeamMembers
