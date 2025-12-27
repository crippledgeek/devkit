import { Binary, Hash, Braces } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon: LucideIcon
  to: string
  tags: string[]
}

export const tools: Tool[] = [
  {
    id: 'text-to-binary',
    name: 'Text ↔ Binary',
    description: 'Convert text to binary and vice versa with support for 80+ character encodings',
    category: 'Encoders',
    icon: Binary,
    to: '/converters/text-to-binary',
    tags: ['binary', 'text', 'encoder', 'decoder', 'ascii', 'utf-8'],
  },
  {
    id: 'text-to-base64',
    name: 'Text ↔ Base64',
    description: 'Encode and decode Base64 strings with multi-encoding support',
    category: 'Encoders',
    icon: Braces,
    to: '/converters/text-to-base64',
    tags: ['base64', 'text', 'encoder', 'decoder', 'encoding'],
  },
  {
    id: 'text-to-hexadecimal',
    name: 'Text ↔ Hexadecimal',
    description: 'Convert between text and hexadecimal with customizable delimiters and case',
    category: 'Encoders',
    icon: Hash,
    to: '/converters/text-to-hexadecimal',
    tags: ['hex', 'hexadecimal', 'text', 'encoder', 'decoder'],
  },
]

export const categories = Array.from(new Set(tools.map((tool) => tool.category)))

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase().trim()

  if (!lowerQuery) {
    return tools
  }

  return tools.filter((tool) => {
    const searchableText = [
      tool.name,
      tool.description,
      tool.category,
      ...tool.tags,
    ].join(' ').toLowerCase()

    return searchableText.includes(lowerQuery)
  })
}

export function getToolsByCategory(category: string): Tool[] {
  return tools.filter((tool) => tool.category === category)
}
