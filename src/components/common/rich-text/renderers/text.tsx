import { NodeFormat } from '@/components/common/rich-text/node-format'
import { UnderlinedText } from '@/components/common/rich-text/renderers/_text-components/UnderlinedText/underlinedText'
import type { RichTextRenderer } from '@/components/common/rich-text/utils'
import {
  HighlightText,
  isTextStateHighlighted,
} from '@/components/common/rich-text/renderers/highlight-text'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const TextRenderer: RichTextRenderer<any> = {
  nodeTypes: ['text', 'highlight'],
  render: ({ node }) => {
    const text = node.text

    if (node.type === 'highlight') {
      switch (node.variant) {
        case 'highlight':
          // TODO: render highlighted span
          return <span className="bg-highlightbar text-blue">{text}</span>
        case 'gradient':
          // TODO: render span with gradient
          return (
            <span
              style={{
                background: 'linear-gradient(92deg, #364efc 26.4%, #b478ff 56.1%, #f1ac0c 99.54%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {text}
            </span>
          )
        case 'text-yellow':
          return <span className="text-yellow">{text}</span>
        case 'up-left':
          // TODO: render span with gradient
          return (
            <div className="relative inline-block">
              {/* Gradient Text */}
              <span className="relative z-10 text-highlight">
                <UnderlinedText text={text} />
              </span>

              {/* Top-Right Image */}
              <img
                src="/icons/squared-floater.svg"
                alt="Squared Stars Icon"
                className="absolute top-[-4px] left-[-26px] w-7 h-5 transform translate-x-1/2 -translate-y-1/2 md:w-10 md:h-7 md:left-[-38px]"
              />
            </div>
          )
        case 'up-right':
          // TODO: render span with gradient
          return (
            <div className="relative inline-block">
              {/* Gradient Text */}
              <span
                className="relative z-10"
                style={{
                  background:
                    'linear-gradient(92deg, #364efc 26.4%, #b478ff 56.1%, #f1ac0c 99.54%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {text}
              </span>

              {/* Top-Right Image */}
              <img
                src="/icons/squared-stars.svg"
                alt="Squared Stars Icon"
                className="absolute top-0 right-[-10px] w-5 h-5 transform translate-x-1/2 -translate-y-1/2"
              />
            </div>
          )
        default:
          throw new Error('Invalid variant')
      }
    }

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
            borderRadius: '0.25rem',
            padding: '0 0.15em',
          }}
        >
          {text}
        </span>
      )
    }

    return text
  },
}
