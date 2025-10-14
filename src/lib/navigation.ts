export type NavItem = {
  name: string
  to: string
  children?: { name: string; to: string }[]
}

export const navigation: NavItem[] = [
  {
    name: 'Converters',
    to: '/converters',
    children: [
        { name: 'Text to Binary', to: '/converters/text-to-binary' },
        { name: 'Text to Base64', to: '/converters/text-to-base64' },
        { name: 'Text to Hexadecimal', to: '/converters/text-to-hexadecimal'}
    ],
  },
]
