import { FormTextArea } from './FormTextArea'
import { FieldErrorMessage } from './FieldErrorMessage'
import { useFieldContext } from '@/hooks/form'

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

    return (
        <>
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
            />
            <FieldErrorMessage
                meta={field.state.meta}
                showWhenSubmitted={field.form.state.isSubmitted}
            />
        </>
    )
}
