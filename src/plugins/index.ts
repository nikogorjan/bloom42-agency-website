import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin, fields as formFields } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

const resolveBlock = (b: any) => (typeof b === 'function' ? b() : b)

// Convenience: safely get the inner `fields` array from a resolved Block
const getBlockFields = (b: any) => {
  const block = resolveBlock(b)
  return {
    block,
    fields: Array.isArray(block?.fields) ? block.fields : [],
  }
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,

      // TEXT
      text: (() => {
        const { block, fields } = getBlockFields(formFields.text)
        return {
          ...block,
          fields: fields.map((fld: any) =>
            fld?.name === 'label' || fld?.name === 'placeholder'
              ? { ...fld, localized: true }
              : fld,
          ),
        }
      })(),

      // TEXTAREA
      textarea: (() => {
        const { block, fields } = getBlockFields(formFields.textarea)
        return {
          ...block,
          fields: fields.map((fld: any) =>
            fld?.name === 'label' || fld?.name === 'placeholder'
              ? { ...fld, localized: true }
              : fld,
          ),
        }
      })(),

      // EMAIL
      email: (() => {
        const { block, fields } = getBlockFields(formFields.email)
        return {
          ...block,
          fields: fields.map((fld: any) =>
            fld?.name === 'label' || fld?.name === 'placeholder'
              ? { ...fld, localized: true }
              : fld,
          ),
        }
      })(),

      // NUMBER
      number: (() => {
        const { block, fields } = getBlockFields(formFields.number)
        return {
          ...block,
          fields: fields.map((fld: any) =>
            fld?.name === 'label' || fld?.name === 'placeholder'
              ? { ...fld, localized: true }
              : fld,
          ),
        }
      })(),

      // SELECT (also localize options[].label)
      select: (() => {
        const { block, fields } = getBlockFields(formFields.select)
        return {
          ...block,
          fields: fields.map((fld: any) => {
            if (fld?.name === 'label' || fld?.name === 'placeholder') {
              return { ...fld, localized: true }
            }
            if (fld?.name === 'options' && fld?.type === 'array' && Array.isArray(fld.fields)) {
              return {
                ...fld,
                fields: fld.fields.map((optFld: any) =>
                  optFld?.name === 'label' ? { ...optFld, localized: true } : optFld,
                ),
              }
            }
            return fld
          }),
        }
      })(),

      // RADIO (also localize options[].label)
      radio: (() => {
        const { block, fields } = getBlockFields(formFields.radio)
        return {
          ...block,
          fields: fields.map((fld: any) => {
            if (fld?.name === 'label') return { ...fld, localized: true }
            if (fld?.name === 'options' && fld?.type === 'array' && Array.isArray(fld.fields)) {
              return {
                ...fld,
                fields: fld.fields.map((optFld: any) =>
                  optFld?.name === 'label' ? { ...optFld, localized: true } : optFld,
                ),
              }
            }
            return fld
          }),
        }
      })(),

      // CHECKBOX
      checkbox: (() => {
        const { block, fields } = getBlockFields(formFields.checkbox)
        return {
          ...block,
          fields: fields.map((fld: any) =>
            fld?.name === 'label' ? { ...fld, localized: true } : fld,
          ),
        }
      })(),

      // COUNTRY
      country: (() => {
        const { block, fields } = getBlockFields(formFields.country)
        return {
          ...block,
          fields: fields.map((fld: any) =>
            fld?.name === 'label' || fld?.name === 'placeholder'
              ? { ...fld, localized: true }
              : fld,
          ),
        }
      })(),

      // STATE
      state: (() => {
        const { block, fields } = getBlockFields(formFields.state)
        return {
          ...block,
          fields: fields.map((fld: any) =>
            fld?.name === 'label' || fld?.name === 'placeholder'
              ? { ...fld, localized: true }
              : fld,
          ),
        }
      })(),

      // MESSAGE (rich text content)
      message: (() => {
        const block = resolveBlock(formFields.message)
        return { ...block, localized: true }
      })(),
    },

    // Keep your confirmation editor override AND add localization on Forms collection fields
    formOverrides: {
      fields: ({ defaultFields }) =>
        defaultFields.map((field: any) => {
          if (field?.name === 'title') return { ...field, localized: true }
          if (field?.name === 'submitButtonLabel') return { ...field, localized: true }

          if (field?.name === 'confirmationMessage') {
            return {
              ...field,
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  FixedToolbarFeature(),
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                ],
              }),
            }
          }

          if (field?.name === 'emails' && Array.isArray(field?.fields)) {
            return {
              ...field,
              fields: field.fields.map((ef: any) => {
                if (ef?.name === 'subject') return { ...ef, localized: true }
                if (ef?.name === 'message') return { ...ef, localized: true }
                return ef
              }),
            }
          }

          return field
        }),
    },
  }),

  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  payloadCloudPlugin(),
]
