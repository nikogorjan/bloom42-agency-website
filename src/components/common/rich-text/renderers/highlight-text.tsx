import * as React from 'react'

export const HighlightText: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <span style={{ backgroundColor: '#FD7247', color: '#262423' }}>{children}</span>
}

/**
 * Returns true if this text node was styled with TextStateFeature
 * for the "bg.highlight" state, or if a matching inline style is present.
 */
export function isTextStateHighlighted(node: any): boolean {
  const states = node?.textStates ?? node?.textState ?? node?.states ?? node?.state

  // Preferred: TextStateFeature stores state keys (we look for bg.highlight)
  if (states) {
    // common keys we’ve seen in payload serializations
    const bg = states.bg ?? states.background ?? states.mark ?? states.Highlight ?? states.highlight
    if (bg && String(bg).toLowerCase() === 'highlight') return true
  }

  // Fallback: Payload may serialize the CSS into a style string on the text node
  const style: string | undefined = node?.style
  if (style && /background-color\s*:\s*#?fd7247/i.test(style)) return true

  return false
}
