// src/components/common/rich-text/lexical-features/coralHighlight/feature.server.ts
import { createServerFeature } from '@payloadcms/richtext-lexical'

export const CoralHighlightFeature = createServerFeature({
  key: 'coralHighlight',
  feature: {
    i18n: {
      en: { label: 'Coral highlight' },
      sl: { label: 'Koralno ozadje' },
    },
    ClientFeature:
      'src/components/common/rich-text/lexical-features/coralHighlight/feature.client#CoralHighlightClientFeature',
  },
})
