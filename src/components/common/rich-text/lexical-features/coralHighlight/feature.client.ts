// src/lexical-features/coralHighlight/feature.client.ts
'use client'

import {
  createClientFeature,
  toolbarFormatGroupWithItems,
  slashMenuBasicGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { CoralHighlightNode, $isCoralHighlightNode } from './nodes/CoralHighlightNode'
import { INSERT_CORAL_HIGHLIGHT_COMMAND, CoralHighlightPlugin } from './plugin'
import { CoralIcon } from './icon'
import { $isRangeSelection } from '@payloadcms/richtext-lexical/lexical'

export const CoralHighlightClientFeature = createClientFeature({
  nodes: [CoralHighlightNode],
  plugins: [
    {
      Component: CoralHighlightPlugin,
      position: 'normal', // valid: 'normal' | 'bottom' | 'aboveContainer' | 'floating' | 'outsideBelow' | 'outsideAbove'
    },
  ],
  toolbarFixed: {
    groups: [
      toolbarFormatGroupWithItems([
        {
          ChildComponent: CoralIcon,
          key: 'coralHighlight',
          label: ({ i18n }) => i18n.t('lexical:coralHighlight:label'),
          onSelect: ({ editor }) =>
            editor.dispatchCommand(INSERT_CORAL_HIGHLIGHT_COMMAND, undefined),
          isActive: ({ selection }) => {
            if (!$isRangeSelection(selection)) return false
            return selection.getNodes().some((n) => {
              const p = n.getParent()
              return p && $isCoralHighlightNode(p)
            })
          },
        },
      ]),
    ],
  },

  toolbarInline: {
    groups: [
      toolbarFormatGroupWithItems([
        {
          ChildComponent: CoralIcon,
          key: 'coralHighlightInline',
          label: ({ i18n }) => i18n.t('lexical:coralHighlight:label'),
          onSelect: ({ editor }) =>
            editor.dispatchCommand(INSERT_CORAL_HIGHLIGHT_COMMAND, undefined),
        },
      ]),
    ],
  },

  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems([
        {
          Icon: CoralIcon,
          key: 'coral-highlight',
          label: ({ i18n }) => i18n.t('lexical:coralHighlight:label'),
          keywords: ['highlight', 'background', 'coral', 'mark', 'bg'],
          onSelect: ({ editor }) =>
            editor.dispatchCommand(INSERT_CORAL_HIGHLIGHT_COMMAND, undefined),
        },
      ]),
    ],
  },
})
