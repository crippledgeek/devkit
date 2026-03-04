import { FormTextArea } from './FormTextArea'
import { useFieldContext } from '@/hooks/form'
import { formatFieldErrors } from '@/lib/errors'

interface TextAreaFieldProps {
    label: string
    placeholder?: string
    rows?: number
    className?: string
    registerRef?: (name: string) => (el: HTMLInputElement | HTMLTextAreaElement | null) => void
}

export function TextAreaField({
    label,
    placeholder,
    rows,
    className,
    registerRef,
}: TextAreaFieldProps) {
    const field = useFieldContext<string>()

    const shouldShow = field.state.meta.isTouched || field.state.meta.isBlurred || field.form.state.isSubmitted
    const errs = field.state.meta.errors ?? []
    const errorMessage = shouldShow && errs.length > 0 ? formatFieldErrors(errs) : undefined

    return (
        <FormTextArea
            ref={registerRef?.(field.name)}
            name={field.name}
            label={label}
            placeholder={placeholder}
            rows={rows}
            isRequired
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
            className={className}
            errorMessage={errorMessage}
        />
    )
}
