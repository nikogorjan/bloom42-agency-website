import type { RichTextRenderer } from '@/components/common/rich-text/utils';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const LinebreakRenderer: RichTextRenderer<any> = {
  nodeTypes: ['linebreak'],
  render: () => <br />,
};
