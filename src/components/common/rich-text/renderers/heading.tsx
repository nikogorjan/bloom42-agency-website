import { RichTextChildren } from '@/components/common/rich-text/rich-text'
import { type RichTextRenderer, getAlignment } from '@/components/common/rich-text/utils'
import { cn } from '@/utilities/ui'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const HeadingRenderer: RichTextRenderer<any> = {
  nodeTypes: ['heading'],
  render: ({ renderers, node, parent, submissionData }) => {
    const children = (
      <RichTextChildren
        renderers={renderers}
        lexicalNodes={node.children}
        parent={{ ...node, parent }}
        submissionData={submissionData}
      />
    )

    const alignment = getAlignment(node)
    const semiboldXL = 'font-semibold'

    switch (node.tag) {
      case 'h1':
        return <h1 className={cn(alignment, '')}>{children}</h1>
      case 'h2':
        return <h2 className={cn(alignment, '')}>{children}</h2>
      case 'h3':
        return <h3 className={cn(alignment, semiboldXL)}>{children}</h3>
      case 'h4':
        return <h4 className={cn(alignment, semiboldXL)}>{children}</h4>
      case 'h5':
        return <h5 className={cn(alignment, semiboldXL)}>{children}</h5>
      case 'h6':
        return <h6 className={cn(alignment, semiboldXL)}>{children}</h6>
      default:
        return children
    }
  },
}
