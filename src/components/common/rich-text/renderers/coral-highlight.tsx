// src/components/common/rich-text/renderers/coral-highlight.tsx
import type { RichTextRenderer } from '@/components/common/rich-text/utils'

export const CoralHighlightRenderer: RichTextRenderer = {
  nodeTypes: ['coral-highlight'],
  render: ({ node, renderers, childIndex, submissionData }) => {
    // Render children inside a styled span
    const children = (node.children || []) as any[]
    return (
      <span
        key={childIndex}
        style={{
          backgroundColor: '#FD7247',
          color: '#262423',
        }}
      >
        {children.map((child, i) => {
          const ChildRenderer = renderers.find((r) => r.nodeTypes.includes(child.type))?.render
          return ChildRenderer ? (
            <ChildRenderer
              key={i}
              childIndex={i}
              renderers={renderers}
              node={child}
              parent={node}
              submissionData={submissionData}
            />
          ) : null
        })}
      </span>
    )
  },
}
