// src/globals/Header.ts
import type { GlobalConfig } from 'payload'
import { revalidateHeader } from './hooks/revalidateHeader'
import { linkGroup } from '@/fields/linkGroup'
import { revalidateHeaderNow } from '@/utilities/revalidate'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'logo',
          label: 'Logo Image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'logoUrl',
          label: 'Logo URL',
          type: 'text',
          required: false,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'navItems',
      label: 'Navigation Items',
      type: 'array',
      localized: true,
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
      fields: [
        // 1) Choose link type
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'radio',
              defaultValue: 'reference',
              options: [
                { label: 'Internal link', value: 'reference' },
                { label: 'Custom URL', value: 'custom' },
                { label: 'Dropdown menu', value: 'dropdown' },
              ],
              admin: { layout: 'horizontal', width: '50%' },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in new tab',
              admin: { width: '50%', style: { alignSelf: 'flex-end' } },
            },
          ],
        },

        // 2) Single‐link fields
        {
          name: 'reference',
          type: 'relationship',
          relationTo: ['pages', 'posts'],
          required: true,
          admin: {
            condition: (_, data) => data?.type === 'reference',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          admin: {
            condition: (_, data) => data?.type === 'custom',
          },
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
          admin: {
            width: '50%',
            condition: (_, data) => data?.type !== 'dropdown',
          },
        },

        // 3) Dropdown items array
        {
          name: 'defaultImage',
          type: 'upload',
          label: 'Default Image',
          relationTo: 'media',
          required: false,
          admin: {
            condition: (_, data) => data?.type === 'dropdown',
          },
        },
        {
          name: 'items',
          label: 'Dropdown Links',
          type: 'array',
          admin: {
            condition: (_, data) => data?.type === 'dropdown',
            initCollapsed: true,
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'type',
                  type: 'radio',
                  defaultValue: 'reference',
                  options: [
                    { label: 'Internal link', value: 'reference' },
                    { label: 'Custom URL', value: 'custom' },
                  ],
                  admin: { layout: 'horizontal', width: '50%' },
                },
                {
                  name: 'newTab',
                  type: 'checkbox',
                  label: 'Open in new tab',
                  admin: { width: '50%', style: { alignSelf: 'flex-end' } },
                },
              ],
            },

            {
              name: 'reference',
              type: 'relationship',
              relationTo: ['pages', 'posts'],
              required: true,
              admin: {
                condition: (_, d) => d?.type === 'reference',
              },
            },
            {
              name: 'url',
              type: 'text',
              required: true,
              admin: {
                condition: (_, d) => d?.type === 'custom',
              },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              label: 'Label',
              admin: { width: '50%' },
            },
            {
              name: 'icon',
              type: 'upload',
              label: 'Icon',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Optional image or icon for this link',
              },
            },
            {
              name: 'media',
              type: 'upload',
              label: 'Media',
              relationTo: 'media',
              required: false,
              admin: {
                description: 'Optional image or icon for this link',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              required: false,
              admin: {
                description: 'Optional description for this link',
              },
            },
          ],
        },
      ],
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
  ],
  hooks: {
    afterChange: [
      async () => {
        await revalidateHeaderNow()
      },
    ],
  },
}
