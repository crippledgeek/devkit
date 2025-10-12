import type { ReactNode } from 'react'
import {Label, FieldError} from '@/components/ui/field'

interface FormFieldProps {
    label: string
    children: ReactNode
    error?: string
    htmlFor?: string
    ariaLabel?: string
}

export function FormField({ label, children, error, htmlFor, ariaLabel }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={htmlFor} aria-label={ariaLabel}>{label}</Label>
            {children}
            {error && <FieldError>{error}</FieldError>}
        </div>
    )
}