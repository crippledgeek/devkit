import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoaderProps {
    size?: number
    className?: string
    text?: string
}

export function Loader({ size = 24, className, text }: LoaderProps) {
    return (
        <div role="status" aria-label={text ?? 'Loading'} className="flex items-center justify-center gap-2">
            <Loader2
                aria-hidden="true"
                size={size}
                className={cn("animate-spin", className)}
            />
            {text && <span className="text-sm text-muted-foreground">{text}</span>}
        </div>
    )
}

// Default export for pendingComponent
export function LoaderPending(){
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader size={32} text="Loading..." />
        </div>
    )
}

// Other variants...
export function LoaderFullPage({ text = 'Loading...' }: { text?: string }) {
    return (
        <div role="status" aria-label={text} className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 aria-hidden="true" size={48} className="animate-spin text-primary" />
                <p className="text-lg font-medium">{text}</p>
            </div>
        </div>
    )
}

export function LoaderInline({ size = 16 }: { size?: number }) {
    return (
        <span role="status" aria-label="Loading">
            <Loader2 aria-hidden="true" size={size} className="animate-spin" />
        </span>
    )
}

export function LoaderOverlay({ text }: { text?: string }) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
            <Loader size={32} text={text} />
        </div>
    )
}