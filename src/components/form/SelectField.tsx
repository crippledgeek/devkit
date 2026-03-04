import type { AnyFormApi } from '@tanstack/react-form'
import { FormSelect } from './FormSelect'
import { FieldErrorMessage } from './FieldErrorMessage'
import type { SelectOption } from '@/lib/converter-configs'

interface SelectFieldProps {
    form: AnyFormApi
    name: string
    label: string
    options: SelectOption[]
}

export function SelectField({ form, name, label, options }: SelectFieldProps) {
    return (
        <form.Field name={name}>
            {(field: { state: { value: string; meta: { isTouched?: boolean; isBlurred?: boolean; errors?: unknown[] } }; setValue: (v: string) => void }) => (
                <>
                    <FormSelect
                        name={name}
                        label={label}
                        value={field.state.value}
                        onChange={(value) => field.setValue(value)}
                        options={options}
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
