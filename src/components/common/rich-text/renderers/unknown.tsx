import type { RichTextRenderer } from '@/components/common/rich-text/utils';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const UnknownRenderer: RichTextRenderer<any> = {
  nodeTypes: ['unknown'],
  render: () => <div className="text-destructive">?</div>,
};
