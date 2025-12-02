import {Label, FieldError} from "@/components/ui/field"
import {TextArea, TextField} from "@/components/ui/textfield"
import type {ChangeEvent} from 'react'
import { forwardRef } from 'react'

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
    errorMessage?: string
}

export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(({
                                 name,
                                 label,
                                 placeholder,
                                 rows = 5,
                                 isRequired = false,
                                 readOnly = false,
                                 value,
                                 onChange,
                                 className,
                                 errorMessage
                             }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e.target?.value ?? '')
    }
    const safeValue = typeof value === 'string' ? value : ''

    return (
        <TextField
            name={name}
            isRequired={isRequired}
            isInvalid={!!errorMessage}
        >
            <Label>{label}</Label>
            <TextArea
                ref={ref}
                placeholder={placeholder}
                rows={rows}
                readOnly={readOnly}
                value={safeValue}
                onChange={handleChange}
                className={className}
            />
            {errorMessage && <FieldError>{errorMessage}</FieldError>}
        </TextField>
    )
})

FormTextArea.displayName = 'FormTextArea'