// src/endpoints/seed/contact-page.ts
import type { Form } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

type ContactArgs = {
  contactForm: Form
}

export const contact: (args: ContactArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  contactForm,
}) => {
  return {
    slug: 'contact',
    _status: 'published',
    hero: { type: 'none' },
    title: 'Contact',
    layout: [
      {
        blockType: 'formBlock',

        // ✅ REQUIRED by your updated block schema
        heading: 'Tell us about your project',
        formHeading: 'Contact form',

        // (optional but nice)
        serviceLabel: 'Select service',
        // description is optional; include it only if you want
        // description: {
        //   root: {
        //     type: 'root',
        //     children: [
        //       {
        //         type: 'paragraph',
        //         children: [{ type: 'text', text: 'We’d love to hear from you.', version: 1, detail: 0, format: 0, mode: 'normal', style: '' }],
        //         direction: 'ltr',
        //         format: '',
        //         indent: 0,
        //         version: 1,
        //       },
        //     ],
        //     direction: 'ltr',
        //     format: '',
        //     indent: 0,
        //     version: 1,
        //   },
        // },

        enableIntro: true,
        introContent: {
          root: {
            type: 'root',
            children: [
              {
                type: 'heading',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Example contact form:',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                tag: 'h3',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },

        // relation to Forms – passing the doc is fine
        form: contactForm,

        // optional extras with safe defaults
        serviceCategories: [],
        allowMultipleServices: false,
      },
    ],
  }
}
