import type { ReactNode } from 'react'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type RichTextRenderer<T = any> = {
  // Which node types this renderer can handle
  nodeTypes: string[]
  // render the node
  render: (props: {
    childIndex: number
    // Pass all renderers to the render function so that it can render child nodes
    renderers: RichTextRenderer[]
    node: T
    parent: SerializedLexicalNodeWithParent
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    submissionData?: any
  }) => ReactNode
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type SerializedLexicalNodeWithParent = any & {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  parent?: any
}

// Copied from payload generated types
export type TRichText = {
  root: {
    type: string
    children: {
      type: string
      version: number
      [k: string]: unknown
    }[]
    direction: ('ltr' | 'rtl') | null
    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
    indent: number
    version: number
  }
  [k: string]: unknown
}

export const getAlignment = (node: { format: string }) => {
  switch (node.format) {
    case 'left':
      return 'text-left'
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
    case 'justify':
      return 'text-justify'
    default:
      return 'text-left'
  }
}

interface EmailVariable {
  field: string
  value: string
}

type EmailVariables = EmailVariable[]

export const replaceDoubleCurlyBrackets = (str: string, variables?: EmailVariables): string => {
  const regex = /\{\{(.+?)\}\}/g
  if (str && variables) {
    return str.replace(regex, (_, variable) => {
      const foundVariable = variables.find(({ field: fieldName }) => variable === fieldName)
      if (foundVariable) return foundVariable.value
      return variable
    })
  }
  return str
}
