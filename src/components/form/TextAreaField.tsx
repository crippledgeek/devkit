import { FormTextArea } from './FormTextArea'
import { FieldErrorMessage } from './FieldErrorMessage'

interface TextAreaFieldProps {
    /** TanStack React Form instance (ReactFormExtendedApi) */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any
    name: string
    label: string
    placeholder?: string
    rows?: number
    className?: string
    registerRef?: (name: string) => (el: HTMLInputElement | HTMLTextAreaElement | null) => void
}

export function TextAreaField({
    form,
    name,
    label,
    placeholder,
    rows,
    className,
    registerRef,
}: TextAreaFieldProps) {
    return (
        <form.Field name={name}>
            {(field: { state: { value: string; meta: { isTouched?: boolean; isBlurred?: boolean; errors?: unknown[] } }; handleChange: (v: string) => void }) => (
                <>
                    <FormTextArea
                        ref={registerRef?.(name)}
                        name={name}
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
                        showWhenSubmitted={form.state.isSubmitted}
                    />
                </>
            )}
        </form.Field>
    )
}
