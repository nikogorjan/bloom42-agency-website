import { HeadingRenderer } from '@/components/common/rich-text/renderers/heading'
import { LinebreakRenderer } from '@/components/common/rich-text/renderers/linebreak'
import { LinkRenderer } from '@/components/common/rich-text/renderers/link'
import { ListItemRenderer, ListRenderer } from '@/components/common/rich-text/renderers/list'
import { ParagraphRenderer } from '@/components/common/rich-text/renderers/paragraph'
import { QuoteRenderer } from '@/components/common/rich-text/renderers/quote'
import { TextRenderer } from '@/components/common/rich-text/renderers/text'
import { UnknownRenderer } from '@/components/common/rich-text/renderers/unknown'
import type {
  RichTextRenderer,
  SerializedLexicalNodeWithParent,
  TRichText,
} from '@/components/common/rich-text/utils'
import { cn } from '@/utilities/ui'
import type { ReactNode } from 'react'
import { CoralHighlightRenderer } from './renderers/coral-highlight'

const richTextRenderers: RichTextRenderer[] = [
  TextRenderer,
  ParagraphRenderer,
  HeadingRenderer,
  LinebreakRenderer,
  LinkRenderer,
  ListRenderer,
  QuoteRenderer,
  UnknownRenderer,
  ListItemRenderer,
  CoralHighlightRenderer,
  /// TODO: Add more renderers here (for example: UnderlineRenderer, etc.)
]

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  text?: TRichText | null
}

export const RichTextCustom = ({ text, className, ...rest }: Props) => {
  if (text?.root?.children?.length) {
    return (
      <div className={cn(className)} {...rest}>
        <RichTextChildren
          renderers={richTextRenderers}
          parent={text?.root}
          lexicalNodes={text?.root?.children}
        />
      </div>
    )
  }
  return ''
}

export const SpanText = ({ text, className, ...rest }: Props) => {
  if (text?.root?.children?.length) {
    return (
      <span className={cn(className)} {...rest}>
        <RichTextChildren
          renderers={richTextRenderers}
          parent={text?.root}
          lexicalNodes={text?.root?.children}
        />
      </span>
    )
  }
  return ''
}

export const RichTextChildren = ({
  renderers,
  lexicalNodes,
  parent,
  submissionData,
}: {
  renderers: RichTextRenderer[]
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  lexicalNodes: any[]
  parent: SerializedLexicalNodeWithParent
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  submissionData?: any
}): ReactNode => {
  const Unknown = renderers.find((r) => r.nodeTypes.includes('unknown'))?.render

  return (
    <>
      {lexicalNodes.map((node, i) => {
        // Find renderer which can handle this node
        const Node = renderers.find((renderer) => renderer.nodeTypes.includes(node.type))?.render

        if (!Node) {
          console.error('No renderer found for node', node)

          if (Unknown) {
            return (
              <Unknown
                key={i}
                childIndex={i}
                renderers={renderers}
                node={node}
                parent={parent}
                submissionData={submissionData}
              />
            )
          }

          // No unknown renderer, don't render this node
          return null
        }

        return (
          <Node
            key={i}
            childIndex={i}
            renderers={renderers}
            node={node}
            parent={parent}
            submissionData={submissionData}
          />
        )
      })}
    </>
  )
}
