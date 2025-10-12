import { createLink } from "@tanstack/react-router"
import { Link as ReactAriaLink } from '@/components/ui/link'
import { MenuItem } from '@/components/ui/menu'

// TanStack Router + React Aria Components integration
// Use these instead of importing Link/MenuItem directly from react-aria-components
// so they participate in TanStack Router navigation.

export const Link = createLink(ReactAriaLink)
export const MenuItemLink = createLink(MenuItem)
