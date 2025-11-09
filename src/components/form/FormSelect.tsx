import { Label, FieldError } from "@/components/ui/field"
import { Select, SelectItem, SelectTrigger, SelectValue, SelectPopover, SelectListBox } from "@/components/ui/select"
import type { Key } from "react-aria-components"

interface SelectOption {
    value: string
    label: string
}

interface FormSelectProps {
    name: string
    label: string
    value: string
    onChange: (value: string) => void
    options: SelectOption[]
    errorMessage?: string
}

export function FormSelect({ label, value, onChange, options, errorMessage }: FormSelectProps) {
    const handleChange = (key: Key | null) => {
        if (key != null) {
            onChange(key.toString())

        }
    }

    return (
        <Select
            selectedKey={value}
            onSelectionChange={handleChange}
            isInvalid={!!errorMessage}
            className="group flex flex-col gap-2"
        >
            <Label>{label}</Label>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectPopover>
                <SelectListBox>
                    {options.map((option) => (
                        <SelectItem key={option.value} id={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectListBox>
            </SelectPopover>
            {errorMessage && <FieldError>{errorMessage}</FieldError>}
        </Select>
    )
}