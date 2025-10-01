import { RichTextChildren } from '@/components/common/rich-text/rich-text';
import type { RichTextRenderer } from '@/components/common/rich-text/utils';
import { Check } from 'lucide-react';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const ListRenderer: RichTextRenderer<any> = {
  nodeTypes: ['list'],
  render: ({ renderers, node, parent, submissionData }) => {
    const children = (
      <RichTextChildren
        renderers={renderers}
        lexicalNodes={node.children}
        parent={{ ...node, parent }}
        submissionData={submissionData}
      />
    );

    if (node?.tag === 'ol') {
      return (
        <ol className="flex list-inside list-decimal flex-col gap-y-2">
          {children}
        </ol>
      );
    }
    if (node?.tag === 'ul') {
      return (
        <ul className="flex list-inside list-disc flex-col gap-y-2 mt-2 ml-4 mb-2">
          {children}
        </ul>
      );
    }

    // Unknown list type
    console.warn('Unknown list type', node?.tag, 'while rendering list', node);
    return null;
  },
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const ListItemRenderer: RichTextRenderer<any> = {
  nodeTypes: ['listitem'],
  render: ({ renderers, node, parent }) => {
    const children = (
      <RichTextChildren
        renderers={renderers}
        lexicalNodes={node.children}
        parent={{ ...node, parent }}
      />
    );
    if (node?.tag === 'ul') {
      return;
    }

    if ('listType' in parent && parent?.listType === 'check') {
      // Checklist
      return (
        <li className="flex list-inside items-center gap-x-2">
          {node.checked ? (
            <Check className="h-5 w-5 shrink-0 text-primary" />
          ) : (
            <div className="h-5 w-5 shrink-0" />
          )}
          <span>{children}</span>
        </li>
      );
    }

    return <li value={node?.value}>{children}</li>;
  },
};
