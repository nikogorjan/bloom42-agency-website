import { RichTextChildren } from '@/components/common/rich-text/rich-text';
import {
  type RichTextRenderer,
  getAlignment,
} from '@/components/common/rich-text/utils';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const ParagraphRenderer: RichTextRenderer<any> = {
  nodeTypes: ['paragraph'],
  render: ({ renderers, node, parent, submissionData }) => {
    if (!node.children.length) {
      return <br />;
    }

    return (
      <div className={getAlignment(node)}>
        <RichTextChildren
          renderers={renderers}
          lexicalNodes={node.children}
          parent={{ ...node, parent }}
          submissionData={submissionData}
        />
      </div>
    );
  },
};
