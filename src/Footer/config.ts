// src/Footer/config.ts
import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateFooterNow } from '@/utilities/revalidate'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  fields: [
    // Logo (upload) + optional link target
    {
      type: 'row',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Logo',
          admin: { width: '50%' },
        },
        {
          name: 'logoHref',
          type: 'text',
          label: 'Logo URL',
          admin: { description: 'Defaults to home (/) if empty.', width: '50%' },
        },
      ],
    },

    // Contact
    {
      name: 'contact',
      type: 'group',
      label: 'Contact',
      fields: [
        { name: 'label', type: 'text', localized: true, defaultValue: 'Contact:', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'email', type: 'email', required: true },
      ],
    },

    // Columns (each with header + links[])
    {
      name: 'columns',
      type: 'array',
      labels: { singular: 'Column', plural: 'Columns' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'header',
          type: 'text',
          localized: true,
          required: true,
          label: 'Column Header',
        },
        {
          name: 'links',
          type: 'array',
          labels: { singular: 'Link', plural: 'Links' },
          fields: [
            link({ appearances: false }), // reuse your CMS link field
          ],
        },
      ],
      maxRows: 6,
    },

    // Socials
    {
      name: 'socialLinks',
      type: 'array',
      labels: { singular: 'Social Link', plural: 'Social Links' },
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'X / Twitter', value: 'x' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'TikTok', value: 'tiktok' },
            { label: 'GitHub', value: 'github' },
            { label: 'Dribbble', value: 'dribbble' },
            { label: 'Behance', value: 'behance' },
            { label: 'Threads', value: 'threads' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },

    // Company image (e.g., partner logo row)
    {
      type: 'row',
      fields: [
        {
          name: 'companyImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Company Image',
          admin: { width: '50%' },
        },
        {
          name: 'companyImageHref',
          type: 'text',
          label: 'Company Image URL',
          admin: { width: '50%' },
        },
      ],
    },

    // Bottom row text + links
    {
      name: 'footerText',
      type: 'text',
      localized: true,
      label: 'Footer Text',
      admin: { placeholder: '© YEAR Company. All rights reserved.' },
    },
    {
      name: 'footerLinks',
      type: 'array',
      labels: { singular: 'Footer Link', plural: 'Footer Links' },
      fields: [link({ appearances: false })],
      admin: { initCollapsed: true },
    },
  ],
  hooks: {
    afterChange: [
      async () => {
        await revalidateFooterNow()
      },
    ],
  },
}
