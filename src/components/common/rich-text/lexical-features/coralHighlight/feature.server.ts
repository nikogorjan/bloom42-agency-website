// src/components/common/rich-text/lexical-features/coralHighlight/feature.server.ts
import { createServerFeature, createNode } from '@payloadcms/richtext-lexical'
import { CoralTextNode } from './nodes/CoralTextNode'

export const CoralHighlightFeature = createServerFeature({
  key: 'coralHighlight',
  feature: {
    i18n: {
      en: { label: 'Coral highlight' },
      sl: { label: 'Koralno ozadje' },
    },
    nodes: [createNode({ node: CoralTextNode })],
    ClientFeature:
      'src/components/common/rich-text/lexical-features/coralHighlight/feature.client#CoralHighlightClientFeature',
  },
})
