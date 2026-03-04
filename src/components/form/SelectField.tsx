import { FormSelect } from './FormSelect'
import { FieldErrorMessage } from './FieldErrorMessage'
import { useFieldContext } from '@/hooks/form'
import type { SelectOption } from '@/lib/converter-configs'

interface SelectFieldProps {
    label: string
    options: SelectOption[]
}

export function SelectField({ label, options }: SelectFieldProps) {
    const field = useFieldContext<string>()

    return (
        <>
            <FormSelect
                name={field.name}
                label={label}
                value={field.state.value}
                onChange={(value: string) => field.setValue(value)}
                options={options}
            />
            <FieldErrorMessage
                meta={field.state.meta}
                showWhenSubmitted={field.form.state.isSubmitted}
            />
        </>
    )
}
