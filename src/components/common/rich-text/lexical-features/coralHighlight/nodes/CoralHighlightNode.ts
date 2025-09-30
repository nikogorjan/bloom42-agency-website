import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
  SerializedLexicalNode,
} from '@payloadcms/richtext-lexical/lexical'
import { $applyNodeReplacement, ElementNode } from '@payloadcms/richtext-lexical/lexical'

// Our serialized shape extends the standard ElementNode shape but fixes type/version.
export type SerializedCoralHighlightNode = SerializedElementNode<SerializedLexicalNode> & {
  type: 'coral-highlight'
  version: 1
}

export class CoralHighlightNode extends ElementNode {
  static override getType(): string {
    return 'coral-highlight'
  }

  static override clone(node: CoralHighlightNode): CoralHighlightNode {
    return new CoralHighlightNode(node.__key)
  }

  constructor(key?: NodeKey) {
    super(key)
  }

  // Inline span
  override isInline(): boolean {
    return true
  }

  // Paste/import from DOM
  static override importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        const bg = domNode.style?.backgroundColor?.toLowerCase?.() ?? ''
        const isCoral =
          domNode.dataset?.coralHighlight === '1' || bg === '#fd7247' || bg === 'rgb(253, 114, 71)'
        if (!isCoral) return null
        return {
          conversion: () => $convertSpanToCoralHighlight(),
          priority: 1,
        }
      },
    }
  }

  static override importJSON(_serializedNode: SerializedCoralHighlightNode): CoralHighlightNode {
    return $createCoralHighlightNode()
  }

  override exportJSON(): SerializedCoralHighlightNode {
    // Start with the base element JSON and then override type/version
    const json = super.exportJSON() as SerializedElementNode<SerializedLexicalNode>
    return {
      ...json,
      type: 'coral-highlight',
      version: 1,
    }
  }

  // Render outer element in editor
  override createDOM(_config: EditorConfig): HTMLElement {
    const el = document.createElement('span')
    el.className = 'lex-coral-highlight'
    el.setAttribute('data-coral-highlight', '1')
    // Inline styles so it looks correct even without CSS
    el.style.backgroundColor = '#FD7247'
    el.style.color = '#262423'
    el.style.borderRadius = '.25em'
    el.style.padding = '0 .15em'
    return el
  }

  override updateDOM(): boolean {
    // no diffing needed, this node is simple
    return false
  }

  // Export to DOM (copy/paste, HTML export)
  override exportDOM(): DOMExportOutput {
    const el = document.createElement('span')
    el.setAttribute('data-coral-highlight', '1')
    el.style.backgroundColor = '#FD7247'
    el.style.color = '#262423'
    el.style.borderRadius = '.25em'
    el.style.padding = '0 .15em'
    return { element: el }
  }
}

// helpers
export function $createCoralHighlightNode(): CoralHighlightNode {
  return $applyNodeReplacement(new CoralHighlightNode())
}
export function $isCoralHighlightNode(
  node: LexicalNode | null | undefined,
): node is CoralHighlightNode {
  return node instanceof CoralHighlightNode
}

function $convertSpanToCoralHighlight(): DOMConversionOutput {
  return { node: $createCoralHighlightNode() }
}
