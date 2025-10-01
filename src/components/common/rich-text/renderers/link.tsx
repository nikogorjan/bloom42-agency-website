import { RichTextChildren } from '@/components/common/rich-text/rich-text';
import {
  type RichTextRenderer,
  replaceDoubleCurlyBrackets,
} from '@/components/common/rich-text/utils';
import Link from 'next/link';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const LinkRenderer: RichTextRenderer<any> = {
  nodeTypes: ['link', 'autolink'],
  render: ({ renderers, node, parent, submissionData }) => {
    const rel: string = node.fields.newTab ? 'noopener noreferrer' : '';
    const target: string = node.fields.newTab ? ' _blank' : '';

    let href: string =
      node.fields.linkType === 'custom'
        ? node.fields.url
        : node.fields.doc?.value?.id;

    if (submissionData) {
      href = replaceDoubleCurlyBrackets(href, submissionData);
    }

    return (
      <Link href={href} target={target} rel={rel} className="text-primary">
        <RichTextChildren
          renderers={renderers}
          lexicalNodes={node.children}
          parent={{ ...node, parent }}
          submissionData={submissionData}
        />
      </Link>
    );
  },
};
