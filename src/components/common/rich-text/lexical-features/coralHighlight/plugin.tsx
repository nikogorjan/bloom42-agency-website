'use client'

import type { LexicalCommand } from '@payloadcms/richtext-lexical/lexical'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  ElementNode,
} from '@payloadcms/richtext-lexical/lexical'
import {
  $unwrapNode,
  $wrapNodeInElement,
  registerNestedElementResolver,
} from '@payloadcms/richtext-lexical/lexical/utils'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import { useEffect } from 'react'
import type { PluginComponent } from '@payloadcms/richtext-lexical'
import {
  $createCoralHighlightNode,
  $isCoralHighlightNode,
  CoralHighlightNode,
} from './nodes/CoralHighlightNode'

export const INSERT_CORAL_HIGHLIGHT_COMMAND: LexicalCommand<void> = createCommand(
  'INSERT_CORAL_HIGHLIGHT_COMMAND',
)

export const CoralHighlightPlugin: PluginComponent = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    // Prevent nested coral-highlight spans by auto-merging adjacent/nested same nodes
    const unregisterResolver = registerNestedElementResolver(
      editor,
      CoralHighlightNode,
      (from) => {
        // clone: we don't store custom data, just return a new wrapper
        return $createCoralHighlightNode()
      },
      // handleOverlap: move children from 'from' into 'to' to merge
      (from, to) => {
        const children = from.getChildren()
        children.forEach((child) => to.append(child))
        from.remove()
      },
    )

    const unregisterCommand = editor.registerCommand(
      INSERT_CORAL_HIGHLIGHT_COMMAND,
      () => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          return true
        }

        const nodes = selection.getNodes()

        // Check if any selected leaf already sits inside our wrapper
        const alreadyWrapped = nodes.some((n) => {
          const p = n.getParent()
          return p && $isCoralHighlightNode(p)
        })

        if (alreadyWrapped) {
          // UNWRAP: locate ancestor CoralHighlightNode(s) of selected nodes and unwrap
          // Use a Set so we don’t try to unwrap the same wrapper multiple times
          const wrappers = new Set<ElementNode>()
          nodes.forEach((n) => {
            let p = n.getParent()
            if (p && $isCoralHighlightNode(p)) wrappers.add(p)
          })
          wrappers.forEach((wrapper) => $unwrapNode(wrapper))
        } else {
          // WRAP: wrap each selected leaf node in our coral span
          nodes.forEach((n) => {
            // Only wrap nodes that have a parent and aren’t already inside the wrapper
            const p = n.getParent()
            if (p && !$isCoralHighlightNode(p)) {
              $wrapNodeInElement(n, () => $createCoralHighlightNode())
            }
          })
        }

        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )

    return () => {
      unregisterResolver()
      unregisterCommand()
    }
  }, [editor])

  return null
}
