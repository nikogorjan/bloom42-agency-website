import type { Block } from 'payload'

export const UncommonServices: Block = {
  slug: 'uncommonServices', // required unique slug
  interfaceName: 'UncommonServicesBlock', // matches your component prop type if you like
  imageURL: '/media/images/blocks/uncommonServices.webp',
  labels: {
    singular: 'Uncommon Services',
    plural: 'Uncommon Services',
  },
  fields: [
    {
      name: 'features',
      label: 'Features',
      type: 'array',
      minRows: 1,
      labels: {
        singular: 'Feature',
        plural: 'Features',
      },
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
        },
        {
          name: 'tagline',
          type: 'text',
        },
        {
          name: 'heading',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },
  ],
}
