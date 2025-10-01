'use client'

import {
  createClientFeature,
  toolbarFormatGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  type BaseSelection,
  type LexicalEditor,
  type LexicalNode,
} from '@payloadcms/richtext-lexical/lexical'
import { $createCoralTextNode, $isCoralTextNode, CoralTextNode } from './nodes/CoralTextNode'
import { CoralIcon } from './icon'
/** helper: is this node (or its parent) a coral text node? */
function nodeIsCoral(n: LexicalNode | null | undefined): boolean {
  return !!n && ($isCoralTextNode(n) || $isCoralTextNode(n.getParent()))
}

/**
 * ACTIVE means: user has a non-empty range selected, and the whole selection is coral.
 * (When the caret is just sitting inside coral with no range, we DO NOT show active—per your ask.)
 */
function isActiveCoral(selection: BaseSelection | null | undefined): boolean {
  if (!$isRangeSelection(selection) || selection.isCollapsed()) return false
  const nodes = selection.getNodes()
  if (nodes.length === 0) return false
  return nodes.every((n) => nodeIsCoral(n))
}

/** Only enable when there is a real, non-empty range */
function isEnabled(selection: BaseSelection | null | undefined): boolean {
  return (
    $isRangeSelection(selection) &&
    !selection.isCollapsed() &&
    selection.getTextContent().length > 0
  )
}

function toggleCoral(editor: LexicalEditor) {
  editor.focus()
  editor.update(() => {
    const selection = $getSelection()
    if (!$isRangeSelection(selection) || selection.isCollapsed()) return

    const nodes = selection.getNodes()
    const allCoral = nodes.length > 0 && nodes.every((n) => nodeIsCoral(n))

    if (allCoral) {
      // UNWRAP: replace each coral node (once) with a plain TextNode
      const seen = new Set<LexicalNode>()
      nodes.forEach((n) => {
        const t = $isCoralTextNode(n) ? n : n.getParent()
        if (t && $isCoralTextNode(t) && !seen.has(t)) {
          seen.add(t)
          t.replace($createTextNode(t.getTextContent()))
        }
      })
      return
    }

    // WRAP: replace the selection with a single CoralTextNode
    const text = selection.getTextContent()
    selection.insertNodes([$createCoralTextNode(text)])
  })
}

/** Button shell: uses our icon and only paints “active” when isActiveCoral() is true */
const CoralBtn: React.FC<{ active?: boolean; onClick: () => void }> = ({ active, onClick }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()} // keep selection from blurring
    onClick={onClick}
    aria-pressed={active ? 'true' : 'false'}
    className={`lex-toolbar-btn${active ? ' is-active' : ''}`}
    title="Coral highlight"
  >
    <CoralIcon />
  </button>
)

export const CoralHighlightClientFeature = createClientFeature({
  nodes: [CoralTextNode],
  toolbarFixed: {
    groups: [
      toolbarFormatGroupWithItems([
        {
          key: 'coralHighlight',
          isActive: ({ selection }) => isActiveCoral(selection),
          isEnabled: ({ selection }) => isEnabled(selection),
          Component: ({ editor, active }) => (
            <CoralBtn active={!!active} onClick={() => toggleCoral(editor)} />
          ),
        },
      ]),
    ],
  },
  toolbarInline: {
    groups: [
      toolbarFormatGroupWithItems([
        {
          key: 'coralHighlightInline',
          isActive: ({ selection }) => isActiveCoral(selection),
          isEnabled: ({ selection }) => isEnabled(selection),
          Component: ({ editor, active }) => (
            <CoralBtn active={!!active} onClick={() => toggleCoral(editor)} />
          ),
        },
      ]),
    ],
  },
})
