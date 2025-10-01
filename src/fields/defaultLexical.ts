// src/fields/defaultLexical.ts
import type { TextFieldSingleValidation } from 'payload'
import {
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  ParagraphFeature,
  UnderlineFeature,
  InlineToolbarFeature,
  FixedToolbarFeature,
  lexicalEditor,
  type LinkFields,
} from '@payloadcms/richtext-lexical'
import { TextStateFeature } from '@payloadcms/richtext-lexical'

export const defaultLexical = lexicalEditor({
  features: [
    ParagraphFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),

    // toolbars so the style picker shows up
    InlineToolbarFeature(),
    FixedToolbarFeature(),

    // ✅ TextStateFeature: one background style called "highlight"
    TextStateFeature({
      state: {
        bg: {
          highlight: {
            label: 'Highlight',
            css: { 'background-color': '#FD7247', color: '#262423' },
          },
        },
      },
    }),

    // your LinkFeature (unchanged)
    LinkFeature({
      enabledCollections: ['pages', 'posts'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter(
          (f) => !('name' in f && f.name === 'url'),
        )
        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: { condition: (_data, s) => s?.linkType !== 'internal' },
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') return true
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),
  ],
})
