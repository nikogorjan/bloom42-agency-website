// src/components/common/rich-text/lexical-features/coralHighlight/nodes/CoralTextNode.ts
import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
} from '@payloadcms/richtext-lexical/lexical'
import { TextNode } from '@payloadcms/richtext-lexical/lexical'

export type SerializedCoralTextNode = SerializedTextNode & {
  type: 'coral-text'
  version: 1
}

export class CoralTextNode extends TextNode {
  static override getType(): string {
    return 'coral-text'
  }

  static override clone(node: CoralTextNode): CoralTextNode {
    return new CoralTextNode(node.__text, node.__key)
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key)
  }

  static override importJSON(json: SerializedCoralTextNode): CoralTextNode {
    return $createCoralTextNode(json.text)
  }

  override exportJSON(): SerializedCoralTextNode {
    const json = super.exportJSON() as SerializedTextNode
    return { ...json, type: 'coral-text', version: 1 }
  }

  override createDOM(_config: EditorConfig): HTMLElement {
    const el = super.createDOM(_config)
    // Coral brand styling
    el.style.backgroundColor = '#FD7247'
    el.style.color = '#262423'
    el.style.borderRadius = '.25rem'
    el.style.padding = '0 .15em'
    return el
  }
}

export function $createCoralTextNode(text: string): CoralTextNode {
  return new CoralTextNode(text)
}
export function $isCoralTextNode(node: LexicalNode | null | undefined): node is CoralTextNode {
  return node instanceof CoralTextNode
}
