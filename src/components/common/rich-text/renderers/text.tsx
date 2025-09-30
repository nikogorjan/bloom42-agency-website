import { NodeFormat } from '@/components/common/rich-text/node-format'
import { UnderlinedText } from '@/components/common/rich-text/renderers/_text-components/UnderlinedText/underlinedText'
import type { RichTextRenderer } from '@/components/common/rich-text/utils'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const TextRenderer: RichTextRenderer<any> = {
  nodeTypes: ['text', 'highlight', 'coral-text'],
  render: ({ node }) => {
    const text = node.text

    if (node.format & NodeFormat.IS_BOLD) {
      return <strong>{text}</strong>
    }
    if (node.format & NodeFormat.IS_ITALIC) {
      return <em>{text}</em>
    }
    if (node.format & NodeFormat.IS_STRIKETHROUGH) {
      return <span className="line-through text-crossed">{text}</span>
    }
    if (node.format & NodeFormat.IS_UNDERLINE) {
      // TODO: modify this component to render yellow svg underlines from the design in figma
      return (
        <span className="underline text-highlight">
          <UnderlinedText text={text} />
        </span>
      )
    }
    if (node.format & NodeFormat.IS_CODE) {
      return <code>{text}</code>
    }
    if (node.format & NodeFormat.IS_SUBSCRIPT) {
      return <sub>{text}</sub>
    }
    if (node.format & NodeFormat.IS_SUPERSCRIPT) {
      return <sup>{text}</sup>
    }
    if (node.format & NodeFormat.IS_HIGHLIGHT) {
      return (
        <span
          style={{
            backgroundColor: '#FD7247',
            color: '#262423',
          }}
        >
          {text}
        </span>
      )
    }
    if (node.type === 'coral-text') {
      const text = node.text
      return (
        <span
          style={{
            backgroundColor: '#FD7247',
            color: '#262423',
          }}
        >
          {text}
        </span>
      )
    }

    return text
  },
}
