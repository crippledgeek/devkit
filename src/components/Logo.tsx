import type { FC } from 'react'
import { cn } from '@/lib/utils'

// Simple inline SVG logo to keep visual stable across themes and builds
// Usage: <Logo className="h-6 w-auto" showWordmark />
export type LogoProps = {
  className?: string
  showWordmark?: boolean
}

export const Logo: FC<LogoProps> = ({ className, showWordmark = true }) => {
  return (
    <span className={cn('inline-flex items-center gap-2 text-foreground', className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
      >
        <path d="M8 16 4 12l4-4" />
        <path d="m16 8 4 4-4 4" />
        <path d="M14 4 10 20" />
      </svg>
      {showWordmark && <span className="font-bold">DevKit</span>}
    </span>
  )
}

export default Logo
