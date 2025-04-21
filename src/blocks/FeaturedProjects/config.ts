import type { Block } from 'payload'

// Match "Props" + "ProjectProps" from your FeaturedProjects component:
export const FeaturedProjects: Block = {
  slug: 'featuredProjects',
  interfaceName: 'FeaturedProjectsBlock',
  imageURL: '/media/images/blocks/FeaturedProjects.webp',
  labels: {
    singular: 'Featured Project',
    plural: 'Featured Projects',
  },
  fields: [
    // Tagline
    {
      name: 'tagline',
      label: 'Tagline',
      type: 'text',
    },
    // Heading
    {
      name: 'heading',
      label: 'Heading',
      type: 'text',
    },
    // Description
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
    },
    // Top-level button
    {
      name: 'button',
      label: 'Main Button',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'text',
          required: true,
        },
        {
          name: 'variant',
          label: 'Variant',
          type: 'select',
          options: [
            { label: 'Secondary', value: 'secondary' },
            { label: 'Link', value: 'link' },
            { label: 'Primary', value: 'primary' },
          ],
          defaultValue: 'secondary',
        },
        {
          name: 'size',
          label: 'Size',
          type: 'select',
          options: [
            { label: 'Link', value: 'link' },
            { label: 'Large', value: 'lg' },
            { label: 'Primary', value: 'primary' },
          ],
          defaultValue: 'primary',
        },
        {
          name: 'iconRight',
          label: 'Icon Right?',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    // Array of projects
    {
      name: 'projects',
      label: 'Projects',
      type: 'array',
      minRows: 1,
      labels: {
        singular: 'Project',
        plural: 'Projects',
      },
      fields: [
        // project.title
        {
          name: 'title',
          label: 'Project Title',
          type: 'text',
          required: true,
        },
        // project.description
        {
          name: 'description',
          label: 'Project Description',
          type: 'textarea',
        },
        // project.url
        {
          name: 'url',
          label: 'Project URL',
          type: 'text',
        },
        // project.image
        {
          name: 'image',
          label: 'Project Image',
          type: 'group',
          fields: [
            {
              name: 'src',
              label: 'Image Source',
              type: 'text',
              required: true,
            },
            {
              name: 'alt',
              label: 'Alt Text',
              type: 'text',
            },
          ],
        },
        // project.button
        {
          name: 'button',
          label: 'Project Button',
          type: 'group',
          fields: [
            {
              name: 'title',
              label: 'Button Title',
              type: 'text',
              required: true,
            },
            {
              name: 'variant',
              label: 'Variant',
              type: 'select',
              options: [
                { label: 'Secondary', value: 'secondary' },
                { label: 'Link', value: 'link' },
              ],
              defaultValue: 'link',
            },
            {
              name: 'size',
              label: 'Size',
              type: 'select',
              options: [
                { label: 'Link', value: 'link' },
                { label: 'Large', value: 'lg' },
              ],
              defaultValue: 'link',
            },
            {
              name: 'iconRight',
              label: 'Icon Right?',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        // project.tags
        {
          name: 'tags',
          label: 'Tags',
          type: 'array',
          labels: {
            singular: 'Tag',
            plural: 'Tags',
          },
          fields: [
            {
              name: 'label',
              label: 'Label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              label: 'URL',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
