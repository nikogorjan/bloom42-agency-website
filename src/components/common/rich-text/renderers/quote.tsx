import { RichTextChildren } from '@/components/common/rich-text/rich-text';
import type { RichTextRenderer } from '@/components/common/rich-text/utils';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const QuoteRenderer: RichTextRenderer<any> = {
  nodeTypes: ['quote'],
  render: ({ renderers, node, parent, submissionData }) => {
    return (
      <blockquote className="my-4 border-s-4 border-border bg-card p-4">
        <RichTextChildren
          renderers={renderers}
          lexicalNodes={node.children}
          parent={{ ...node, parent }}
          submissionData={submissionData}
        />
      </blockquote>
    );
  },
};
