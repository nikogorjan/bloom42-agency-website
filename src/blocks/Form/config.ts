import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
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
      name: 'description',
      type: 'richText',
      localized: true,
      label: 'Description',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h4', 'h5', 'h6'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: { description: 'Shown to the left of the form (supports rich formatting).' },
    },
    {
      name: 'contacts',
      type: 'array',
      labels: { singular: 'Contact', plural: 'Contacts' },
      admin: { description: 'Shown under the description.' },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Icon',
          admin: { description: 'Upload a small square icon (SVG/PNG recommended).' },
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
          label: 'Label',
          admin: { placeholder: 'e.g. +386 40 123 456 or hello@bloom42.com' },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Raw value',
          admin: {
            description:
              'Phone number, email address, or URL. Used to build the link (tel:, mailto:, or https://).',
            placeholder: '+386 40 123 456 / hello@bloom42.com / https://…',
          },
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'auto',
          options: [
            { label: 'Auto-detect', value: 'auto' },
            { label: 'Phone', value: 'phone' },
            { label: 'Email', value: 'email' },
            { label: 'Link', value: 'link' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          label: 'Link URL (if type = Link)',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'link',
            placeholder: 'https://…',
          },
        },
      ],
    },
    {
      name: 'formHeading',
      type: 'text',
      localized: true,
      required: true,
      label: 'Form Heading',
      admin: { placeholder: 'Form description' },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
    },
    {
      name: 'enableIntro',
      type: 'checkbox',
      label: 'Enable Intro Content',
    },
    {
      name: 'introContent',
      type: 'richText',
      admin: {
        condition: (_, { enableIntro }) => Boolean(enableIntro),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: 'Intro Content',
    },
    {
      name: 'serviceLabel',
      type: 'text',
      localized: true,
      label: 'Services Label',
      admin: { placeholder: 'Select service' },
    },
    {
      name: 'serviceCategories',
      type: 'relationship',
      relationTo: 'project-categories',
      hasMany: true,
      label: 'Services (Project Categories)',
      admin: {
        description: 'Pick which services to display as selectable buttons on the form.',
      },
    },
    {
      name: 'allowMultipleServices',
      type: 'checkbox',
      defaultValue: false,
      label: 'Allow selecting multiple services',
    },
  ],
  graphQL: {
    singularName: 'FormBlock',
  },
  labels: {
    plural: 'Form Blocks',
    singular: 'Form Block',
  },
}
