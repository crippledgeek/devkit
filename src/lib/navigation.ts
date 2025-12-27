import { tools } from './tools'

export type NavItem = {
  name: string
  to: string
  children?: { name: string; to: string }[]
}

export const navigation: NavItem[] = [
  {
    name: 'Converters',
    to: '/converters',
    children: tools
      .filter((tool) => tool.category === 'Encoders')
      .map((tool) => ({
        name: tool.name,
        to: tool.to,
      })),
  },
]
