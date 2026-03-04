import { FormSelect } from './FormSelect'
import { useFieldContext } from '@/hooks/form'
import { formatFieldErrors } from '@/lib/errors'
import type { SelectOption } from '@/lib/converter-configs'

interface SelectFieldProps {
    label: string
    options: SelectOption[]
}

export function SelectField({ label, options }: SelectFieldProps) {
    const field = useFieldContext<string>()

    const shouldShow = field.state.meta.isTouched || field.state.meta.isBlurred || field.form.state.isSubmitted
    const errs = field.state.meta.errors ?? []
    const errorMessage = shouldShow && errs.length > 0 ? formatFieldErrors(errs) : undefined

    return (
        <FormSelect
            name={field.name}
            label={label}
            value={field.state.value}
            onChange={(value: string) => field.setValue(value)}
            options={options}
            errorMessage={errorMessage}
        />
    )
}
