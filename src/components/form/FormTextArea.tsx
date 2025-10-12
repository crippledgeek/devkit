import {Label, FieldError} from "@/components/ui/field"
import {TextArea, TextField} from "@/components/ui/textfield"
import type {ChangeEvent} from 'react'

interface FormTextAreaProps {
    name: string
    label: string
    placeholder?: string
    rows?: number
    isRequired?: boolean
    readOnly?: boolean
    value?: string
    onChange?: (value: string) => void
    className?: string
}

export function FormTextArea({
                                 name,
                                 label,
                                 placeholder,
                                 rows = 5,
                                 isRequired = false,
                                 readOnly = false,
                                 value,
                                 onChange,
                                 className
                             }: FormTextAreaProps) {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e.target?.value ?? '')
    }
    const safeValue = typeof value === 'string' ? value : ''

    return (
        <TextField name={name} isRequired={isRequired}>
            <Label>{label}</Label>
            <TextArea
                placeholder={placeholder}
                rows={rows}
                readOnly={readOnly}
                value={safeValue}
                onChange={handleChange}
                className={className}
            />
            <FieldError/>
        </TextField>
    )
}